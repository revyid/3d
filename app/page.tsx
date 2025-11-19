'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const exhibitions = [
    {
      id: 'islamisasi',
      title: 'Islamisasi di Nusantara',
      description: 'Jelajahi perjalanan sejarah Islamisasi melalui galeri 3D interaktif dengan 12 karya seni yang mendetail.',
      href: '/1000',
      color: 'from-amber-600 to-orange-600',
      icon: '🏛️',
    },
    {
      id: 'upcoming',
      title: 'Pameran Mendatang',
      description: 'Koleksi baru akan segera hadir. Tetap terhubung untuk pembaruan terbaru.',
      href: '#',
      color: 'from-slate-600 to-slate-700',
      icon: '🎨',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.08, 0.05],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MUSEUM</h1>
              <p className="text-xs text-amber-400/80">3D Interactive Gallery</p>
            </div>
          </div>
          
          <a
            href="https://github.com/revyid/3d"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-all"
          >
            GitHub
          </a>
        </motion.div>

        {/* Main Content */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-32 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl text-center"
          >
            {/* Main Title */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-5xl md:text-7xl font-extralight tracking-wider text-white mb-4">
                PAMERAN SENI
              </h2>
              <h3 className="text-2xl md:text-4xl font-light text-amber-400/90 tracking-wide">
                Digital Interaktif 3D
              </h3>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-12"
            >
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-16">
              <p className="text-xl text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto font-light">
                Selamat datang di platform pameran seni digital interaktif. Jelajahi koleksi karya seni dalam lingkungan 3D yang imersif dengan teknologi pencahayaan museum profesional.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
                Setiap pameran dirancang dengan cermat untuk memberikan pengalaman visual yang optimal, menggabungkan estetika modern dengan konten edukatif.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
              {[
                { label: 'Galeri 3D', value: 'Navigasi Interaktif' },
                { label: 'Pencahayaan', value: 'Museum Grade' },
                { label: 'Artwork', value: 'High Quality' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all hover:bg-white/10 backdrop-blur-sm"
                >
                  <p className="text-amber-400 text-sm font-semibold mb-2">{feature.label}</p>
                  <p className="text-white font-light">{feature.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Exhibitions Grid */}
            <motion.div variants={itemVariants} className="w-full">
              <h4 className="text-lg text-gray-400 mb-8 tracking-widest uppercase text-sm font-light">
                Pameran Tersedia
              </h4>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {exhibitions.map((exhibition) => (
                  <motion.div
                    key={exhibition.id}
                    whileHover={!exhibition.disabled ? { scale: 1.02, y: -4 } : {}}
                    transition={{ duration: 0.3 }}
                    className={!exhibition.disabled ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                  >
                    <Link href={exhibition.href} className={!exhibition.disabled ? '' : 'pointer-events-none'}>
                      <div
                        className={`
                          relative h-64 rounded-xl overflow-hidden
                          bg-gradient-to-br ${exhibition.color}
                          border border-white/10 backdrop-blur-sm
                          p-8 flex flex-col justify-between
                          transition-all hover:border-white/20 hover:shadow-xl hover:shadow-amber-500/10
                          group
                        `}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full">
                          <div>
                            <div className="text-4xl mb-4">{exhibition.icon}</div>
                            <h5 className="text-2xl font-extralight text-white mb-3 tracking-wide">
                              {exhibition.title}
                            </h5>
                          </div>

                          <div>
                            <p className="text-sm text-gray-100/90 leading-relaxed font-light mb-6">
                              {exhibition.description}
                            </p>
                            {!exhibition.disabled ? (
                              <div className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-light text-white border border-white/20 transition-all group-hover:border-white/40 group-hover:bg-white/30">
                                Kunjungi Pameran →
                              </div>
                            ) : (
                              <div className="inline-block px-6 py-2 bg-white/5 rounded-lg text-sm font-light text-gray-500 border border-white/10">
                                Segera Hadir
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <h6 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Tentang</h6>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  Platform pameran seni 3D interaktif dengan teknologi pencahayaan museum profesional.
                </p>
              </div>
              <div>
                <h6 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Teknologi</h6>
                <ul className="text-gray-400 text-sm space-y-2 font-light">
                  <li>• Next.js 16.0.3</li>
                  <li>• Three.js & React Three Fiber</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
              <div>
                <h6 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Kontak</h6>
                <ul className="text-gray-400 text-sm space-y-2 font-light">
                  <li>
                    <a href="https://github.com/revyid" className="hover:text-amber-400 transition-colors">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="mailto:contact@example.com" className="hover:text-amber-400 transition-colors">
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-gray-500 text-sm font-light">
                © 2025 Museum 3D Interactive Gallery. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
