// ─── BankAccountData.ts ───────────────────────────────────────────────────────
// Phase 1: Preserved all existing API data contracts exactly.
// All data structures, country routing fields, banks, and currencies unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { Building2, User } from 'lucide-react';
import type React from 'react';
import type { AccountCategory } from './types';

export interface Country {
  code: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  routingFields: RoutingField[];
  ibanPrefix?: string;
  ibanLength?: number;
}

export interface RoutingField {
  key: string;
  labelEn: string;
  labelAr: string;
  placeholder: string;
  hintEn: string;
  hintAr: string;
  pattern?: string;
  maxLength?: number;
}

export interface BankEntry {
  nameEn: string;
  nameAr: string;
  swiftEn: string;
  phone: string;
  email: string;
  website: string;
}

export interface Currency {
  code: string;
  nameEn: string;
  nameAr: string;
  symbol: string;
}

export const COUNTRIES: Country[] = [
  {
    code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦',
    ibanPrefix: 'SA', ibanLength: 24,
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت / BIC',
        placeholder: 'e.g. RJHISARI',
        hintEn: '8 or 11 character code identifying the bank globally.',
        hintAr: 'رمز من 8 أو 11 حرفًا يُعرّف البنك دوليًا.',
        maxLength: 11,
      },
    ],
  },
  {
    code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪',
    ibanPrefix: 'AE', ibanLength: 23,
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت / BIC',
        placeholder: 'e.g. NBADAEAA',
        hintEn: '8 or 11 character code.',
        hintAr: 'رمز من 8 أو 11 حرفًا.',
        maxLength: 11,
      },
    ],
  },
  {
    code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة الأمريكية', flag: '🇺🇸',
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت',
        placeholder: 'e.g. CHASUS33',
        hintEn: 'Required for international wires.',
        hintAr: 'مطلوب للتحويلات الدولية.',
        maxLength: 11,
      },
      {
        key: 'routingNumber', labelEn: 'ABA Routing Number', labelAr: 'رقم التوجيه ABA',
        placeholder: '9 digits',
        hintEn: '9-digit ABA number for US domestic transfers.',
        hintAr: 'رقم ABA من 9 أرقام للتحويلات المحلية الأمريكية.',
        pattern: '[0-9]{9}',
        maxLength: 9,
      },
    ],
  },
  {
    code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', flag: '🇬🇧',
    ibanPrefix: 'GB', ibanLength: 22,
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت',
        placeholder: 'e.g. BARCGB22',
        hintEn: '8 or 11 character code.',
        hintAr: 'رمز من 8 أو 11 حرفًا.',
        maxLength: 11,
      },
      {
        key: 'sortCode', labelEn: 'Sort Code', labelAr: 'رمز الفرز',
        placeholder: 'XX-XX-XX',
        hintEn: '6-digit UK bank routing code.',
        hintAr: 'رمز مكوّن من 6 أرقام.',
        pattern: '[0-9]{2}-[0-9]{2}-[0-9]{2}',
        maxLength: 8,
      },
    ],
  },
  {
    code: 'IN', nameEn: 'India', nameAr: 'الهند', flag: '🇮🇳',
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت',
        placeholder: 'e.g. HDFCINBB',
        hintEn: '8 or 11 character code.',
        hintAr: 'رمز من 8 أو 11 حرفًا.',
        maxLength: 11,
      },
      {
        key: 'ifscCode', labelEn: 'IFSC Code', labelAr: 'رمز IFSC',
        placeholder: 'HDFCINBB001',
        hintEn: '11-character Indian Financial System Code.',
        hintAr: 'رمز النظام المالي الهندي من 11 حرفًا.',
        pattern: '[A-Z]{4}0[A-Z0-9]{6}',
        maxLength: 11,
      },
    ],
  },
  {
    code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪',
    ibanPrefix: 'DE', ibanLength: 22,
    routingFields: [
      {
        key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت',
        placeholder: 'e.g. DEUTDEDB',
        hintEn: '8 or 11 character code.',
        hintAr: 'رمز من 8 أو 11 حرفًا.',
        maxLength: 11,
      },
      {
        key: 'bankleitzahl', labelEn: 'Bankleitzahl (BLZ)', labelAr: 'رمز Bankleitzahl',
        placeholder: '20010020',
        hintEn: '8-digit German bank routing code.',
        hintAr: 'رمز البنك الألماني من 8 أرقام.',
        maxLength: 8,
      },
    ],
  },
  {
    code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', ibanPrefix: 'KW', ibanLength: 30,
    routingFields: [{ key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت', placeholder: 'e.g. NBOKKWKW', hintEn: '8 or 11 character code.', hintAr: 'رمز من 8 أو 11 حرفًا.', maxLength: 11 }],
  },
  {
    code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', ibanPrefix: 'QA', ibanLength: 29,
    routingFields: [{ key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت', placeholder: 'e.g. QNBAQQQA', hintEn: '8 or 11 character code.', hintAr: 'رمز من 8 أو 11 حرفًا.', maxLength: 11 }],
  },
  {
    code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', ibanPrefix: 'BH', ibanLength: 22,
    routingFields: [{ key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت', placeholder: 'e.g. NBOBBHBM', hintEn: '8 or 11 character code.', hintAr: 'رمز من 8 أو 11 حرفًا.', maxLength: 11 }],
  },
  {
    code: 'OM', nameEn: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', ibanPrefix: 'OM', ibanLength: 23,
    routingFields: [{ key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت', placeholder: 'e.g. BMUSOMRX', hintEn: '8 or 11 character code.', hintAr: 'رمز من 8 أو 11 حرفًا.', maxLength: 11 }],
  },
  {
    code: 'FR', nameEn: 'France', nameAr: 'فرنسا', flag: '🇫🇷', ibanPrefix: 'FR', ibanLength: 27,
    routingFields: [{ key: 'swiftCode', labelEn: 'SWIFT / BIC Code', labelAr: 'رمز السويفت', placeholder: 'e.g. BNPAFRPP', hintEn: '8 or 11 character code.', hintAr: 'رمز من 8 أو 11 حرفًا.', maxLength: 11 }],
  },
];

export const BANKS: Record<string, BankEntry[]> = {
  SA: [
    { nameEn: 'Al Rajhi Bank', nameAr: 'مصرف الراجحي', swiftEn: 'RJHISARI', phone: '920000802', email: 'info@alrajhibank.com.sa', website: 'www.alrajhibank.com.sa' },
    { nameEn: 'Saudi National Bank (SNB)', nameAr: 'البنك الأهلي السعودي', swiftEn: 'NCBKSAJE', phone: '920001000', email: 'info@snb.com.sa', website: 'www.snb.com.sa' },
    { nameEn: 'Riyad Bank', nameAr: 'بنك الرياض', swiftEn: 'RIBLSARI', phone: '920002470', email: 'info@riyadbank.com', website: 'www.riyadbank.com' },
    { nameEn: 'Saudi Fransi Bank', nameAr: 'بنك السعودي الفرنسي', swiftEn: 'BSFRSARI', phone: '920007555', email: 'info@alfransi.com.sa', website: 'www.alfransi.com.sa' },
    { nameEn: 'Arab National Bank', nameAr: 'البنك العربي الوطني', swiftEn: 'ARNBSARI', phone: '920002240', email: 'info@anb.com.sa', website: 'www.anb.com.sa' },
    { nameEn: 'Alinma Bank', nameAr: 'مصرف الإنماء', swiftEn: 'INMASARI', phone: '8001244000', email: 'info@alinma.com', website: 'www.alinma.com' },
    { nameEn: 'Bank Albilad', nameAr: 'بنك البلاد', swiftEn: 'ALBISARI', phone: '920005000', email: 'info@bankalbilad.com', website: 'www.bankalbilad.com' },
    { nameEn: 'HSBC Saudi Arabia', nameAr: 'إتش إس بي سي السعودية', swiftEn: 'HBZUSARI', phone: '9200280000', email: 'info@hsbcsaudi.com', website: 'www.hsbc.com.sa' },
  ],
  AE: [
    { nameEn: 'Emirates NBD', nameAr: 'الإمارات NBD', swiftEn: 'EBILAEAD', phone: '600540000', email: 'info@emiratesnbd.com', website: 'www.emiratesnbd.com' },
    { nameEn: 'First Abu Dhabi Bank (FAB)', nameAr: 'بنك أبوظبي الأول', swiftEn: 'NBADAEAA', phone: '600525500', email: 'info@bankfab.com', website: 'www.bankfab.com' },
    { nameEn: 'Abu Dhabi Commercial Bank (ADCB)', nameAr: 'بنك أبوظبي التجاري', swiftEn: 'ADCBAEAA', phone: '600502030', email: 'info@adcb.com', website: 'www.adcb.com' },
    { nameEn: 'Dubai Islamic Bank (DIB)', nameAr: 'بنك دبي الإسلامي', swiftEn: 'DUIBAEAD', phone: '044609000', email: 'info@dib.ae', website: 'www.dib.ae' },
  ],
  US: [
    { nameEn: 'JPMorgan Chase', nameAr: 'JPMorgan Chase', swiftEn: 'CHASUS33', phone: '18003359900', email: 'support@chase.com', website: 'www.chase.com' },
    { nameEn: 'Bank of America', nameAr: 'Bank of America', swiftEn: 'BOFAUS3N', phone: '18004321000', email: 'info@bankofamerica.com', website: 'www.bankofamerica.com' },
    { nameEn: 'Wells Fargo', nameAr: 'Wells Fargo', swiftEn: 'WFBIUS6S', phone: '18009563476', email: 'info@wellsfargo.com', website: 'www.wellsfargo.com' },
    { nameEn: 'Citibank', nameAr: 'سيتي بنك', swiftEn: 'CITIUS33', phone: '18006272265', email: 'info@citibank.com', website: 'www.citibank.com' },
  ],
  GB: [
    { nameEn: 'Barclays', nameAr: 'باركليز', swiftEn: 'BARCGB22', phone: '03457345345', email: 'info@barclays.co.uk', website: 'www.barclays.co.uk' },
    { nameEn: 'HSBC UK', nameAr: 'HSBC المملكة المتحدة', swiftEn: 'MIDLGB22', phone: '03456002290', email: 'info@hsbc.co.uk', website: 'www.hsbc.co.uk' },
    { nameEn: 'Lloyds Bank', nameAr: 'لويدز بنك', swiftEn: 'LOYDGB2L', phone: '03456000000', email: 'info@lloydsbank.com', website: 'www.lloydsbank.com' },
    { nameEn: 'NatWest', nameAr: 'ناتويست', swiftEn: 'NWBKGB2L', phone: '03459000400', email: 'info@natwest.com', website: 'www.natwest.com' },
  ],
  IN: [
    { nameEn: 'HDFC Bank', nameAr: 'HDFC بنك', swiftEn: 'HDFCINBB', phone: '18002026161', email: 'info@hdfcbank.com', website: 'www.hdfcbank.com' },
    { nameEn: 'ICICI Bank', nameAr: 'ICICI بنك', swiftEn: 'ICICINBB', phone: '18001080', email: 'info@icicibank.com', website: 'www.icicibank.com' },
    { nameEn: 'State Bank of India (SBI)', nameAr: 'بنك الدولة الهندي', swiftEn: 'SBININBB', phone: '1800112211', email: 'info@sbi.co.in', website: 'www.sbi.co.in' },
  ],
  DE: [
    { nameEn: 'Deutsche Bank', nameAr: 'دويتشه بنك', swiftEn: 'DEUTDEDB', phone: '069910010', email: 'info@deutschebank.de', website: 'www.db.com' },
    { nameEn: 'Commerzbank', nameAr: 'كوميرزبنك', swiftEn: 'COBADEBB', phone: '069136220', email: 'info@commerzbank.com', website: 'www.commerzbank.com' },
  ],
  KW: [
    { nameEn: 'National Bank of Kuwait (NBK)', nameAr: 'بنك الكويت الوطني', swiftEn: 'NBOKKWKW', phone: '1801801', email: 'info@nbk.com', website: 'www.nbk.com' },
    { nameEn: 'Kuwait Finance House (KFH)', nameAr: 'بيت التمويل الكويتي', swiftEn: 'KFHOKWKW', phone: '1800500', email: 'info@kfh.com', website: 'www.kfh.com' },
  ],
  QA: [
    { nameEn: 'Qatar National Bank (QNB)', nameAr: 'بنك قطر الوطني', swiftEn: 'QNBAQQQA', phone: '44407407', email: 'info@qnb.com.qa', website: 'www.qnb.com' },
    { nameEn: 'Commercial Bank of Qatar', nameAr: 'البنك التجاري القطري', swiftEn: 'CBQAQAQA', phone: '44490101', email: 'info@cbq.qa', website: 'www.cbq.qa' },
  ],
  BH: [
    { nameEn: 'National Bank of Bahrain (NBB)', nameAr: 'البنك الوطني البحريني', swiftEn: 'NBOBBHBM', phone: '17228800', email: 'info@nbbonline.com', website: 'www.nbbonline.com' },
    { nameEn: 'Bank of Bahrain and Kuwait (BBK)', nameAr: 'بنك البحرين والكويت', swiftEn: 'BBKUBHBM', phone: '17223388', email: 'info@bbkonline.com', website: 'www.bbkonline.com' },
  ],
  OM: [
    { nameEn: 'Bank Muscat', nameAr: 'بنك مسقط', swiftEn: 'BMUSOMRX', phone: '24795555', email: 'info@bankmuscat.com', website: 'www.bankmuscat.com' },
  ],
  FR: [
    { nameEn: 'BNP Paribas', nameAr: 'BNP باريبا', swiftEn: 'BNPAFRPP', phone: '0800740100', email: 'info@bnpparibas.com', website: 'www.bnpparibas.com' },
    { nameEn: 'Société Générale', nameAr: 'سوسيتيه جنرال', swiftEn: 'SOGEFRPP', phone: '0969080900', email: 'info@societegenerale.fr', website: 'www.societegenerale.fr' },
  ],
};

export const CURRENCIES: Currency[] = [
  { code: 'SAR', nameEn: 'Saudi Riyal',    nameAr: 'الريال السعودي',    symbol: 'ر.س' },
  { code: 'USD', nameEn: 'US Dollar',      nameAr: 'الدولار الأمريكي',  symbol: '$'   },
  { code: 'EUR', nameEn: 'Euro',           nameAr: 'اليورو',             symbol: '€'   },
  { code: 'GBP', nameEn: 'British Pound',  nameAr: 'الجنيه الإسترليني', symbol: '£'   },
  { code: 'AED', nameEn: 'UAE Dirham',     nameAr: 'الدرهم الإماراتي',  symbol: 'د.إ' },
  { code: 'KWD', nameEn: 'Kuwaiti Dinar',  nameAr: 'الدينار الكويتي',   symbol: 'د.ك' },
  { code: 'QAR', nameEn: 'Qatari Riyal',   nameAr: 'الريال القطري',      symbol: 'ر.ق' },
  { code: 'BHD', nameEn: 'Bahraini Dinar', nameAr: 'الدينار البحريني',   symbol: 'BD'  },
  { code: 'INR', nameEn: 'Indian Rupee',   nameAr: 'الروبية الهندية',    symbol: '₹'   },
  { code: 'JPY', nameEn: 'Japanese Yen',   nameAr: 'الين الياباني',      symbol: '¥'   },
  { code: 'CNY', nameEn: 'Chinese Yuan',   nameAr: 'اليوان الصيني',      symbol: '¥'   },
];

export const CATEGORIES: {
  value: AccountCategory;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: React.ElementType;
  activeClass: string;
  iconClass: string;
}[] = [
  {
    value: 'personal',
    labelEn: 'Personal',
    labelAr: 'شخصي',
    descriptionEn: 'For individuals — requires National ID or Passport',
    descriptionAr: 'للأفراد — يتطلب هوية وطنية أو جواز سفر',
    icon: User,
    activeClass: 'border-primary/40 bg-primary/[0.08] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.4)]',
    iconClass: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    value: 'business',
    labelEn: 'Business',
    labelAr: 'تجاري',
    descriptionEn: 'For companies — requires Commercial Registration',
    descriptionAr: 'للشركات — يتطلب سجل تجاري',
    icon: Building2,
    activeClass: 'border-blue-500/40 bg-blue-500/[0.08] shadow-[inset_0_0_0_1px_hsl(210_100%_56%/0.4)]',
    iconClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
];

export const ESTABLISHMENT_TYPES = [
  { value: 'sole_proprietorship',       labelEn: 'Sole Proprietorship',       labelAr: 'مؤسسة فردية' },
  { value: 'general_partnership',       labelEn: 'General Partnership',       labelAr: 'شركة تضامن' },
  { value: 'limited_partnership',       labelEn: 'Limited Partnership',       labelAr: 'شركة توصية بسيطة' },
  { value: 'limited_partnership_shares', labelEn: 'Limited Partnership with Shares', labelAr: 'شركة توصية بالأسهم' },
  { value: 'llc',                       labelEn: 'Limited Liability Company (LLC)', labelAr: 'شركة ذات مسؤولية محدودة' },
  { value: 'joint_stock',               labelEn: 'Joint Stock Company',       labelAr: 'شركة مساهمة' },
  { value: 'closed_joint_stock',        labelEn: 'Closed Joint Stock Company', labelAr: 'شركة مساهمة مقفلة' },
  { value: 'holding_company',           labelEn: 'Holding Company',           labelAr: 'شركة قابضة' },
  { value: 'subsidiary',                labelEn: 'Subsidiary',                labelAr: 'شركة تابعة' },
  { value: 'professional_company',      labelEn: 'Professional Company',      labelAr: 'شركة مهنية' },
  { value: 'joint_venture',             labelEn: 'Joint Venture',             labelAr: 'مشروع مشترك' },
  { value: 'multinational_corporation', labelEn: 'Multinational Corporation', labelAr: 'شركة متعددة الجنسيات' },
];

export const BUSINESS_ACTIVITY_SECTORS = [
  { value: 'retail',             labelEn: 'Retail & E-commerce',           labelAr: 'التجزئة والتجارة الإلكترونية' },
  { value: 'foodstuff',          labelEn: 'Foodstuff Wholesale Trade',     labelAr: 'التجارة المنتجات الغذائية' },
  { value: 'manufacturing',      labelEn: 'Manufacturing & Industry',      labelAr: 'التصنيع والصناعة' },
  { value: 'construction',       labelEn: 'Construction & Real Estate',    labelAr: 'البناء والعقارات' },
  { value: 'hospitality',        labelEn: 'Hospitality & Tourism',         labelAr: 'الضيافة والسياحة' },
  { value: 'professional',       labelEn: 'Professional Services',         labelAr: 'الخدمات المهنية' },
  { value: 'it_telecom',         labelEn: 'IT & Telecommunications',       labelAr: 'تقنية المعلومات والاتصالات' },
  { value: 'finance',            labelEn: 'Financial Services',            labelAr: 'الخدمات المالية' },
  { value: 'healthcare',         labelEn: 'Healthcare & Pharmaceuticals',  labelAr: 'الرعاية الصحية والأدوية' },
  { value: 'transport_logistics', labelEn: 'Transport & Logistics',        labelAr: 'النقل والخدمات اللوجستية' },
  { value: 'education',          labelEn: 'Education & Training',          labelAr: 'التعليم والتدريب' },
  { value: 'energy',             labelEn: 'Energy & Utilities',            labelAr: 'الطاقة والمرافق' },
  { value: 'government',         labelEn: 'Government & Public Sector',    labelAr: 'القطاع الحكومي والعام' },
  { value: 'non_profit',         labelEn: 'Non-Profit & Associations',     labelAr: 'المنظمات غير الربحية والجمعيات' },
  { value: 'charitable',         labelEn: 'Charitable Organizations',      labelAr: 'المنظمات الحساسة' },
  { value: 'other',              labelEn: 'Other',                         labelAr: 'آخر' },
];
