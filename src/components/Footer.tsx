import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="site">
      <div className="container">
        <div>
          <Link className="brand dark" to="/" aria-label="Синтем">
            <Logo inkStroke="#F5F1E8" brassStroke="#C99457" />
            <span className="word">Си<em>н</em>тем</span>
          </Link>
          <p className="tagline">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4>{t('footer.platform')}</h4>
          <ul>
            <li><Link to="/about">{t('footer.platform_about')}</Link></li>
            <li><Link to="/how-it-works">{t('footer.platform_how')}</Link></li>
            <li><Link to="/reports">{t('footer.platform_reports')}</Link></li>
            <li><Link to="/tax-deduction">{t('footer.platform_tax')}</Link></li>
            <li><Link to="/ambassadors">{t('footer.platform_ambassadors')}</Link></li>
            <li><Link to="/press">{t('footer.platform_press')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.partners')}</h4>
          <ul>
            <li><Link to="/partnership/funds">{t('footer.partners_fund')}</Link></li>
            <li><Link to="/partnership/hospitals">{t('footer.partners_hosp')}</Link></li>
            <li><Link to="/b2b">{t('footer.partners_b2b')}</Link></li>
            <li><Link to="/csr">{t('footer.partners_csr')}</Link></li>
            <li><Link to="/api">{t('footer.partners_api')}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><Link to="/legal/charter">{t('footer.legal_charter')}</Link></li>
            <li><Link to="/legal/donation">{t('footer.legal_donation')}</Link></li>
            <li><Link to="/legal/pdp">{t('footer.legal_pdp')}</Link></li>
            <li><Link to="/legal/moderation">{t('footer.legal_moderation')}</Link></li>
            <li><Link to="/legal/program">{t('footer.legal_program')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container foot-bottom">
        <div>{t('footer.license')}</div>
        <div>2026 · {t('footer.contact')}</div>
      </div>
    </footer>
  );
};
