import type { LocalizedString } from '@/lib/formatters';

export type HelpType =
  | 'treatment' | 'rehab' | 'medication' | 'equipment'
  | 'surgery' | 'abroad' | 'other';

export type Category = 'child' | 'adult' | 'elderly' | 'animal' | 'ecology';

export type CampaignStatus =
  | 'active' | 'urgent' | 'closing' | 'on_report' | 'completed';

export type PublisherType = 'fund' | 'hospital';

export type BadgeKey =
  | 'surgery' | 'medication' | 'equipment' | 'rehab' | 'treatment'
  | 'abroad' | 'other' | 'direct_to_clinic' | 'oms_refusal' | 'urgent';

export type DocType = 'extract' | 'referral' | 'oms_refusal' | 'bill';

export interface Partner {
  id: string;
  type: PublisherType;
  name: string;
  region: string;
  ogrn: string;
  licenseNumber?: string;
  verifiedSince: string;
}

export interface Campaign {
  id: string;
  slug: string;
  publisher: Partner;
  curatorFund?: Partner;
  doctorName?: LocalizedString;
  patientName: string;
  patientNameLatin?: string;
  patientAge?: number;
  patientRegion: string;
  diagnosis: LocalizedString;
  icd10?: string;
  helpType: HelpType;
  category: Category;
  story: LocalizedString;
  shortTitle: LocalizedString;
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  deadlineDays: number;
  omsRefusal: boolean;
  urgent: boolean;
  beneficiary: 'fund' | 'hospital';
  status: CampaignStatus;
  badges?: BadgeKey[];
  photoVariant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  documents?: Array<{ name: LocalizedString; size: string; type: DocType }>;
  updates?: Array<{ dateLabel: LocalizedString; dayLabel: string; title: LocalizedString; body: LocalizedString }>;
  donations?: Array<{ name: string; sumLabel: string; anon?: boolean }>;
  targetClinic?: { name: string; license: string };
  patientNameDative?: string;
  patientNameGenitive?: string;
}

export interface SiteStats {
  collectedYtd: string;
  donorsYtd: string;
  fundsActive: string;
  hospitalsActive: string;
  beneficiariesActive: string;
  reportingRate: string;
}
