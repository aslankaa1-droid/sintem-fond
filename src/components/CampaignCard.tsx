import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Campaign } from '@/types';
import { formatRub, percent } from '@/lib/formatters';

interface PartnerIconProps { type: 'fund' | 'hospital'; }

const PartnerIcon = ({ type }: PartnerIconProps) =>
  type === 'fund' ? (
    <svg viewBox="0 0 24 24"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24"><path d="M6 21V9l6-5 6 5v12M9 21v-6h6v6" /></svg>
  );

interface Props {
  campaign: Campaign;
  variant?: 'grid' | 'lead' | 'compact';
}

export const CampaignCard = ({ campaign, variant = 'grid' }: Props) => {
  const { t } = useTranslation();
  const pct = percent(campaign.collectedAmount, campaign.targetAmount);
  const isFeatured = variant === 'lead' || variant === 'compact';

  if (isFeatured) {
    return (
      <Link className={`feat-card${variant === 'lead' ? ' lead' : ''}`} to={`/campaigns/${campaign.slug}`}>
        <div className={`photo ph-${campaign.photoVariant}`}>
          <div className="badges">
            {campaign.urgent && <span className="tag crimson">Срочно</span>}
            {campaign.omsRefusal && <span className="tag brass">ОМС-отказ</span>}
            {!campaign.urgent && !campaign.omsRefusal && campaign.beneficiary === 'hospital' && (
              <span className="tag sage">Прямо в клинику</span>
            )}
          </div>
        </div>
        <div className="partner">{campaign.publisher.name} · {campaign.publisher.region}</div>
        <h3 className="title">{campaign.shortTitle}</h3>
        <div className="progress-row">
          <div className="progress"><span style={{ width: `${pct}%` }} /></div>
          <div className="amounts">
            <div className="col"><span>{t('campaigns.amounts_collected')}</span><span className="v">{formatRub(campaign.collectedAmount)}</span></div>
            <div className="col right"><span>{t('campaigns.amounts_target')}</span><span className="v">{formatRub(campaign.targetAmount)}</span></div>
          </div>
        </div>
        <span className="more">{t('cta.help')} {campaign.patientName} <span className="arrow">→</span></span>
      </Link>
    );
  }

  return (
    <Link className="card" to={`/campaigns/${campaign.slug}`}>
      <div className={`photo ph-${campaign.photoVariant}`}>
        <div className="badges">
          {campaign.urgent && <span className="tag crimson">Срочно</span>}
          {campaign.omsRefusal && <span className="tag brass">ОМС-отказ</span>}
          {!campaign.urgent && !campaign.omsRefusal && campaign.beneficiary === 'hospital' && (
            <span className="tag sage">Прямо в клинику</span>
          )}
          {campaign.helpType === 'medication' && <span className="tag">Лекарства</span>}
          {campaign.helpType === 'equipment' && <span className="tag">Оборудование</span>}
        </div>
      </div>
      <div className="partner">
        <PartnerIcon type={campaign.publisher.type} />
        {campaign.publisher.name} · {campaign.publisher.region}
      </div>
      <h3>{campaign.shortTitle}</h3>
      <div className="progress-row">
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        <div className="amounts">
          <div className="col"><span>{t('campaigns.amounts_collected')}</span><span className="v">{formatRub(campaign.collectedAmount)}</span></div>
          <div className="col right"><span>{t('campaigns.amounts_target')}</span><span className="v">{formatRub(campaign.targetAmount)}</span></div>
        </div>
      </div>
    </Link>
  );
};
