import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
function numberToWords(num: number, currency: string): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  function convertLessThanOneThousand(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    }
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanOneThousand(n % 100) : '');
  }

  function convert(n: number): string {
    if (n === 0) return 'Zero';
    if (n < 1000) return convertLessThanOneThousand(n);
    if (n < 1000000) {
      return convertLessThanOneThousand(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertLessThanOneThousand(n % 1000) : '');
    }
    if (n < 1000000000) {
      return convertLessThanOneThousand(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 !== 0 ? ' ' + convert(n % 1000000) : '');
    }
    return convertLessThanOneThousand(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 !== 0 ? ' ' + convert(n % 1000000000) : '');
  }

  const whole = Math.floor(num);
  const cents = Math.round((num - whole) * 100);

  const currencyNames: { [key: string]: { singular: string; plural: string; centSingular: string; centPlural: string } } = {
    'USD': { singular: 'Dollar', plural: 'Dollars', centSingular: 'Cent', centPlural: 'Cents' },
    'EUR': { singular: 'Euro', plural: 'Euros', centSingular: 'Cent', centPlural: 'Cents' },
    'TRY': { singular: 'Turkish Lira', plural: 'Turkish Liras', centSingular: 'Kuruş', centPlural: 'Kuruş' },
    'GBP': { singular: 'Pound', plural: 'Pounds', centSingular: 'Penny', centPlural: 'Pence' },
    'SAR': { singular: 'Saudi Riyal', plural: 'Saudi Riyals', centSingular: 'Halala', centPlural: 'Halalas' },
    'AED': { singular: 'UAE Dirham', plural: 'UAE Dirhams', centSingular: 'Fils', centPlural: 'Fils' }
  };

  const currencyInfo = currencyNames[currency] || currencyNames['USD'];

  let result = convert(whole) + ' ' + (whole !== 1 ? currencyInfo.plural : currencyInfo.singular);
  if (cents > 0) {
    result += ' and ' + convert(cents) + ' ' + (cents !== 1 ? currencyInfo.centPlural : currencyInfo.centSingular);
  }

  return result;
}

// Register fonts
Font.register({
  family: 'TimesNewRomanRegular',
  src: '/Fonts/Tajawal-Regular.ttf'
});

Font.register({
  family: 'Arial',
  src: '/Fonts/TimesNewRomanRegular.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0,
    fontSize: 12, // Increased from 12
    lineHeight: 1, // Set to 1.5
    fontFamily: 'TimesNewRomanRegular',
    color: '#1a1a1a'
  },
  gradientHeader: {
    height: 8, // Increased from 6
    backgroundColor: '#01163A'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    height: '2.5cm', // Slightly increased
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 14,
    backgroundColor: '#f8fafb',
    borderBottom: '1 solid #e2e8f0'
  },
  headerLeft: {
    flex: 1.2,
    alignItems: 'flex-start',
    paddingRight: 8
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRight: {
    flex: 1.2,
    alignItems: 'flex-end',
    paddingLeft: 8
  },
  companyLogo: {
    width: 80, // Increased from 70
    height: 65, // Increased from 55
    objectFit: 'contain'
  },
  companyNameEnglish: {
    fontSize: 15, // Increased from 12
    fontWeight: 'bold',
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    lineHeight: 1.5,
    textAlign: 'left',
    paddingTop: 4,
    marginBottom: 2
  },
  companyNameArabic: {
    fontFamily: 'TimesNewRomanRegular',
    fontSize: 16, // Increased from 13
    color: '#01163A',
    fontWeight: 'bold',
    lineHeight: 1.5,
    textAlign: 'right',
    paddingTop: 4,
    marginBottom: 2
  },
  companySubtitleEnglish: {
    fontSize: 12, // Increased from 10
    color: '#4b5563',
    fontFamily: 'Arial',
    lineHeight: 1.5,
    textAlign: 'left',
    marginBottom: 3
  },
  companySubtitleArabic: {
    fontFamily: 'TimesNewRomanRegular',
    fontSize: 12, // Increased from 10
    color: '#4b5563',
    lineHeight: 1.3,
    textAlign: 'right',
    marginBottom: 2
  },
  companyRegNumber: {
    fontSize: 10, // Increased from 8
    color: '#64748b',
    fontFamily: 'TimesNewRomanRegular',
    lineHeight: 1.2,
    marginTop: 2
  },
  titleSection: {
    backgroundColor: '#01163A',
    height: '1cm', // Increased to allow more space for titles
    paddingTop: 8, // Added to move titles down
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    paddingHorizontal: 24,
    marginBottom: 8 // Increased from 6
  },
  titleLeft: {
    flex: 1,
    alignItems: 'flex-start'
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center'
  },
  titleRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  titleText: {
    fontSize: 12, // Increased from 9
    color: '#ffffff',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    lineHeight: 1.5
  },
  titleTextArabic: {
    fontSize: 12, // Increased from 9
    color: '#ffffff',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 1.5
  },
  amountSection: {
    backgroundColor: '#f0f4ff',
    borderRadius: 3,
    marginBottom: 4, // Reduced from 8
    padding: 6, // Reduced from 10
    border: '1 solid #01163A'
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    marginBottom: 2, // Reduced from 6
    paddingBottom: 2, // Reduced from 6
    borderBottom: '1 solid #01163A'
  },
  amountLabel: {
    fontSize: 10, // Increased from 8
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    lineHeight: 1.5
  },
  amountLabelArabic: {
    fontSize: 10, // Increased from 8
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 1.5
  },
  amountValue: {
    fontSize: 15, // Increased from 12
    fontWeight: 'bold',
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'center',
    lineHeight: 1.2 // Reduced from 1.5
  },
  amountWords: {
    fontSize: 12, // Increased from 9
    color: '#374151',
    textAlign: 'center',
    fontFamily: 'TimesNewRomanRegular',
    marginTop: 2, // Reduced from 4
    fontStyle: 'normal',
    lineHeight: 1.2 // Reduced from 1.5
  },
  requestStatement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    marginBottom: 8, // Increased from 6
    paddingHorizontal: 24,
    backgroundColor: '#f8fafb',
    paddingVertical: 5, // Increased from 3
    borderRadius: 2
  },
  requestTextEnglish: {
    fontSize: 10, // Increased from 8
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    lineHeight: 1.5
  },
  requestTextArabic: {
    fontSize: 10, // Increased from 8
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 1.5
  },
  contentContainer: {
    paddingHorizontal: 24, // Increased from 20
    paddingBottom: 14 // Increased from 10
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 3,
    padding: 8, // Increased from 6
    marginBottom: 6, // Increased from 4
    border: '1 solid #e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    marginBottom: 6, // Increased from 4
    paddingBottom: 5, // Increased from 3
    borderBottom: '1 solid #01163A',
    backgroundColor: '#f8fafb',
    paddingHorizontal: 6, // Increased from 4
    paddingVertical: 4, // Increased from 2
    borderRadius: 2
  },
  sectionHeaderLeft: {
    flex: 1,
    alignItems: 'flex-start'
  },
  sectionHeaderRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  sectionTitle: {
    fontSize: 10, // Increased from 8
    fontWeight: 'bold',
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    lineHeight: 1.5
  },
  sectionTitleArabic: {
    fontSize: 10, // Increased from 8
    fontWeight: 'bold',
    color: '#01163A',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'right',
    lineHeight: 1.5
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure vertical centering
    paddingVertical: 2, // Reduced from 4
    paddingHorizontal: 6,
    marginBottom: 1, // Reduced from 2
    minHeight: 12 // Reduced from 18
  },
  detailLabelEnglish: {
    width: '32%',
    fontSize: 9, // Increased from 7
    color: '#4b5563',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'left',
    lineHeight: 1.5,
    paddingTop: 2 // Added to nudge text down
  },
  detailData: {
    width: '36%',
    fontSize: 9, // Increased from 7
    color: '#111827',
    textAlign: 'center',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    lineHeight: 1.5,
    paddingTop: 2 // Added to nudge text down
  },
  detailLabelArabic: {
    width: '32%',
    fontSize: 9, // Increased from 7
    color: '#4b5563',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'right',
    lineHeight: 1.5,
    paddingTop: 2 // Added to nudge text down
  },
  detailRowAlternate: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure vertical centering
    paddingVertical: 2, // Reduced from 4
    paddingHorizontal: 6,
    marginBottom: 1, // Reduced from 2
    minHeight: 12, // Reduced from 18
    backgroundColor: '#f9fafb'
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical centering
    paddingVertical: 2, // Reduced from 4
    paddingHorizontal: 6,
    marginBottom: 1, // Reduced from 2
    minHeight: 10 // Reduced from 16
  },
  compactLabel: {
    fontSize: 9, // Increased from 7
    color: '#4b5563',
    fontFamily: 'TimesNewRomanRegular',
    width: '48%',
    lineHeight: 1.5,
    paddingTop: 2 // Added to nudge text down
  },
  compactValue: {
    fontSize: 9, // Increased from 7
    color: '#111827',
    fontFamily: 'TimesNewRomanRegular',
    fontWeight: 'bold',
    width: '48%',
    textAlign: 'right',
    lineHeight: 1.5,
    paddingTop: 2 // Added to nudge text down
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4, // Reduced from 10
    paddingHorizontal: 34, // Increased from 30
    paddingBottom: 8 // Reduced from 18
  },
  signatureBox: {
    width: 90, // Increased from 80
    height: 36, // Increased from 30
    border: '1 solid #01163A',
    borderRadius: 3,
    justifyContent: 'center', // Changed from flex-end to center for vertical centering
    alignItems: 'center',
    paddingBottom: 0, // Removed bottom padding
    backgroundColor: '#f8fafb'
  },
  signatureLabelEnglish: {
    fontSize: 8, // Increased from 6
    color: '#4b5563',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'center',
    lineHeight: 1.5
  },
  signatureLabelArabic: {
    fontSize: 8, // Increased from 6
    color: '#4b5563',
    fontFamily: 'TimesNewRomanRegular',
    textAlign: 'center',
    lineHeight: 1.5
  },
  footerDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 18, // Increased from 15
    backgroundColor: '#01163A',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerTextEnglish: {
    fontSize: 8, // Increased from 6
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'TimesNewRomanRegular',
    lineHeight: 1.5
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  columnLeft: {
    flex: 1,
    marginRight: 4
  },
  columnRight: {
    flex: 1,
    marginLeft: 4
  }
});


// Mock getCompanyInfo (replace with real implementation if available)
async function getCompanyInfo() {
  // You should replace this with a real API/database call
  return {
    name: 'Thouraya Albilad Trading Co.',
    tax_number: '310155261400003',
    address: 'KSA - Jeddah - Petromin Dist. - King Faisal St. - Basurrah Complex',
    phone: '+966550168553',
    logo: '/Logo/Logo-min-min.png',
  };
}

// Types for props
interface CompanyInfo {
  name: string;
  tax_number: string;
  address: string;
  phone: string;
  logo: string;
}
interface BankDetails {
  bankName?: string;
  swiftCode?: string;
  companyAccount?: string;
  companyIban?: string;
  branchName?: string;
  country?: string;
  taxNumber?: string;
}
interface BeneficiaryDetails {
  accountName?: string;
  fullName?: string;
  fullNameAr?: string;
  accountNumber?: string;
  beneficiaryIban?: string;
  iban?: string;
  bankName?: string;
  swiftCode?: string;
  bankBranch?: string;
  bankAddress?: string;
  country?: string;
  aba?: string;
  ifscCode?: string;
}
interface TransferDetails {
  requestNumber?: string;
  amount?: number;
  currency?: string;
  requestDate?: string;
  reasonForTransfer?: string;
  amountInWords?: string;
  notes?: string;
}

const EnhancedTransferRequestDocument = ({ 
  companyInfo = {
    name: '',
    tax_number: '',
    address: '',
    phone: '',
    logo: ''
  }, 
  bankDetails = {}, 
  beneficiaryDetails = {}, 
  transferDetails = {} 
}: { companyInfo?: CompanyInfo, bankDetails?: BankDetails, beneficiaryDetails?: BeneficiaryDetails, transferDetails?: TransferDetails }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Decorative header */}
        <View style={styles.gradientHeader} />

        {/* Company header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyNameEnglish}>Thouraya Albilad Trading Co.</Text>
            <Text style={styles.companySubtitleEnglish}>Food Stuff Trading</Text>
            <Text style={styles.companyRegNumber}>Commercial Registration: 4030281022</Text>
          </View>
          
          <View style={styles.headerCenter}>
            <Image 
              src={'/Logo/Logo-min-min.png'}
              style={styles.companyLogo} 
            />
          </View> 
          
          <View style={styles.headerRight}>
            <Text style={styles.companyNameArabic}>شركة ثريا البلاد للتجارة</Text>
            <Text style={styles.companySubtitleArabic}>تجارة المواد الغذائية</Text>
            <Text style={[styles.companyRegNumber, { textAlign: 'right' }]}>رقم السجل التجاري: ٤٠٣٠٢٨١٠٢٢</Text>
          </View>
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <View style={styles.titleLeft}>
            <Text style={styles.titleText}>Transfer Request</Text>
          </View>
          <View style={styles.titleCenter}>
            <Text style={styles.titleText}>#{transferDetails.requestNumber || 'TR-2024-001'}</Text>
          </View>
          <View style={styles.titleRight}>
            <Text style={styles.titleTextArabic}>طلب تحويل مالي</Text>
          </View>
        </View>

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* New Bank Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 12, fontFamily: 'TimesNewRomanRegular', color: '#01163A', width: '20%', textAlign: 'left', fontWeight: 'bold', lineHeight: 1.5 }}>TO</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TimesNewRomanRegular', color: '#01163A', width: '60%', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.5 }}>{bankDetails.bankName || '[Bank Name]'}</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TimesNewRomanRegular', color: '#01163A', width: '20%', textAlign: 'right', fontWeight: 'bold', lineHeight: 1.5 }}>إلى</Text>
          </View>
          {/* Transfer request statement */}
          <View style={styles.requestStatement}>
            <Text style={styles.requestTextEnglish}>Please transfer the amount of</Text>
            <Text style={styles.requestTextArabic}>يرجى تحويل مبلغ وقدره</Text>
          </View>

          {/* Amount section */}
          <View style={styles.amountSection}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>
                {formatAmount(transferDetails.amount || 0)} {transferDetails.currency || 'SAR'}
              </Text>
              <Text style={styles.amountLabelArabic}>المبلغ</Text>
            </View>
            <Text style={styles.amountWords}>
              {numberToWords(transferDetails.amount || 0, transferDetails.currency || 'SAR')}
            </Text>
          </View>

          {/* Account deduction notice */}
          <View style={styles.requestStatement}>
            <Text style={styles.requestTextEnglish}>To be debited from our account with you</Text>
            <Text style={styles.requestTextArabic}>وذلك خصماً من حسابنا لديكم</Text>
          </View>

          {/* Client Details Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Client Details</Text>
              </View>
              <View style={styles.sectionHeaderRight}>
                <Text style={styles.sectionTitleArabic}>بيانات العميل</Text>
              </View>
            </View>
  
            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Account Number</Text>
              <Text style={styles.detailData}>{bankDetails.companyAccount || '[Account Number]'}</Text>
              <Text style={styles.detailLabelArabic}>رقم الحساب</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>IBAN</Text>
              <Text style={styles.detailData}>{bankDetails.companyIban || '[Company IBAN]'}</Text>
              <Text style={styles.detailLabelArabic}>رقم الآيبان</Text>
            </View>
            
            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Tax Number</Text>
              <Text style={styles.detailData}>{bankDetails.taxNumber || companyInfo.tax_number || '[Tax Number]'}</Text>
              <Text style={styles.detailLabelArabic}>الرقم الضريبي</Text>
            </View>
          </View>

          {/* Additional Information Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Additional Information</Text>
              </View>
              <View style={styles.sectionHeaderRight}>
                <Text style={styles.sectionTitleArabic}>معلومات إضافية</Text>
              </View>
            </View>

            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Request Date</Text>
              <Text style={styles.detailData}>{transferDetails.requestDate || currentDate}</Text>
              <Text style={styles.detailLabelArabic}>تاريخ الطلب</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>Transfer Purpose</Text>
              <Text style={styles.detailData}>{transferDetails.reasonForTransfer || 'Business Payment'}</Text>
              <Text style={styles.detailLabelArabic}>الغرض من التحويل</Text>
            </View>
          </View>

          {/* Beneficiary Details Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Beneficiary Details</Text>
              </View>
              <View style={styles.sectionHeaderRight}>
                <Text style={styles.sectionTitleArabic}>بيانات المستفيد</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>Beneficiary Name</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.fullName || beneficiaryDetails.accountName || '[Beneficiary Name]'}</Text>
              <Text style={styles.detailLabelArabic}>اسم المستفيد</Text>
            </View>
            
            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Account Number</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.accountNumber || '[Account Number]'}</Text>
              <Text style={styles.detailLabelArabic}>رقم الحساب</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>
                {beneficiaryDetails.country === 'United States'
                  ? 'ABA'
                  : beneficiaryDetails.country === 'India'
                  ? 'IFSC Code'
                  : 'IBAN'}
              </Text>
              <Text style={styles.detailData}>
                {beneficiaryDetails.country === 'United States'
                  ? beneficiaryDetails.aba || '[ABA]'
                  : beneficiaryDetails.country === 'India'
                  ? beneficiaryDetails.ifscCode || '[IFSC Code]'
                  : beneficiaryDetails.iban || '[IBAN]'}
              </Text>
              <Text style={styles.detailLabelArabic}>
                {beneficiaryDetails.country === 'United States' ? 'رقم ABA' : beneficiaryDetails.country === 'India' ? 'كود IFSC' : 'رقم الآيبان'}
              </Text>
            </View>
            
            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Bank Name</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.bankName || '[Bank Name]'}</Text>
              <Text style={styles.detailLabelArabic}>اسم البنك</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>SWIFT Code</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.swiftCode || '[SWIFT Code]'}</Text>
              <Text style={styles.detailLabelArabic}>رمز السويفت</Text>
            </View>
            
            <View style={styles.detailRowAlternate}>
              <Text style={styles.detailLabelEnglish}>Branch Name</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.bankBranch || '[Branch Name]'}</Text>
              <Text style={styles.detailLabelArabic}>فرع البنك</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelEnglish}>Bank Address</Text>
              <Text style={styles.detailData}>{beneficiaryDetails.bankAddress || '[Bank Address]'}</Text>
              <Text style={styles.detailLabelArabic}>عنوان البنك</Text>
            </View>
          </View>
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View>
            <View>
            <Image src="Stamp.png" style={{ width: 62, height: 60, objectFit: 'contain' }} />
            </View>
          </View>
          <View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabelEnglish}>Authorized Signature</Text>
              <Text style={styles.signatureLabelArabic}>التوقيع المخول</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerDecoration}>
          <Text style={styles.footerTextEnglish}>
            KSA - Jeddah - Petromin Dist. - King Faisal St. - Basurrah Complex - Mobile: +966550168553
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF generation function
const generateEnhancedTransferRequestPDF = async (
  companyInfo: CompanyInfo,
  bankDetails: BankDetails,
  beneficiaryDetails: BeneficiaryDetails,
  transferDetails: TransferDetails
) => {
  try {
    const doc = <EnhancedTransferRequestDocument 
      companyInfo={companyInfo}
      bankDetails={bankDetails}
      beneficiaryDetails={beneficiaryDetails}
      transferDetails={transferDetails}
    />;
    const blob = await pdf(doc).toBlob();
    if (!blob) throw new Error('PDF blob generation failed');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transfer_Request_${transferDetails.requestNumber || 'Document'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
  } catch (error: any) {
    console.error('Error generating PDF:', error.message);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

// Helper function to prepare transfer data
const prepareTransferDataForPDF = (transfer: any, bank: any, beneficiary: any): TransferDetails => {
  return {
    requestNumber: transfer.reference_number,
    amount: transfer.amount,
    currency: transfer.currency,
    requestDate: new Date(transfer.transfer_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    reasonForTransfer: transfer.purpose_description,
    amountInWords: transfer.amount_in_words || `${transfer.amount} ${transfer.currency}`,
    notes: transfer.notes
  };
};

// React wrapper for PDF generation
const downloadEnhancedTransferPDFReact = async (transfer: any, bank: any, beneficiary: any) => {
  try {
    const companyInfo = await getCompanyInfo();
    const transferDetails = prepareTransferDataForPDF(transfer, bank, beneficiary);
    const bankDetails: BankDetails = {
      bankName: bank.name,
      swiftCode: bank.swift_code,
      companyAccount: bank.account_number,
      companyIban: bank.iban,
      branchName: bank.branch_name,
      country: bank.country,
      taxNumber: companyInfo.tax_number
    };
    const beneficiaryDetails: BeneficiaryDetails = {
      accountName: beneficiary.full_name,
      fullName: beneficiary.full_name,
      fullNameAr: beneficiary.beneficiary_name_arabic,
      accountNumber: beneficiary.account_number,
      beneficiaryIban: beneficiary.iban,
      iban: beneficiary.iban,
      bankName: beneficiary.bank_name, // [Bank Name]
      swiftCode: beneficiary.swift_bic_code,
      bankBranch: beneficiary.bank_city, // [Branch Name]
      bankAddress: beneficiary.bank_address,
      country: beneficiary.bank_country,
      aba: beneficiary.aba,
      ifscCode: beneficiary.ifsc_code
    };
    return await generateEnhancedTransferRequestPDF(
      companyInfo,
      bankDetails,
      beneficiaryDetails,
      transferDetails
    );
  } catch (error) {
    console.error('Error in downloadEnhancedTransferPDFReact:', error);
    throw error;
  }
};

const EnhancedTransferRequestPDFGenerator = () => null;

export { generateEnhancedTransferRequestPDF, downloadEnhancedTransferPDFReact };
export default EnhancedTransferRequestPDFGenerator;