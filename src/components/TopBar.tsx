import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { supportedLangs } from '@/i18n';

export const TopBar = () => {
  const { t, i18n } = useTranslation();
  const current = (i18n.language || 'ru').slice(0, 2);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const switchLang = (lng: string) => {
    void i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [navOpen]);

  return (
    <header className="topbar">
      <div className="container">
        <Link className="brand" to="/" aria-label="Синтем · главная">
          <Logo />
          <span className="word">Си<em>н</em>тем</span>
        </Link>
        <nav className="main" aria-label="Главное меню">
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
                aria-current={current === lng ? 'true' : undefined}
                aria-label={`Переключить язык: ${lng.toUpperCase()}`}
                onClick={() => switchLang(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          <Link className="btn primary compact" to="/campaigns">
            <span className="btn-label">{t('cta.donate_now')}</span>
            <span className="arrow" aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={navOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span className={`bar ${navOpen ? 'on' : ''}`} aria-hidden />
            <span className={`bar ${navOpen ? 'on' : ''}`} aria-hidden />
            <span className={`bar ${navOpen ? 'on' : ''}`} aria-hidden />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav ${navOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!navOpen}
      >
        <nav aria-label="Мобильное меню">
          <NavLink to="/about">{t('nav.about')}</NavLink>
          <NavLink to="/how-it-works">{t('nav.how')}</NavLink>
          <NavLink to="/campaigns">{t('nav.campaigns')}</NavLink>
          <NavLink to="/partners">{t('nav.partners')}</NavLink>
          <NavLink to="/reports">{t('nav.reports')}</NavLink>
          <NavLink to="/partnership">{t('nav.partnership')}</NavLink>
        </nav>
      </div>
    </header>
  );
};
