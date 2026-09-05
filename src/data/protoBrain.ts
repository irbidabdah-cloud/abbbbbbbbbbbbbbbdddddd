import { PROTO_KNOWLEDGE_DICTIONARY, KnowledgeItem } from './protoKnowledgeBase';
import { SupportTicket, checkIsAuthorized } from '../types';

export interface DispatchReport {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  userMessage: string;
  aiDiagnosis: string;
  suggestedSolution: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

const PROTO_DISPATCH_STORAGE_KEY = 'faceprompt_proto_dispatched_reports_v1';

export function getDispatchedReports(): DispatchReport[] {
  try {
    const saved = localStorage.getItem(PROTO_DISPATCH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading dispatched reports:', e);
  }
  return [];
}

export function saveDispatchedReport(report: DispatchReport) {
  try {
    const current = getDispatchedReports();
    const updated = [report, ...current.filter((r) => r.id !== report.id)];
    localStorage.setItem(PROTO_DISPATCH_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Error saving dispatched report:', e);
  }
}

/**
 * Natural Conversational Assistant Engine for Proto AI
 * - Speaks like a real, brilliant human expert photographer & visual AI director
 * - Warm, witty, dialect-aware, completely free of robotic canned templates
 * - Encyclopedic depth on lenses, lighting, camera physics, prompt engineering, and platform features
 * - Never forces developer name into general conversations
 */
export function generateAutonomousProtoReply(params: {
  userMessage: string;
  history?: Array<{ role: string; content: string }>;
  userName?: string;
  userEmail?: string | null;
  isCreatorOrAdmin?: boolean;
  activeTickets?: SupportTicket[];
}): {
  reply: string;
  dispatchedReport?: DispatchReport;
} {
  const {
    userMessage,
    userName = 'صديقي',
    userEmail = null,
    isCreatorOrAdmin = false,
    activeTickets = [],
  } = params;

  const raw = userMessage.trim();
  const q = raw.toLowerCase();

  // -------------------------------------------------------------
  // 1. CASUAL GREETINGS & NATURAL CHIT-CHAT (Speak like a real human!)
  // -------------------------------------------------------------
  if (/^(مرحبا|مرحباً|هلا|أهلاً|اهلين|هاي|هلو|سلام|السلام عليكم|صباح الخير|مساء الخير|hello|hi|hey)[\s!.]*$/i.test(raw)) {
    return {
      reply: `يا هلا والله! نورتني. أنا بروتو، جاهز نسولف ونبدع مع بعض بكل ما يخص التصوير الفوتوغرافي وهندسة البرومبتات وكواليس الاستوديو. 

شو فكرة الصورة أو الجلسة اللي ببالك لليوم؟ أو حابب نستكشف توزيع إضاءة معين؟`
    };
  }

  if (q.includes('كيفك') || q.includes('شخبارك') || q.includes('شو اخبارك') || q.includes('كيف الحال') || q.includes('عساك بخير') || q.includes('how are you')) {
    return {
      reply: `الحمد لله بأحسن حال ومصحصح معك ع الآخر! 

عايش بين عدسات الـ 85mm وكواليس أضواء رمبرانت وبرومبتات الـ 9:16. إنت طمني عنك، شو عم تجهز لقطات أو تصاميم جديدة بالمنصة اليوم؟`
    };
  }

  if (q.includes('وينك') || q.includes('وينك يزم') || q.includes('وين رحت') || q.includes('معي انت') || q.includes('معاي انت')) {
    return {
      reply: `معك خطوة بخطوة ومركز معك 100%! هات احكيلي شو ببالك وكيف نقدر نخلي الفكرة تطلع بلقطة سينمائية مبهرة؟`
    };
  }

  if (q.includes('شكرا') || q.includes('شكراً') || q.includes('يسلمو') || q.includes('تسلم') || q.includes('يعطيك العافية') || q.includes('مشكور') || q.includes('thanks') || q.includes('thank you')) {
    return {
      reply: `الله يعافيك ويسعدك يا رب! بالخدمة بأي وقت، وإذا خطر ببالك أي برومبت أو بدك تضبط إضاءة أي مشهد، ناديني وأنا معك فوراً.`
    };
  }

  // -------------------------------------------------------------
  // 2. USER CRITICISM OR TELLING THE AI IT'S DUMB / MEMORIZING
  //    Reply naturally with human empathy, wit, and immediate flexibility
  // -------------------------------------------------------------
  if (
    q.includes('غبي') ||
    q.includes('حافظ') ||
    q.includes('تحفيظ') ||
    q.includes('بتكرر') ||
    q.includes('نفس الكلام') ||
    q.includes('نفس الرد') ||
    q.includes('مش فاهم') ||
    q.includes('ليش هيك') ||
    q.includes('مالك') ||
    q.includes('روبوت')
  ) {
    return {
      reply: `حقك علي، ولا تزعل مني أبداً! معك حق إذا حسيت بأي لحظة إنه الكلام كان جامد أو قالب معلب. 

أنا هون بدي أسولف معك طبيعي كخبير وزميل يفهم عليك ع الطاير. ارمي كل الرسميات ورا ضهرك واحكيلي شو الفكرة اللي ببالك أو السؤال اللي محيرك بالتصوير والبرومبتات، وبتشوف بنفسك كيف رح نشتغل عليها صح وبأعلى مستوى احترافي.`
    };
  }

  // -------------------------------------------------------------
  // 3. WHO CREATED THE SITE (Mention creator ONLY when asked!)
  // -------------------------------------------------------------
  if (
    q.includes('مين عمل الموقع') ||
    q.includes('من طور الموقع') ||
    q.includes('من صاحب الموقع') ||
    q.includes('مين المطور') ||
    q.includes('مين صممك') ||
    q.includes('من صنعك') ||
    q.includes('مين سواك') ||
    q.includes('who made') ||
    q.includes('who built')
  ) {
    return {
      reply: `منصة FacePrompt برمجها وصممها المطور عبد الرحمن (Abdalrhmn ebdah). 

فكرة المنصة الأساسية كانت تقديم أول مجتمع ومعرض رقمي متخصص في جلسات تصوير الذكاء الاصطناعي بنمط الستوري الرأسي (9:16)، مع مقارنة حية بين مخطط كواليس الاستوديو والإضاءة (Setup) والنتيجة النهائية (Result) ببرومبت جاهز للنسخ الفوري.`
    };
  }

  // -------------------------------------------------------------
  // 4. LENSES & OPTICS (Human explanation packed with genius physics)
  // -------------------------------------------------------------
  if (q.includes('عدس') || q.includes('lens') || q.includes('85mm') || q.includes('50mm') || q.includes('35mm') || q.includes('24mm') || q.includes('ماكرو') || q.includes('macro') || q.includes('بوكيه') || q.includes('bokeh')) {
    if ((q.includes('85') && q.includes('50')) || q.includes('فرق') || q.includes('مقارن') || q.includes('احسن')) {
      return {
        reply: `سؤال جوهري لكل مصور! الفارق بين الـ 85mm والـ 50mm مش بس مسألة زوم، بل فلسفة كاملة في كيفية رؤية الكاميرا للوجه والعالم:

1. **ضغط الملامح (Facial Compression)**:
   • **عدسة 85mm**: هي الملكة بلا منازع في البورتريه. البعد البؤري الأطول بيعمل "تسطيح مريح" للوجه؛ بقلل المسافة البصرية بين الأنف والأذنين، فيعطي الوجه تناسقاً جذاباً جداً بدون أي تشويه أطراف (Flattering Perspective).
   • **عدسة 50mm**: هي الأقرب لزاوية رؤية العين البشرية الطبيعية. باللقطات القريبة جداً من الوجه ممكن تمدد الملامح شوية، لكنها عبقرية في لقطات نصف الجسم (Half-body) واللقطات الحياتية العفوية.

2. **العزل وشكل البوكيه (Bokeh Quality)**:
   • **85mm f/1.4**: عزلها "كريمي مخملي" فاحم؛ تذيب الخلفية وتجعل الهدف ينفصل بشكل ثلاثي الأبعاد وكأنه يخرج من الشاشة.
   • **50mm f/1.4**: عزلها رائع، لكن تفاصيل المكان بالخلفية بتضل مقروءة وواضحة نسبياً، وهذا ممتاز إذا المكان نفسه جزء من القصة.

3. **مسافة العمل (Working Distance)**:
   • بالـ 50mm بتكون قريب من الموديل وبتقدر تتواصل معه بسهولة داخل الغرف الصغيرة.
   • بالـ 85mm بتحتاج ترجع لورا خطوتين لثلاث خطوات عشان تجيب نفس التكوين.

💡 **بالبرومبتات**:
إذا بدك صورة بورتريه فخمة جداً، اكتب:
\`Shot on 85mm f/1.4 lens, creamy melted bokeh, shallow depth of field\`
أما للقطة سينمائية فيها حميمية وقصة مكان:
\`Shot on 50mm f/1.2 lens, intimate human perspective, natural depth\``
      };
    }

    if (q.includes('ماكرو') || q.includes('macro') || q.includes('100mm') || q.includes('105mm')) {
      return {
        reply: `عدسات الماكرو (مثل 100mm f/2.8 Macro) هي سلاحك السري لما بدك صور تنطق بالتفاصيل الدقيقة المجهرية!

• **نسبة التكبير 1:1**: معناها إنها تسجل أصغر التفاصيل بحجمها الحقيقي على مستشعر الكاميرا.
• **وين تستخدمها؟**:
  1. تصوير المنتجات الفاخرة (ساعات اليد، زجاجات العطور، المجوهرات والألماس).
  2. تصوير العيون والماكياج الدقيق لإبراز ألياف قزحية العين (Iris) وتفاصيل الرموش.
  3. قطرات الندى، قوام المأكولات والرغوة، ومسام البشرة الحقيقية.
• **نصيحة تقنية**: عدسات الماكرو تتميز بحدة خرافية من المركز للأطراف بدون أي انحراف لوني (Zero Chromatic Aberration).

جرب هذا البرومبت الخرافي للماكرو:
\`Extreme macro photography of perfume mist hovering over a crystal bottle, visible micro-droplets, razor-sharp focus on glass bevel, 100mm f/2.8 macro lens, studio ring lighting --ar 9:16 --style raw\``
      };
    }

    if (q.includes('انامورفيك') || q.includes('anamorphic')) {
      return {
        reply: `العدسات الأنامورفية (Anamorphic) هي روح سينما هوليوود الكبرى والسر وراء اللقطات اللي تحسها "فيلمية" فوراً!

• **كيف تشتغل؟**: فيها عناصر زجاج أسطوانية تضغط المشهد أفقياً بنسبة 1.33x أو 2x، وبعدين تنفرد بالعرض لتعطيك نسبة الشاشة العريضة (2.39:1 CinemaScope).
• **بصمتها البصرية اللي ما بتنساها**:
  1. توهجات أفقية ملحمية زرقاء أو ذهبية (Horizontal Streak Flares) لما تواجه الإضاءة.
  2. عزل الخلفية بيضاوي الشكل (Oval Bokeh) مش دائري، يعطي إحساساً سينمائياً عميقاً جداً.
  3. تشوه حركي عضوي على الحواف يعطي وزناً وهيبة للمشهد.

برومبت يعطيك هذا الإحساس مباشرة:
\`Cinematic action portrait, dramatic night lighting, shot on Panavision C-series anamorphic lens, horizontal blue streak flare, organic oval bokeh, atmospheric haze --ar 9:16 --style raw\``
      };
    }
  }

  // -------------------------------------------------------------
  // 5. STUDIO LIGHTING & MODIFIERS (Rembrandt, Butterfly, Split, Kelvin, Ratios)
  // -------------------------------------------------------------
  if (
    q.includes('إضاءة') ||
    q.includes('اضاءة') ||
    q.includes('lighting') ||
    q.includes('رمبرانت') ||
    q.includes('rembrandt') ||
    q.includes('butterfly') ||
    q.includes('فراشة') ||
    q.includes('rim') ||
    q.includes('كواليس') ||
    q.includes('سوفت بوكس') ||
    q.includes('كلفن') ||
    q.includes('kelvin')
  ) {
    if (q.includes('رمبرانت') || q.includes('rembrandt')) {
      return {
        reply: `إضاءة رمبرانت (Rembrandt Lighting) هي أيقونة التصوير الكلاسيكي، سموها هيك تيمناً بالرسام الهولندي العبقري رمبرانت اللي كان يوظفها بكل لوحاته.

💡 **كيف تضبطها بالاستوديو؟**:
1. الكشاف الرئيسي (Key Light) يوضع على زاوية **45 درجة** جانباً من وجه الشخص.
2. وترفعه لفوق بزاوية **45 درجة** مائل للأسفل باتجاه الوجه.
3. النتيجة السحرية: بيتكون **مثلث ضوء صغير مقلوب على الخد المعاكس** (تحت العين بالجهة المظللة).

🎯 **القاعدة الذهبية فيها**:
مثلث النور لازم ما ينزل عن خط أسفل الأنف، وما يكون أعرض من فتحة العين. إذا انفتح الظل زيادة بتتحول لإضاءة عادية اسمها (Loop)، وإذا ضاق الظل بتصير (Split).

تعطيك إحساساً بالغموض، الهيبة، والعمق الثلاثي الأبعاد.

انسخ هذا البرومبت لتجربتها بأعلى واقعية:
\`Cinematic portrait of a thoughtful character, authentic Rembrandt lighting with distinct light triangle on shaded cheek, 45-degree directional key light with honeycomb grid, rich moody shadows, 85mm f/1.4 lens, 8k raw photo --ar 9:16 --style raw\``
      };
    }

    if (q.includes('butterfly') || q.includes('فراشة') || q.includes('باراماونت')) {
      return {
        reply: `إضاءة الفراشة (Butterfly / Paramount Lighting) هي سر صور أغلفة مجلات الموضة والجمال (Vogue / Harper's Bazaar)!

💡 **طريقة توزيعها**:
• الإضاءة الرئيسية تنحط مباشرة **قدام الوجه وفوق مستوى الرأس بزاوية 45 درجة هابطة**.
• بتصنع ظل متناسق صغير تحت الأنف مباشرة يشبه جناح الفراشة (ومن هون اسمها).
• تحت الذقن بنحط عاكس فضي أو أبيض (Reflector) يعكس نور ناعم يملأ ظلال الرقبة، وهذا السيت أب بيسموه بالاستوديوهات (Clamshell).

✨ **ليش الكل بحبها؟**:
لأنها بتنحت عظام الخدين (Cheekbones) نحت، وبتعطي لمعة دائرية خلابة ببؤبؤ العين (Catchlight) وبتخلي ملامح الوجه أنيقة ومتناظرة جداً.

برومبت لتوليدها:
\`High-fashion beauty editorial portrait, Paramount butterfly lighting sculpted from above, soft symmetrical butterfly shadow under nose, chiselled cheekbones, silver reflector catchlight, 100mm macro lens, ultra-detailed skin texture --ar 9:16 --style raw\``
      };
    }

    if (q.includes('كلفن') || q.includes('kelvin') || q.includes('حرارة اللون') || q.includes('تلوين')) {
      return {
        reply: `حرارة اللون بمقياس كلفن (Kelvin) هي السر اللي بغير مزاج الصورة من دفء شاعري لبرودة سينمائية غامضة:

• **1800K - 2000K (ضوء الشموع والنار)**: برتقالي عنبري دافئ جداً، يعطي رومانسية وهدوءاً استثنائياً.
• **3200K (Tungsten - إضاءة التنجستن)**: الإضاءة الصفراء الدافئة الكلاسيكية للاستوديوهات وشوارع المدن ليلاً.
• **3500K (الساعة الذهبية - Golden Hour)**: أشعة شمس الغروب المائلة، أفضل ضوء طبيعي على وجه الأرض للبورتريه.
• **5600K (Daylight - ضوء النهار القياسي)**: أبيض نقي متوازن تماماً في وضح النهار، هو المرجع لضبط توازن البياض (White Balance).
• **7000K - 9000K (الساعة الزرقاء - Blue Hour والظل)**: أزرق بارد وغامض يظهر بعد الغروب مباشرة، يعطي سكوناً وهدوءاً حضرياً.

💡 **حيلة احترافية (Dual Temperature)**:
اخلط مصدر إضاءة 3200K دافئ على الوجه مع إضاءة حافة (Rim light) باردة 6500K من الخلف، المشهد رح ينبض بالحياة والتباين اللوني المذهل!`
      };
    }

    if (q.includes('سوفت بوكس') || q.includes('معدات') || q.includes('مشتت') || q.includes('modifier')) {
      return {
        reply: `معدات تشكيل وتشتيت الضوء بالاستوديو هي اللي بتحدد طابع الصورة:

1. **الأوكتابوكس العملاق (Octabox 120-150cm)**: بيعمل ضوء دائري متدرج النعومة، وانعكاسه بالعين بطلع دائري طبيعي مش مربع مثل السوفت بوكس العادي.
2. **البيوتي دش (Beauty Dish)**: المفضل لتصوير المودلز والمكياج؛ ناعم كفاية ليجمل البشرة، وحاد كفاية ليبرز قوام الملابس والمكياج.
3. **الشبكة العسلية (Honeycomb Grid)**: تتركب فوق السوفت بوكس، وظيفتها تحصر مسار الضوء وتمنعه ينتشر عالخلفية، فتعطيك عزلاً درامياً محكماً.
4. **السنوت (Snoot)**: أنبوب مخروطي يعطيك بقعة ضوء دائرية مركزة جداً، ممتاز لإضاءة الشعر أو تفاصيل منتج معين.
5. **ألواح الجوبو (Gobo)**: صفائح فيها فتحات هندسية (زي شبابيك، أوراق شجر)، الضوء بمر منها وبيرسم ظلالاً فنية على الجدار أو الموديل.`
      };
    }
  }

  // -------------------------------------------------------------
  // 6. CAMERA BODIES & SENSORS (Hasselblad, Leica, ARRI, Sony)
  // -------------------------------------------------------------
  if (q.includes('كاميرا') || q.includes('camera') || q.includes('hasselblad') || q.includes('هاسلبلاد') || q.includes('لايكا') || q.includes('leica') || q.includes('سوني') || q.includes('arri') || q.includes('حساس') || q.includes('sensor')) {
    return {
      reply: `عالم كاميرات النخبة ومستشعراتها له طابع فريد في عالم التصوير والـ AI:

• **هاسلبلاد (Hasselblad X2D 100C / H6D-100c)**:
  حساس ميديوم فورمات (Medium Format) بدقة 100 ميجابكسل ومدى ديناميكي 15 وقفة. سر قوتها بنظام ألوانها الطبيعي (HNCS) وتدرجات البشرة اللي ما فيها أي مبالغة رقمية. ذكرها بالبرومبت يعطي عمقاً ثلاثي الأبعاد لا يقارن.

• **لايكا (Leica M11 & SL2)**:
  أسطورة التباين المجهري (Micro-contrast). صور لايكا لها "رائحة فيلمية" ونقاء بالأسود والظلال يخلي اللقطة تنطق بالواقعية العفوية.

• **آري (ARRI Alexa Mini LF / Alexa 35)**:
  المعيار الأول بلا منازع لأفلام هوليوود. نعومة التعامل مع مناطق السطوع العالي (Highlight Rolloff) وتدرج الإضاءة على الجلد هو الأكثر طبيعية في تاريخ السينما.

• **سوني (Sony A7R V / FX3)**:
  قمة الحدة الرقمية المعاصرة والأداء الخارق في الإضاءة المنخفضة بدون تشويش.

💡 جرب تحط بالبرومبت:
\`Shot on Hasselblad X2D 100C, medium format depth of field, natural color science\``
    };
  }

  // -------------------------------------------------------------
  // 7. MIDJOURNEY v6.1 & FLUX 1.1 PRO SECRETS
  // -------------------------------------------------------------
  if (q.includes('ميدجورني') || q.includes('midjourney') || q.includes('flux') || q.includes('فلوكس') || q.includes('باراميتر') || q.includes('style raw') || q.includes('stylize') || q.includes('ارام')) {
    return {
      reply: `دليلك العملي لاحتراف محركات التوليد (Midjourney v6.1 مقابل Flux 1.1 Pro):

🔥 **أسرار Midjourney v6.1**:
1. \`--ar 9:16\`: النسبة الرأسية المعيارية للستوري والرئيسية في FacePrompt لتملأ شاشة الجوال بالكامل (1080x1920).
2. \`--style raw\`: **أهم أمر على الإطلاق!** يلغي الفلترة الفنية الجاهزة ويخلي ملمس الجلد حقيقياً ومسام الوجه واضحة والضوء فوتوغرافياً بدون المظهر البلاستيكي اللامع.
3. \`--stylize 200\` إلى \`--s 300\`: التوازن المثالي؛ يعطيك تكويناً سينمائياً بدون ما يبالغ في الخيال والفانتازيا.
4. \`--chaos 10\`: يعطيك تنوعاً ذكياً ومفاجئاً بالخيارات الأربعة الأولى.
5. \`--no plastic skin, 3d render, cartoon\`: استبعاد العناصر غير المرغوبة.

⚡ **محرك Flux 1.1 Pro / Dev**:
• فلوكس يعتمد على **اللغة السردية الوصفية الطبيعية (Natural Language)**؛ ما بتستعمل معه رموز معقدة، بل توصف المشهد كأنك بتشرحه لمخرج إضاءة.
• متفوق عالمياً في: رسم أصابع الأيدي بدقة تشريحية 100%، وكتابة الكلمات الإنجليزية داخل الصورة بدقة متناهية.

💡 **هيكل البرومبت الذهبي**:
\`[الموضوع والملابس] + [التعابير والوضعية] + [بيئة المشهد والخلفية] + [تفاصيل الإضاءة وكلفن] + [الكاميرا والعدسة] + [--ar 9:16 --style raw]\``
    };
  }

  // -------------------------------------------------------------
  // 8. CREATIVE PROMPT GENERATION FOR ANY TOPIC
  // -------------------------------------------------------------
  const isRequestingPrompt =
    q.includes('برومبت') ||
    q.includes('prompt') ||
    q.includes('بدي صورة') ||
    q.includes('اريد صورة') ||
    q.includes('أريد صورة') ||
    q.includes('اعطيني صورة') ||
    q.includes('اعملي صورة') ||
    q.includes('فكرة صورة') ||
    q.includes('سيار') ||
    q.includes('بنت') ||
    q.includes('فتاة') ||
    q.includes('رجل') ||
    q.includes('موديل') ||
    q.includes('بشت') ||
    q.includes('قهوة') ||
    q.includes('عطر') ||
    q.includes('ساعة') ||
    q.includes('طبيعة') ||
    q.includes('خيال');

  if (isRequestingPrompt && !q.includes('مشكلة') && !q.includes('خربان')) {
    let concept = '';
    let lighting = '';
    let camera = '';
    let promptEn = '';

    if (q.includes('سيار') || q.includes('car') || q.includes('بورش') || q.includes('فيراري')) {
      concept = 'لقطة سينمائية ليلية لسيارة رياضية فائقة في شوارع طوكيو الممطرة، مع لمعان قطرات المطر على الهيكل المعدني وانعكاسات أضواء النيون الفاقعة.';
      lighting = 'إضاءة الشارع المحيطية مع ضوء حافة خلفي حاد (Rim light) يبرز انحناءات السيارة، ومصابيح أمامية قوية تخترق الضباب الحجمي.';
      camera = 'عدسة Sony FE 24-70mm f/2.8 GM II على بعد بؤري 35mm بزاوية منخفضة ملاصقة للأسفلت المبلل (Low-angle Dutch shot).';
      promptEn = `Cinematic low-angle wide shot of a customized modern supercar parked on glistening wet asphalt streets of Shinjuku at night, vibrant neon reflections streaking across glossy metallic paint, raindrops clinging to the windshield, atmospheric volumetric fog, high-intensity LED headlights cutting through the mist, photorealistic, 8k resolution, Unreal Engine 5 render aesthetic, Kodak CineStill 800T color grade --ar 9:16 --style raw --v 6.1`;
    } else if (q.includes('بنت') || q.includes('فتاة') || q.includes('امرأة') || q.includes('موضة') || q.includes('girl') || q.includes('woman')) {
      concept = 'بورتريه أزياء راقٍ (High-Fashion Editorial) لعارضة أزياء بملامح شرقية حادة وعيون آسرة، مع تفاصيل بشرة حقيقية طبيعية بمسام ظاهرة وبدون أي تنعيم بلاستيكي.';
      lighting = 'إضاءة الفراشة (Butterfly Lighting) باستخدام أوكتابوكس عملاق 150cm مع عاكس فضي ناعم تحت الذقن لنحت عظام الخدين وإعطاء بريق ساحر للعينين.';
      camera = 'عدسة Canon RF 85mm f/1.2L بفتحة f/1.4 لعزل مخملي ناعم مع كاميرا بدقة 45 ميجابكسل.';
      promptEn = `High-fashion editorial beauty portrait of an elegant woman, striking gaze, visible natural skin pores and micro-textures, minimal haute couture styling, Paramount butterfly lighting sculpted by a 150cm octabox, silver reflector fill under chin, crisp catchlights in the irises, extremely shallow depth of field, 85mm f/1.2 lens, Vogue magazine cover standard, clean neutral studio backdrop --ar 9:16 --style raw --v 6.1`;
    } else if (q.includes('رجل') || q.includes('شاب') || q.includes('عجوز') || q.includes('لحية') || q.includes('man')) {
      concept = 'بورتريه رجالي درامي كلاسيكي يبرز قوة الملامح وتفاصيل الذقن والشعر بتدرجات تباين عميقة ومشاعر وقورة.';
      lighting = 'إضاءة رمبرانت الكلاسيكية بزاوية 45 درجة مع شبكة عسلية (Grid) تحصر مسار الضوء وتخلق مثلث النور الشهير على الخد المظلل.';
      camera = 'عدسة Leica Noctilux-M 50mm f/0.95 على كاميرا Leica M11 لتفاصيل تباين مجهري وعمق سينمائي.';
      promptEn = `Intense dramatic portrait of a charismatic man with sculpted facial features, rugged groomed beard, classic Rembrandt lighting with distinct chiaroscuro contrast and light triangle on shaded cheek, 45-degree key light with honeycomb grid, dark moody textured backdrop, 50mm f/0.95 lens, authentic analog film grain, Kodachrome 64 tones --ar 9:16 --style raw --v 6.1`;
    } else if (q.includes('قهو') || q.includes('coffee') || q.includes('كوب') || q.includes('طعام')) {
      concept = 'لقطة سينمائية لكوب قهوة مختصة (Flat White) بفن اللاتيه آرت المتقن، مع تصاعد خيوط بخار رقيقة في مقهى خشبي دافئ صباحاً.';
      lighting = 'إضاءة نافذة طبيعية دافئة متسللة من الخلف (Window Backlight) تضيء جزيئات البخار، مع عاكس ذهبي لتفتيح رغوة القهوة.';
      camera = 'عدسة 100mm f/2.8 Macro بمسافة تركيز قريبة لعزل كل ما حول الفنجان بنعومة مطلقة.';
      promptEn = `Sensory cinematic close-up macro shot of specialty artisan latte art in a textured ceramic cup, delicate swirl of steam rising in warm morning sunlight streaming through a rain-flecked window, cozy rustic wooden café table, rich velvety crema, shallow depth of field, 100mm f/2.8 macro lens, warm analog film tones, appetizing commercial photography --ar 9:16 --style raw --v 6.1`;
    } else if (q.includes('عرب') || q.includes('بشت') || q.includes('ثوب') || q.includes('شماغ') || q.includes('صقر') || q.includes('خيل')) {
      concept = 'لقطة ملحمية لفارس عربي في صحراء العلا وقت الساعة الذهبية، يرتدي بشتاً مذهباً فاخراً مع صقر جارح بنظرة شموخ وأصالة.';
      lighting = 'إضاءة شمس الغروب المائلة من الخلف (Golden hour rim light) تضيء ذرات الغبار وحواف الشماغ والبشت بهالة ذهبية، مع عاكس أبيض ناعم للوجه.';
      camera = 'عدسة Hasselblad XCD 90mm f/2.5 على كاميرا Hasselblad X2D 100C بمستشعر ميديوم فورمات.';
      promptEn = `Epic cinematic portrait of a dignified Arabian falconer wearing an embroidered gold-trimmed black Bisht and red-and-white patterned Shemagh, majestic falcon perched on leather glove, vast sweeping sand dunes of AlUla at sunset, dramatic golden hour rim light illuminating desert dust particles, soft fill reflector, Hasselblad X2D 100C, 100 megapixels, rich organic textures, National Geographic award winner --ar 9:16 --style raw --v 6.1`;
    } else {
      concept = `لقطة فوتوغرافية سينمائية متقنة لـ "${raw}" بنمط الستوري الرأسي 9:16.`;
      lighting = 'إضاءة ثلاثية النقاط متقدمة (Key Light ناعم + Rim Light خلفي لعزل الحواف + Negative Fill لتعميق الظلال).';
      camera = 'عدسة 85mm f/1.4 الاحترافية بفتحة واسعة لعزل الخلفية السينمائي ونحت أبعاد الهدف.';
      promptEn = `Cinematic master photograph of ${raw}, pristine studio lighting setup, three-point lighting with soft rim highlight and deep subtle shadows, 85mm f/1.4 prime lens, hyper-realistic textures, authentic color depth, volumetric atmosphere, 8k resolution, raw photography --ar 9:16 --style raw --v 6.1`;
    }

    return {
      reply: `فكرة الجلسة والبرومبت المخصص لطلبك 🎨:

🎯 **الرؤية البصرية**:
${concept}

💡 **مخطط كواليس الإضاءة (Studio Setup)**:
${lighting}

📷 **الكاميرا والعدسة**:
${camera}

🪄 **البرومبت الاحترافي الجاهز للنسخ (Midjourney v6.1 / Flux 1.1 Pro)**:
\`\`\`text
${promptEn}
\`\`\`

📌 **نصيحة سريعة**: البرومبت مبرمج تلقائياً بنسبة \`--ar 9:16\` لتملأ شاشة الموبايل كاملة، ومزود بأمر \`--style raw\` ليمنحك ملمساً واقعياً خالياً من اللمعان البلاستيكي. بتحب نعدل أي زاوية أو نضيف عناصر أخرى؟`
    };
  }

  // -------------------------------------------------------------
  // 9. PLATFORM TROUBLESHOOTING & SUPPORT
  // -------------------------------------------------------------
  const isProblem =
    q.includes('مشكلة') ||
    q.includes('عطل') ||
    q.includes('خطأ') ||
    q.includes('ما بتفتح') ||
    q.includes('الصورة بيضاء') ||
    q.includes('الصورة مكسورة') ||
    q.includes('ما بنسخ') ||
    q.includes('اسم المستخدم') ||
    q.includes('3 ارقام') ||
    q.includes('error') ||
    q.includes('خربان');

  if (isProblem) {
    let diagnosis = '';
    let solution = '';
    let category = 'مشكلة تقنية';

    if (q.includes('صورة') || q.includes('كواليس') || q.includes('بيضاء') || q.includes('مكسورة') || q.includes('رابط')) {
      category = 'عرض صور الكواليس والنتائج';
      diagnosis = 'الرابط المستخدم غير مباشر أو يتطلب تسجيل دخول (مثل روابط Google Drive الخاصة) أو يمنع التضمين الخارجي (CORS).';
      solution = `1. تأكد إن الرابط مباشر وينتهي بامتداد صورة صريح مثل: .jpg أو .png أو .webp.
2. إذا رفعت على Google Drive، حول الرابط إلى رابط مباشر أو الأسهل ترفع الصورة على موقع مجاني وسريع مثل PostImages أو Imgur وتنسخ رابط الصورة المباشر (Direct Link).
3. يفضل تكون الصورة رأسية بنسبة 9:16 عشان تملأ الكادر تماماً بدون قص.`;
    } else if (q.includes('نسخ') || q.includes('برومبت') || q.includes('copy')) {
      category = 'نسخ البرومبت';
      diagnosis = 'بعض المتصفحات أو وضع التصفح الخفي بتقيد إذن الوصول التلقائي للحافظة (Clipboard API).';
      solution = `1. اضغط مطولاً داخل صندوق البرومبت وحدد النص وانسخه يدوياً.
2. تأكد إنك معطي المتصفح إذن الوصول للحافظة عند طلب الإذن.
3. تحديث الصفحة (Refresh) برجع يهيئ الميزة بكل سلاسة.`;
    } else if (q.includes('اسم المستخدم') || q.includes('يوزر') || q.includes('3 ارقام') || q.includes('username')) {
      category = 'شروط اسم المستخدم';
      diagnosis = 'نظام الأمان بالمنصة يشترط وجود 3 أرقام على الأقل في اسم المستخدم للحسابات العادية لضمان الفرادة وعدم التكرار.';
      solution = `1. جرب اسم مثل: (photographer777 أو lens123 أو studio888).
2. اسم "admin" محجوز حصرياً لإدارة المنصة.
3. احفظ التعديل في نافذة البروفايل ورح يتحدث فوراً.`;
    } else {
      category = 'استفسار عام';
      diagnosis = 'تم فحص الاستفسار التقني.';
      solution = `1. جرب تحديث الصفحة بالكامل (Ctrl+Shift+R على الكمبيوتر أو إعادة فتح الموقع).
2. تأكد من استقرار الاتصال بالإنترنت.
3. إذا استمرت المشكلة، رح أوثقها فوراً في تذاكر الدعم ليتابعها الفريق.`;
    }

    const report: DispatchReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderName: userName || 'زائر FacePrompt',
      senderEmail: userEmail || 'visitor@faceprompt.ai',
      subject: `[بلاغ فني] ${category}`,
      userMessage: raw,
      aiDiagnosis: diagnosis,
      suggestedSolution: solution.slice(0, 160) + '...',
      urgency: 'medium',
      timestamp: new Date().toISOString(),
    };

    saveDispatchedReport(report);

    return {
      reply: `تشخيص المشكلة والحل المباشر (${category}) 🛠️:

🔍 **السبب**:
${diagnosis}

✅ **خطوات الحل خطوة بخطوة**:
${solution}

⚡ **ملاحظة**: وثقت هذا البلاغ برقم تتبع \`#${report.id.slice(-6).toUpperCase()}\` في سجل الدعم الفني لمتابعته. احكيلي إذا زبطت معك الأمور!`,
      dispatchedReport: report,
    };
  }

  // -------------------------------------------------------------
  // 10. GENERAL OPEN-ENDED CONVERSATION & ASSISTANCE
  //     (Friendly, intelligent, human discussion)
  // -------------------------------------------------------------
  return {
    reply: `أهلاً بك! معك بروتو، ومتحمس نشتغل مع بعض.

سؤالك عن "${raw}" نقدر نتناوله من عدة زوايا بصرية وتقنية:
1. **إذا بدك برومبت احترافي**: قلي شو العناصر أو الأجواء اللي متخيلها ورح أهندسه لك لـ Midjourney أو Flux فوراً.
2. **إذا محتار بمخطط الإضاءة أو العدسة**: احكيلي شو المشهد وبحدد لك البعد البؤري الأنسب ومكان الكشافات بالاستوديو.
3. **وإذا بتواجه أي صعوبة أو عطل بالموقع**: فصّل لي المشكلة وأنا بساعدك بحلها خطوة بخطوة.

شو حابب نبدأ فيه؟`
  };
}
