import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <section className="stub">
      <div className="container">
        <h1>{t('not_found.t_a')} <em>{t('not_found.em')}</em> {t('not_found.t_b')}</h1>
        <p>{t('not_found.body')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/">{t('not_found.to_home')}</Link>
          <Link className="btn" to="/campaigns">{t('not_found.to_catalog')}</Link>
        </div>
      </div>
    </section>
  );
};
