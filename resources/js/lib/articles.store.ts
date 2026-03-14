import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocalizedText {
  en: string;
  ar: string;
}

interface Article {
  title: LocalizedText;
  desc: LocalizedText;
  category: LocalizedText;
  date: LocalizedText;
  readTime: LocalizedText;
  featured: boolean;
  author: string;
  publisher?: LocalizedText;
  journal?: LocalizedText;
  doi?: string;
  publishDate: string;
  heroImage: string;
  authorImage: string;
  tags: LocalizedText[];
  fullContent: LocalizedText;
}

interface ArticlesStore {
  articles: Article[];
  featuredArticles: Article[];
  getArticleByTitle: (title: string) => Article | undefined;
  getArticlesByCategory: (category: string, lang: 'en' | 'ar') => Article[];
  getArticlesByTag: (tag: string) => Article[];
  searchArticles: (query: string, lang: 'en' | 'ar') => Article[];
}

export const useArticlesStore = create<ArticlesStore>()(
  persist(
    (set, get) => ({
      articles: [
        // ─────────────────────────────────────────────────────────────
        // ARTICLE 1 — Mediterranean Diet & CVD (Barbería-Latasa & Martínez-González, 2025)
        // Source: Cardiovascular Research, Vol 121, Issue 16, Nov 2025
        // DOI: 10.1093/cvr/cvaf218
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'The Mediterranean Diet and Cardiovascular Disease: An Evolving Evidence Base',
            ar: 'النظام الغذائي المتوسطي وأمراض القلب والأوعية الدموية: قاعدة أدلة متطورة'
          },
          desc: {
            en: 'Since Ancel Keys popularized it in the 1950s, the Mediterranean diet has accumulated a vast body of evidence from prospective cohort studies, randomized controlled trials, and systematic reviews demonstrating broad cardiovascular benefits including reduced coronary heart disease mortality.',
            ar: 'منذ أن روّج لها أنسيل كيز في خمسينيات القرن الماضي، تراكمت للنظام الغذائي المتوسطي كميةٌ ضخمة من الأدلة من الدراسات المستقبلية والتجارب السريرية المضبوطة التي توثّق فوائد قلبية وعائية واسعة.'
          },
          category: {
            en: 'Heart Health',
            ar: 'صحة القلب'
          },
          date: {
            en: 'November 2025',
            ar: 'نوفمبر 2025'
          },
          readTime: {
            en: '9 min',
            ar: '9 دقائق'
          },
          featured: true,
          author: 'Barbería-Latasa M, Martínez-González MA',
          publisher: {
            en: 'Cardiovascular Research',
            ar: 'مجلة أبحاث القلب والأوعية الدموية'
          },
          journal: {
            en: 'Cardiovascular Research',
            ar: 'أبحاث القلب والأوعية الدموية'
          },
          doi: '10.1093/cvr/cvaf218',
          publishDate: '2025-11-01',
          heroImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=Martinez+Gonzalez&background=0D8ABC&color=fff',
          tags: [
            { en: 'mediterranean', ar: 'بحر متوسطي' },
            { en: 'heart_health', ar: 'صحة القلب' },
            { en: 'diet', ar: 'نظام غذائي' },
            { en: 'cardiovascular', ar: 'قلب وعائي' },
            { en: 'RCT', ar: 'تجربة سريرية عشوائية' }
          ],
          fullContent: {
            en: `Since Ancel Keys and colleagues conducted the Seven Countries Study between 1958 and 1964 — following men in 16 cohorts across seven nations for up to 50 years — a strong inverse relationship between adherence to the Mediterranean diet (MedDiet) and coronary heart disease (CHD) mortality has been robustly established.

This comprehensive 2025 review published in Cardiovascular Research (Oxford Academic) synthesizes decades of prospective cohort studies, multiple landmark randomized controlled trials including PREDIMED and PREDIMED-Plus, and extensive meta-analyses. The evidence base confirms that the traditional MedDiet — abundant in minimally processed plant-based foods, high in monounsaturated fat from olive oil, and lower in saturated fat, meats, and dairy — represents a sustainable and highly palatable dietary pattern with broad cardiovascular benefits.

The review highlights the potential mechanisms: the high content of polyunsaturated fatty acids, fiber, and polyphenols collectively modify cardiovascular risk factors including blood lipid and glucose levels, blood pressure, and body weight. Several large RCTs — Lyon Diet-Heart Study, PREDIMED, and others — confirm primary and secondary preventive effects specifically against CHD events, stroke, and overall cardiovascular mortality.

An important related initiative highlighted is the UNATI trial (University of Navarra Alumni Trialist Initiative), funded by the European Research Council, which is a large ongoing randomized non-inferiority trial examining alcohol cessation in Mediterranean region participants, with over 7,500 recruited as of late 2025. The authors underscore that the MedDiet's protective effects are best understood as a dietary pattern effect rather than any single nutrient, consistent with endorsement in the 2020–2025 American Dietary Guidelines.`,
            ar: `منذ أن أجرى أنسيل كيز وزملاؤه دراسة الدول السبع بين عامَي 1958 و1964 — وتتبعوا فيها رجالاً في 16 مجموعة من سبع دول لمدة تصل إلى 50 عاماً — تأسّست علاقةٌ عكسية قوية بين الالتزام بالنظام الغذائي المتوسطي ووفيات أمراض القلب التاجية.

تجمع هذه المراجعة الشاملة لعام 2025، المنشورة في مجلة Cardiovascular Research (جامعة أكسفورد)، عقوداً من الدراسات المستقبلية والتجارب السريرية المضبوطة الكبرى بما فيها PREDIMED وPREDIMED-Plus، فضلاً عن تحليلات تلوية مستفيضة. تؤكد قاعدة الأدلة أن النظام الغذائي المتوسطي التقليدي — الغني بالأغذية النباتية قليلة المعالجة والدهون الأحادية غير المشبعة من زيت الزيتون، مع محتوى أقل من الدهون المشبعة والفلوم ومنتجات الألبان — يمثّل نمطاً غذائياً مستداماً وشهياً للغاية ذا فوائد قلبية وعائية واسعة.

تسلّط المراجعة الضوء على الآليات المحتملة: الأحماض الدهنية المتعددة غير المشبعة، والألياف، والبوليفينولات مجتمعةً تعدّل عوامل خطر القلب والأوعية الدموية بما فيها مستويات الدهون والغلوكوز في الدم وضغط الدم ووزن الجسم.`
          }
        },

        // ─────────────────────────────────────────────────────────────
        // ARTICLE 2 — Long-term Mediterranean Diet & CVD Prevention (Sebastian, Padda & Johal, 2024)
        // Source: Current Problems in Cardiology, Vol 49(5), May 2024
        // DOI: 10.1016/j.cpcardiol.2024.102509
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'Long-term Mediterranean Diet Cuts Major Cardiovascular Events by 48%: Meta-Analysis of RCTs',
            ar: 'النظام الغذائي المتوسطي على المدى الطويل يخفض الأحداث القلبية الوعائية الكبرى بنسبة 48%: تحليل تلوي'
          },
          desc: {
            en: 'A systematic meta-analysis of four large randomized clinical trials involving 10,054 participants found that the Mediterranean diet reduces the composite endpoint of major adverse cardiovascular events (MACE) by 48% compared to a control diet, with a mean follow-up of 2–7 years.',
            ar: 'أثبت تحليل تلوي منهجي لأربع تجارب سريرية عشوائية كبيرة شملت 10,054 مشاركاً أن النظام الغذائي المتوسطي يقلل من الأحداث القلبية الوعائية الكبرى بنسبة 48% مقارنةً بالنظام الغذائي الضابط، مع متوسط متابعة من سنتين إلى سبع سنوات.'
          },
          category: {
            en: 'Therapeutic Nutrition',
            ar: 'التغذية العلاجية'
          },
          date: {
            en: 'May 2024',
            ar: 'مايو 2024'
          },
          readTime: {
            en: '8 min',
            ar: '8 دقائق'
          },
          featured: false,
          author: 'Sebastian SA, Padda I, Johal G',
          publisher: {
            en: 'Current Problems in Cardiology',
            ar: 'المشاكل الحالية في طب القلب'
          },
          journal: {
            en: 'Current Problems in Cardiology',
            ar: 'المشاكل الحالية في طب القلب'
          },
          doi: '10.1016/j.cpcardiol.2024.102509',
          publishDate: '2024-03-01',
          heroImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=Sebastian+Padda&background=E05A2B&color=fff',
          tags: [
            { en: 'meta_analysis', ar: 'تحليل تلوي' },
            { en: 'clinical_trials', ar: 'تجارب سريرية' },
            { en: 'cardiovascular_prevention', ar: 'الوقاية من أمراض القلب' },
            { en: 'MACE', ar: 'أحداث قلبية وعائية كبرى' },
            { en: 'mediterranean', ar: 'بحر متوسطي' }
          ],
          fullContent: {
            en: `Researchers from Azeezia Medical College (India), Richmond University Medical Center (New York), and the University of Washington (Seattle) conducted a pre-registered systematic meta-analysis searching MEDLINE (via PubMed), Google Scholar, the Cochrane Library, ClinicalTrials.gov, and ScienceDirect for randomized clinical trials exploring the long-term efficacy of the Mediterranean diet on cardiovascular disease prevention.

Four RCTs totaling 10,054 participants met inclusion criteria, with participants averaging 57 years of age and follow-up durations ranging from 2 to 7 years. Statistical analysis used RevMan 5.4 with a random-effects model. The primary finding: the composite endpoint of major adverse cardiovascular events (MACE) — which includes heart attacks, strokes, and cardiovascular deaths — showed a statistically significant reduction in participants on the Mediterranean diet versus control diet, with an odds ratio of 0.52 (95% CI: 0.32–0.84; p = 0.008), representing a 48% relative risk reduction.

Secondary analyses confirmed consistent reductions in individual cardiovascular end points including non-fatal myocardial infarction, cardiovascular mortality, and total mortality. The heterogeneity was moderate (I² = 87%), reflecting real-world variation in how the Mediterranean diet was operationalized across trials.

The authors, affiliated with the Research Nexus consortium in Philadelphia, conclude that the Mediterranean diet represents a non-pharmacological intervention with robust clinical evidence for primary and secondary prevention of major cardiovascular events. They call for standardized dietary assessment tools in future trials to reduce heterogeneity.`,
            ar: `أجرى باحثون من كلية أزيزيا الطبية (الهند) ومركز جامعة ريتشموند الطبي (نيويورك) وجامعة واشنطن (سياتل) تحليلاً تلوياً منهجياً مسجّلاً مسبقاً، بحثوا فيه في قواعد بيانات MEDLINE وجوجل سكولار والكوكرين وClinicalTrials.gov وScienceDirect عن التجارب السريرية العشوائية التي تدرس فعالية النظام الغذائي المتوسطي طويلة الأمد في الوقاية من أمراض القلب والأوعية الدموية.

استوفت أربع تجارب سريرية عشوائية بإجمالي 10,054 مشاركاً معايير الإدراج، بمتوسط عمر 57 عاماً وفترات متابعة تتراوح بين سنتين وسبع سنوات. أظهر التحليل باستخدام RevMan 5.4 مع نموذج التأثيرات العشوائية أن الأحداث القلبية الوعائية الكبرى المجمّعة (نوبات قلبية وسكتات دماغية ووفيات قلبية) انخفضت انخفاضاً دالاً إحصائياً لدى المجموعة المتبعة للنظام المتوسطي مقارنةً بالضابطة: نسبة أرجحية 0.52 (فاصل ثقة 95%: 0.32–0.84؛ p = 0.008)، أي انخفاض نسبي في الخطر بنسبة 48%.`
          }
        },

        // ─────────────────────────────────────────────────────────────
        // ARTICLE 3 — Personal Microbiome Fingerprint (Zhou, Snyder et al., 2024)
        // Source: Cell Host & Microbe, 32(4):506-526, April 10, 2024
        // DOI: 10.1016/j.chom.2024.02.012
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'Your Microbiome Is as Unique as a Fingerprint — And the Most Personal Bacteria Are the Most Stable',
            ar: 'ميكروبيومك فريد كبصمتك — والبكتيريا الأكثر خصوصية هي الأكثر استقراراً'
          },
          desc: {
            en: 'A landmark 6-year Stanford longitudinal study tracking gut, oral, nasal, and skin microbiomes of 86 adults found that the bacteria most unique to an individual — not those shared across populations — are the most stable over time, with insulin-resistant participants showing significantly disrupted microbial stability.',
            ar: 'كشفت دراسة ستانفورد الطولية الرائدة التي امتدت ست سنوات وتتبعت ميكروبيومات الأمعاء والفم والأنف والجلد لدى 86 بالغاً أن البكتيريا الأكثر فردية — لا تلك المشتركة بين الناس — هي الأكثر استقراراً عبر الزمن، فيما أظهر المقاومون للأنسولين اضطراباً ملحوظاً في الاستقرار الميكروبي.'
          },
          category: {
            en: 'Gut Health',
            ar: 'صحة الأمعاء'
          },
          date: {
            en: 'April 10, 2024',
            ar: '10 أبريل 2024'
          },
          readTime: {
            en: '7 min',
            ar: '7 دقائق'
          },
          featured: false,
          author: 'Zhou X, Shen X, Johnson JS, Spakowicz DJ, Snyder MP et al.',
          publisher: {
            en: 'Cell Host & Microbe',
            ar: 'مجلة Cell Host & Microbe'
          },
          journal: {
            en: 'Cell Host & Microbe',
            ar: 'خلية مضيفة وميكروب'
          },
          doi: '10.1016/j.chom.2024.02.012',
          publishDate: '2024-04-10',
          heroImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=Xin+Zhou&background=2E7D32&color=fff',
          tags: [
            { en: 'microbiome', ar: 'ميكروبيوم' },
            { en: 'longitudinal_study', ar: 'دراسة طولية' },
            { en: 'stanford', ar: 'ستانفورد' },
            { en: 'personalized_medicine', ar: 'طب شخصي' },
            { en: 'insulin_resistance', ar: 'مقاومة الأنسولين' }
          ],
          fullContent: {
            en: `Conducted as part of the National Institutes of Health's Integrative Human Microbiome Project and led by Michael P. Snyder (Stanford Center for Genomics and Personalized Medicine) in collaboration with the late George Weinstock (Jackson Laboratory), this landmark study tracked the gut, oral, nasal, and skin microbiomes of 86 individuals ranging in age from 29 to 75 over up to six years.

Participants submitted quarterly microbiome samples from stool, skin, mouth, and nose. Additional samples (3–7 per event) were collected whenever participants experienced a respiratory illness, received a vaccination, or took antibiotics. All samples underwent deep genetic sequencing, while researchers simultaneously collected extensive clinical data including host multi-omics, immune markers, and metabolic measures.

The central finding defied prevailing assumptions: researchers expected that bacteria universally shared across the population would be the most stable — and found the opposite. Bacteria that were most unique to an individual consistently persisted best over years, while widely shared species fluctuated more readily. "Our results underscore the idea that we each have individualized microbiomes in our bodies that are special to us," said Snyder.

A secondary but clinically important finding: microbiome dynamics are strongly correlated across body sites. When the nasal microbiome shifts during a respiratory infection, the gut, oral, and skin microbiomes shift correspondingly — suggesting integrated systemic host–microbe dynamics.

Participants with Type 2 diabetes and insulin resistance exhibited a measurably less stable and less diverse gut microbiome. The authors propose that altered lipid and metabolite profiles in insulin-resistant individuals change the nutritional environment available to commensal bacteria, selectively disadvantaging stability. These findings have direct implications for microbiome-based diagnostics and personalized therapeutic interventions.`,
            ar: `أُجريت هذه الدراسة الرائدة في إطار المشروع التكاملي للميكروبيوم البشري التابع للمعاهد الوطنية للصحة الأمريكية، بقيادة مايكل سنايدر من مركز ستانفورد لعلم الجينوم والطب الشخصي، وبالتعاون مع الراحل جورج واينستوك من مختبر جاكسون. تتبعت الدراسة ميكروبيومات الأمعاء والفم والأنف والجلد لدى 86 شخصاً تتراوح أعمارهم بين 29 و75 عاماً على مدى ست سنوات.

قدّم المشاركون عيّنات ميكروبيوم ربع سنوية من البراز والجلد والفم والأنف، إلى جانب عيّنات إضافية (3–7 عيّنات لكل حدث) عند تعرّضهم لأمراض تنفسية أو تلقّيهم تطعيمات أو تناولهم مضادات حيوية. خضعت جميع العيّنات للتسلسل الجيني العميق.

النتيجة المركزية خالفت الافتراضات السائدة: بدلاً من أن تكون البكتيريا المشتركة بين الجميع هي الأكثر استقراراً، وجد الباحثون العكس تماماً — فالبكتيريا الأكثر خصوصية لكل فرد هي التي تثبت وتستمر على مدى السنوات. قال سنايدر: "نتائجنا تعزز فكرة أن لكل منا ميكروبيوم فريد خاص به."

كشفت الدراسة أيضاً أن ديناميكيات الميكروبيوم مترابطة بين مواقع الجسم المختلفة؛ فعند تغيّر ميكروبيوم الأنف أثناء العدوى التنفسية، تتغيّر معه ميكروبيومات الأمعاء والفم والجلد بالتوازي. كما أظهر المصابون بالسكري من النوع الثاني ومقاومة الأنسولين ميكروبيوم أمعاء أقل استقراراً وتنوعاً بشكل ملحوظ.`
          }
        },

        // ─────────────────────────────────────────────────────────────
        // ARTICLE 4 — Gut Microbiome Summit 2024 (Jangi et al., Gut Microbes)
        // Source: Gut Microbes, 16(1):2400579, Sep 10, 2024
        // DOI: 10.1080/19490976.2024.2400579
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'Microbiome 2.0: Three Key Themes Shaping the Future of Gut Health Therapies',
            ar: 'الميكروبيوم 2.0: ثلاثة محاور رئيسية تشكّل مستقبل علاجات صحة الأمعاء'
          },
          desc: {
            en: 'The 12th Gut Microbiota for Health World Summit (Washington DC, 2024) identified three priorities for advancing microbiome-based therapies: identifying actionable microbial targets, developing effective manipulation strategies, and aligning new therapies with real-world clinical practice — following the approval of two FMT-based products.',
            ar: 'حدّد المؤتمر العالمي الثاني عشر لميكروبيوتا الأمعاء من أجل الصحة (واشنطن 2024) ثلاثة أولويات لتطوير العلاجات القائمة على الميكروبيوم: تحديد الأهداف الميكروبية القابلة للتطبيق، وتطوير استراتيجيات تعديل فعّالة، وتوافق العلاجات الجديدة مع الممارسة السريرية الفعلية.'
          },
          category: {
            en: 'Gut Health',
            ar: 'صحة الأمعاء'
          },
          date: {
            en: 'September 10, 2024',
            ar: '10 سبتمبر 2024'
          },
          readTime: {
            en: '6 min',
            ar: '6 دقائق'
          },
          featured: false,
          author: 'Jangi S et al. (AGA)',
          publisher: {
            en: 'Gut Microbes',
            ar: 'مجلة Gut Microbes'
          },
          journal: {
            en: 'Gut Microbes',
            ar: 'ميكروبات الأمعاء'
          },
          doi: '10.1080/19490976.2024.2400579',
          publishDate: '2024-09-10',
          heroImage: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=GMFH+Summit&background=6A0572&color=fff',
          tags: [
            { en: 'microbiome', ar: 'ميكروبيوم' },
            { en: 'FMT', ar: 'زراعة ميكروبيوتا البراز' },
            { en: 'probiotics', ar: 'بروبيوتيك' },
            { en: 'gut_health', ar: 'صحة الأمعاء' },
            { en: 'precision_medicine', ar: 'الطب الدقيق' }
          ],
          fullContent: {
            en: `Published in Gut Microbes by the American Gastroenterological Association (AGA), this meeting summary captures insights from the two-day 12th Gut Microbiota for Health World Summit held in Washington, DC — involving thought leaders, physicians, researchers, and representatives from the FDA and the pharmaceutical industry.

The summit recognized a landmark milestone: the successful clinical introduction of two fecal microbiota transplantation (FMT)-based products into practice, marking a new era in microbiome-directed therapeutics. Beyond this, three recurring themes defined the conference agenda:

1. Better methods to identify actionable targets in the microbiome. The complexity of the gut microbiota — estimated at around 39 trillion microbes — makes it difficult to pinpoint which specific taxa or functional pathways drive therapeutic benefit. Advances in metagenomics, metatranscriptomics, and metaproteomics were highlighted as key tools for mapping host–microbe interactions at systems level.

2. Developing effective strategies to manipulate the microbiome. Next-generation probiotics, bacteriophage therapy, engineered bacterial consortia (SynComs), and precision prebiotics were discussed as avenues beyond traditional FMT. Early-phase clinical trials suggest synthetic communities can match FMT efficacy for specific indications like recurrent Clostridioides difficile infection while offering better safety and reproducibility.

3. Aligning microbiome therapies with existing clinical treatment paradigms. Challenges around interindividual variability, biomarker standardization, regulatory pathways, and patient stratification were central discussions. Speakers emphasized that microbiome-guided diagnostics must interoperate with established clinical workflows to achieve adoption at scale.

The summit underscored that the field has moved decisively from descriptive associations toward intervention-ready, mechanistically grounded models — positioning the microbiome at the center of precision medicine.`,
            ar: `نشرت مجلة Gut Microbes ملخصاً للرؤى الرئيسية من اليومين الدراسيين للمؤتمر العالمي الثاني عشر لميكروبيوتا الأمعاء من أجل الصحة، المنعقد في واشنطن العاصمة، والذي جمع قادة الفكر والأطباء والباحثين وممثلي إدارة الغذاء والدواء الأمريكية وصناعة الأدوية.

أقرّ المؤتمر بمرحلةٍ فارقة: الإدخال السريري الناجح لمنتجَين مستندَين إلى زراعة ميكروبيوتا البراز (FMT) في الممارسة الطبية، مما يبشّر بعهد جديد في العلاجات الموجَّهة بالميكروبيوم.

تمحورت أعمال المؤتمر حول ثلاثة محاور: أولاً، تطوير أدوات أفضل لتحديد الأهداف الميكروبية القابلة للتطبيق، مع التركيز على التطورات في علم الميتاجينوميكس والميتاتصنيع البروتيني. ثانياً، تطوير استراتيجيات فعّالة لتعديل الميكروبيوم تشمل البروبيوتيك من الجيل التالي والعلاج بالبكتيريوفاج والمجتمعات البكتيرية المُصنَّعة. ثالثاً، توافق العلاجات الجديدة مع بروتوكولات العلاج السريري القائمة، مع التأكيد على التغلب على تحديات التباين بين الأفراد وتوحيد البايوماركرز.`
          }
        },

        // ─────────────────────────────────────────────────────────────
        // ARTICLE 5 — Intermittent Fasting & Cardiometabolic Health (Semnani-Azad et al., BMJ 2025)
        // Source: BMJ, 389:e082007, June 18, 2025
        // DOI: 10.1136/bmj-2024-082007
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'Intermittent Fasting vs. Continuous Caloric Restriction: A Network Meta-Analysis of 100+ RCTs',
            ar: 'الصيام المتقطع مقابل تقييد السعرات الحرارية المستمر: تحليل شبكي لأكثر من 100 تجربة سريرية عشوائية'
          },
          desc: {
            en: 'A 2025 BMJ network meta-analysis covering data through November 2024 compared all major intermittent fasting regimens (alternate-day fasting, time-restricted eating, whole-day fasting) against continuous energy restriction and ad-libitum diets on cardiometabolic outcomes in randomized clinical trials.',
            ar: 'قارن تحليل شبكي في مجلة BMJ لعام 2025 يغطي بيانات حتى نوفمبر 2024 بين جميع أنظمة الصيام المتقطع الرئيسية وتقييد السعرات الحرارية المستمر والأنظمة الحرة على المؤشرات الأيضية والقلبية الوعائية في التجارب السريرية العشوائية.'
          },
          category: {
            en: 'Metabolic Health',
            ar: 'الصحة الأيضية'
          },
          date: {
            en: 'June 18, 2025',
            ar: '18 يونيو 2025'
          },
          readTime: {
            en: '8 min',
            ar: '8 دقائق'
          },
          featured: false,
          author: 'Semnani-Azad Z, Khan TA, Chiavaroli L, Sievenpiper JL et al.',
          publisher: {
            en: 'The BMJ',
            ar: 'مجلة BMJ البريطانية'
          },
          journal: {
            en: 'BMJ',
            ar: 'المجلة الطبية البريطانية BMJ'
          },
          doi: '10.1136/bmj-2024-082007',
          publishDate: '2025-06-18',
          heroImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=Semnani+Azad&background=C62828&color=fff',
          tags: [
            { en: 'intermittent_fasting', ar: 'صيام متقطع' },
            { en: 'time_restricted_eating', ar: 'الأكل في نافذة زمنية محددة' },
            { en: 'cardiometabolic_health', ar: 'الصحة الأيضية القلبية' },
            { en: 'weight_loss', ar: 'خسارة الوزن' },
            { en: 'network_meta_analysis', ar: 'تحليل شبكي' }
          ],
          fullContent: {
            en: `This large-scale network meta-analysis, published in The BMJ by researchers from the University of Toronto's Temerty Faculty of Medicine and collaborators from multiple institutions, systematically examined the cardiometabolic effects of different intermittent fasting (IF) regimens. Searches were conducted in Medline, Embase, and Cochrane databases from inception to November 14, 2024.

The study compared three primary IF regimens — alternate day fasting (ADF), time-restricted eating (TRE), and whole-day fasting (WDF) — against continuous energy restriction (CER) and ad-libitum (unrestricted) diets. Primary outcome was body weight; secondary outcomes included BMI, waist circumference, fasting glucose, HbA1c, insulin, LDL cholesterol, HDL cholesterol, triglycerides, blood pressure, CRP, and liver disease markers.

Key findings: All IF regimens produced significant reductions in body weight relative to ad-libitum diets. TRE was specifically associated with improvements in fasting insulin and glycosylated haemoglobin (HbA1c) in overweight and obese adults — high-quality evidence. Alternate-day fasting showed the most pronounced short-term weight reduction but had lower long-term adherence. No IF regimen demonstrated superiority over continuous caloric restriction for most cardiometabolic endpoints when calorie deficit was matched.

Notably, the analysis also synthesizes findings from a parallel landmark RCT (Manoogian et al., Ann Intern Med 2024) showing that time-restricted eating significantly reduced HbA1c and systolic blood pressure in adults with metabolic syndrome over 3 months versus a control diet. The authors emphasize that the optimal IF protocol remains patient-specific, and personalized approaches within a precision medicine framework are needed.`,
            ar: `نشر هذا التحليل الشبكي الواسع في مجلة BMJ باحثون من كلية الطب في جامعة تورنتو وشركاء من مؤسسات متعددة، وقد استعرض منهجياً التأثيرات الأيضية والقلبية الوعائية لأنظمة الصيام المتقطع المختلفة، شمل البحث قواعد بيانات Medline وEmbase والكوكرين من بداياتها حتى نوفمبر 2024.

قارن الدراسة بين ثلاثة أنظمة صيام رئيسية — الصيام المتناوب يوماً بعد يوم، والأكل في نافذة زمنية محددة، والصيام لأيام كاملة — مقابل تقييد السعرات الحرارية المستمر والأنظمة الحرة.

أثبتت جميع أنظمة الصيام المتقطع انخفاضاً ملحوظاً في وزن الجسم مقارنةً بالأنظمة الحرة، وارتبط الأكل في نافذة زمنية محددة بشكل خاص بتحسينات في مستوى الأنسولين الصائم والهيموجلوبين الغليكوزيلاتي (HbA1c) لدى البالغين المصابين بالسمنة — وهذا دليل عالي الجودة. لم يُظهر أي نظام صيام متقطع تفوقاً على التقييد الكالوري المستمر في معظم المؤشرات الأيضية عند تعادل عجز السعرات الحرارية.`
          }
        },

        // ─────────────────────────────────────────────────────────────
        // ARTICLE 6 — Sleep Duration & Central Obesity (Kohanmoo & Akhlaghi, 2024)
        // Source: Obesity Science & Practice, 10(3):e772, June 2024
        // DOI: 10.1002/osp4.772
        // ─────────────────────────────────────────────────────────────
        {
          title: {
            en: 'Short Sleep Duration Linked to Higher Risk of Central Obesity: Systematic Review & Meta-Analysis',
            ar: 'قصر مدة النوم مرتبط بارتفاع خطر السمنة المركزية: مراجعة منهجية وتحليل تلوي'
          },
          desc: {
            en: 'A 2024 systematic review and meta-analysis of prospective cohort studies, searching databases through February 2024, confirms that short sleep duration consistently raises ghrelin (the hunger hormone), lowers leptin (the satiety hormone), and significantly increases the risk of abdominal obesity and impaired body composition in adults.',
            ar: 'تؤكد مراجعة منهجية وتحليل تلوي لعام 2024 لدراسات المتابعة المستقبلية، شملت قواعد البيانات حتى فبراير 2024، أن قصر مدة النوم يرفع باستمرار الغريلين (هرمون الجوع) ويخفض اللبتين (هرمون الشبع)، مما يزيد بشكل ملحوظ من خطر السمنة البطنية لدى البالغين.'
          },
          category: {
            en: 'General Health',
            ar: 'صحة عامة'
          },
          date: {
            en: 'June 4, 2024',
            ar: '4 يونيو 2024'
          },
          readTime: {
            en: '6 min',
            ar: '6 دقائق'
          },
          featured: false,
          author: 'Kohanmoo A, Akhlaghi M, Sasani N, Nouripour F, Lombardo C',
          publisher: {
            en: 'Obesity Science & Practice',
            ar: 'مجلة علم السمنة والممارسة'
          },
          journal: {
            en: 'Obesity Science & Practice',
            ar: 'علم السمنة والممارسة'
          },
          doi: '10.1002/osp4.772',
          publishDate: '2024-06-04',
          heroImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=600&fit=crop',
          authorImage: 'https://ui-avatars.com/api/?name=Kohanmoo+Akhlaghi&background=1565C0&color=fff',
          tags: [
            { en: 'sleep', ar: 'نوم' },
            { en: 'obesity', ar: 'سمنة' },
            { en: 'ghrelin', ar: 'غريلين' },
            { en: 'leptin', ar: 'لبتين' },
            { en: 'metabolic_syndrome', ar: 'متلازمة أيضية' }
          ],
          fullContent: {
            en: `Researchers from Shiraz University of Medical Sciences (Iran) and Sapienza University of Rome conducted a systematic review and meta-analysis of prospective cohort studies examining the relationship between sleep duration and central obesity measures including waist circumference and body composition indices in adults. The search spanned PubMed, Scopus, and Web of Science up to February 2024.

The National Sleep Foundation recommends 7–9 hours of sleep per night for adults aged 18–64, with 6 hours or less classified as short sleep. Despite this, approximately one in four people worldwide has insomnia, and broader poor sleep quality affects roughly one-third of populations in low- and middle-income countries.

The meta-analysis confirms that short sleep duration is robustly associated with higher ghrelin levels (the orexigenic hormone released from stomach cells that stimulates appetite), and lower leptin levels (the adipokine from fat tissue that inhibits appetite and promotes satiety). This hormonal dysregulation leads to chronically increased hunger, particularly toward calorie-dense and palatable foods, contributing to weight gain, higher BMI, increased waist circumference, and elevated body fat percentage.

The findings also show that sleep deprivation disrupts the hypothalamic–pituitary–adrenal axis, elevating cortisol — especially at atypical times such as midday instead of the normal morning peak. Sustained high cortisol promotes visceral fat accumulation, hyperinsulinemia, and progression toward prediabetes and type 2 diabetes. The authors note that interventions designed to increase sleep duration and quality could serve as viable primary preventative measures for metabolic disorders, complementing dietary and physical activity interventions.`,
            ar: `أجرى باحثون من جامعة شيراز للعلوم الطبية في إيران وجامعة سابيينزا في روما مراجعةً منهجية وتحليلاً تلوياً للدراسات المستقبلية التي تبحث في العلاقة بين مدة النوم ومقاييس السمنة المركزية لدى البالغين، شملت قواعد بيانات PubMed وScopus وWeb of Science حتى فبراير 2024.

يوصي مؤسسة النوم الوطنية بالنوم من 7 إلى 9 ساعات يومياً للبالغين بين 18 و64 عاماً، وتُصنِّف ست ساعات أو أقل بوصفها نوماً قصيراً. ومع ذلك، يعاني نحو واحد من كل أربعة أشخاص حول العالم من الأرق.

يؤكد التحليل التلوي ارتباط قصر مدة النوم برفع مستويات الغريلين (هرمون الشهية) وخفض مستويات اللبتين (هرمون الشبع)، مما يقود إلى جوع مزمن متزايد نحو الأطعمة الغنية بالسعرات الحرارية، ومن ثَمّ إلى اكتساب الوزن وارتفاع مؤشر كتلة الجسم ومحيط الخصر ونسبة الدهون في الجسم. كما يُشير إلى أن اضطرابات النوم تُفسد محور HPA فترفع الكورتيزول في أوقات غير طبيعية، مما يعزز تراكم الدهون الحشوية وفرط إفراز الأنسولين والتقدم نحو مرض السكري.`
          }
        }
      ],

      get featuredArticles() {
        return get().articles.filter(article => article.featured);
      },

      getArticleByTitle: (title: string) => {
        return get().articles.find(article =>
          article.title.en === title || article.title.ar === title
        );
      },

      getArticlesByCategory: (category: string, lang: 'en' | 'ar' = 'en') => {
        return get().articles.filter(article =>
          article.category[lang].toLowerCase() === category.toLowerCase()
        );
      },

      getArticlesByTag: (tag: string) => {
        return get().articles.filter(article =>
          article.tags.some(t =>
            t.en.toLowerCase() === tag.toLowerCase() ||
            t.ar.toLowerCase() === tag.toLowerCase()
          )
        );
      },

      searchArticles: (query: string, lang: 'en' | 'ar' = 'en') => {
        const q = query.toLowerCase();
        return get().articles.filter(article =>
          article.title[lang].toLowerCase().includes(q) ||
          article.desc[lang].toLowerCase().includes(q) ||
          article.fullContent[lang].toLowerCase().includes(q) ||
          article.tags.some(tag =>
            tag.en.toLowerCase().includes(q) ||
            tag.ar.toLowerCase().includes(q)
          )
        );
      }
    }),
    {
      name: 'articles-storage',
    }
  )
);