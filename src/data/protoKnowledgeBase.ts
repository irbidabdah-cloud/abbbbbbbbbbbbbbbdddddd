export interface KnowledgeItem {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'lighting' | 'lenses' | 'engines' | 'platform';
  shortDesc: string;
  details: string;
  recommendedPrompt?: string;
  tags: string[];
}

export const PROTO_KNOWLEDGE_DICTIONARY: KnowledgeItem[] = [
  // --- LIGHTING DICTIONARY ---
  {
    id: 'rembrandt-lighting',
    title: 'Rembrandt Lighting',
    arabicTitle: 'إضاءة رمبرانت الدرامية',
    category: 'lighting',
    shortDesc: 'إضاءة بزاوية 45 درجة تصنع مثلث نور كلاسيكي أسفل العين على الخد المعاكس.',
    details: 'تعتبر إضاءة رمبرانت من أشهر أساليب الإضاءة الكلاسيكية والسينمائية. توضع الإضاءة الرئيسية بزاوية 45 درجة بارتفاع مائل، وتخلق مثلثاً مضيئاً مميزاً على الخد الأقل إضاءة. تمنح الوجه عمقاً ثلاثي الأبعاد وإحساساً سينمائياً ودرامياً غامضاً.',
    recommendedPrompt: 'Cinematic portrait of a brooding character, intense gaze, classic Rembrandt lighting creating a sharp triangle of light on shadow cheek, deep moody shadows, 85mm f/1.4 lens, 8k resolution, raw photo --ar 9:16 --style raw',
    tags: ['إضاءة', 'رمبرانت', 'دراما', 'سينمائي', 'portrait', 'lighting']
  },
  {
    id: 'rim-lighting',
    title: 'Rim / Kicker / Hair Light',
    arabicTitle: 'إضاءة الحافة وعزل الشعر',
    category: 'lighting',
    shortDesc: 'إضاءة خلفية حادة موضوعة خلف الهدف لعزل ملامحه عن الخلفية المظلمة.',
    details: 'توضع الإضاءة خلف الهدف بزاوية مائلة، لتضيء حواف الكتفين والشعر بخط نور ساطع (Edge Light). وظيفتها الجوهرية فصل العنصر تماماً عن الخلفيات المظلمة وإبراز التكوين الخارجي للشخصية.',
    recommendedPrompt: 'Dramatic portrait, striking golden rim light contouring the silhouette and hair strands, deep black backdrop, soft front fill light, ARRI Alexa Mini LF, shallow depth of field --ar 9:16',
    tags: ['إضاءة الحافة', 'rim light', 'hair light', 'kicker', 'silhouette']
  },
  {
    id: 'butterfly-lighting',
    title: 'Butterfly / Paramount Lighting',
    arabicTitle: 'إضاءة الفراشة (الموضة والجمال)',
    category: 'lighting',
    shortDesc: 'إضاءة فوقية أمامية بزاوية 45° تصنع ظلاً متناظراً كالفراشة أسفل الأنف.',
    details: 'المعيار الذهبي لتصوير مجلات الأزياء الراقية والجمال (Glamour). توضع الإضاءة فوق وأمام الوجه مباشرة، فتبرز عظام الخدين وتنحت ملامح الوجه وتخلق ظلاً رقيقاً متناسقاً يشبه الفراشة أسفل الأنف.',
    recommendedPrompt: 'High-fashion editorial beauty portrait, flawless Paramount butterfly lighting sculpting cheekbones, subtle soft shadow beneath nose, beauty dish reflection in eyes, 100mm macro lens, ultra-detailed skin texture --ar 9:16 --style raw',
    tags: ['فراشة', 'موضة', 'أزياء', 'جمال', 'butterfly', 'glamour']
  },
  {
    id: 'split-lighting',
    title: 'Split Lighting',
    arabicTitle: 'إضاءة الانقسام (90 درجة)',
    category: 'lighting',
    shortDesc: 'إضاءة جانبية تقسم الوجه تماماً إلى نصف مضيء ونصف في الظل التام.',
    details: 'توضع الإضاءة على جانب الوجه بزاوية 90 درجة بالتمام، ما ينتج نصفاً مضيئاً تماماً ونصفاً غارقاً في العتمة. ترمز للقوة، الازدواجية، والصراع الداخلي.',
    recommendedPrompt: 'Intense split lighting portrait, half face illuminated with cold white light, other half completely engulfed in dramatic shadow, high contrast chiaroscuro, cinematic monochrome mood --ar 9:16',
    tags: ['انقسام', 'split', 'صراع', 'غموض', 'high-contrast']
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpunk & Volumetric Neon',
    arabicTitle: 'أضواء النيون السايبربانك الحجمية',
    category: 'lighting',
    shortDesc: 'أضواء نيون زرقاء وقرمزية مع ضباب حجمي وانعكاسات الطرق المبللة.',
    details: 'أسلوب إضاءة مستقبلي يعتمد على مصدري إضاءة بألوان متقابلة (Dual Gel Lighting: Cyan & Magenta أو Teal & Orange)، مع إضاءة حجمية تخترق الضباب وتنعكس على الأسطح الزجاجية والأسفلت المبلل بمياه الأمطار.',
    recommendedPrompt: 'Cyberpunk night portrait in a futuristic neon alley, volumetric pink and cyan neon fog, rain droplets dripping on wet jacket, authentic reflections on asphalt, anamorphic blue horizontal lens flare, Hasselblad medium format --ar 9:16',
    tags: ['نيون', 'سايبربانك', 'ضباب', 'مطر', 'cyberpunk', 'neon']
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour & Warm Backlight',
    arabicTitle: 'الساعة الذهبية والإضاءة الدافئة',
    category: 'lighting',
    shortDesc: 'أشعة شمس مائلة بحرارة 3200K وظلال ناعمة طويلة وقت الغروب.',
    details: 'إضاءة شمس الغروب الدافئة، بزاوية أفقية منخفضة وتشتت ضوئي ذهبي ناعم في الأجواء (Atmospheric Haze). تعطي إحساساً بالحنين، الجمال الطبيعي، والراحة النفسية.',
    recommendedPrompt: 'Ethereal outdoor portrait during golden hour, low warm sunlight 3200K creating dazzling sun flares and hair highlights, lush meadows bokeh background, 85mm f/1.2 lens, organic film grain --ar 9:16',
    tags: ['الساعة الذهبية', 'شمس', 'غروب', 'دافئ', 'golden hour']
  },

  // --- LENSES & CAMERAS DICTIONARY ---
  {
    id: 'lens-85mm',
    title: '85mm f/1.4 (The Portrait King)',
    arabicTitle: 'عدسة 85mm (ملك البورتريه)',
    category: 'lenses',
    shortDesc: 'العدسة القياسية الأفضل في العالم لعزل الخلفيات ببوكيه حريري مخملي.',
    details: 'تعتبر 85mm f/1.2 و f/1.4 ملكة تصوير الوجوه بلا منازع، حيث تمنح ضغطاً مريحاً يبرز تناسق ملامح الوجه دون أي تشويه للأبعاد، مع عزل بصري ضبابي ساحر (Creamy Bokeh).',
    recommendedPrompt: 'Close-up portrait shot on 85mm f/1.4 lens, ultra shallow depth of field, creamy spherical bokeh, sharp iris focus, natural skin texture, studio softbox lighting --ar 9:16',
    tags: ['85mm', 'عدسة', 'بورتريه', 'بوكيه', 'عزل']
  },
  {
    id: 'lens-50mm',
    title: '50mm f/1.8 (Natural Human Vision)',
    arabicTitle: 'عدسة 50mm (الرؤية الطبيعية النظيفة)',
    category: 'lenses',
    shortDesc: 'تحاكي زاوية الرؤية الطبيعية للعين البشرية بنسب حقيقية متوازنة.',
    details: 'تسمى بالإنجليزية "Nifty Fifty"، وتقدم لقطات متوازنة جداً تحاكي تماماً المنظور الطبيعي كما تراه العين المجردة، مثالية للشارع، والمشاهد العفوية والأزياء.',
    recommendedPrompt: 'Candid lifestyle street portrait, shot on 50mm f/1.8 lens at eye-level, natural daylight, genuine expressions, balanced composition, realistic depth --ar 9:16',
    tags: ['50mm', 'طبيعي', 'شارع', 'عفوي', 'lifestyle']
  },
  {
    id: 'lens-35mm',
    title: '35mm f/1.4 (Cinematic Narrative)',
    arabicTitle: 'عدسة 35mm (السرد السينمائي للمخرجين)',
    category: 'lenses',
    shortDesc: 'عدسة المخرجين لربط الشخصية بتفاصيل المكان والبيئة المحيطة.',
    details: 'تسمح هذه العدسة بإظهار الشخصية في قلب بيئتها دون تشويه الملامح، مما يساعد في سرد قصة المشهد (Environmental Portraiture) ونقل المشاهد لداخل المكان.',
    recommendedPrompt: 'Cinematic environmental portrait of an artisan in a vintage wood workshop, 35mm f/1.4 lens, rich ambient lighting, dust particles floating in window sunlight, storytelling atmosphere --ar 9:16',
    tags: ['35mm', 'سينمائي', 'بيئة', 'سرد', 'قصة']
  },
  {
    id: 'lens-macro-100mm',
    title: '100mm Macro f/2.8 (Microscopic Detail)',
    arabicTitle: 'عدسة 100mm ماكرو (التفاصيل الفائقة والمنتجات)',
    category: 'lenses',
    shortDesc: 'مخصصة لتصوير أدق التفاصيل، العطور، المجوهرات، وقطرات الندى.',
    details: 'عدسة التقريب المجهري، قادرة على إظهار مسام الجلد الدقيقة، لمعان قزحية العين، وقطرات الماء على زجاجات العطور ومنتجات مستحضرات التجميل بدقة متناهية.',
    recommendedPrompt: 'Macro product photography of a luxury perfume bottle, crystal glass facets, condensed water droplets, soft strip-box reflections, black velvet background, 100mm f/2.8 macro, 8k --ar 9:16',
    tags: ['ماكرو', '100mm', 'عطور', 'منتجات', 'macro']
  },
  {
    id: 'camera-hasselblad',
    title: 'Hasselblad H6D-100c & Leica M11',
    arabicTitle: 'كاميرات النخبة: هاسلبلاد ولايكا',
    category: 'lenses',
    shortDesc: 'محاكاة حساسات الميديوم فورمات والتدرج اللوني العضوي الأسطوري.',
    details: 'استخدام أسماء هذه الكاميرات داخل برومبت الذكاء الاصطناعي يوجه المحرك لمحاكاة التباين المجهري العالي والألوان غير المشبعة صناعياً والتدرج الطبيعي الناعم بين الظلال والضوء.',
    recommendedPrompt: 'Authentic documentary portrait shot on Hasselblad H6D-100c medium format, unmatched micro-contrast, organic tonal range, Leica color profile, studio lighting setup --ar 9:16 --style raw',
    tags: ['كاميرا', 'هاسلبلاد', 'لايكا', 'hasselblad', 'leica']
  },

  // --- AI ENGINE PROMPT RULES ---
  {
    id: 'engine-midjourney',
    title: 'Midjourney v6.1 Parameters Formula',
    arabicTitle: 'معادلة وأوامر Midjourney v6.1',
    category: 'engines',
    shortDesc: 'أهم المعاملات: --ar 9:16 و --style raw و --s 250 لتفادي المظهر البلاستيكي.',
    details: 'للحصول على صور واقعية في ميدجورني v6.1: \n1. استخدم دائماً --ar 9:16 لنمط الستوري الرأسي.\n2. أضف --style raw لتقليل التدخل الفني المبالغ فيه وجعل البشرة واقعية.\n3. اضبط --stylize بين 150 و 350.\n4. تجنب الكلمات المكررة مثل (photorealistic, 8k) واستبدلها بأسماء الكاميرات والإضاءة الحقيقية.',
    recommendedPrompt: 'Editorial photography of an elderly sailor, weathered skin, salt-encrusted beard, authentic sea spray, dramatic overcast sky lighting, shot on ARRI Alexa 35 --ar 9:16 --style raw --s 250',
    tags: ['midjourney', 'ميدجورني', 'أوامر', 'parameters', 'style raw']
  },
  {
    id: 'engine-flux',
    title: 'Flux 1.1 Pro Descriptive Flow',
    arabicTitle: 'أسلوب الصياغة السردية لمحرك Flux 1.1',
    category: 'engines',
    shortDesc: 'الوصف الحسي للضوء والأنسجة الدقيقة وتفاصيل البشرة الواقعية.',
    details: 'يعمل محرك فلكس (Flux) بكفاءة خارقة عند كتابة جمل وصفية سردية غنية بالتفاصيل الحسية (مثل: subtle peach fuzz, visible skin pores, natural eye catchlights, delicate fabric wrinkles) بدلاً من الكلمات المفتاحية المنفصلة.',
    recommendedPrompt: 'A realistic close-up portrait of a woman laughing under soft rainy city light, wet glistening hair strands, visible natural skin texture and freckles, soft wool scarf with visible thread weave, cinematic realism, neutral color grading --ar 9:16',
    tags: ['flux', 'فلكس', 'واقعي', 'بشرة', 'descriptive']
  },
  {
    id: 'engine-sdxl',
    title: 'Stable Diffusion XL & SD 3.5 Rules',
    arabicTitle: 'قواعد وقاموس البرومبت السلبي لـ SDXL',
    category: 'engines',
    shortDesc: 'استخدام أوزان اللورا والبرومبت السلبي المعياري لمنع التشوهات.',
    details: 'في موديلات Stable Diffusion، يعتبر البرومبت السلبي (Negative Prompt) أساسياً: \n(plastic skin:1.3), (smooth textures:1.2), deformed, extra limbs, bad anatomy, bad hands, blurry, watermark, signature, oversaturated, cartoon, 3d render.',
    recommendedPrompt: 'RAW candid photograph, 8k uhd, masterpiece, Fujifilm Provia film simulation, studio lighting with octabox and rim light --ar 9:16',
    tags: ['stable diffusion', 'sdxl', 'negative prompt', 'برومبت سلبي']
  },

  // --- FACEPROMPT PLATFORM GUIDE ---
  {
    id: 'platform-creator',
    title: 'The Creator: Abdalrhmn ebdah',
    arabicTitle: 'المصمم والمطور: Abdalrhmn ebdah',
    category: 'platform',
    shortDesc: 'صاحب الفكرة والمطور والمصمم الحصري لمنصة FacePrompt ومساعد بروتو.',
    details: 'المطور والمصمم المبدع **Abdalrhmn ebdah** (عبد الرحمن عابدة) هو صاحب الرؤية والمطور الوحيد الذي قام بتصميم وبرمجة وتطوير منصة FacePrompt من الصفر، وبنى نظام الستوريات والمقارنة التفاعلية ونظام اللغات والثيمات ولوحة التحكم ومساعد بروتو الذكي.',
    recommendedPrompt: 'Prompt crafted with love on FacePrompt by Abdalrhmn ebdah',
    tags: ['مطور', 'مصمم', 'عبد الرحمن', 'صانع', 'abdalrhmn', 'ebdah', 'creator']
  },
  {
    id: 'platform-story-format',
    title: '9:16 Story Format: Setup vs Result',
    arabicTitle: 'فلسفة الستوري 9:16: المقارنة الحية',
    category: 'platform',
    shortDesc: 'مقارنة فريدة بين كواليس الإضاءة وزوايا الكاميرا وصورة النتيجة النهائية.',
    details: 'جوهر FacePrompt هو تحويل تعليم وتوليد صور الذكاء الاصطناعي إلى تجربة بصرية ممتعة: \n1. صورة الكواليس (Setup / Behind The Scenes): تعرض مخطط الاستوديو، مواضع السوفت بوكس، وزاوية الكاميرا.\n2. صورة النتيجة (Result Output): الصورة النهائية فائقة السينمائية الناتجة عن البرومبت.\nيتيح الموقع التبديل الفوري بنقرة واحدة وتكبير الصور في العارض المكبر (Lightbox).',
    tags: ['ستوري', '9:16', 'setup', 'result', 'كواليس', 'نتيجة', 'مقارنة']
  },
  {
    id: 'platform-features',
    title: 'Platform Full Feature Set',
    arabicTitle: 'دليل ميزات منصة FacePrompt الشامل',
    category: 'platform',
    shortDesc: 'المعرض، نسخ البرومبت بنقرة واحدة، الثيمات، 25 لغة، والدعم الفني.',
    details: 'تتضمن منصة FacePrompt:\n• نسخ البرومبت الكامل بنقرة واحدة (One-Click Copy).\n• ثيمين راقيين: الأبيض الملكي (Pure White) والخمري الفاخر (Burgundy).\n• دعم 25 لغة عالمية فورية مع ضبط الاتجاه (RTL & LTR).\n• صفحة الملف الشخصي الكاملة مع إحصائيات الجلسات واليوزر نيم المخصص.\n• لوحة تحكم المشرفين مع تخزين سحابي متزامن عبر Firebase Firestore.\n• مكتب دعم فني وتذاكر متكامل (فريق الدعم: عبد الرحمن، زيد، خالد، محمد).',
    tags: ['ميزات', 'دليل', 'معرض', 'ثيم', 'لغات', 'دعم فني', 'firestore']
  },

  // --- COMPREHENSIVE TROUBLESHOOTING MATRIX ---
  {
    id: 'troubleshooting-broken-images',
    title: 'Broken Images & Upload Issues',
    arabicTitle: 'حل مشكلة عدم ظهور الصور أو الروابط المكسورة',
    category: 'platform',
    shortDesc: 'كيفية التأكد من استخدام روابط صور مباشرة (Direct Links) صالحة للعرض العام.',
    details: 'تحدث مشكلة عدم ظهور الصورة عند وضع رابط صفحة ويب بدلاً من رابط الصورة المباشر، أو استخدام رابط Google Drive خاص أو رابط يمنع الـ Hotlinking.\nالحل الجذري: \n1. تأكد من أن الرابط ينتهي بصيغة مباشرة (.jpg, .png, .webp).\n2. استخدم مواقع رفع مجانية ومفتوحة مثل Imgur أو PostImages أو Cloudinary.\n3. تأكد أن الصورة بنمط الستوري (9:16) لتظهر بدقة عالية بدون تشويه.',
    tags: ['مشكلة', 'صورة', 'كواليس', 'رابط مكسور', 'رفع صور', 'broken image']
  },
  {
    id: 'troubleshooting-clipboard-copy',
    title: 'Prompt Copying & Clipboard Permissions',
    arabicTitle: 'حل مشكلة نسخ البرومبت واستجابة الأزرار',
    category: 'platform',
    shortDesc: 'طرق بديلة لنسخ البرومبت في حال تقييد المتصفح للحافظة (Clipboard API).',
    details: 'إذا لم يستجب زر النسخ في بعض متصفحات الهواتف المحمولة القديمة أو النوافذ المضمنة:\n1. اضغط ضغطة مطولة على نص البرومبت داخل المربع وسيتم تحديده بالكامل لتقوم بنسخه.\n2. قم بتحديث الصفحة للسماح للمتصفح بإعادة تفعيل إذن الحافظة.\n3. استخدم متصفحاً حديثاً مثل Chrome أو Safari.',
    tags: ['مشكلة', 'نسخ', 'برومبت', 'حافظة', 'clipboard', 'زر']
  },
  {
    id: 'troubleshooting-aspect-ratio',
    title: 'Aspect Ratio 9:16 Optimization',
    arabicTitle: 'حل مشكلة اقتصاص الصور ونسبة الستوري 9:16',
    category: 'platform',
    shortDesc: 'كيفية توليد وتجهيز الصور لتناسب نمط الستوري الرأسي بدون قص عشوائي.',
    details: 'صممت كروت FacePrompt خصيصاً بنمط الستوري الرأسي (9:16) لمحاكاة شاشات الهواتف الذكية:\n1. في Midjourney: أضف دائماً الأمر --ar 9:16 في نهاية البرومبت.\n2. في التوليد اليدوي: استخدم أبعاد 1080x1920 بكسل.\n3. تجنب رفع صور مربعة (1:1) أو أفقية (16:9) لأنها ستظهر بحواف رمادية لتناسب إطار الستوري.',
    tags: ['مشكلة', 'نسبة', 'ستوري', '9:16', 'اقتصاص', 'aspect ratio']
  },
  {
    id: 'troubleshooting-username-rules',
    title: 'Username Policy: 3 Digits Rule',
    arabicTitle: 'حل مشكلة اسم المستخدم وقاعدة الـ 3 أرقام',
    category: 'platform',
    shortDesc: 'شرط وجود 3 أرقام على الأقل لليوزر نيم العادي وحجز admin للحسابات الإدارية.',
    details: 'يشترط نظام الأمان في FacePrompt لحسابات الزوار العاديين أن يحتوي اسم المستخدم (Username) على 3 أرقام على الأقل (مثل user789 أو sami911) لضمان الفرادة وعدم تكرار الأسماء.\nبينما اسم المستخدم "admin" محجوز حصرياً ومشترك بين الحسابات الإدارية الـ 5 المصرحة.',
    tags: ['مشكلة', 'يوزر نيم', 'اسم مستخدم', 'حساب', 'أرقام', 'admin']
  },
  {
    id: 'troubleshooting-support-escalation',
    title: 'Support Desk & Creator Escalation',
    arabicTitle: 'قناة تحويل الشكاوى والمشاكل للمطور عبد الرحمن',
    category: 'platform',
    shortDesc: 'كيفية إيصال أي مشكلة أو اقتراح مباشرة للمطور وفريق الدعم الفني.',
    details: 'يمتلك بروتو صلة وصل ذاتية ومباشرة مع المطور Abdalrhmn ebdah. بمجرد أن يذكر الزائر أي مشكلة، يقوم بروتو بتشخيصها فوراً وتوليد تذكرة بلاغ فني موجهة للمطور وفريق الدعم المعتمد (عبد الرحمن، زيد، خالد، محمد)، ويمكن للمستخدم أيضاً استخدام زر "خدمة العملاء" العائم في أسفل الشاشة.',
    tags: ['خدمة عملاء', 'تواصل', 'مطور', 'شكوى', 'دعم فني', 'تذكرة']
  }
];

