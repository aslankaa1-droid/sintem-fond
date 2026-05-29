export type HelpType =
  | 'treatment' | 'rehab' | 'medication' | 'equipment'
  | 'surgery' | 'abroad' | 'other';

export type Category = 'child' | 'adult' | 'elderly' | 'animal' | 'ecology';

export type CampaignStatus =
  | 'active' | 'urgent' | 'closing' | 'on_report' | 'completed';

export type PublisherType = 'fund' | 'hospital';

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
  doctorName?: string;
  patientName: string;
  patientAge?: number;
  patientRegion: string;
  diagnosis: string;
  icd10?: string;
  helpType: HelpType;
  category: Category;
  story: string;
  shortTitle: string;
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  deadlineDays: number;
  omsRefusal: boolean;
  urgent: boolean;
  beneficiary: 'fund' | 'hospital';
  status: CampaignStatus;
  badges?: string[];
  photoVariant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  documents?: Array<{ name: string; size: string; type: 'extract' | 'referral' | 'oms_refusal' | 'bill' }>;
  updates?: Array<{ dateLabel: string; dayLabel: string; title: string; body: string }>;
  donations?: Array<{ name: string; sumLabel: string; anon?: boolean }>;
}

export interface SiteStats {
  collectedYtd: string;
  donorsYtd: string;
  fundsActive: string;
  hospitalsActive: string;
  beneficiariesActive: string;
  reportingRate: string;
}
