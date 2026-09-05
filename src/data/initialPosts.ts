import { Post } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'بورتريه سينمائي بإضاءة ثلاثية استوديو',
    description: 'تقنية تصوير استوديو متقدمة تركز على إضاءة حافة الشعر (Rim Light) مع سوفت بوكس جانبي لإبراز تفاصيل الوجه والعمق الدرامي.',
    prompt: 'Cinematic portrait of a contemplative man with beard, captured with 85mm lens at f/1.4, dramatic rim lighting separating subject from deep dark background, soft fill light on facial contours, 8k resolution, ultra-detailed skin textures, hyper-realistic, award-winning photography --ar 16:9 --style raw',
    setupImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    setupTitle: 'طريقة التصوير: عدسة 85mm مع سوفت بوكس 45 درجة وإضاءة خلفية دقيقة',
    resultImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    lens: '85mm f/1.4 Prime',
    lighting: 'إضاءة استوديو ثلاثية (Key + Rim + Fill)',
    cameraAngle: 'مستوى العين Eye-Level مباشر',
    category: 'بورتريه',
    createdAt: '2026-09-04',
    authorEmail: 'alrhmnabd91@gmail.com'
  },
  {
    id: 'post-2',
    title: 'لقطة سينمائية بالشارع مع انعكاسات أمطار النيون',
    description: 'توضيح لكيفية استخدام الزاوية السفلية القريبة من الأرض (Low-angle Puddle Shot) للاستفادة من انعكاس أضواء النيون بعد المطر في الشوارع الليلية.',
    prompt: 'Cyberpunk neon-lit alleyway at midnight after rain, low-angle ground level shot, neon signs reflecting vividly in asphalt puddles, steam rising from grates, 35mm cinematic anamorphic lens, moody volumetric atmosphere, highly detailed, blade runner aesthetic --ar 16:9',
    setupImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    setupTitle: 'طريقة التصوير: تثبيت الكاميرا بزاوية أرضية منخفضة مواجهة للبركة',
    resultImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    lens: '35mm f/1.8 Anamorphic',
    lighting: 'أضواء نيون ليلية مع تشتت الإضاءة في الرذاذ',
    cameraAngle: 'زاوية أرضية منخفضة Low Ground Angle',
    category: 'سينمائي',
    createdAt: '2026-09-03',
    authorEmail: 'abdalrhmnabdah911@gmail.com'
  },
  {
    id: 'post-3',
    title: 'تصوير منتجات تجاري لزجاجة عطر فاخرة مع قطرات الماء',
    description: 'طريقة إعداد إضاءة تجارية مزدوجة Strip-boxes مع لوح أكريليك عاكس ورشاش ماء دقيق للحصول على تناثر رذاذ فوتوغرافي محترف.',
    prompt: 'Commercial luxury glass perfume bottle standing on dark wet slate, micro water droplets suspended in mid-air, macro 100mm lens, dual strip softbox lighting creating sharp edge reflections, crisp caustics and refractions, high-end magazine advertisement quality --ar 4:5',
    setupImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    setupTitle: 'طريقة التصوير: عدسة ماكرو 100mm مع إضاءة شريطية مزدوجة وخلفية عازلة',
    resultImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4:5',
    lens: '100mm Macro f/2.8',
    lighting: 'إضاءة شريطية مزدوجة Dual Strip-box',
    cameraAngle: 'زاوية 45 درجة مع مستوى المنتج',
    category: 'منتجات',
    createdAt: '2026-09-02',
    authorEmail: 'irbidabdah@gmail.com'
  },
  {
    id: 'post-4',
    title: 'الساعة الذهبية في الصحراء وزوايا الإضاءة الطبيعية',
    description: 'استخدام إضاءة الشمس المائلة وقت الغروب (Backlight Golden Hour) مع عاكس ذهبي أمامي خفيف لإبراز تموجات الرمال والظلال الطويلة.',
    prompt: 'Epic wide landscape of vast sand dunes in golden hour, a solitary nomadic figure on horizon, ultra-warm sun rays flaring naturally into the lens, long rhythmic dune shadows, 24mm wide-angle, cinematic color grading, national geographic quality --ar 16:9',
    setupImage: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=900&q=80',
    setupTitle: 'طريقة التصوير: كاميرا بعدسة واسعة 24mm مواجهة لمصدر الشمس الخافت',
    resultImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '16:9',
    lens: '24mm Ultra Wide f/4',
    lighting: 'ضوء طبيعي دافئ وقت الغروب (Golden Hour)',
    cameraAngle: 'زاوية واسعة ومستوى متوسط',
    category: 'طبيعة',
    createdAt: '2026-09-01',
    authorEmail: 'qudiqudi164@gmail.com'
  }
];
