import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CampaignCard } from '@/components/CampaignCard';
import { campaigns, stats, partners } from '@/mock/data';

export const Home = () => {
  const { t } = useTranslation();
  const featured = campaigns.slice(0, 3);
  const fundLogos = partners.filter((p) => p.type === 'fund').slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">{t('home.eyebrow')}</div>
            <h1>
              {t('home.h1_a')}<br />
              {t('home.h1_b')} <em>{t('home.h1_em')}</em>.<br />
              <span className="lift">{t('home.h1_lift')}</span>
            </h1>
            <p className="lede">{t('home.lede')}</p>
            <div className="actions-row">
              <Link className="btn primary" to="/campaigns">
                {t('cta.choose_campaign')} <span className="arrow">→</span>
              </Link>
              <Link className="btn" to="/subscribe">{t('cta.subscribe_monthly')}</Link>
            </div>
          </div>
          <aside className="hero-meter">
            <div className="label">{t('home.meter_label')}</div>
            <div className="value">{stats.collectedYtd}</div>
            <div className="unit">{t('home.meter_unit_collected', { donors: stats.donorsYtd })}</div>
            <div className="submeter">
              <div><div className="v">{stats.fundsActive}</div><div className="k">{t('home.meter_funds')}</div></div>
              <div><div className="v">{stats.hospitalsActive}</div><div className="k">{t('home.meter_hospitals')}</div></div>
              <div><div className="v">{stats.beneficiariesActive}</div><div className="k">{t('home.meter_beneficiaries')}</div></div>
              <div><div className="v">{stats.reportingRate}</div><div className="k">{t('home.meter_reporting')}</div></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="manifest">
        <div className="container">
          {(['01', '02', '03'] as const).map((n) => (
            <div className="item" key={n}>
              <span className="num">{n}</span>
              <h3>{t(`home.manifest.${n}_t`)}</h3>
              <p>{t(`home.manifest.${n}_b`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.featured_t')} <em>{t('home.featured_em')}</em></h2>
            <div className="meta">{campaigns.length} {t('home.featured_meta')}</div>
          </div>
          <div className="feat-grid">
            <CampaignCard campaign={featured[0]} variant="lead" />
            <CampaignCard campaign={featured[1]} variant="compact" />
            <CampaignCard campaign={featured[2]} variant="compact" />
          </div>
        </div>
      </section>

      <section className="how">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.how_t')} <em>{t('home.how_em')}</em></h2>
            <div className="meta">{t('home.how_meta')}</div>
          </div>
          <div className="how-grid">
            {(['01', '02', '03'] as const).map((n) => (
              <div className="how-step" key={n}>
                <span className="num">{n}</span>
                <h3>{t(`home.how.${n}_t`)}</h3>
                <p>{t(`home.how.${n}_b`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="amb">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.amb_t')} <em>{t('home.amb_em')}</em></h2>
            <div className="meta">{t('home.amb_meta')}</div>
          </div>
          <div className="amb-grid">
            <div className="amb-card">
              <p className="quote">{t('home.amb.q1')}</p>
              <div className="person">
                <div className="avatar a1" />
                <div className="info">
                  <div className="name">{t('home.amb.n1')}</div>
                  <div className="role">{t('home.amb.r1')}</div>
                </div>
              </div>
            </div>
            <div className="amb-card">
              <p className="quote">{t('home.amb.q2')}</p>
              <div className="person">
                <div className="avatar a2" />
                <div className="info">
                  <div className="name">{t('home.amb.n2')}</div>
                  <div className="role">{t('home.amb.r2')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partners">
        <div className="container">
          <div>
            <h3><em>{stats.fundsActive}</em> {t('home.partners_t_a')} <em>{stats.hospitalsActive}</em> {t('home.partners_t_b')}</h3>
            <p>{t('home.partners_sub')}</p>
          </div>
          <div className="logos">
            {fundLogos.map((p) => (
              <div key={p.id}>{p.name.replace(/^БФ «|»$/g, '')}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="join">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.join_t')} <em>{t('home.join_em')}</em></h2>
            <div className="meta">{t('home.join_meta')}</div>
          </div>
          <div className="join-grid">
            <Link className="join-card" to="/partnership/funds">
              <div className="label">{t('home.join_fund_label')}</div>
              <h3>{t('home.join_fund_t_a')} <em>{t('home.join_fund_em')}</em> {t('home.join_fund_t_b')}</h3>
              <p>{t('home.join_fund_body')}</p>
              <span className="link">{t('home.join_fund_link')} <span className="arrow">→</span></span>
            </Link>
            <Link className="join-card" to="/partnership/hospitals">
              <div className="label">{t('home.join_hosp_label')}</div>
              <h3>{t('home.join_hosp_t_a')} <em>{t('home.join_hosp_em')}</em> {t('home.join_hosp_t_b')}</h3>
              <p>{t('home.join_hosp_body')}</p>
              <span className="link">{t('home.join_hosp_link')} <span className="arrow">→</span></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
