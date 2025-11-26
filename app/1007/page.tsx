'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmbedPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!hasStarted) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950" style={{ backgroundImage: 'url(/ms/photo-1635944095210-23114a1fb7c0.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 255, 0.12) 0%, transparent 50%)',
            }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="text-center max-w-5xl px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h1 className="mb-4 sm:mb-6 md:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] text-cyan-100 drop-shadow-2xl">
                  GALERI ISLAM
                </h1>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-0.5 w-20 sm:w-24 md:w-32 lg:w-40 xl:w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-14"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 font-light leading-relaxed max-w-3xl mx-auto">
                  Masuknya Islam ke Indonesia menjadi bukti bahwa ajaran ini tidak selalu hadir melalui pedang atau kekuatan perang, melainkan lewat jalur-jalur sederhana yang kerap kita abaikan: kejujuran berdagang, pertemuan antarbangsa, dan keteladanan yang menyentuh hati.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHasStarted(true)}
                  className="px-8 sm:px-10 md:px-12 lg:px-16 py-2 sm:py-3 md:py-4 lg:py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-400 text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl rounded-full transition-all shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10">Mulai Jelajahi</span>
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 text-xs sm:text-xs md:text-sm text-blue-300 font-light"
              >
                Desktop experience • Tekan tombol untuk melanjutkan
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-gradient-to-t from-slate-950 via-blue-950/80 to-transparent border-t border-cyan-400/20"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-wide text-center">
                  <span className="text-red-400">K</span>
                  <span className="text-orange-400">a</span>
                  <span className="text-yellow-300">t</span>
                  <span className="text-green-400">a</span>
                  <span className="text-cyan-400"> </span>
                  <span className="text-blue-300">P</span>
                  <span className="text-indigo-400">e</span>
                  <span className="text-purple-400">n</span>
                  <span className="text-pink-400">u</span>
                  <span className="text-red-400">t</span>
                  <span className="text-orange-400">u</span>
                  <span className="text-yellow-300">p</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed text-center font-light">
                  <span className="text-cyan-300">Warga arah SKB selalu maju, </span>
                  <span className="text-blue-300">warga pasar atas </span>
                  <span className="text-cyan-200">dan pasar bawah </span>
                  <span className="text-blue-200">selalu langganan banjir.</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ backgroundImage: 'url(/ms/photo-1635944095210-23114a1fb7c0.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <motion.iframe
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        src="https://www.artsteps.com/embed/6921be4933a3402ba514d7de"
        frameBorder="0"
        style={{ width: '100%', height: '100%' }}
        allowFullScreen
      />
    </div>
  );
}
