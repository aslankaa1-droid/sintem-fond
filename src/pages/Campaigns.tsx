import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CampaignCard } from '@/components/CampaignCard';
import { campaigns } from '@/mock/data';
import { formatRub } from '@/lib/formatters';
import type { Campaign } from '@/types';

type Status = 'all' | 'active' | 'urgent' | 'closing';

export const Campaigns = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('all');
  const [query, setQuery] = useState('');
  const [omsOnly, setOmsOnly] = useState(false);

  const filtered = useMemo<Campaign[]>(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (status === 'urgent' && !c.urgent) return false;
      if (status === 'closing' && c.status !== 'closing') return false;
      if (status === 'active' && (c.urgent || c.status === 'closing')) return false;
      if (omsOnly && !c.omsRefusal) return false;
      if (q && !`${c.patientName} ${c.diagnosis} ${c.publisher.name} ${c.patientRegion}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [status, query, omsOnly]);

  const totalTarget = filtered.reduce((s, c) => s + c.targetAmount, 0);
  const totalCollected = filtered.reduce((s, c) => s + c.collectedAmount, 0);
  const urgentCount = filtered.filter((c) => c.urgent).length;
  const uniquePartners = new Set(filtered.map((c) => c.publisher.id)).size;

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Главная</Link>
            <span className="sep">/</span>
            <span>{t('nav.campaigns')}</span>
          </div>
          <h1>
            {t('campaigns.h1_a')} <em>{t('campaigns.em')}</em><br />
            {t('campaigns.h1_b', { count: filtered.length })}
          </h1>
          <div className="summary">
            <div><span>{t('campaigns.summary_target')}</span><span className="v">{formatRub(totalTarget)}</span></div>
            <div><span>{t('campaigns.summary_collected')}</span><span className="v">{formatRub(totalCollected)}</span></div>
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
              {t(`campaigns.filters.${s}`)} {s === 'all' && `· ${campaigns.length}`}
            </button>
          ))}
          <span className="filter-divider" />
          <button
            type="button"
            className={`filter-pill ${omsOnly ? 'on' : ''}`}
            onClick={() => setOmsOnly((v) => !v)}
          >
            ОМС-отказ
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
            <select defaultValue="urgency">
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
              {[
                ['Москва', 42], ['Санкт-Петербург', 28], ['Красноярский край', 11],
                ['Дагестан', 18], ['Чеченская Республика', 9], ['Татарстан', 7],
                ['Свердловская область', 5],
              ].map(([name, n], i) => (
                <FacetRow key={name as string} label={name as string} n={n as number} defaultChecked={i < 2} />
              ))}
            </Facet>
            <Facet title={t('campaigns.facet_help_type')}>
              {[['Лечение', 64], ['Реабилитация', 38], ['Лекарства', 29], ['Оборудование', 22], ['Операция', 18], ['Лечение за рубежом', 8], ['Прочее', 8]].map(
                ([name, n]) => <FacetRow key={name as string} label={name as string} n={n as number} />,
              )}
            </Facet>
            <Facet title={t('campaigns.facet_segment')}>
              <FacetRow label="ОМС-отказ" n={37} defaultChecked={omsOnly} onChange={(v) => setOmsOnly(v)} />
              <FacetRow label="Платная услуга вне ОМС" n={94} />
              <FacetRow label="Дорогостоящее" n={23} />
            </Facet>
            <Facet title={t('campaigns.facet_partner_type')}>
              <FacetRow label="Фонд" n={142} defaultChecked />
              <FacetRow label="Больница" n={45} defaultChecked />
            </Facet>
            <Facet title={t('campaigns.facet_amount')}>
              <div className="range-vis">
                <div style={{ position: 'relative', height: 2, background: 'var(--mist-2)', margin: '24px 0' }}>
                  <div style={{ position: 'absolute', left: '18%', right: '35%', height: '100%', background: 'var(--brass)' }} />
                  <div style={{ position: 'absolute', left: '18%', top: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', left: '65%', top: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: '50%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
                  <span>0</span><span>200 тыс</span><span>700 тыс+</span>
                </div>
              </div>
            </Facet>
          </aside>

          <div className="results">
            <div className="results-info">
              <div className="count">{t('campaigns.found_a')} <strong>{filtered.length}</strong> {t('campaigns.found_b')}</div>
              <div className="applied">
                <span className="applied-chip">
                  Активные фильтры
                  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </span>
                <button
                  className="applied-chip"
                  style={{ background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--mist-2)' }}
                  onClick={() => { setStatus('all'); setQuery(''); setOmsOnly(false); }}
                >
                  {t('campaigns.reset_all')}
                </button>
              </div>
            </div>
            <div className="grid">
              {filtered.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
            <nav className="pagi">
              <a className="nav">← {t('campaigns.back')}</a>
              <a className="on">1</a>
              <a>2</a>
              <a>3</a>
              <a>4</a>
              <span className="sep">…</span>
              <a>10</a>
              <a className="nav">{t('campaigns.next')} →</a>
            </nav>
          </div>
        </div>
      </div>

      <Link className="float-donate" to="#">
        <svg viewBox="0 0 24 24"><path d="M12 21l-1.5-1.5C6 15.5 3 13 3 9c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 4-3 6.5-7.5 10.5L12 21z" /></svg>
        {t('campaigns.float_donate_a')} {filtered.length} {t('campaigns.float_donate_b')}
      </Link>
    </>
  );
};

const Facet = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="facet">
    <h4>{title}</h4>
    <div className="facet-list">{children}</div>
  </div>
);

interface RowProps { label: string; n: number; defaultChecked?: boolean; onChange?: (v: boolean) => void; }
const FacetRow = ({ label, n, defaultChecked, onChange }: RowProps) => {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => { setChecked(e.target.checked); onChange?.(e.target.checked); }}
      />
      {label} <span className="n">{n}</span>
    </label>
  );
};
