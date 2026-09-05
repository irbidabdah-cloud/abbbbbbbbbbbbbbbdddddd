import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  X,
  Send,
  CheckCircle2,
  Inbox,
  Clock,
  ShieldCheck,
  Mail,
  MessageSquare,
  AlertCircle,
  Tag,
  Trash2,
  Reply,
  Sparkles,
  Wrench,
  Lightbulb,
  FileQuestion,
  Layers,
  UserCheck,
} from 'lucide-react';
import { ThemeMode, SupportTicket, ADMIN_EMAILS, checkIsAuthorized, SUPPORT_AGENTS, SupportAgent } from '../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  userEmail: string | null;
  userName: string;
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  onUpdateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  onDeleteTicket?: (ticketId: string) => void;
  onReplyTicket?: (ticketId: string, replyText: string, agentName?: string) => void;
}

const CATEGORY_OPTIONS: {
  id: SupportTicket['category'];
  label: string;
  desc: string;
  icon: typeof HelpCircle;
  badgeColor: string;
}[] = [
  {
    id: 'issue',
    label: 'مشكلة تقنية',
    desc: 'خلل بالموقع أو خطأ برومبت',
    icon: Wrench,
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'question',
    label: 'استفسار عام',
    desc: 'سؤال حول المنصة والتوليد',
    icon: FileQuestion,
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'suggestion',
    label: 'اقتراح وتطوير',
    desc: 'فكرة لتحسين تجربة الاستخدام',
    icon: Lightbulb,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'prompt_request',
    label: 'طلب برومبت مخصص',
    desc: 'جلسة أو كواليس تصوير خاصة',
    icon: Sparkles,
    badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'other',
    label: 'موضوع آخر',
    desc: 'أي استفسار أو مراسلة أخرى',
    icon: MessageSquare,
    badgeColor: 'text-stone-500 bg-stone-500/10 border-stone-500/20',
  },
];

export function CustomerSupportModal({
  isOpen,
  onClose,
  theme,
  userEmail,
  userName,
  tickets,
  onSubmitTicket,
  onUpdateTicketStatus,
  onDeleteTicket,
  onReplyTicket,
}: CustomerSupportModalProps) {
  const isBurgundy = theme === 'burgundy';
  const isAuthorized = checkIsAuthorized(userEmail);

  // Active view for admins: 'create' | 'inbox'
  const [activeTab, setActiveTab] = useState<'create' | 'inbox'>(
    isAuthorized && tickets.length > 0 ? 'inbox' : 'create'
  );

  // Form State (Default senderName empty as requested)
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState(userEmail || '');
  const [targetAgent, setTargetAgent] = useState<string>('عبد الرحمن');
  const [category, setCategory] = useState<SupportTicket['category']>('issue');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Admin reply state
  const [selectedAgent, setSelectedAgent] = useState<SupportAgent>('عبد الرحمن');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [selectedTicketFilter, setSelectedTicketFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = senderEmail.trim();
    const cleanSubject = subject.trim();
    const cleanMsg = message.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح للتواصل معك');
      return;
    }

    if (!cleanSubject) {
      setErrorMsg('يرجى كتابة عنوان للمشكلة أو الاستفسار');
      return;
    }

    if (!cleanMsg) {
      setErrorMsg('يرجى كتابة تفاصيل المشكلة');
      return;
    }

    onSubmitTicket({
      senderName: senderName.trim() || 'مستخدم المنصة',
      senderEmail: cleanEmail,
      targetAgent: targetAgent || 'الفريق ككل',
      category,
      subject: cleanSubject,
      message: cleanMsg,
      status: 'new',
    });

    setIsSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setIsSubmitted(false);
      if (isAuthorized) {
        setActiveTab('inbox');
      } else {
        onClose();
      }
    }, 2000);
  };

  const handleSendReply = (ticketId: string) => {
    const text = (replyTextMap[ticketId] || '').trim();
    if (!text) return;
    if (onReplyTicket) {
      onReplyTicket(ticketId, text, selectedAgent);
      setReplyTextMap((prev) => ({ ...prev, [ticketId]: '' }));
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedTicketFilter === 'all') return true;
    return t.status === selectedTicketFilter;
  });

  const newTicketsCount = tickets.filter((t) => t.status === 'new').length;

  const adminEmailListStr = ADMIN_EMAILS.join(',');
  const directMailtoUrl = `mailto:${adminEmailListStr}?subject=${encodeURIComponent(
    `[FacePrompt Support] ${subject || 'طلب دعم فني'}`
  )}&body=${encodeURIComponent(`الاسم: ${senderName}\nالبريد: ${senderEmail}\n\nالتفاصيل:\n${message}`)}`;

  return (
    <div
      id="customer-support-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        id="customer-support-modal"
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl transition-all border ${
          isBurgundy
            ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] shadow-rose-950/70'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
                isBurgundy
                  ? 'bg-[#240611] border-[#581827] text-[#f43f5e]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
              }`}
            >
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl">خدمة العملاء والدعم الفني</h3>
                {isAuthorized && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    أدمن المنصة
                  </span>
                )}
              </div>
              <p className={`text-xs ${isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'}`}>
                فريق الدعم الفني: (عبد الرحمن، زيد، خالد، محمد) • استجابة سريعة على مدار الساعة
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-support-modal-btn"
            onClick={onClose}
            className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
              isBurgundy
                ? 'border-[#581827] bg-[#15040a] text-[#fce7f3] hover:text-[#f43f5e]'
                : 'border-[#e7e5e4] bg-[#f9f6ef] text-[#1c1917] hover:text-[#6b0f24]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch for Authorized Admins */}
        {isAuthorized && (
          <div className="flex items-center gap-2 mb-5 p-1 rounded-2xl border border-inherit">
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? isBurgundy
                    ? 'bg-[#f43f5e] text-white'
                    : 'bg-[#6b0f24] text-white'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>صندوق رسائل المستخدمين</span>
              {newTicketsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">
                  {newTicketsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? isBurgundy
                    ? 'bg-[#f43f5e] text-white'
                    : 'bg-[#6b0f24] text-white'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>إرسال طلب جديد</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: INBOX FOR ADMINS (5 LINKED GOOGLE ACCOUNTS)                       */}
        {/* ========================================================================= */}
        {isAuthorized && activeTab === 'inbox' ? (
          <div className="flex flex-col gap-4">
            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'new', 'in_progress', 'resolved'] as const).map((filter) => {
                  const labels = {
                    all: 'الكل',
                    new: 'جديدة',
                    in_progress: 'قيد المعالجة',
                    resolved: 'تم الحل',
                  };
                  const count =
                    filter === 'all'
                      ? tickets.length
                      : tickets.filter((t) => t.status === filter).length;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedTicketFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        selectedTicketFilter === filter
                          ? isBurgundy
                            ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                            : 'bg-[#6b0f24] border-[#6b0f24] text-white'
                          : isBurgundy
                          ? 'border-[#581827] bg-[#15040a] text-[#fda4af]'
                          : 'border-[#e7e5e4] bg-[#f9f6ef] text-[#78716c]'
                      }`}
                    >
                      {labels[filter]} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] opacity-70 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>حسابات الأدمن الخمسة متزامنة</span>
              </div>
            </div>

            {/* Tickets List */}
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center opacity-60">
                <Inbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">لا توجد رسائل دعم فني في هذا القسم حالياً</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTickets.map((ticket) => {
                  const statusColors = {
                    new: isBurgundy ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' : 'bg-amber-50 text-amber-800 border-amber-200',
                    in_progress: isBurgundy ? 'bg-blue-950/40 text-blue-300 border-blue-500/40' : 'bg-blue-50 text-blue-800 border-blue-200',
                    resolved: isBurgundy ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  };

                  const categoryNames = {
                    issue: 'مشكلة تقنية',
                    question: 'استفسار عام',
                    suggestion: 'اقتراح وتطوير',
                    prompt_request: 'طلب برومبت خاص',
                    other: 'أخرى',
                  };

                  return (
                    <div
                      key={ticket.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isBurgundy
                          ? 'bg-[#15040a] border-[#3b101c]'
                          : 'bg-[#faf8f5] border-[#e7e5e4]'
                      }`}
                    >
                      {/* Ticket Top Info */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-extrabold text-sm sm:text-base">
                              {ticket.subject}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[ticket.status]}`}>
                              {ticket.status === 'new' ? 'جديد' : ticket.status === 'in_progress' ? 'قيد المتابعة' : 'تم الحل'}
                            </span>
                            <span className="text-[10px] font-medium opacity-60">
                              {categoryNames[ticket.category] || ticket.category}
                            </span>
                            {ticket.targetAgent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-500/10 text-rose-500 border-rose-500/20 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                <span>موجه إلى: {ticket.targetAgent}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs opacity-75 flex items-center gap-2">
                            <span className="font-bold">{ticket.senderName}</span>
                            <span>•</span>
                            <a
                              href={`mailto:${ticket.senderEmail}`}
                              className="text-rose-500 hover:underline font-mono text-[11px]"
                            >
                              {ticket.senderEmail}
                            </a>
                            <span>•</span>
                            <span className="text-[10px] opacity-60">
                              {new Date(ticket.createdAt).toLocaleString('ar-EG')}
                            </span>
                          </div>
                        </div>

                        {/* Status Change Interactive Buttons / Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          <div
                            className={`flex items-center p-0.5 rounded-lg border text-[11px] font-bold ${
                              isBurgundy
                                ? 'bg-[#15040a] border-[#3b101c]'
                                : 'bg-[#f5f2eb] border-[#e7e5e4]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => onUpdateTicketStatus(ticket.id, 'new')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                ticket.status === 'new'
                                  ? 'bg-amber-500 text-black font-black shadow-xs'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              title="تعيين كجديد"
                            >
                              جديد
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateTicketStatus(ticket.id, 'in_progress')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                ticket.status === 'in_progress'
                                  ? 'bg-blue-600 text-white font-black shadow-xs'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              title="قيد المتابعة"
                            >
                              متابعة
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateTicketStatus(ticket.id, 'resolved')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                ticket.status === 'resolved'
                                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              title="تم الحل"
                            >
                              محلول
                            </button>
                          </div>

                          {onDeleteTicket && (
                            <button
                              type="button"
                              onClick={() => onDeleteTicket(ticket.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 cursor-pointer"
                              title="حذف التذكرة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Message Body */}
                      <p className="text-xs sm:text-sm leading-relaxed p-3 rounded-xl bg-black/10 my-2 whitespace-pre-wrap">
                        {ticket.message}
                      </p>

                      {/* Replies List */}
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="flex flex-col gap-2 my-2.5 pl-4 border-r-2 border-rose-500/40">
                          {ticket.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className={`p-2.5 rounded-xl text-xs ${
                                isBurgundy ? 'bg-[#240611]' : 'bg-white border border-[#e7e5e4]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold opacity-90 mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-extrabold ${isBurgundy ? 'text-rose-400' : 'text-[#6b0f24]'}`}>
                                    {rep.sender}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold">
                                    فريق الدعم الفني
                                  </span>
                                </div>
                                <span className="opacity-60">{new Date(rep.createdAt).toLocaleTimeString('ar-EG')}</span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-wrap">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Box with Support Agent Selector */}
                      {onReplyTicket && (
                        <div className="flex flex-col gap-2 mt-3 pt-2.5 border-t border-inherit">
                          {/* Agent Picker */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold opacity-75 flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span>الرد باسم العضو:</span>
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                              {SUPPORT_AGENTS.map((agent) => (
                                <button
                                  key={agent}
                                  type="button"
                                  onClick={() => setSelectedAgent(agent)}
                                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                    selectedAgent === agent
                                      ? isBurgundy
                                        ? 'bg-[#f43f5e] border-[#f43f5e] text-white shadow-xs'
                                        : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-xs'
                                      : isBurgundy
                                      ? 'bg-[#15040a] border-[#3b101c] text-[#fda4af] hover:border-[#581827]'
                                      : 'bg-white border-[#e7e5e4] text-[#1c1917] hover:border-slate-300'
                                  }`}
                                >
                                  {agent}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Reply Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`اكتب ردك للعميل بصفتك (${selectedAgent})...`}
                              value={replyTextMap[ticket.id] || ''}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(ticket.id);
                              }}
                              className={`flex-1 h-8.5 px-3 rounded-xl text-xs border ${
                                isBurgundy
                                  ? 'bg-[#1e070e] border-[#581827] text-white'
                                  : 'bg-white border-[#e7e5e4] text-black'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => handleSendReply(ticket.id)}
                              className={`h-8.5 px-3.5 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                                isBurgundy ? 'bg-[#f43f5e]' : 'bg-[#6b0f24]'
                              }`}
                            >
                              <Reply className="w-3.5 h-3.5" />
                              <span>إرسال الرد</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: SUBMIT SUPPORT TICKET (AVAILABLE TO ALL VISITORS & USERS)         */
          /* ========================================================================= */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black mb-1">تم إرسال مشكلتك بنجاح!</h4>
                <p className="text-xs opacity-75 max-w-sm">
                  تم توجيه تذكرتك فوراً إلى فريق الدعم الفني (عبد الرحمن، زيد، خالد، محمد) عبر السحابة، وسيتم متابعتها والرد عليك بأسرع وقت.
                </p>
              </div>
            ) : (
              <>
                {/* Support Team Banner */}
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isBurgundy
                      ? 'bg-[#240611] border-[#4a1222] text-[#fda4af]'
                      : 'bg-[#faf8f5] border-[#e7e5e4] text-[#6b0f24]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">
                      رسالتك تصل مباشرة إلى فريق الدعم الفني (عبد الرحمن، زيد، خالد، محمد).
                    </span>
                  </div>
                  <a
                    href={directMailtoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-[11px] font-bold whitespace-nowrap hover:opacity-80 flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>مراسلة عبر Gmail</span>
                  </a>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">
                      اسمك الكامل (اختياري)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="اكتب اسمك هنا (أو اتركه فارغاً)..."
                      className={`w-full h-10 px-3.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 ${
                        isBurgundy
                          ? 'bg-[#15040a] border-[#3b101c] text-white focus:ring-[#f43f5e]'
                          : 'bg-white border-[#e7e5e4] text-black focus:ring-[#6b0f24]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">
                      بريدك الإلكتروني (لتلقي الرد) *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full h-10 px-3.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 ${
                        isBurgundy
                          ? 'bg-[#15040a] border-[#3b101c] text-white focus:ring-[#f43f5e]'
                          : 'bg-white border-[#e7e5e4] text-black focus:ring-[#6b0f24]'
                      }`}
                    />
                  </div>
                </div>

                {/* Target Agent / Who to talk with selector */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 opacity-90 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>مع من ترغب في التحدث / توجيه رسالتك؟</span>
                    </span>
                    <span className="text-[10px] opacity-60">اختر العضو المناسب</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'عبد الرحمن', name: 'عبد الرحمن', desc: 'دعم فني وتطوير' },
                      { id: 'زيد', name: 'زيد', desc: 'متابعة وتنسيق' },
                      { id: 'خالد', name: 'خالد', desc: 'استفسارات وبرومبتات' },
                      { id: 'محمد', name: 'محمد', desc: 'حلول ومساعدة' },
                      { id: 'الفريق ككل', name: 'الفريق ككل', desc: 'أي عضو متاح' },
                    ].map((agent) => {
                      const isSelected = targetAgent === agent.id;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => setTargetAgent(agent.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? isBurgundy
                                ? 'bg-[#f43f5e] border-[#f43f5e] text-white shadow-sm ring-1 ring-[#f43f5e]/50'
                                : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-sm ring-1 ring-[#6b0f24]/30'
                              : isBurgundy
                              ? 'bg-[#15040a] border-[#3b101c] text-rose-200/80 hover:border-[#581827] hover:text-white'
                              : 'bg-white border-[#e7e5e4] text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-black">{agent.name}</span>
                          <span className={`text-[9px] truncate max-w-full ${isSelected ? 'opacity-90 text-white' : 'opacity-60'}`}>
                            {agent.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Selection Cards (No Native Select) */}
                <div>
                  <label className="block text-xs font-bold mb-2 opacity-90 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-500" />
                      <span>نوع الطلب أو الرسالة:</span>
                    </span>
                    <span className="text-[10px] opacity-60">اختر الفئة الأنسب</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = category === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col gap-1 cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? isBurgundy
                                ? 'bg-gradient-to-br from-rose-950/80 to-[#2c0815] border-[#f43f5e] ring-2 ring-[#f43f5e]/30 shadow-md'
                                : 'bg-rose-50/80 border-[#6b0f24] ring-2 ring-[#6b0f24]/20 shadow-md'
                              : isBurgundy
                              ? 'bg-[#15040a] border-[#3b101c] hover:border-[#581827] opacity-80 hover:opacity-100'
                              : 'bg-white border-[#e7e5e4] hover:border-slate-300 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${cat.badgeColor}`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                                ✓
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{cat.label}</div>
                            <div className="text-[10px] opacity-60 leading-tight mt-0.5 line-clamp-1">
                              {cat.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">
                    عنوان المشكلة / الموضوع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="اكتب عنواناً واضحاً ومختصراً لموضوعك"
                    className={`w-full h-11 px-3.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 ${
                      isBurgundy
                        ? 'bg-[#15040a] border-[#3b101c] text-white focus:ring-[#f43f5e]'
                        : 'bg-white border-[#e7e5e4] text-black focus:ring-[#6b0f24]'
                    }`}
                  />
                </div>

                {/* Message Details */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">
                    تفاصيل المشكلة أو الرسالة *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اشرح المشكلة بالتفصيل، وما الجهاز أو المتصفح المستخدم إن أمكن..."
                    className={`w-full p-3.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 ${
                      isBurgundy
                        ? 'bg-[#15040a] border-[#3b101c] text-white focus:ring-[#f43f5e]'
                        : 'bg-white border-[#e7e5e4] text-black focus:ring-[#6b0f24]'
                    }`}
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`h-11 px-5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      isBurgundy
                        ? 'border-[#581827] bg-[#15040a] text-white hover:border-[#f43f5e]'
                        : 'border-[#e7e5e4] bg-[#f9f6ef] text-black hover:border-[#6b0f24]'
                    }`}
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    id="submit-support-ticket-btn"
                    className={`h-11 px-7 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                      isBurgundy
                        ? 'bg-gradient-to-r from-[#f43f5e] to-[#e11d48] hover:shadow-rose-900/50'
                        : 'bg-gradient-to-r from-[#6b0f24] to-[#881337] hover:shadow-rose-950/30'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال التذكرة للإدارة</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
