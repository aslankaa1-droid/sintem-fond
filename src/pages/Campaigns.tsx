import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CampaignCard } from '@/components/CampaignCard';
import { campaigns } from '@/mock/data';
import { formatRub, localize, pluralForm } from '@/lib/formatters';
import type { Campaign, HelpType, PublisherType } from '@/types';

type Status = 'all' | 'active' | 'urgent' | 'closing';
type Sort = 'urgency' | 'closing' | 'new' | 'amount';

interface FacetOption<V extends string> {
  value: V;
  label: string;
  count: number;
}

const sortCampaigns = (list: Campaign[], sort: Sort): Campaign[] => {
  const arr = [...list];
  switch (sort) {
    case 'urgency':
      return arr.sort((a, b) => {
        if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
        return a.deadlineDays - b.deadlineDays;
      });
    case 'closing':
      return arr.sort((a, b) => a.deadlineDays - b.deadlineDays);
    case 'new':
      return arr.sort((a, b) => b.id.localeCompare(a.id));
    case 'amount':
      return arr.sort((a, b) => b.targetAmount - a.targetAmount);
    default:
      return arr;
  }
};

const countBy = <T extends string>(list: Campaign[], key: (c: Campaign) => T): Map<T, number> => {
  const m = new Map<T, number>();
  for (const c of list) {
    const k = key(c);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
};

export const Campaigns = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'ru').slice(0, 2);
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US';

  const [status, setStatus] = useState<Status>('all');
  const [query, setQuery] = useState('');
  const [omsOnly, setOmsOnly] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Set<string>>(new Set());
  const [helpTypeFilter, setHelpTypeFilter] = useState<Set<HelpType>>(new Set());
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<Set<PublisherType>>(new Set());
  const [sort, setSort] = useState<Sort>('urgency');

  const filtered = useMemo<Campaign[]>(() => {
    const q = query.trim().toLowerCase();
    const base = campaigns.filter((c) => {
      if (status === 'urgent' && !c.urgent) return false;
      if (status === 'closing' && c.status !== 'closing') return false;
      if (status === 'active' && (c.urgent || c.status === 'closing')) return false;
      if (omsOnly && !c.omsRefusal) return false;
      if (regionFilter.size && !regionFilter.has(c.patientRegion)) return false;
      if (helpTypeFilter.size && !helpTypeFilter.has(c.helpType)) return false;
      if (partnerTypeFilter.size && !partnerTypeFilter.has(c.publisher.type)) return false;
      if (q) {
        const haystack = [
          c.patientName,
          c.patientNameLatin,
          localize(c.diagnosis, lang),
          localize(c.shortTitle, lang),
          c.publisher.name,
          c.patientRegion,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return sortCampaigns(base, sort);
  }, [status, query, omsOnly, regionFilter, helpTypeFilter, partnerTypeFilter, sort, lang]);

  const totalTarget = filtered.reduce((s, c) => s + c.targetAmount, 0);
  const totalCollected = filtered.reduce((s, c) => s + c.collectedAmount, 0);
  const urgentCount = filtered.filter((c) => c.urgent).length;
  const uniquePartners = new Set(filtered.map((c) => c.publisher.id)).size;

  const regionCounts = useMemo(() => countBy(campaigns, (c) => c.patientRegion), []);
  const helpTypeCounts = useMemo(() => countBy<HelpType>(campaigns, (c) => c.helpType), []);
  const partnerTypeCounts = useMemo(() => countBy<PublisherType>(campaigns, (c) => c.publisher.type), []);
  const omsCount = useMemo(() => campaigns.filter((c) => c.omsRefusal).length, []);

  const regionOptions: FacetOption<string>[] = useMemo(
    () => Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({
        value,
        label: t(`regions.${value}`, { defaultValue: value }),
        count,
      })),
    [regionCounts, t],
  );

  const helpTypeOptions: FacetOption<HelpType>[] = useMemo(() => {
    const labels: Record<HelpType, string> = {
      treatment: t('badges.treatment'),
      rehab: t('badges.rehab'),
      medication: t('badges.medication'),
      equipment: t('badges.equipment'),
      surgery: t('badges.surgery'),
      abroad: t('badges.abroad'),
      other: t('badges.other'),
    };
    return Array.from(helpTypeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: labels[value], count }));
  }, [helpTypeCounts, t]);

  const toggleFromSet = <T extends string>(setter: (v: Set<T>) => void, current: Set<T>, value: T) => {
    const next = new Set(current);
    if (next.has(value)) next.delete(value); else next.add(value);
    setter(next);
  };

  const resetAll = () => {
    setStatus('all');
    setQuery('');
    setOmsOnly(false);
    setRegionFilter(new Set());
    setHelpTypeFilter(new Set());
    setPartnerTypeFilter(new Set());
  };

  const handleFloatDonate = () => {
    if (!filtered.length) return;
    const top = sortCampaigns(filtered, 'urgency')[0];
    window.location.hash = `#campaign-${top.id}`;
  };

  const personPlural = t(`common.person_${pluralForm(lang, filtered.length)}`);
  const campaignPlural = t(`common.campaign_${pluralForm(lang, filtered.length)}`);
  const activeChipCount = campaigns.length;
  const minAmount = useMemo(() => Math.min(...campaigns.map((c) => c.targetAmount)), []);
  const maxAmount = useMemo(() => Math.max(...campaigns.map((c) => c.targetAmount)), []);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('common.home')}</Link>
            <span className="sep">/</span>
            <span>{t('nav.campaigns')}</span>
          </div>
          <h1>
            {t('campaigns.h1_a')} <em>{t('campaigns.em')}</em><br />
            {t('campaigns.h1_b', { count: filtered.length, person: personPlural })}
          </h1>
          <div className="summary">
            <div><span>{t('campaigns.summary_target')}</span><span className="v">{formatRub(totalTarget, locale)}</span></div>
            <div><span>{t('campaigns.summary_collected')}</span><span className="v">{formatRub(totalCollected, locale)}</span></div>
            <div><span>{t('campaigns.summary_partners')}</span><span className="v">{uniquePartners}</span></div>
            <div>
              <span>{t('campaigns.summary_urgent')}</span>
              <span className="v" style={{ color: 'var(--crimson)' }}>{urgentCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="container">
          {(['all', 'active', 'urgent', 'closing'] as const).map((s) => (
            <button
              key={s}
              className={`filter-pill ${status === s ? 'on' : ''}`}
              type="button"
              onClick={() => setStatus(s)}
            >
              {t(`campaigns.filters.${s}`)} {s === 'all' && `· ${activeChipCount}`}
            </button>
          ))}
          <span className="filter-divider" />
          <button
            type="button"
            className={`filter-pill ${omsOnly ? 'on' : ''}`}
            onClick={() => setOmsOnly((v) => !v)}
          >
            {t('badges.oms_refusal')}
          </button>
          <span className="filter-divider" />
          <div className="filter-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('campaigns.filters.search_ph')}
            />
          </div>
          <div className="filter-sort">
            {t('campaigns.filters.sort')}
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="urgency">{t('campaigns.filters.sort_urgency')}</option>
              <option value="closing">{t('campaigns.filters.sort_closing')}</option>
              <option value="new">{t('campaigns.filters.sort_new')}</option>
              <option value="amount">{t('campaigns.filters.sort_amount')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="layout">
          <aside className="sidebar">
            <Facet title={t('campaigns.facet_region')}>
              {regionOptions.map((o) => (
                <FacetRow
                  key={o.value}
                  label={o.label}
                  n={o.count}
                  checked={regionFilter.has(o.value)}
                  onChange={() => toggleFromSet(setRegionFilter, regionFilter, o.value)}
                />
              ))}
            </Facet>
            <Facet title={t('campaigns.facet_help_type')}>
              {helpTypeOptions.map((o) => (
                <FacetRow
                  key={o.value}
                  label={o.label}
                  n={o.count}
                  checked={helpTypeFilter.has(o.value)}
                  onChange={() => toggleFromSet(setHelpTypeFilter, helpTypeFilter, o.value)}
                />
              ))}
            </Facet>
            <Facet title={t('campaigns.facet_segment')}>
              <FacetRow
                label={t('segment.oms_refusal')}
                n={omsCount}
                checked={omsOnly}
                onChange={() => setOmsOnly((v) => !v)}
              />
            </Facet>
            <Facet title={t('campaigns.facet_partner_type')}>
              <FacetRow
                label={t('partner_type.fund')}
                n={partnerTypeCounts.get('fund') || 0}
                checked={partnerTypeFilter.has('fund')}
                onChange={() => toggleFromSet(setPartnerTypeFilter, partnerTypeFilter, 'fund')}
              />
              <FacetRow
                label={t('partner_type.hospital')}
                n={partnerTypeCounts.get('hospital') || 0}
                checked={partnerTypeFilter.has('hospital')}
                onChange={() => toggleFromSet(setPartnerTypeFilter, partnerTypeFilter, 'hospital')}
              />
            </Facet>
            <Facet title={t('campaigns.facet_amount')}>
              <div className="range-vis">
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span>{formatRub(minAmount, locale)}</span>
                  <span>{formatRub(maxAmount, locale)}</span>
                </div>
              </div>
            </Facet>
          </aside>

          <div className="results">
            <div className="results-info">
              <div className="count">{t('campaigns.found_a')} <strong>{filtered.length}</strong> {campaignPlural}</div>
              <div className="applied">
                <button
                  type="button"
                  className="applied-chip"
                  style={{ background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--mist-2)', cursor: 'pointer' }}
                  onClick={resetAll}
                >
                  {t('campaigns.reset_all')}
                </button>
              </div>
            </div>
            {filtered.length === 0 ? (
              <p style={{ padding: '40px 0', color: 'var(--ink-3)' }}>{t('campaigns.no_results')}</p>
            ) : (
              <div className="grid">
                {filtered.map((c) => (
                  <div id={`campaign-${c.id}`} key={c.id}>
                    <CampaignCard campaign={c} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 && (
        <button
          type="button"
          className="float-donate"
          onClick={handleFloatDonate}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24"><path d="M12 21l-1.5-1.5C6 15.5 3 13 3 9c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 4-3 6.5-7.5 10.5L12 21z" /></svg>
          {t('campaigns.float_donate', { count: filtered.length, plural: campaignPlural })}
        </button>
      )}
    </>
  );
};

const Facet = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="facet">
    <h4>{title}</h4>
    <div className="facet-list">{children}</div>
  </div>
);

interface RowProps { label: string; n: number; checked: boolean; onChange: () => void; }
const FacetRow = ({ label, n, checked, onChange }: RowProps) => (
  <label>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label} <span className="n">{n}</span>
  </label>
);
