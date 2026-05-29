import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Campaigns } from '@/pages/Campaigns';
import { CampaignDetail } from '@/pages/CampaignDetail';
import { Stub } from '@/pages/Stub';
import { NotFound } from '@/pages/NotFound';
import { useTranslation } from 'react-i18next';

const StubPage = ({ k }: { k: string }) => {
  const { t } = useTranslation();
  return <Stub title={t(k)} />;
};

const DemoBanner = () => {
  const { t } = useTranslation();
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;
  return (
    <div
      role="note"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: '#1A1714',
        color: '#F5F1E8',
        padding: '10px 24px',
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        borderBottom: '1px solid #A87D43',
      }}
    >
      {t('demo_banner')}
    </div>
  );
};

const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

export const App = () => (
  <BrowserRouter basename={BASENAME}>
    <DemoBanner />
    <Suspense fallback={<div className="stub"><div className="container">…</div></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:slug" element={<CampaignDetail />} />
          <Route path="about" element={<StubPage k="nav.about" />} />
          <Route path="how-it-works" element={<StubPage k="nav.how" />} />
          <Route path="partners" element={<StubPage k="nav.partners" />} />
          <Route path="reports" element={<StubPage k="nav.reports" />} />
          <Route path="partnership" element={<StubPage k="nav.partnership" />} />
          <Route path="partnership/funds" element={<StubPage k="footer.partners_fund" />} />
          <Route path="partnership/hospitals" element={<StubPage k="footer.partners_hosp" />} />
          <Route path="subscribe" element={<StubPage k="cta.subscribe_monthly" />} />
          <Route path="tax-deduction" element={<StubPage k="footer.platform_tax" />} />
          <Route path="ambassadors" element={<StubPage k="footer.platform_ambassadors" />} />
          <Route path="press" element={<StubPage k="footer.platform_press" />} />
          <Route path="b2b" element={<StubPage k="footer.partners_b2b" />} />
          <Route path="csr" element={<StubPage k="footer.partners_csr" />} />
          <Route path="api" element={<StubPage k="footer.partners_api" />} />
          <Route path="legal/charter" element={<StubPage k="footer.legal_charter" />} />
          <Route path="legal/donation" element={<StubPage k="footer.legal_donation" />} />
          <Route path="legal/pdp" element={<StubPage k="footer.legal_pdp" />} />
          <Route path="legal/moderation" element={<StubPage k="footer.legal_moderation" />} />
          <Route path="legal/program" element={<StubPage k="footer.legal_program" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
