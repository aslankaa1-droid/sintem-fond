import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { findCampaign } from '@/mock/data';
import { formatNumber, formatRub, percent, pluralForm } from '@/lib/formatters';

export const CampaignDetail = () => {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const campaign = findCampaign(slug);
  const [selectedSum, setSelectedSum] = useState(500);
  const [customSum, setCustomSum] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [allDonations, setAllDonations] = useState(false);

  if (!campaign) return <Navigate to="/404" replace />;

  const lang = (i18n.language || 'ru').slice(0, 2);
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US';
  const pct = percent(campaign.collectedAmount, campaign.targetAmount);
  const avg = Math.round(campaign.collectedAmount / Math.max(1, campaign.donorsCount));
  const sums = [300, 500, 1000, 5000];
  const region = t(`regions.${campaign.patientRegion}`, { defaultValue: campaign.patientRegion });

  const ageForm = pluralForm(lang, campaign.patientAge || 0);
  const ageLabel = campaign.patientAge ? `${campaign.patientAge} ${t(`campaign.age_year_${ageForm}`)}` : '';
  const daysForm = pluralForm(lang, campaign.deadlineDays);
  const daysLabel = `${campaign.deadlineDays} ${t(`common.day_${daysForm}`)}`;

  const storyName = lang === 'ru' && campaign.patientNameGenitive ? campaign.patientNameGenitive : campaign.patientName;

  const isAydarhan = campaign.id === 'c-aydarhan';
  const h1 = isAydarhan ? (
    <>
      {t('campaign.aydarhan_h1_a')} <em>{t('campaign.aydarhan_h1_em')}</em> {t('campaign.aydarhan_h1_b')}
    </>
  ) : (
    campaign.shortTitle
  );

  const recipient = campaign.beneficiary === 'hospital'
    ? t('campaign.recipient_clinic')
    : t('campaign.recipient_fund', { name: campaign.publisher.name });

  return (
    <>
      <section className="cd-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('common.home')}</Link><span className="sep">/</span>
            <Link to="/campaigns">{t('nav.campaigns')}</Link><span className="sep">/</span>
            <span>{campaign.patientName} · {region}</span>
          </div>

          <div className="cd-grid">
            <div className="cd-left">
              <div className="tags">
                {campaign.urgent && <span className="tag crimson on-paper">{t('badges.urgent')} · {daysLabel}</span>}
                {campaign.omsRefusal && <span className="tag brass">{t('badges.oms_refusal')}</span>}
                {campaign.badges?.map((b) => <span className="tag" key={b}>{b}</span>)}
              </div>
              <h1>{h1}</h1>
              <p className="dek">{campaign.diagnosis}.</p>
            </div>

            <aside className="donate-widget">
              <div className="dw-label">{t('campaign.open', { days: campaign.deadlineDays, plural: t(`common.day_${daysForm}`) })}</div>
              <div className="dw-collected">{formatRub(campaign.collectedAmount, locale)}</div>
              <div className="dw-of">{t('campaign.of')} <strong>{formatRub(campaign.targetAmount, locale)}</strong></div>
              <div className="dw-progress"><span style={{ width: `${pct}%` }} /></div>

              <div className="dw-stats">
                <div><span>{t('campaign.donors')}</span><span className="v">{formatNumber(campaign.donorsCount, locale)}</span></div>
                <div><span>{t('campaign.average')}</span><span className="v">{formatRub(avg, locale)}</span></div>
                <div><span>{t('campaign.days')}</span><span className="v">{campaign.deadlineDays}</span></div>
              </div>

              <div className="dw-sums">
                {sums.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`dw-sum ${selectedSum === s ? 'on' : ''}`}
                    onClick={() => { setSelectedSum(s); setCustomSum(''); }}
                  >
                    {s.toLocaleString(locale)} ₽
                  </button>
                ))}
              </div>
              <input
                type="text"
                inputMode="numeric"
                className="dw-custom"
                placeholder={t('common.custom_amount')}
                value={customSum}
                onChange={(e) => setCustomSum(e.target.value.replace(/[^\d]/g, ''))}
              />

              <div className="dw-pay">
                <button type="button">
                  <span className="lbl">{t('campaign.sbp')}</span>
                  <span className="sub">{t('campaign.sbp_sub')}</span>
                </button>
                <button type="button" className="ghost">
                  <span className="lbl">{t('campaign.card')}</span>
                  <span className="sub">{t('campaign.card_sub')}</span>
                </button>
              </div>

              <label className="dw-recur">
                <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
                {t('campaign.monthly')}
              </label>

              <p className="dw-fine">{t('campaign.fine')}</p>
            </aside>
          </div>

          <div className={`cd-photo ph-${campaign.photoVariant}`}>
            <div className="caption">
              <span className="name">{campaign.patientName}{ageLabel ? `, ${ageLabel}` : ''}</span>
              <span>{t('campaign.photo_caption')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="verify-strip">
        <div className="container">
          {(campaign.curatorFund || campaign.publisher.type === 'fund') && (() => {
            const fund = campaign.curatorFund ?? campaign.publisher;
            return (
              <VerifyItem
                type="fund"
                label={t('campaign.verify_fund_l')}
                name={fund.name}
                sub={`${t('verify.ogrn')} ${fund.ogrn} · ${t('verify.nko_registry')} · ${t('verify.since')} ${fund.verifiedSince}`}
              />
            );
          })()}
          {campaign.publisher.type === 'hospital' && (
            <VerifyItem
              type="hospital"
              label={t('campaign.verify_hospital_l')}
              name={campaign.publisher.name}
              sub={`${t('verify.license')} ${campaign.publisher.licenseNumber} · ${t('verify.roszdrav')}`}
            />
          )}
          {campaign.publisher.type === 'fund' && campaign.targetClinic && (
            <VerifyItem
              type="hospital"
              label={t('campaign.verify_hospital_l')}
              name={campaign.targetClinic.name}
              sub={`${t('verify.license')} ${campaign.targetClinic.license} · ${t('verify.roszdrav')}`}
            />
          )}
          {campaign.doctorName && (
            <VerifyItem
              type="doctor"
              label={t('campaign.verify_doctor_l')}
              name={campaign.doctorName.split(',')[0]}
              sub={campaign.doctorName.split(',').slice(1).join(',').trim()}
            />
          )}
        </div>
      </section>

      <section className="story-wrap">
        <div className="container">
          <div className="story-grid">
            <article className="story">
              <h2>{t('campaign.story_t')} {storyName}</h2>
              {campaign.story.split('\n\n').map((p, i) =>
                p.startsWith('«')
                  ? <p key={i} className="pullquote">{p}</p>
                  : <p key={i}>{p}</p>,
              )}
            </article>

            <aside>
              <div className="sidecard">
                <h4>{t('campaign.diag_label')}</h4>
                <dl>
                  <dt>{t('campaign.diag_patient')}</dt><dd>{campaign.patientName}{ageLabel ? `, ${ageLabel}` : ''}</dd>
                  <dt>{t('campaign.diag_region')}</dt><dd>{region}</dd>
                  <dt>{t('campaign.diag_text')}</dt><dd>{campaign.diagnosis}</dd>
                </dl>
                {campaign.icd10 && (
                  <div className="icd">{t('campaign.icd10')} · <span className="code">{campaign.icd10}</span></div>
                )}
              </div>

              <div className="sidecard">
                <h4>{t('campaign.campaign_label')}</h4>
                <dl>
                  <dt>{t('campaign.campaign_target')}</dt><dd>{formatRub(campaign.targetAmount, locale)}</dd>
                  <dt>{t('campaign.campaign_recipient')}</dt><dd>{recipient}</dd>
                </dl>
              </div>

              <div className="sidecard dark">
                <h4>{t('campaign.after_label')}</h4>
                <p>{t('campaign.after_text')}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {campaign.documents && (
        <section className="docs-wrap">
          <div className="container">
            <div className="docs-head">
              <h3>{t('campaign.docs_t')}</h3>
              <span className="note">{t('campaign.docs_note')}</span>
            </div>
            <div className="docs-grid">
              {campaign.documents.map((d, i) => (
                <div key={i} className={`doc${d.type === 'oms_refusal' ? ' accent' : ''}`}>
                  <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 4v5M15 4v5" /></svg>
                  <div className="nm">{d.name}</div>
                  <div className="meta">PDF · {d.size} · {t(`doc_types.${d.type}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {campaign.updates && (
        <section className="updates">
          <div className="container">
            <h3>{t('campaign.updates_t')} <em>{t('campaign.updates_em')}</em></h3>
            {campaign.updates.map((u, i) => (
              <div className="upd" key={i}>
                <div className="date">{u.dateLabel}<span className="d">{u.dayLabel}</span></div>
                <div className="content"><h4>{u.title}</h4><p>{u.body}</p></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {campaign.donations && (
        <section className="donations">
          <div className="container">
            <div className="donations-head">
              <h3>{t('campaign.donations_t')}</h3>
              <span className="meta">{t('campaign.donations_meta', { n: formatNumber(campaign.donorsCount, locale) })}</span>
            </div>
            <div className="feed">
              {(allDonations ? campaign.donations : campaign.donations.slice(0, 6)).map((d, i) => (
                <div className="don-row" key={i}>
                  <span className={`who${d.anon ? ' anon' : ''}`}>{d.anon ? t('campaign.anonymous') : d.name}</span>
                  <span />
                  <span className="sum">{d.sumLabel}</span>
                </div>
              ))}
            </div>
            {!allDonations && campaign.donations.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button type="button" className="btn" onClick={() => setAllDonations(true)}>
                  {t('campaign.show_all_donations')} <span className="arrow">→</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

const VerifyItem = ({ type, label, name, sub }: { type: 'fund' | 'hospital' | 'doctor'; label: string; name: string; sub: string }) => (
  <div className="vc">
    <div className="ico">
      {type === 'fund' && <svg viewBox="0 0 24 24"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" /><path d="M9 12l2 2 4-4" /></svg>}
      {type === 'hospital' && <svg viewBox="0 0 24 24"><path d="M6 21V9l6-5 6 5v12M9 21v-6h6v6" /></svg>}
      {type === 'doctor' && <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>}
    </div>
    <div className="meta">
      <div className="l">{label}</div>
      <div className="v">{name}</div>
      <div className="sub">{sub}</div>
    </div>
  </div>
);
