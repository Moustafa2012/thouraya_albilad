import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, PhoneCall, Headphones, Handshake, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";

interface ContactNumber {
  number: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const WHATSAPP_GREEN = "#25D366";
const WHATSAPP_DARK = "#075E54";

const APPEAR_DELAY_MS = 1500;

export default function WhatsAppButton() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  // Delay the button appearing on load for polish
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const contacts: ContactNumber[] = [
    {
      number: "+966550168553",
      name: t("General Manager", "المدير العام"),
      role: t("General Manager", "المدير العام"),
      icon: <Handshake className="h-4 w-4" />,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      number: "+966541624620",
      name: t("Head Office", "المكتب الرئيسي"),
      role: t("Head Office", "المكتب الرئيسي"),
      icon: <Headphones className="h-4 w-4" />,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      number: "+966533643860",
      name: t("Sales 1", "مبيعات ١"),
      role: t("Sales Representative", "مندوب مبيعات"),
      icon: <PhoneCall className="h-4 w-4" />,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
    },
    {
      number: "+966537144334",
      name: t("Sales 2", "مبيعات ٢"),
      role: t("Sales Representative", "مندوب مبيعات"),
      icon: <PhoneCall className="h-4 w-4" />,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
  ];

  const openWhatsApp = (phoneNumber: string) => {
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, "")}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 16, originX: 0, originY: 1 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring", stiffness: 320, damping: 28, staggerChildren: 0.06, delayChildren: 0.04 },
    },
    exit: {
      opacity: 0, scale: 0.93, y: 12,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: language === "ar" ? 12 : -12 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 380, damping: 30 } },
  };

  const fabVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1, opacity: 1,
      transition: { type: "spring", stiffness: 280, damping: 20 },
    },
  };

  return (
    <div
      className="fixed bottom-6 start-6 z-50 flex flex-col items-start"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Popup card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-3 w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(37,211,102,0.15)" }}
          >
            {/* Header */}
            <div
              className="px-4 py-3.5 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${WHATSAPP_DARK} 0%, ${WHATSAPP_GREEN} 100%)` }}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm leading-tight">
                  {t("Chat with us", "تحدث معنا")}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse inline-block" />
                  <span className="text-white/80 text-xs">
                    {t("Typically replies instantly", "يرد عادةً على الفور")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={t("Close", "إغلاق")}
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

            {/* Contact list */}
            <div className="bg-white dark:bg-zinc-900" style={{ maxHeight: 280, overflowY: "auto" }}>
              {contacts.map((contact, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  onClick={() => openWhatsApp(contact.number)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-start transition-colors duration-150 border-b border-gray-100 dark:border-zinc-800 last:border-0 group outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-zinc-800"
                  style={{ backgroundColor: hoveredIndex === index ? "#f0fff4" : "transparent" }}
                >
                  {/* Icon badge */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
                    style={{ backgroundColor: contact.bg, color: contact.color }}
                  >
                    {contact.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight">
                      {contact.name}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 truncate">
                      {contact.role}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    animate={{ x: hoveredIndex === index ? 2 : 0, opacity: hoveredIndex === index ? 1 : 0.3 }}
                    transition={{ duration: 0.15 }}
                    className="rtl:rotate-180"
                    style={{ color: WHATSAPP_GREEN }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 flex items-center justify-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill={WHATSAPP_GREEN}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                {t("Powered by WhatsApp", "مدعوم من واتساب")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={t("Contact via WhatsApp", "تواصل عبر واتساب")}
            aria-expanded={isOpen}
            className="relative flex items-center justify-center w-14 h-14 rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
            style={{
              background: isOpen
                ? `linear-gradient(135deg, ${WHATSAPP_DARK} 0%, #1a9e52 100%)`
                : `linear-gradient(135deg, ${WHATSAPP_GREEN} 0%, ${WHATSAPP_DARK} 100%)`,
              boxShadow: isOpen
                ? "0 4px 20px rgba(37,211,102,0.3)"
                : "0 6px 28px rgba(37,211,102,0.5)",
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
          >
            {/* Animated pulse rings */}
            {!isOpen && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: WHATSAPP_GREEN, opacity: 0.4 }}
                  animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0 }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: WHATSAPP_GREEN, opacity: 0.25 }}
                  animate={{ scale: [1, 1.9], opacity: [0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
              </>
            )}

            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.18 }}
                >
                  <MessageCircle className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}