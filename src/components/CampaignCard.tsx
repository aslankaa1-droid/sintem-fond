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
  const { t, i18n } = useTranslation();
  const pct = percent(campaign.collectedAmount, campaign.targetAmount);
  const isFeatured = variant === 'lead' || variant === 'compact';
  const lang = (i18n.language || 'ru').slice(0, 2);
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US';
  const region = t(`regions.${campaign.patientRegion}`, { defaultValue: campaign.patientRegion });
  const helpName = lang === 'ru' && campaign.patientNameDative ? campaign.patientNameDative : campaign.patientName;

  if (isFeatured) {
    return (
      <Link className={`feat-card${variant === 'lead' ? ' lead' : ''}`} to={`/campaigns/${campaign.slug}`}>
        <div className={`photo ph-${campaign.photoVariant}`}>
          <div className="badges">
            {campaign.urgent && <span className="tag crimson">{t('badges.urgent')}</span>}
            {campaign.omsRefusal && <span className="tag brass">{t('badges.oms_refusal')}</span>}
            {!campaign.urgent && !campaign.omsRefusal && campaign.beneficiary === 'hospital' && (
              <span className="tag sage">{t('badges.direct_to_clinic')}</span>
            )}
          </div>
        </div>
        <div className="partner">{campaign.publisher.name} · {region}</div>
        <h3 className="title">{campaign.shortTitle}</h3>
        <div className="progress-row">
          <div className="progress"><span style={{ width: `${pct}%` }} /></div>
          <div className="amounts">
            <div className="col"><span>{t('campaigns.amounts_collected')}</span><span className="v">{formatRub(campaign.collectedAmount, locale)}</span></div>
            <div className="col right"><span>{t('campaigns.amounts_target')}</span><span className="v">{formatRub(campaign.targetAmount, locale)}</span></div>
          </div>
        </div>
        <span className="more">{t('cta.help_with_name', { name: helpName })} <span className="arrow">→</span></span>
      </Link>
    );
  }

  return (
    <Link className="card" to={`/campaigns/${campaign.slug}`}>
      <div className={`photo ph-${campaign.photoVariant}`}>
        <div className="badges">
          {campaign.urgent && <span className="tag crimson">{t('badges.urgent')}</span>}
          {campaign.omsRefusal && <span className="tag brass">{t('badges.oms_refusal')}</span>}
          {!campaign.urgent && !campaign.omsRefusal && campaign.beneficiary === 'hospital' && (
            <span className="tag sage">{t('badges.direct_to_clinic')}</span>
          )}
          {campaign.helpType === 'medication' && <span className="tag">{t('badges.medication')}</span>}
          {campaign.helpType === 'equipment' && <span className="tag">{t('badges.equipment')}</span>}
        </div>
      </div>
      <div className="partner">
        <PartnerIcon type={campaign.publisher.type} />
        {campaign.publisher.name} · {region}
      </div>
      <h3>{campaign.shortTitle}</h3>
      <div className="progress-row">
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        <div className="amounts">
          <div className="col"><span>{t('campaigns.amounts_collected')}</span><span className="v">{formatRub(campaign.collectedAmount, locale)}</span></div>
          <div className="col right"><span>{t('campaigns.amounts_target')}</span><span className="v">{formatRub(campaign.targetAmount, locale)}</span></div>
        </div>
      </div>
    </Link>
  );
};
