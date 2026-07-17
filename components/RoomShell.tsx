"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";

// A room is a translucent chamber that opens OVER the same living sky (which stays
// mounted, dimmed, behind it). Exit is always the same: the chevron, or swipe down.
export default function RoomShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { state } = useSandhya();
  const controls = useDragControls();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="room"
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: "rgba(8,10,26,0.55)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            className="flex-1 flex flex-col min-h-0"
            style={{
              background: "linear-gradient(180deg, rgba(18,20,44,0.94) 0%, rgba(24,18,40,0.97) 100%)",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              boxShadow: "0 -12px 40px rgba(0,0,0,0.4)",
            }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 700) {
                sounds.bowl(false);
                onClose();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            {/* grab handle / header — the only drag initiator */}
            <div
              className="safe-top px-5 pt-2 pb-3 select-none cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25" />
              <div className="max-w-md mx-auto w-full flex items-center justify-between">
                <button
                  onClick={() => {
                    haptic(6);
                    onClose();
                  }}
                  className="flex items-center gap-1 text-white/70 text-sm active:scale-95"
                >
                  <span className="text-lg leading-none">⌄</span> return to the sky
                </button>
                <div className="text-right">
                  <div className="text-white/90 font-serif text-lg leading-tight">{title}</div>
                  {subtitle && <div className="text-white/45 text-[11px] italic font-serif">{subtitle}</div>}
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-24 safe-bottom">
              <div className="max-w-md mx-auto w-full">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
