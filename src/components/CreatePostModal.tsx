import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Image as ImageIcon, PlusCircle, Sparkles, Upload, X, Loader2 } from 'lucide-react';
import { Post, ThemeMode } from '../types';
import { uploadImageToStorage } from '../lib/firebase';

interface CreatePostModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  userEmail: string;
  onAdd: (newPost: Post) => void;
  onClose: () => void;
}

export function CreatePostModal({
  isOpen,
  theme,
  userEmail,
  onAdd,
  onClose,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [setupImage, setSetupImage] = useState('');
  const [setupTitle, setSetupTitle] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [category, setCategory] = useState('بورتريه');
  const [lens, setLens] = useState('85mm f/1.4');
  const [lighting, setLighting] = useState('إضاءة استوديو ثلاثية ناعمة');
  const [cameraAngle, setCameraAngle] = useState('مستوى العين Eye-Level');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isUploadingSetup, setIsUploadingSetup] = useState(false);
  const [isUploadingResult, setIsUploadingResult] = useState(false);

  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: 'setup' | 'result'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'setup') {
      setIsUploadingSetup(true);
    } else {
      setIsUploadingResult(true);
    }

    try {
      const url = await uploadImageToStorage(file, 'sessions');
      if (type === 'setup') {
        setSetupImage(url);
      } else {
        setResultImage(url);
      }
    } catch (err) {
      console.warn('Firebase upload fallback warning:', err);
    } finally {
      if (type === 'setup') {
        setIsUploadingSetup(false);
      } else {
        setIsUploadingResult(false);
      }
    }
  };

  const handleLoadSample = (sampleType: 'portrait' | 'neon' | 'macro') => {
    if (sampleType === 'portrait') {
      setTitle('لقطة بورتريه أزياء بإضاءة متباينة');
      setDescription('كواليس إعداد جلسة تصوير أزياء عصرية، تم استخدام عاكس إضاءة فضي على الجانب الأيمن مع شمس طبيعية خلفية.');
      setPrompt('High fashion editorial portrait, elegant model with sculptural outfit, backlit by golden natural light, silver reflector fill on cheekbones, 85mm prime lens, shallow depth of field, Vogue magazine style, 8k --ar 16:9');
      setSetupImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80');
      setSetupTitle('طريقة التصوير: استخدام عاكس فضي 45 درجة مع إضاءة خلفية');
      setResultImage('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80');
      setLens('85mm f/1.2');
      setLighting('ضوء خلفي مع عاكس فضي جانبي');
      setCameraAngle('مستوى العين مباشر');
      setCategory('بورتريه');
    } else if (sampleType === 'neon') {
      setTitle('تصوير الشوارع السينمائي في ليلة ممطرة');
      setDescription('الاستفادة من البرك المائية العاكسة على الأسفلت للحصول على تشبع لوني عالي مع أضواء لوحات النيون الإعلانية.');
      setPrompt('Cinematic cyberpunk street night, deep blue hour with vibrant magenta and cyan neon lights reflecting in wet pavement, rain droplets splashing on puddle, anamorphic lens flare, photorealistic --ar 16:9');
      setSetupImage('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80');
      setSetupTitle('طريقة التصوير: زاوية منخفضة جداً على بعد 10 سم من سطح الأرض');
      setResultImage('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80');
      setLens('35mm f/1.8');
      setLighting('أضواء نيون ليلية وانعكاسات مائية');
      setCameraAngle('زاوية أرضية منخفضة جداً');
      setCategory('سينمائي');
    } else {
      setTitle('تصوير المنتجات الدقيق مع قطرات الندى');
      setDescription('استخدام عدسة ماكرو مخصصة لتقريب أدق التفاصيل مع مشتت إضاءة دائري ناعم جداً بدون ظلال حادة.');
      setPrompt('Macro photography of a fresh dew drop on green leaf, crystal clear refraction of morning sky, delicate textures, soft diffusion ring lighting, f/2.8 macro lens, ultra-sharp detail --ar 1:1');
      setSetupImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80');
      setSetupTitle('طريقة التصوير: عدسة ماكرو مع حامل ثلاثي ومشتت ناعم');
      setResultImage('https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=1200&q=80');
      setLens('105mm Macro');
      setLighting('مشتت إضاءة ناعم Ring Diffuser');
      setCameraAngle('مستوى متوازي 90 درجة');
      setCategory('منتجات');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !prompt) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title,
      description,
      prompt,
      setupImage: setupImage || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      setupTitle: setupTitle || 'طريقة إعداد الكاميرا والإضاءة',
      resultImage: resultImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
      category,
      lens,
      lighting,
      cameraAngle,
      aspectRatio,
      createdAt: new Date().toISOString().split('T')[0],
      authorEmail: userEmail,
    };

    onAdd(newPost);
    onClose();
  };

  return (
    <div
      id="create-post-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="create-post-modal"
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl transition-all my-auto ${
          isBurgundy
            ? 'bg-[#2d0815] border-[#6b162f] text-rose-50 shadow-rose-950/60'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isBurgundy ? 'border-[#551025] bg-[#380b1b]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isBurgundy ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">إضافة عمل برومبت وطريقة تصوير جديدة</h2>
              <p className={`text-xs ${isBurgundy ? 'text-rose-300/80' : 'text-slate-500'}`}>
                بصفتك مصرح لك بالنشر ({userEmail})
              </p>
            </div>
          </div>

          <button
            id="btn-close-create-modal"
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isBurgundy
                ? 'text-rose-300 hover:text-white hover:bg-[#4d0f23]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="إغلاق نافذة الإضافة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div
          className={`px-6 py-2.5 text-xs flex flex-wrap items-center gap-2 border-b ${
            isBurgundy ? 'border-[#551025] bg-[#240611]' : 'border-slate-100 bg-slate-100/70'
          }`}
        >
          <span className="font-semibold opacity-80">تعبئة نموذج سريع جاهز:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('portrait')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              isBurgundy
                ? 'bg-[#3b091a] hover:bg-[#500c24] text-rose-200'
                : 'bg-white hover:bg-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            بورتريه أزياء
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('neon')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              isBurgundy
                ? 'bg-[#3b091a] hover:bg-[#500c24] text-rose-200'
                : 'bg-white hover:bg-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            سينمائي نيون
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('macro')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              isBurgundy
                ? 'bg-[#3b091a] hover:bg-[#500c24] text-rose-200'
                : 'bg-white hover:bg-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            تصوير ماكرو
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">
              عنوان الصورة والعمل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#1e050e] border-[#551025] text-rose-100 focus:border-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
              placeholder="مثال: لقطة استوديو سينمائية بإضاءة حافة..."
            />
          </div>

          {/* Setup vs Result Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setup Image */}
            <div
              className={`p-4 rounded-xl border ${
                isBurgundy ? 'bg-[#220610] border-[#501023]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-amber-500" />
                <label className="text-sm font-bold">صورة طريقة التصوير (الكواليس / الزاوية)</label>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-black/20 border border-black/10 flex items-center justify-center">
                {setupImage ? (
                  <img
                    src={setupImage}
                    alt="طريقة التصوير"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    ارفع صورة أو ضع رابطاً
                  </div>
                )}
              </div>

              <input
                type="url"
                value={setupImage}
                onChange={(e) => setSetupImage(e.target.value)}
                placeholder="رابط صورة الكواليس وطريقة التصوير (URL)"
                className={`w-full px-3 py-2 rounded-lg text-xs border mb-2 focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />

              <label
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-dashed transition-colors ${
                  isBurgundy
                    ? 'border-rose-500/40 hover:bg-rose-950/40 text-rose-300'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isUploadingSetup ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الرفع سحابياً...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>أو ارفع صورة من جهازك سحابياً</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingSetup}
                  onChange={(e) => handleFileUpload(e, 'setup')}
                  className="hidden"
                />
              </label>

              <div className="mt-3">
                <label className="block text-xs font-semibold mb-1 opacity-80">
                  شرح مختصر لزاوية التصوير أو التكنيك:
                </label>
                <input
                  type="text"
                  value={setupTitle}
                  onChange={(e) => setSetupTitle(e.target.value)}
                  placeholder="مثال: سوفت بوكس جانبي 45 درجة مع عاكس ذهبي"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                    isBurgundy
                      ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Result Image */}
            <div
              className={`p-4 rounded-xl border ${
                isBurgundy ? 'bg-[#220610] border-[#501023]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <label className="text-sm font-bold">الصورة الناتجة (بعد أخذ البرومبت)</label>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-black/20 border border-black/10 flex items-center justify-center">
                {resultImage ? (
                  <img
                    src={resultImage}
                    alt="الصورة الناتجة"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    ارفع صورة أو ضع رابطاً
                  </div>
                )}
              </div>

              <input
                type="url"
                value={resultImage}
                onChange={(e) => setResultImage(e.target.value)}
                placeholder="رابط الصورة الناتجة (URL)"
                className={`w-full px-3 py-2 rounded-lg text-xs border mb-2 focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />

              <label
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-dashed transition-colors ${
                  isBurgundy
                    ? 'border-rose-500/40 hover:bg-rose-950/40 text-rose-300'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isUploadingResult ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الرفع سحابياً...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>أو ارفع صورة من جهازك سحابياً</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingResult}
                  onChange={(e) => handleFileUpload(e, 'result')}
                  className="hidden"
                />
              </label>

              <div className="mt-3">
                <label className="block text-xs font-semibold mb-1.5 opacity-80">التصنيف:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['بورتريه', 'سينمائي', 'منتجات', 'طبيعة', 'فنون وتجريد'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        category === cat
                          ? isBurgundy
                            ? 'bg-[#f43f5e] border-[#f43f5e] text-white shadow-xs'
                            : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-xs'
                          : isBurgundy
                          ? 'bg-[#18040b] border-[#440d1e] text-rose-200/70 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cat === 'منتجات' ? 'تصوير منتجات' : cat === 'طبيعة' ? 'طبيعة ومناظر' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">
              الوصف والشرح <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#1e050e] border-[#551025] text-rose-100 focus:border-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
              placeholder="اكتب شرحاً لما تم إعداده في طريقة التصوير ولماذا تم اختيار هذا الأسلوب..."
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-bold mb-2">
              نص البرومبت (Prompt) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              dir="ltr"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl font-mono text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#18040b] border-[#551025] text-amber-200 focus:border-amber-400'
                  : 'bg-slate-900 border-slate-800 text-amber-300 focus:border-amber-500'
              }`}
              placeholder="e.g. Cinematic portrait, 85mm lens, rim lighting, 8k..."
            />
          </div>

          {/* Camera Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">العدسة (Lens)</label>
              <input
                type="text"
                value={lens}
                onChange={(e) => setLens(e.target.value)}
                placeholder="85mm f/1.4"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">الإضاءة (Lighting)</label>
              <input
                type="text"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                placeholder="Key Light + Softbox"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">زاوية الكاميرا (Angle)</label>
              <input
                type="text"
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                placeholder="مستوى العين Eye-Level"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">أبعاد الصورة (Ratio)</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                placeholder="16:9"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Submit */}
          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isBurgundy ? 'border-[#551025]' : 'border-slate-200'
            }`}
          >
            <button
              id="btn-cancel-create"
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isBurgundy
                  ? 'bg-[#430c1c] hover:bg-[#550f24] text-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              إلغاء
            </button>
            <button
              id="btn-submit-create"
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-900/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              نشر العمل في المعرض
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
