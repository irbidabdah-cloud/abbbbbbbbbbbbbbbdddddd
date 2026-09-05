import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Camera,
  Layers,
  Sliders,
  AlertCircle,
  BookOpen,
  Globe,
  ShieldCheck,
  Wrench,
  HelpCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Zap,
  Crown,
  Brain,
} from 'lucide-react';
import { ThemeMode, SupportTicket, checkIsAuthorized } from '../types';
import { PROTO_KNOWLEDGE_DICTIONARY, KnowledgeItem } from '../data/protoKnowledgeBase';
import {
  generateAutonomousProtoReply,
  getDispatchedReports,
  saveDispatchedReport,
  DispatchReport,
} from '../data/protoBrain';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  dispatchedReport?: DispatchReport;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  onClose: () => void;
  onOpenStartScreen?: () => void;
  userEmail?: string | null;
  userName?: string;
  tickets?: SupportTicket[];
  onSubmitTicket?: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  onUpdateTicketStatus?: (ticketId: string, status: SupportTicket['status']) => void;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Wrench,
    label: 'حل مشكلة عدم ظهور صور الكواليس',
    text: 'عندي مشكلة في صورة الكواليس بتطلع بيضاء بالمعرض، كيف أحلها وأتأكد من الرابط؟',
  },
  {
    icon: Copy,
    label: 'حل مشكلة نسخ البرومبت بالجوال',
    text: 'زر نسخ البرومبت ما عم يشتغل على متصفح الموبايل، شو هو الحل البديل؟',
  },
  {
    icon: Zap,
    label: 'إرسال بلاغ فني للدعم',
    text: 'يا بروتو، واجهتني مشكلة وأريد إرسال تقرير فني عاجل بها لفريق الدعم.',
  },
  {
    icon: Sparkles,
    label: 'سر إضاءة رمبرانت والفراشة للستوري 9:16',
    text: 'يا بروتو، اشرح لي بالتفصيل إضاءة رمبرانت (Rembrandt) وكيف أدمجها مع إضاءة الفراشة في برومبت ستوري 9:16؟',
  },
  {
    icon: Camera,
    label: 'أفضل عدسة لعزل البورتريه (85mm)',
    text: 'ما هي أفضل عدسة بعد بؤري (85mm f/1.4) وكاميرا هاسلبلاد في كتابة برومبت يحقق عزلاً ضبابياً مخملياً للبشرة؟',
  },
  {
    icon: Globe,
    label: 'ما هي فكرة منصة FacePrompt وميزاتها؟',
    text: 'اشرح لي فكرة منصة FacePrompt وكيف تفيد المصورين ومصممي البرومبتات بمقارنة الكواليس مع النتيجة؟',
  },
];

export function AiAssistantModal({
  isOpen,
  theme,
  onClose,
  userEmail = null,
  userName = 'مستخدم',
  tickets = [],
  onSubmitTicket,
  onUpdateTicketStatus,
}: AiAssistantModalProps) {
  const isBurgundy = theme === 'burgundy';
  const isAuthorized = checkIsAuthorized(userEmail);
  const [isCreatorIdentified, setIsCreatorIdentified] = useState(false);
  const effectiveIsAuthorized = isAuthorized || isCreatorIdentified;

  // View tabs: 'chat' | 'creator_liaison' | 'dictionary'
  const [activeTab, setActiveTab] = useState<'chat' | 'creator_liaison' | 'dictionary'>(
    isAuthorized ? 'creator_liaison' : 'chat'
  );
  const [dictCategory, setDictCategory] = useState<'lighting' | 'lenses' | 'engines' | 'platform'>('lighting');
  const [selectedKnowledgeItem, setSelectedKnowledgeItem] = useState<KnowledgeItem | null>(null);

  // Dispatched reports
  const [dispatchedReports, setDispatchedReports] = useState<DispatchReport[]>(() => getDispatchedReports());
  const [dispatchedSuccessNotice, setDispatchedSuccessNotice] = useState<string | null>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: isAuthorized
        ? `أهلاً بك! 👑✨

أنا **«بروتو | Proto AI»**. قمت بربط لوحة تحكم المشاكل وبلاغات الزوار الحية بقناة المتابعة السريعة.
• يمكنك مراجعة الشكاوى والبلاغات والتشخيص الذكي من تبويب *"سجل البلاغات"*.
• يمكنك سؤالي عن أحدث بلاغات الزوار، أو اختبار هندسة البرومبتات وقواميس إضاءات الاستوديو مباشرة.`
        : `أهلاً وسهلاً بك في **FacePrompt**! 👋
أنا **«بروتو | Proto AI»**، رفيقك ومساعدك الذكي في التصوير الفوتوغرافي وهندسة البرومبتات واستوديو الإضاءات.

جاهز نسولف ونبدع مع بعض بكل سلاسة:
• اطلب مني برومبت لأي مشهد ببالك (سيارات، أزياء، بورتريه، مأكولات، خيال علمي) بنسبة الستوري 9:16.
• اسألني عن أسرار إضاءات الاستوديو (Rembrandt, Butterfly, Rim Light)، أنواع العدسات والفيزياء البصرية.
• أو شاركني أي استفسار أو مشكلة تواجهك وسأساعدك في حلها فوراً!`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
      setDispatchedReports(getDispatchedReports());
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    // Switch to chat tab if in dictionary view
    if (activeTab === 'dictionary') {
      setActiveTab('chat');
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);
    const startTime = Date.now();

    const isClaimingCreator =
      text.includes('عبد الرحمن') ||
      text.includes('عبدالرحمن') ||
      text.includes('المطور') ||
      text.includes('صاحب الموقع') ||
      text.includes('qudiqudi');

    if (isClaimingCreator && !isCreatorIdentified) {
      setIsCreatorIdentified(true);
    }

    const currentCreatorStatus = effectiveIsAuthorized || isClaimingCreator;

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-8)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.text,
        }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userMessage: text,
          userName: currentCreatorStatus ? 'Abdalrhmn ebdah (المطور)' : userName,
          userEmail: currentCreatorStatus ? 'qudiqudi164@gmail.com' : userEmail,
          isCreatorOrAdmin: currentCreatorStatus,
          activeTickets: tickets,
        }),
      });

      let reply = '';
      let dispatched: DispatchReport | undefined;

      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
        dispatched = data.dispatchedReport;
      } else {
        // Fallback directly to client-side autonomous engine
        const fallbackRes = generateAutonomousProtoReply({
          userMessage: text,
          history: historyPayload,
          userName: currentCreatorStatus ? 'Abdalrhmn ebdah (المطور)' : userName,
          userEmail: currentCreatorStatus ? 'qudiqudi164@gmail.com' : userEmail,
          isCreatorOrAdmin: currentCreatorStatus,
          activeTickets: tickets,
        });
        reply = fallbackRes.reply;
        dispatched = fallbackRes.dispatchedReport;
      }

      if (dispatched) {
        setDispatchedReports((prev) => [dispatched!, ...prev.filter((r) => r.id !== dispatched!.id)]);
        // If ticket submit prop is available, submit to tickets store
        if (onSubmitTicket) {
          onSubmitTicket({
            senderName: dispatched.senderName,
            senderEmail: dispatched.senderEmail,
            targetAgent: 'عبد الرحمن',
            category: 'issue',
            subject: dispatched.subject,
            message: `${dispatched.userMessage}\n\n[تشخيص بروتو الذكي]: ${dispatched.aiDiagnosis}\n[الحل المقترح]: ${dispatched.suggestedSolution}`,
            status: 'new',
          });
        }
      }

      // Natural deliberate AI thinking window (requested by creator)
      const elapsed = Date.now() - startTime;
      const minThinkingTime = 1350;
      if (elapsed < minThinkingTime) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingTime - elapsed));
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
        timestamp: new Date(),
        dispatchedReport: dispatched,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Network issue, invoking local autonomous engine:', err);
      // Seamless offline fallback
      const localResult = generateAutonomousProtoReply({
        userMessage: text,
        history: messages.map((m) => ({ role: m.role, content: m.text })),
        userName,
        userEmail,
        isCreatorOrAdmin: isAuthorized,
        activeTickets: tickets,
      });

      if (localResult.dispatchedReport) {
        setDispatchedReports((prev) => [
          localResult.dispatchedReport!,
          ...prev.filter((r) => r.id !== localResult.dispatchedReport!.id),
        ]);
        if (onSubmitTicket) {
          onSubmitTicket({
            senderName: localResult.dispatchedReport.senderName,
            senderEmail: localResult.dispatchedReport.senderEmail,
            targetAgent: 'عبد الرحمن',
            category: 'issue',
            subject: localResult.dispatchedReport.subject,
            message: `${localResult.dispatchedReport.userMessage}\n\n[تشخيص بروتو]: ${localResult.dispatchedReport.aiDiagnosis}`,
            status: 'new',
          });
        }
      }

      const elapsed = Date.now() - startTime;
      const minThinkingTime = 1350;
      if (elapsed < minThinkingTime) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingTime - elapsed));
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: localResult.reply,
        timestamp: new Date(),
        dispatchedReport: localResult.dispatchedReport,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualDispatchReport = (msgText: string) => {
    const report: DispatchReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderName: userName || 'زائر FacePrompt',
      senderEmail: userEmail || 'visitor@faceprompt.ai',
      subject: `[بلاغ بروتو يدوي] مشكلة أبلغ عنها الزائر`,
      userMessage: msgText,
      aiDiagnosis: 'تم رفع البلاغ مباشرة من واجهة محادثة بروتو للمطور عبد الرحمن وفريق الدعم.',
      suggestedSolution: 'مراجعة بيانات المستخدم والتواصل معه عبر البريد أو تحديث المعرض.',
      urgency: 'high',
      timestamp: new Date().toISOString(),
    };

    saveDispatchedReport(report);
    setDispatchedReports((prev) => [report, ...prev]);

    if (onSubmitTicket) {
      onSubmitTicket({
        senderName: report.senderName,
        senderEmail: report.senderEmail,
        targetAgent: 'عبد الرحمن',
        category: 'issue',
        subject: report.subject,
        message: `${report.userMessage}\n\n[بلاغ بروتو الذكي المحول للمطور]`,
        status: 'new',
      });
    }

    setDispatchedSuccessNotice(`تم توثيق البلاغ الفني بنجاح في سجل الدعم برقم: #${report.id.slice(-6).toUpperCase()}!`);
    setTimeout(() => setDispatchedSuccessNotice(null), 5000);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'تم بدء محادثة جديدة مع **بروتو (Proto)**. اسألني عن أي مشكلة أو إضاءة أو عدسة أو ميزة في FacePrompt وسأساعدك فوراً!',
        timestamp: new Date(),
      },
    ]);
  };

  // Helper to render formatted message content with code blocks and bold text
  const renderFormattedText = (rawText: string, msgId: string) => {
    const codeBlockRegex = /```(?:text|json|bash|)(\n[\s\S]*?\n)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: rawText.substring(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        content: match[1].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < rawText.length) {
      parts.push({
        type: 'text',
        content: rawText.substring(lastIndex),
      });
    }

    return (
      <div className="space-y-3">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            const blockId = `${msgId}-code-${idx}`;
            return (
              <div key={idx} className="relative group/code my-2.5">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-black/80 text-rose-300 text-[11px] font-mono border-b border-rose-500/20">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    برومبت جاهز للنسخ والتوليد (9:16)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(blockId, part.content)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500 text-white transition-all cursor-pointer text-[10px] font-bold"
                  >
                    {copiedId === blockId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>نسخ البرومبت</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-b-xl bg-black/90 text-rose-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed select-all border border-rose-500/30">
                  {part.content}
                </pre>
              </div>
            );
          }

          // Format normal markdown text
          const paragraphs = part.content.split('\n');
          return (
            <div key={idx} className="space-y-2 leading-relaxed">
              {paragraphs.map((line, lineIdx) => {
                if (!line.trim()) return <div key={lineIdx} className="h-1" />;

                const boldRegex = /\*\*(.*?)\*\*/g;
                const formattedSegments = [];
                let pLast = 0;
                let pMatch;

                while ((pMatch = boldRegex.exec(line)) !== null) {
                  if (pMatch.index > pLast) {
                    formattedSegments.push(line.substring(pLast, pMatch.index));
                  }
                  formattedSegments.push(
                    <strong key={`${lineIdx}-${pMatch.index}`} className="font-extrabold text-rose-400">
                      {pMatch[1]}
                    </strong>
                  );
                  pLast = pMatch.index + pMatch[0].length;
                }
                if (pLast < line.length) {
                  formattedSegments.push(line.substring(pLast));
                }

                const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
                return (
                  <p key={lineIdx} className={isBullet ? 'pr-2 flex items-start gap-1.5' : ''}>
                    {isBullet && <span className="text-rose-500 font-bold shrink-0">•</span>}
                    <span>{formattedSegments.length > 0 ? formattedSegments : line}</span>
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const filteredDictionary = PROTO_KNOWLEDGE_DICTIONARY.filter(
    (item) => item.category === dictCategory
  );

  // Tickets combined with dispatched reports
  const allIssuesAndReports = [
    ...dispatchedReports,
    ...tickets
      .filter((t) => t.category === 'issue' || t.subject.includes('بروتو'))
      .map((t) => ({
        id: t.id,
        senderName: t.senderName,
        senderEmail: t.senderEmail,
        subject: t.subject,
        userMessage: t.message,
        aiDiagnosis: 'بلاغ وارد عبر خدمة العملاء/الموقع، تم تحليله في مكتب الدعم.',
        suggestedSolution: 'الرد على المستخدم أو تحديث حالة التذكرة من لوحة الدعم.',
        urgency: 'high' as const,
        timestamp: t.createdAt,
      })),
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl h-[90vh] max-h-[800px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isBurgundy
            ? 'bg-[#140409] border-[#4a121e] text-[#fce7f3] shadow-rose-950/80'
            : 'bg-[#faf8f5] border-[#e7e5e4] text-[#1c1917] shadow-2xl'
        }`}
      >
        {/* TOP HEADER */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between shrink-0 ${
            isBurgundy ? 'bg-[#1f070f]/95 border-[#4a121e]' : 'bg-white/95 border-[#e7e5e4]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg relative ${
                isBurgundy
                  ? 'bg-gradient-to-br from-rose-500 to-rose-900 text-white'
                  : 'bg-gradient-to-br from-[#6b0f24] to-[#9f1239] text-white'
              }`}
            >
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#140409]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  بروتو | Proto AI
                </h3>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                  ذكاء فوتوغرافي متقدم
                </span>
              </div>
              <p className="text-[11px] sm:text-xs opacity-75 flex items-center gap-1">
                <span>منصة FacePrompt</span>
                <span>•</span>
                <span className="font-semibold text-rose-400">استوديو الإضاءة والبرومبتات</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle: Chat vs Support Reports vs Knowledge Dictionaries */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isBurgundy ? 'bg-[#140409] border-[#4a121e]' : 'bg-stone-100 border-[#e5e2de]'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? isBurgundy
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[#6b0f24] text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                المحادثة
              </button>

              {/* Support & Reports Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('creator_liaison')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'creator_liaison'
                    ? isBurgundy
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#6b0f24] text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100 text-amber-500'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>سجل البلاغات والدعم</span>
                {allIssuesAndReports.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {allIssuesAndReports.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dictionary')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'dictionary'
                    ? isBurgundy
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[#6b0f24] text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>قواميس بروتو</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              title="مسح المحادثة وبدء محادثة جديدة"
              className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-rose-500/15 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-rose-500/15 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNER IF DISPATCHED */}
        {dispatchedSuccessNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-fadeIn shrink-0">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {dispatchedSuccessNotice}
            </span>
            <button
              type="button"
              onClick={() => setDispatchedSuccessNotice(null)}
              className="p-1 hover:bg-emerald-700 rounded-sm cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: CHAT VIEW */}
        {activeTab === 'chat' && (
          <>
            {/* Quick Suggestion Pills */}
            <div
              className={`px-4 py-2 border-b overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar ${
                isBurgundy ? 'bg-[#18050c] border-[#360d16]' : 'bg-white/70 border-[#eceae7]'
              }`}
            >
              <span className="text-[11px] font-bold opacity-70 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500 animate-pulse" />
                حل المشاكل واستفسارات سريعة:
              </span>
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.text)}
                  disabled={isLoading}
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isBurgundy
                      ? 'bg-[#240a13] border-[#4a121e] text-rose-200 hover:bg-rose-900/40 hover:border-rose-500'
                      : 'bg-white border-[#e2dfdb] text-stone-700 hover:border-[#6b0f24] hover:text-[#6b0f24] shadow-2xs'
                  }`}
                >
                  <item.icon className="w-3 h-3 text-rose-500" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 sm:gap-3 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        isUser
                          ? isBurgundy
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#6b0f24] text-white'
                          : isBurgundy
                          ? 'bg-[#2c0b15] border border-[#5a1626] text-rose-300'
                          : 'bg-white border border-[#e5e3df] text-[#6b0f24]'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`group relative max-w-[90%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? isBurgundy
                            ? 'bg-rose-600 text-white rounded-tr-none font-medium'
                            : 'bg-[#6b0f24] text-white rounded-tr-none font-medium'
                          : isBurgundy
                          ? 'bg-[#1d0710] border border-[#48121f] text-rose-50 rounded-tl-none'
                          : 'bg-white border border-[#e5e3df] text-stone-800 rounded-tl-none'
                      }`}
                    >
                      {/* Formatted Content */}
                      {renderFormattedText(msg.text, msg.id)}

                      {/* If Bot detected or generated a dispatched report */}
                      {!isUser && msg.dispatchedReport && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            تم توثيق البلاغ الفني في سجل الدعم بنجاح
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('creator_liaison')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[10px] font-extrabold hover:bg-amber-400 cursor-pointer"
                          >
                            عرض البلاغات
                          </button>
                        </div>
                      )}

                      {/* Bottom Tools for Bot Messages */}
                      {!isUser && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-75">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-rose-400">Proto AI Assistant</span>
                            <button
                              type="button"
                              onClick={() => handleManualDispatchReport(msg.text)}
                              title="توثيق بلاغ فني بالاستفسار"
                              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Zap className="w-3 h-3" />
                              <span>توثيق بلاغ فني</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            title="نسخ النص كاملاً"
                            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/15 cursor-pointer transition-all"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ الإجابة'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator with deliberate AI reasoning animation */}
              {isLoading && (
                <div className="flex items-start gap-2.5 sm:gap-3 animate-fadeIn">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isBurgundy
                        ? 'bg-[#2c0b15] border border-[#5a1626] text-rose-300'
                        : 'bg-white border border-[#e5e3df] text-[#6b0f24]'
                    }`}
                  >
                    <Brain className="w-4 h-4 text-rose-500 animate-pulse" />
                  </div>
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm rounded-tl-none flex items-center gap-2 border shadow-sm ${
                      isBurgundy
                        ? 'bg-[#1d0710] border-[#48121f] text-rose-200'
                        : 'bg-white border-[#e5e3df] text-stone-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span className="font-medium">بروتو يفكر ويحلل الأبعاد البصرية ويصيغ الإجابة بدقة...</span>
                    <span className="inline-flex gap-1 mr-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              className={`p-3 sm:p-4 border-t shrink-0 ${
                isBurgundy ? 'bg-[#1a050d] border-[#360d16]' : 'bg-white border-[#eceae7]'
              }`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="اسأل بروتو عن أي مشكلة بالموقع، أو إضاءة وتركيب كاميرا، أو برومبت ستوري 9:16..."
                    disabled={isLoading}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm border focus:outline-hidden transition-all ${
                      isBurgundy
                        ? 'bg-[#120308] border-[#48121f] text-[#fce7f3] placeholder-rose-900 focus:border-rose-500'
                        : 'bg-[#faf8f5] border-[#e5e2de] text-stone-900 placeholder-stone-400 focus:border-[#6b0f24]'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2.5 sm:p-3 rounded-2xl font-bold flex items-center justify-center transition-all shadow-md cursor-pointer ${
                    inputValue.trim() && !isLoading
                      ? isBurgundy
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-[#6b0f24] hover:bg-[#83142d] text-white'
                      : 'opacity-40 cursor-not-allowed bg-stone-300 text-stone-500'
                  }`}
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* TAB 2: CREATOR LIAISON & DISPATCH REPORTS VIEW (صلة وصل بروتو مع المطور عبد الرحمن) */}
        {activeTab === 'creator_liaison' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Hero Creator Header */}
            <div
              className={`p-5 rounded-3xl border relative overflow-hidden shadow-lg ${
                isBurgundy
                  ? 'bg-gradient-to-br from-[#2c0b16] via-[#1a050e] to-[#120308] border-amber-500/30 text-rose-100'
                  : 'bg-gradient-to-br from-[#fffdfa] via-[#fef7ee] to-[#faf5ee] border-amber-400/40 text-stone-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black shadow-md shrink-0">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black tracking-tight">
                        سجل البلاغات والتقارير الفنية الذكية
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                        مباشر ومحمي
                      </span>
                    </div>
                    <p className="text-xs opacity-85 mt-1 leading-relaxed">
                      هنا يرصد بروتو كافة المشاكل والشكاوى التي واجهها الزوار في المعرض أو خدمة العملاء،
                      ويقوم بتشخيص الخلل الفني واقتراح الحلول الفورية لفريق المنصة.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSendMessage('يا بروتو، لخص لي بشكل تحليلي دقيق كافة المشاكل والشكاوى المفتوحة والحلول المقترحة لها؟');
                    setActiveTab('chat');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>طلب تقرير تحليلي فوري من بروتو</span>
                </button>
              </div>
            </div>

            {/* Quick Developer Command Chips */}
            <div>
              <h5 className="text-xs font-black mb-2.5 opacity-80 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                محادثة واستشارات فنية سريعة مع بروتو:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  {
                    title: '📊 ملخص شكاوى الزوار اليوم',
                    q: 'يا بروتو، لخص لي الشكاوى والمشاكل التي واجهت الزوار في الموقع وقدم لي أولويات الحل.',
                  },
                  {
                    title: '🛠️ حل مشاكل الصور وروابط المعرض',
                    q: 'كيف نمنع ظهور الصور البيضاء الناتجة عن روابط غير مباشرة أو قيود CORS؟',
                  },
                  {
                    title: '⚡ فحص سلامة نظام الستوري 9:16',
                    q: 'افحص لي حالة نظام المعرض ونسبة الستوري 9:16 وأخبرني بأي تحسينات مقترحة.',
                  },
                  {
                    title: '💡 اقتراحات لتجربة المستخدم (UX)',
                    q: 'ما هي الميزات الجديدة التي يقترحها بروتو لتطوير منصة FacePrompt وجعلها أكثر إبهاراً؟',
                  },
                  {
                    title: '🔑 فحص أمان الحسابات الإدارية الـ 5',
                    q: 'لخص لي الحسابات المصرحة الـ 5 وصلاحياتها الإدارية وقاعدة يوزر نيم admin.',
                  },
                  {
                    title: '🌐 حالة الـ 25 لغة والمزامنة السحابية',
                    q: 'هل تعمل مزامنة Firestore ونظام اللغات والاتجاهات RTL/LTR بشكل سليم؟',
                  },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleSendMessage(chip.q);
                      setActiveTab('chat');
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isBurgundy
                        ? 'bg-[#1b060f] border-[#3e101c] hover:border-amber-500 hover:bg-[#260915]'
                        : 'bg-white border-[#e5e2de] hover:border-amber-500 hover:shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-black text-amber-500 mb-1">{chip.title}</span>
                    <span className="text-[11px] opacity-75 line-clamp-2">{chip.q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Feed: Dispatched Reports & Customer Complaints */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-black opacity-90 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>تقارير المشاكل والشكاوى المحولة من المستخدمين ({allIssuesAndReports.length}):</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setDispatchedReports(getDispatchedReports())}
                  className="text-[11px] font-bold opacity-75 hover:opacity-100 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>تحديث البلاغات</span>
                </button>
              </div>

              {allIssuesAndReports.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed opacity-75 text-xs">
                  لا توجد بلاغات مشاكل حالية معلقة. المنصة تعمل بكفاءة تامة!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {allIssuesAndReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isBurgundy
                          ? 'bg-[#1b060f] border-[#44111f]'
                          : 'bg-white border-[#e7e5e4] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-rose-500">
                              {report.subject}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                report.urgency === 'high' || report.urgency === 'critical'
                                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                              }`}
                            >
                              {report.urgency === 'high' || report.urgency === 'critical'
                                ? 'عاجل'
                                : 'متوسط'}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-70 mt-0.5">
                            المُرسل: <strong className="text-amber-400">{report.senderName}</strong> ({report.senderEmail}) •{' '}
                            {new Date(report.timestamp).toLocaleString('ar')}
                          </p>
                        </div>

                        {onUpdateTicketStatus && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateTicketStatus(report.id, 'resolved');
                              setDispatchedReports((prev) => prev.filter((r) => r.id !== report.id));
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                          >
                            حل المشكلة
                          </button>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-xs mb-3">
                        <strong className="text-rose-400 block mb-1">نص الشكوى / البلاغ:</strong>
                        <p className="opacity-90">{report.userMessage}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <strong className="text-rose-400 block mb-1 flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5" />
                            تشخيص بروتو للخلل:
                          </strong>
                          <p className="opacity-85 leading-relaxed">{report.aiDiagnosis}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <strong className="text-amber-400 block mb-1 flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5" />
                            الحل المقترح للمطور:
                          </strong>
                          <p className="opacity-85 leading-relaxed">{report.suggestedSolution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ENCYCLOPEDIC DICTIONARIES VIEW */}
        {activeTab === 'dictionary' && (
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
            {/* Sidebar Categories */}
            <div
              className={`w-full md:w-56 p-3 md:p-4 border-b md:border-b-0 md:border-l shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible ${
                isBurgundy ? 'bg-[#18050d] border-[#360d16]' : 'bg-[#f4f2ee] border-[#e7e4df]'
              }`}
            >
              {[
                { id: 'lighting', label: 'إضاءات الاستوديو', icon: Sparkles, count: 6 },
                { id: 'lenses', label: 'العدسات والكاميرات', icon: Camera, count: 5 },
                { id: 'engines', label: 'أوامر ومحركات الذكاء', icon: Sliders, count: 3 },
                { id: 'platform', label: 'دليل وحلول FacePrompt', icon: Layers, count: 6 },
              ].map((cat) => {
                const isActive = dictCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setDictCategory(cat.id as any);
                      setSelectedKnowledgeItem(null);
                    }}
                    className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? isBurgundy
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-[#6b0f24] text-white shadow-xs'
                        : isBurgundy
                        ? 'hover:bg-[#250914] text-rose-200'
                        : 'hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Main Dictionary Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredDictionary.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedKnowledgeItem(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isBurgundy
                        ? 'bg-[#1e0711] border-[#48121f] hover:border-rose-500 hover:bg-[#250915]'
                        : 'bg-white border-[#e5e2de] hover:border-[#6b0f24] hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-rose-500">{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                          {item.arabicTitle}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-85 mb-3">{item.shortDesc}</p>
                    </div>

                    <div className="pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-400">عرض التفاصيل والبرومبت</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendMessage(
                            `يا بروتو، اشرح لي بالتفصيل مفهوم: ${item.title} (${item.arabicTitle}) واصنع لي برومبت ستوري 9:16 احترافي يطبقه!`
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 font-bold transition-all cursor-pointer"
                      >
                        اسأل بروتو عنه
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Item Detail Modal / Expanded Card */}
              {selectedKnowledgeItem && (
                <div
                  className={`mt-4 p-5 rounded-2xl border shadow-xl ${
                    isBurgundy
                      ? 'bg-[#290a16] border-rose-500/40 text-rose-100'
                      : 'bg-white border-[#6b0f24]/30 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      <h4 className="text-sm font-black">
                        {selectedKnowledgeItem.title} - {selectedKnowledgeItem.arabicTitle}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedKnowledgeItem(null)}
                      className="p-1 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs leading-relaxed mb-4 opacity-90 whitespace-pre-line">
                    {selectedKnowledgeItem.details}
                  </p>

                  {selectedKnowledgeItem.recommendedPrompt && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-rose-400">
                        <span>البرومبت المقترح لتطبيق هذا النمط:</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              `dict-${selectedKnowledgeItem.id}`,
                              selectedKnowledgeItem.recommendedPrompt || ''
                            )
                          }
                          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        >
                          {copiedId === `dict-${selectedKnowledgeItem.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>نسخ البرومبت</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/70 text-rose-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap select-all border border-rose-500/20">
                        {selectedKnowledgeItem.recommendedPrompt}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleSendMessage(
                          `يا بروتو، اشرح لي بالتفصيل مفهوم: ${selectedKnowledgeItem.title} (${selectedKnowledgeItem.arabicTitle}) واصنع لي برومبت ستوري 9:16 احترافي يطبقه!`
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>بدء استفسار مع بروتو حول هذا الموضوع</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
