import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { supportedLangs } from '@/i18n';

export const TopBar = () => {
  const { t, i18n } = useTranslation();
  const current = (i18n.language || 'ru').slice(0, 2);

  const switchLang = (lng: string) => {
    void i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <header className="topbar">
      <div className="container">
        <Link className="brand" to="/" aria-label="Синтем · главная">
          <Logo />
          <span className="word">Си<em>н</em>тем</span>
        </Link>
        <nav className="main">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.about')}</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.how')}</NavLink>
          <NavLink to="/campaigns" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.campaigns')}</NavLink>
          <NavLink to="/partners" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.partners')}</NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.reports')}</NavLink>
          <NavLink to="/partnership" className={({ isActive }) => (isActive ? 'on' : '')}>{t('nav.partnership')}</NavLink>
        </nav>
        <div className="actions">
          <div className="lang" role="group" aria-label="Языки сайта">
            {supportedLangs.map((lng) => (
              <button
                key={lng}
                type="button"
                className={current === lng ? 'on' : ''}
                onClick={() => switchLang(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          <Link className="btn primary compact" to="/campaigns">
            {t('cta.donate_now')} <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
