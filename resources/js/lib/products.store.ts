import { create } from 'zustand';

// Import product images
import cardamomImg from "../../../public/assets/product-cardamom-Cx1PFBmx.jpg";
import coffeeImg from "../../../public/assets/product-coffee-D06UMYsC.jpg";
import driedFruitsImg from "../../../public/assets/product-dried-fruits-D7zA5pwh.jpg";
import grainsImg from "../../../public/assets/product-grains-lMBUMGBa.jpg";
import legumesImg from "../../../public/assets/product-legumes-BOsCP686.jpg";
import nutsImg from "../../../public/assets/product-nuts-BrtEBjCA.jpg";
import oliveOilImg from "../../../public/assets/product-olive-oil-CTCgqP3M.jpg";
import spicesImg from "../../../public/assets/product-spices-7iPOJmzP.jpg";

// Types
type Tag = string;
type Certification = string;

type ShelfLife = {
  duration: string;
  duration_ar: string;
  note: string;
  note_ar: string;
};

type Storage = {
  temperature: string;
  humidity: string;
  humidity_ar: string;
  instructions: string;
  instructions_ar: string;
};

type Usage = {
  primary: string[];
  primary_ar: string[];
  tip: string;
  tip_ar: string;
};

type Product = {
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  rating: number;
  image: string;
  images: string[];
  tags: Tag[];
  tags_ar: string[];
  featured: boolean;
  desc: string;
  desc_ar: string;
  origin: string;
  origin_ar: string;
  certifications: Certification[];
  certifications_ar: string[];
  benefits: string[];
  benefits_ar: string[];
  shelfLife: ShelfLife;
  storage: Storage;
  usage: Usage;
};

type Category = {
  id: string;
  label: string;
  label_ar: string;
};

type ProductsStore = {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  selectedProduct: Product | null;
  isModalOpen: boolean;
  setActiveCategory: (category: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  getFilteredProducts: () => Product[];
  getFeaturedCount: () => number;
  getAverageRating: () => string;
};

const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [
    {
      name: "Whole Wheat Grains",
      name_ar: "حبوب القمح الكامل",
      category: "grains",
      category_ar: "الحبوب",
      rating: 4.8,
      image: grainsImg,
      images: [grainsImg, grainsImg, grainsImg],
      tags: ["100% Organic", "Gluten Free", "Rich in Fiber"],
      tags_ar: ["عضوي 100%", "خالي من الغلوتين", "غني بالألياف"],
      featured: true,
      desc: "Sourced exclusively from certified organic farms in the fertile Nile Valley, our whole wheat grains are harvested at peak ripeness and minimally processed to retain their full nutritional profile. Each batch undergoes rigorous quality testing to ensure consistent kernel integrity, moisture levels, and natural flavor. High in complex carbohydrates, dietary fiber, B vitamins, and essential minerals, these grains form the backbone of wholesome, nutrient-dense baking and cooking.",
      desc_ar: "يُجمع قمحنا الكامل حصريًا من مزارع عضوية معتمدة في وادي النيل الخصيب، ويُحصد عند اكتمال نضجه ويخضع لمعالجة طفيفة للحفاظ على قيمته الغذائية الكاملة. تخضع كل دفعة لاختبارات جودة صارمة لضمان سلامة الحبة ومستويات الرطوبة والنكهة الطبيعية. غنية بالكربوهيدرات المعقدة والألياف الغذائية وفيتامينات ب والمعادن الأساسية، تشكّل هذه الحبوب أساس الخبز والطهي المغذي.",
      origin: "Certified Organic Farms — Nile Valley, Egypt",
      origin_ar: "مزارع عضوية معتمدة — وادي النيل، مصر",
      certifications: ["Certified Organic", "ISO 22000", "HACCP"],
      certifications_ar: ["عضوي معتمد", "أيزو 22000", "نظام تحليل المخاطر"],
      benefits: ["Improves digestion", "Sustained energy release", "Preservative-free", "High dietary fiber"],
      benefits_ar: ["يحسن الهضم", "إطلاق طاقة مستدام", "خالي من المواد الحافظة", "غني بالألياف الغذائية"],
      shelfLife: {
        duration: "12 months",
        duration_ar: "12 شهرًا",
        note: "Best consumed within 6 months of opening for optimal freshness",
        note_ar: "يُستحسن الاستهلاك خلال 6 أشهر من الفتح للحصول على أفضل نضارة",
      },
      storage: {
        temperature: "15–25°C",
        humidity: "Below 65% relative humidity",
        humidity_ar: "أقل من 65% رطوبة نسبية",
        instructions: "Store in a sealed container in a cool, dry place away from direct sunlight and strong odors",
        instructions_ar: "يُحفظ في وعاء محكم الإغلاق في مكان بارد وجاف بعيدًا عن أشعة الشمس المباشرة والروائح القوية",
      },
      usage: {
        primary: ["Whole wheat bread", "Flatbreads & wraps", "Whole grain flour", "Porridge & hot cereals"],
        primary_ar: ["خبز القمح الكامل", "الخبز المسطح واللفائف", "دقيق الحبوب الكاملة", "العصيدة والحبوب الساخنة"],
        tip: "Soak overnight before cooking to reduce phytic acid and improve mineral absorption",
        tip_ar: "انقعه طوال الليل قبل الطهي لتقليل حمض الفيتيك وتحسين امتصاص المعادن",
      },
    },
    {
      name: "Extra Virgin Olive Oil",
      name_ar: "زيت زيتون بكر ممتاز",
      category: "oils",
      category_ar: "الزيوت",
      rating: 4.9,
      image: oliveOilImg,
      images: [oliveOilImg, oliveOilImg, oliveOilImg],
      tags: ["Cold Pressed", "Organic", "Low Acidity"],
      tags_ar: ["معصور على البارد", "عضوي", "قليل الحموضة"],
      featured: true,
      desc: "Pressed within hours of harvest from hand-picked olives grown on centuries-old trees along the Mediterranean coast, this extra virgin olive oil captures the full spectrum of the fruit's flavor and bioactive compounds. With an acidity level below 0.3%, it surpasses international extra virgin standards. Its flavor profile is pleasantly peppery with notes of fresh cut grass and ripe fruit — a hallmark of premium, unrefined oil.",
      desc_ar: "يُعصر هذا الزيت خلال ساعات من الحصاد من زيتون يُقطف يدويًا من أشجار معمّرة تمتد عمرها لقرون على سواحل البحر الأبيض المتوسط، ليلتقط طيف النكهة الكامل والمركبات الحيوية للثمرة. بحموضة أقل من 0.3%، يتجاوز معايير الزيت البكر الممتاز الدولية. نكهته حارة بلطف مع ملاحظات العشب الطازج والفاكهة الناضجة — سمة الزيت الفاخر غير المكرر.",
      origin: "Heritage Olive Orchards — Mediterranean Coast",
      origin_ar: "بساتين الزيتون التراثية — سواحل البحر الأبيض المتوسط",
      certifications: ["Certified Organic", "Extra Virgin Grade", "PDO Protected"],
      certifications_ar: ["عضوي معتمد", "درجة بكر ممتاز", "منشأ محمي PDO"],
      benefits: ["Rich in polyphenols & antioxidants", "Supports cardiovascular health", "Natural anti-inflammatory", "Enhances nutrient absorption"],
      benefits_ar: ["غني بالبوليفينول ومضادات الأكسدة", "يدعم صحة القلب والأوعية الدموية", "مضاد طبيعي للالتهابات", "يعزز امتصاص العناصر الغذائية"],
      shelfLife: {
        duration: "18 months (unopened)",
        duration_ar: "18 شهرًا (غير مفتوح)",
        note: "Use within 3–4 months of opening; flavor and antioxidants degrade after exposure to air",
        note_ar: "يُستخدم خلال 3–4 أشهر من الفتح؛ تتدهور النكهة ومضادات الأكسدة بعد التعرض للهواء",
      },
      storage: {
        temperature: "10–20°C",
        humidity: "Moderate — avoid condensation",
        humidity_ar: "معتدلة — تجنّب التكثيف",
        instructions: "Store in a dark glass bottle or tin away from heat sources and direct light. Never refrigerate — cold temperatures cause cloudiness and alter texture",
        instructions_ar: "يُحفظ في زجاجة داكنة أو علبة معدنية بعيدًا عن مصادر الحرارة والضوء المباشر. لا يُحفظ في الثلاجة — تسبب درجات الحرارة الباردة التعكر وتغيير القوام",
      },
      usage: {
        primary: ["Raw salad dressings", "Bread dipping", "Finishing drizzle on dishes", "Low-heat sautéing (below 180°C)"],
        primary_ar: ["صلصات السلطة الطازجة", "تغميس الخبز", "رذاذ تشطيب الأطباق", "القلي الخفيف (أقل من 180 درجة)"],
        tip: "For maximum health benefit, consume raw. Avoid high-heat frying — use refined olive oil for that purpose instead",
        tip_ar: "للحصول على أقصى فائدة صحية، تناوله نيئًا. تجنّب القلي على حرارة عالية — استخدم زيت الزيتون المكرر لذلك",
      },
    },
    {
      name: "Premium Spice Blend",
      name_ar: "مزيج بهارات فاخر",
      category: "spices",
      category_ar: "البهارات",
      rating: 4.7,
      image: spicesImg,
      images: [spicesImg, spicesImg, spicesImg],
      tags: ["Freshly Ground", "Special Blend", "100% Natural"],
      tags_ar: ["طازج الطحن", "مزيج خاص", "طبيعي 100%"],
      featured: true,
      desc: "Crafted by expert blenders from hand-selected whole spices sourced from their finest growing regions — cumin from Egypt, coriander from Morocco, black pepper from Vietnam, and turmeric from India. Spices are stone-ground in small batches and blended to a precise ratio developed over years of culinary refinement. The result is a deeply aromatic, balanced blend that elevates grilled meats, slow-cooked stews, and rice dishes alike.",
      desc_ar: "يُصنع هذا المزيج بأيدي خبراء الخلط من بهارات كاملة مختارة يدويًا من أجود مناطق نموها — كمون من مصر، كزبرة من المغرب، فلفل أسود من فيتنام، وكركم من الهند. تُطحن البهارات على الحجر على دفعات صغيرة وتُمزج بنسبة دقيقة طُوّرت عبر سنوات من الصقل الطهوي. النتيجة مزيج عطري عميق ومتوازن يرفع من مستوى اللحوم المشوية واليخنات المطبوخة على نار هادئة وأطباق الأرز.",
      origin: "Multi-origin blend — Egypt, Morocco, Vietnam & India",
      origin_ar: "مزيج متعدد المصادر — مصر، المغرب، فيتنام والهند",
      certifications: ["100% Natural", "No Artificial Additives", "Non-Irradiated"],
      certifications_ar: ["طبيعي 100%", "بدون إضافات صناعية", "غير مشعّع"],
      benefits: ["Complex layered flavor", "Rich in antioxidants", "Supports digestion", "Immune-boosting compounds"],
      benefits_ar: ["نكهة غنية متعددة الطبقات", "غني بمضادات الأكسدة", "يدعم الهضم", "مركبات معززة للمناعة"],
      shelfLife: {
        duration: "24 months (sealed)",
        duration_ar: "24 شهرًا (مغلق)",
        note: "Aromatic potency is strongest in the first 12 months; still safe and flavorful beyond that",
        note_ar: "تكون قوة العطر في أوجها خلال أول 12 شهرًا؛ لا يزال آمنًا وعطريًا بعد ذلك",
      },
      storage: {
        temperature: "15–25°C",
        humidity: "Dry — keep away from steam and cooking vapors",
        humidity_ar: "جاف — ابعده عن البخار وأبخرة الطهي",
        instructions: "Store in an airtight glass or ceramic jar away from heat, light, and moisture. Do not store above the stove",
        instructions_ar: "يُحفظ في جرة زجاجية أو خزفية محكمة الإغلاق بعيدًا عن الحرارة والضوء والرطوبة. لا يُحفظ فوق الموقد",
      },
      usage: {
        primary: ["Grilled meats & kebabs", "Slow-cooked stews & tagines", "Rice & grain dishes", "Marinades & rubs", "Roasted vegetables"],
        primary_ar: ["اللحوم المشوية والكباب", "اليخنات والطاجن", "أطباق الأرز والحبوب", "مخاليط التتبيل", "الخضروات المشوية"],
        tip: "Bloom the spices in warm oil or butter for 30 seconds before adding other ingredients to dramatically deepen their flavor",
        tip_ar: "أضف البهارات إلى الزيت أو الزبدة الدافئة لمدة 30 ثانية قبل إضافة المكونات الأخرى لتعميق نكهتها بشكل ملحوظ",
      },
    },
    {
      name: "Mixed Raw Nuts",
      name_ar: "مكسرات نيئة متنوعة",
      category: "nuts",
      category_ar: "المكسرات",
      rating: 4.6,
      image: nutsImg,
      images: [nutsImg, nutsImg, nutsImg],
      tags: ["Raw", "Unsalted", "Rich in Protein"],
      tags_ar: ["نيء", "غير مملح", "غني بالبروتين"],
      featured: false,
      desc: "A thoughtfully curated mix of raw, unsalted almonds, walnuts, cashews, and pistachios — each variety sourced from its prime growing region and selected for size, freshness, and lipid quality. Unlike roasted blends, our nuts are unprocessed to preserve their natural oils, enzymes, and full complement of fat-soluble vitamins. Every handful delivers a satisfying combination of crunch, richness, and clean, unadulterated flavor.",
      desc_ar: "مزيج مختار بعناية من اللوز والجوز والكاجو والفستق النيء غير المملح — كل صنف مصدره المنطقة الأمثل لزراعته، ويُختار بناءً على الحجم والطزاجة وجودة الدهون. على عكس المخاليط المحمصة، تبقى مكسراتنا غير مكررة للحفاظ على زيوتها الطبيعية وإنزيماتها والفيتامينات الذائبة في الدهون. كل حفنة تقدم مزيجًا مُرضيًا من الهشاشة والنكهة الغنية النقية.",
      origin: "Premium sourcing — California (almonds), Turkey (walnuts), Vietnam (cashews), Iran (pistachios)",
      origin_ar: "مصادر مميزة — كاليفورنيا (لوز)، تركيا (جوز)، فيتنام (كاجو)، إيران (فستق)",
      certifications: ["100% Natural", "Preservative-free", "No Added Salt or Oil"],
      certifications_ar: ["طبيعي 100%", "خالي من المواد الحافظة", "بدون ملح أو زيت مضاف"],
      benefits: ["Rich in Omega-3 & Omega-6", "Sustained energy & satiety", "Supports brain and heart health", "High in vitamin E & magnesium"],
      benefits_ar: ["غني بأوميغا 3 وأوميغا 6", "طاقة مستدامة وإشباع", "يدعم صحة الدماغ والقلب", "غني بفيتامين E والمغنيسيوم"],
      shelfLife: {
        duration: "9 months (sealed)",
        duration_ar: "9 أشهر (مغلق)",
        note: "Raw nuts are sensitive to rancidity — refrigeration extends freshness significantly after opening",
        note_ar: "المكسرات النيئة حساسة للتزنخ — يُطيل التبريد الطزاجة بشكل ملحوظ بعد الفتح",
      },
      storage: {
        temperature: "10–20°C (or refrigerate after opening)",
        humidity: "Low — high humidity accelerates rancidity",
        humidity_ar: "منخفضة — الرطوبة العالية تسرّع التزنخ",
        instructions: "Store in an airtight container in a cool, dark location. After opening, refrigerate and consume within 4–6 weeks for best quality",
        instructions_ar: "يُحفظ في وعاء محكم الإغلاق في مكان بارد ومظلم. بعد الفتح، يُبرّد ويُستهلك خلال 4–6 أسابيع للجودة المثلى",
      },
      usage: {
        primary: ["Daily snacking", "Trail mixes", "Salad toppings", "Homemade nut butters", "Baked goods", "Plant-based milk"],
        primary_ar: ["وجبات خفيفة يومية", "مزيج المشي", "إضافات السلطات", "زبدة المكسرات المنزلية", "المعجنات", "الحليب النباتي"],
        tip: "Activating nuts by soaking in water for 8–12 hours then drying them reduces enzyme inhibitors and makes nutrients more bioavailable",
        tip_ar: "تنشيط المكسرات بنقعها في الماء لمدة 8–12 ساعة ثم تجفيفها يقلل مثبطات الإنزيم ويجعل العناصر الغذائية أكثر توافرًا بيولوجيًا",
      },
    },
    {
      name: "Premium Coffee Beans",
      name_ar: "حبوب قهوة فاخرة",
      category: "coffee",
      category_ar: "القهوة",
      rating: 4.9,
      image: coffeeImg,
      images: [coffeeImg, coffeeImg, coffeeImg],
      tags: ["100% Arabica", "Freshly Roasted", "Single Origin"],
      tags_ar: ["أرابيكا 100%", "محمرة حديثاً", "منشأ واحد"],
      featured: true,
      desc: "Grown at elevations above 1,800 meters in the highlands of Ethiopia and Colombia, these 100% Arabica beans develop a natural sweetness and complex acidity that defines specialty-grade coffee. Carefully washed and sun-dried on raised beds, then roasted to a medium profile to honor the terroir of each origin. Tasting notes include stone fruit, dark chocolate, and a lingering floral finish — an exceptional cup from the first sip to the last.",
      desc_ar: "تُزرع هذه الحبوب على ارتفاعات تتجاوز 1800 متر في مرتفعات إثيوبيا وكولومبيا، مما يمنحها حلاوة طبيعية وحموضة معقدة تُعرّف قهوة المستوى الفاخر. تُغسل بعناية وتُجفف تحت الشمس على أسرة مرتفعة، ثم تُحمص على درجة متوسطة لإبراز طابع كل منشأ. ملاحظات التذوق تشمل الفواكه ذات النواة، الشوكولاتة الداكنة، ونهاية زهرية طويلة — فنجان استثنائي من أول رشفة إلى آخرها.",
      origin: "Single-origin highlands — Yirgacheffe (Ethiopia) & Huila (Colombia)",
      origin_ar: "مرتفعات منشأ واحد — يرغاشيف (إثيوبيا) وهويلا (كولومبيا)",
      certifications: ["Fair Trade Certified", "Rainforest Alliance", "Specialty Grade 85+", "Organic"],
      certifications_ar: ["تجارة عادلة معتمدة", "تحالف الغابات المطيرة", "درجة فاخرة 85+", "عضوي"],
      benefits: ["Complex layered flavor profile", "Natural caffeine boost", "High in antioxidants", "Ethically sourced"],
      benefits_ar: ["نكهة غنية متعددة الطبقات", "دفعة طبيعية من الكافيين", "غني بمضادات الأكسدة", "مصدر أخلاقي"],
      shelfLife: {
        duration: "6 months (whole beans, sealed)",
        duration_ar: "6 أشهر (حبوب كاملة، مغلقة)",
        note: "Grind only what you brew — pre-ground coffee goes stale within 15–30 minutes of exposure to air",
        note_ar: "اطحن فقط ما ستعده — القهوة المطحونة مسبقًا تفقد نضارتها خلال 15–30 دقيقة من التعرض للهواء",
      },
      storage: {
        temperature: "15–25°C (room temperature)",
        humidity: "Low — moisture is the primary enemy of freshness",
        humidity_ar: "منخفضة — الرطوبة هي العدو الأول للنضارة",
        instructions: "Store in an opaque, airtight container at room temperature. Avoid the refrigerator or freezer — condensation introduces moisture that ruins the beans",
        instructions_ar: "يُحفظ في وعاء معتم محكم الإغلاق في درجة حرارة الغرفة. تجنّب الثلاجة أو الفريزر — يُضيف التكثّف رطوبة تفسد الحبوب",
      },
      usage: {
        primary: ["Espresso & Americano", "Pour-over & drip", "French press", "Moka pot", "Turkish coffee"],
        primary_ar: ["إسبرسو وأمريكانو", "صب ومفلتر", "فرنش برس", "موكا بوت", "قهوة تركية"],
        tip: "For peak flavor, brew within 2–4 weeks of the roast date and use water at 92–96°C — boiling water scorches the delicate aromatic compounds",
        tip_ar: "لأفضل نكهة، اعده خلال 2–4 أسابيع من تاريخ التحميص واستخدم ماءً بدرجة 92–96 درجة — الماء المغلي يحرق المركبات العطرية الرقيقة",
      },
    },
    {
      name: "Organic Red Lentils",
      name_ar: "عدس أحمر عضوي",
      category: "legumes",
      category_ar: "البقوليات",
      rating: 4.8,
      image: legumesImg,
      images: [legumesImg, legumesImg, legumesImg],
      tags: ["Organic", "Rich in Protein", "Quick Cooking"],
      tags_ar: ["عضوي", "غني بالبروتين", "سريع التحضير"],
      featured: true,
      desc: "Grown in nutrient-rich soils under certified organic farming practices, these split red lentils are prized for their naturally fast cook time — no soaking required. With 26g of plant protein per 100g and an exceptional iron content, they are one of the most nutritionally dense legumes available. Their mild, earthy flavor makes them incredibly versatile, absorbing the spices and aromatics of any dish they're cooked in.",
      desc_ar: "تُزرع في تربة غنية بالعناصر الغذائية وفق ممارسات الزراعة العضوية المعتمدة، ويُشاد بعدسنا الأحمر المقشور لسرعة طهيه الطبيعية — لا يحتاج إلى نقع. بمحتوى 26 جرامًا من البروتين النباتي لكل 100 جرام ومحتوى استثنائي من الحديد، يُعد من أكثر البقوليات كثافة غذائية. نكهته الخفيفة والترابية تجعله متعدد الاستخدامات بشكل لا مثيل له، إذ يمتص توابل وعطريات أي طبق يُطهى فيه.",
      origin: "Certified organic farms — Anatolia (Turkey) & Saskatchewan (Canada)",
      origin_ar: "مزارع عضوية معتمدة — الأناضول (تركيا) وساسكاتشيوان (كندا)",
      certifications: ["Certified Organic", "Non-GMO Verified", "Vegan Society Approved"],
      certifications_ar: ["عضوي معتمد", "معتمد خالٍ من الكائنات المعدلة وراثيًا", "معتمد من مجتمع النباتيين"],
      benefits: ["26g plant protein per 100g", "Rich in iron & folate", "Low glycemic index", "Supports heart health & digestion"],
      benefits_ar: ["26 جرام بروتين نباتي لكل 100 جرام", "غني بالحديد وحمض الفوليك", "مؤشر جلايسيمي منخفض", "يدعم صحة القلب والهضم"],
      shelfLife: {
        duration: "24 months (sealed)",
        duration_ar: "24 شهرًا (مغلق)",
        note: "Quality is best within the first 18 months; older lentils may require slightly longer cooking times",
        note_ar: "الجودة في أفضلها خلال أول 18 شهرًا؛ قد يحتاج العدس القديم إلى وقت طهي أطول قليلاً",
      },
      storage: {
        temperature: "15–25°C",
        humidity: "Below 70% — protect from moisture to prevent mold",
        humidity_ar: "أقل من 70% — احمه من الرطوبة لمنع العفن",
        instructions: "Store in a sealed container in a cool, dry pantry. Keep away from strong-smelling foods as lentils can absorb surrounding odors",
        instructions_ar: "يُحفظ في وعاء مغلق في مخزن بارد وجاف. ابعده عن الأطعمة ذات الرائحة القوية إذ يمكن للعدس امتصاص الروائح المحيطة",
      },
      usage: {
        primary: ["Lentil soups & dals", "Stews & curries", "Vegan patties & kofta", "Salads & grain bowls", "Lentil pasta sauce"],
        primary_ar: ["شوربات ودال العدس", "اليخنات والكاري", "كفتة وكباب نباتي", "السلطات وأوعية الحبوب", "صلصة معكرونة بالعدس"],
        tip: "Add a squeeze of lemon juice after cooking to brighten the flavor and significantly boost iron absorption",
        tip_ar: "أضف عصرة ليمون بعد الطهي لتنشيط النكهة وتعزيز امتصاص الحديد بشكل ملحوظ",
      },
    },
    {
      name: "Natural Dried Fruits",
      name_ar: "فواكه مجففة طبيعية",
      category: "dried-fruits",
      category_ar: "الفواكه المجففة",
      rating: 4.9,
      image: driedFruitsImg,
      images: [driedFruitsImg, driedFruitsImg, driedFruitsImg],
      tags: ["No Added Sugar", "Sun-Dried", "100% Natural"],
      tags_ar: ["بدون سكر مضاف", "مجفف بالشمس", "طبيعي 100%"],
      featured: true,
      desc: "Slowly sun-dried over several days to concentrate natural sweetness without any added sugar, sulfur, or preservatives, this collection includes apricots, figs, dates, and mulberries at peak ripeness. Sun-drying preserves heat-sensitive nutrients that oven or dehydrator processing destroys, resulting in a more nutritionally intact product with a beautifully chewy texture and an intensely sweet, true-fruit flavor.",
      desc_ar: "تُجفف ببطء تحت الشمس على مدى عدة أيام لتركيز الحلاوة الطبيعية دون أي سكر أو كبريت أو مواد حافظة مضافة. تشمل هذه المجموعة المشمش والتين والتمر والتوت في أوج نضجها. يحافظ التجفيف بالشمس على العناصر الغذائية الحساسة للحرارة التي يدمرها الفرن أو مجفف الطعام، مما ينتج منتجًا أكثر سلامة غذائية بقوام مطاطي جميل ونكهة فاكهة حقيقية مركزة.",
      origin: "Sun-dried in Mediterranean & Central Asian orchards",
      origin_ar: "مجفف بالشمس في بساتين البحر الأبيض المتوسط وآسيا الوسطى",
      certifications: ["100% Natural", "Sulfite-free", "No Added Sugar", "Vegan"],
      certifications_ar: ["طبيعي 100%", "خالي من الكبريتيت", "بدون سكر مضاف", "نباتي"],
      benefits: ["Concentrated source of fiber", "Natural quick-release energy", "Rich in potassium, iron & vitamins", "No artificial preservatives"],
      benefits_ar: ["مصدر مركز للألياف", "طاقة طبيعية سريعة الإفراز", "غني بالبوتاسيوم والحديد والفيتامينات", "بلا مواد حافظة صناعية"],
      shelfLife: {
        duration: "12 months (sealed)",
        duration_ar: "12 شهرًا (مغلق)",
        note: "Natural color darkening over time is normal and does not affect safety or flavor quality",
        note_ar: "اسمرار اللون الطبيعي مع مرور الوقت أمر طبيعي ولا يؤثر على السلامة أو جودة النكهة",
      },
      storage: {
        temperature: "15–20°C",
        humidity: "Below 60% — excess humidity causes sticking and mold",
        humidity_ar: "أقل من 60% — الرطوبة الزائدة تسبب التلاصق والعفن",
        instructions: "Store in a resealable airtight bag or glass jar in a cool, dry place. Refrigerate after opening to maintain texture and prevent insect exposure",
        instructions_ar: "يُحفظ في كيس محكم أو جرة زجاجية في مكان بارد وجاف. بعد الفتح يُبرّد للحفاظ على القوام وحمايته من الحشرات",
      },
      usage: {
        primary: ["Standalone healthy snack", "Oatmeal & yogurt toppings", "Baked goods & energy bars", "Savory tagines & rice", "Cheese boards & charcuterie"],
        primary_ar: ["وجبة خفيفة صحية مستقلة", "إضافات الشوفان والزبادي", "المعجنات وأشرطة الطاقة", "الطاجن والأرز المالح", "لوحات الجبن والمشهيات"],
        tip: "Soak in warm water or orange juice for 10 minutes before adding to baked goods — they'll stay plump and moist throughout baking",
        tip_ar: "انقعها في ماء دافئ أو عصير برتقال لمدة 10 دقائق قبل إضافتها للمعجنات — ستبقى ممتلئة ورطبة طوال الخبز",
      },
    },
    {
      name: "Premium Green Cardamom",
      name_ar: "هيل أخضر فاخر",
      category: "spices",
      category_ar: "البهارات",
      rating: 4.7,
      image: cardamomImg,
      images: [cardamomImg, cardamomImg, cardamomImg],
      tags: ["Whole", "Aromatic", "Grade A"],
      tags_ar: ["حبة كاملة", "عطري", "درجة أولى"],
      featured: false,
      desc: "Harvested by hand from small family farms in Karnataka, India and the Verapaz highlands of Guatemala, these whole Grade A cardamom pods are selected for their vivid green color, plump seeds, and intensely complex aroma — floral, citrusy, and warmly spiced all at once. Whole pods are kept intact to preserve the volatile aromatic oils that evaporate rapidly once ground, ensuring you extract peak fragrance at the moment of use.",
      desc_ar: "تُحصد يدويًا من مزارع عائلية صغيرة في كارناتاكا بالهند ومرتفعات فيراباز بغواتيمالا، تُختار قرون الهيل الأخضر من الدرجة الأولى لألوانها الخضراء النضرة وبذورها الممتلئة وعطرها المركب المكثف — زهري، حامضي، ودافئ التوابل في آنٍ واحد. تُحافظ القرون الكاملة على الزيوت العطرية المتطايرة التي تتبخر بسرعة بعد الطحن، مما يضمن استخلاص أقصى قدر من العطر لحظة الاستخدام.",
      origin: "Grade A selection — Karnataka (India) & Verapaz (Guatemala)",
      origin_ar: "اختيار الدرجة الأولى — كارناتاكا (الهند) وفيراباز (غواتيمالا)",
      certifications: ["Grade A Certified", "100% Natural", "Pesticide-tested"],
      certifications_ar: ["معتمد الدرجة الأولى", "طبيعي 100%", "مفحوص من المبيدات"],
      benefits: ["Natural digestive aid", "Antibacterial properties", "Freshens breath naturally", "Rich in volatile aromatic oils"],
      benefits_ar: ["مساعد طبيعي للهضم", "خصائص مضادة للبكتيريا", "يُنعّم النفس بشكل طبيعي", "غني بالزيوت العطرية المتطايرة"],
      shelfLife: {
        duration: "18 months (whole pods, sealed)",
        duration_ar: "18 شهرًا (قرون كاملة، مغلقة)",
        note: "Whole pods stay potent far longer than ground cardamom — grind only immediately before use",
        note_ar: "تحتفظ القرون الكاملة بقوتها أطول بكثير من الهيل المطحون — اطحن فورًا قبل الاستخدام مباشرة",
      },
      storage: {
        temperature: "15–25°C",
        humidity: "Low and stable — humidity dulls the aroma",
        humidity_ar: "منخفضة ومستقرة — الرطوبة تخفف العطر",
        instructions: "Store whole pods in a small airtight glass jar away from heat and sunlight. Avoid plastic — it can absorb and mute the essential oils over time",
        instructions_ar: "يُحفظ في جرة زجاجية صغيرة محكمة الإغلاق بعيدًا عن الحرارة وأشعة الشمس. تجنّب البلاستيك — يمكنه امتصاص الزيوت الأساسية وإضعافها مع مرور الوقت",
      },
      usage: {
        primary: ["Arabic & Turkish coffee", "Chai & spiced teas", "Rice pilafs & biryanis", "Middle Eastern sweets & halawa", "Cookies, cakes & pastries"],
        primary_ar: ["القهوة العربية والتركية", "الشاي بالبهارات", "أرز البلاف والبرياني", "الحلويات الشرقية والحلاوة", "الكوكيز والكيك والمعجنات"],
        tip: "Lightly crush the pods with the back of a knife before adding to hot liquid — this releases the aromatic oils without scattering the seeds",
        tip_ar: "اسحق القرون بخفة بظهر السكين قبل إضافتها إلى السائل الساخن — يُطلق هذا الزيوت العطرية دون تشتيت البذور",
      },
    },
  ],

  categories: [
    { id: "all", label: "All Products", label_ar: "جميع المنتجات" },
    { id: "grains", label: "Grains", label_ar: "الحبوب" },
    { id: "oils", label: "Oils", label_ar: "الزيوت" },
    { id: "spices", label: "Spices", label_ar: "التوابل" },
    { id: "nuts", label: "Nuts", label_ar: "المكسرات" },
    { id: "coffee", label: "Coffee", label_ar: "القهوة" },
    { id: "legumes", label: "Legumes", label_ar: "البقوليات" },
    { id: "dried-fruits", label: "Dried Fruits", label_ar: "الفواكه المجففة" },
  ],

  activeCategory: "all",
  selectedProduct: null,
  isModalOpen: false,

  // Actions
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // Atomic action — always use this to open a product modal
  openProduct: (product) => set({ selectedProduct: product, isModalOpen: true }),

  // Atomic action — always use this to close the product modal
  closeProduct: () => set({ selectedProduct: null, isModalOpen: false }),

  // Selectors
  getFilteredProducts: () => {
    const { products, activeCategory } = get();
    return activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);
  },

  getFeaturedCount: () => {
    return get().products.filter((p) => p.featured).length;
  },

  getAverageRating: () => {
    const { products } = get();
    return (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);
  },
}));

export default useProductsStore;