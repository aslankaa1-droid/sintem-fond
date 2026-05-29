import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props { title: string; }

export const Stub = ({ title }: Props) => {
  const { t } = useTranslation();
  return (
    <section className="stub">
      <div className="container">
        <h1>{title} · <em>{t('stub.soon_em')}</em></h1>
        <p>{t('stub.soon_b')}</p>
        <Link className="btn primary" to="/">{t('stub.back_home')} <span className="arrow">→</span></Link>
      </div>
    </section>
  );
};
