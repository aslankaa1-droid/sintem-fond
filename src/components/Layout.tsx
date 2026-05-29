import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DemoBanner = () => {
  const { t } = useTranslation();
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;
  return (
    <div className="demo-banner" role="note">
      <span className="dot" aria-hidden />
      <span className="text">{t('demo_banner')}</span>
    </div>
  );
};

export const Layout = () => {
  const { i18n } = useTranslation();
  const banner = import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    document.documentElement.dataset.banner = banner ? 'true' : 'false';
  }, [banner]);

  return (
    <>
      <a className="skip-link" href="#main">К содержимому</a>
      <div className="site-header" data-banner={banner ? 'true' : 'false'}>
        <DemoBanner />
        <TopBar />
      </div>
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
