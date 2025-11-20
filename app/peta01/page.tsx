'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Anchor } from 'lucide-react';

export default function Page() {
  const locations = [
    { 
      name: 'Malaka', 
      year: '1511', 
      lat: 35, 
      lng: 15, 
      title: 'Kejatuhan Malaka',
      desc: 'Portugis di bawah pimpinan Alfonso de Albuquerque berhasil menaklukkan Kesultanan Malaka. Peristiwa ini menandai dimulainya era kolonialisme Eropa di Nusantara dan mengubah jalur perdagangan rempah-rempah Asia.'
    },
    { 
      name: 'Banten', 
      year: '1596', 
      lat: 62, 
      lng: 28, 
      title: 'Kedatangan Belanda',
      desc: 'Armada Cornelis de Houtman tiba di Banten, menandai kontak pertama Belanda dengan Nusantara. Pelabuhan Banten menjadi pintu gerbang perdagangan lada dan rempah yang sangat menguntungkan bagi pedagang Eropa.'
    },
    { 
      name: 'Batavia', 
      year: '1619', 
      lat: 63, 
      lng: 32, 
      title: 'Pendirian Batavia',
      desc: 'Jan Pieterszoon Coen mendirikan Batavia di atas reruntuhan Jayakarta. Kota ini menjadi markas besar VOC di Asia dan pusat administrasi kolonial Belanda yang akan bertahan selama 3 abad.'
    },
    { 
      name: 'Maluku', 
      year: '1605', 
      lat: 68, 
      lng: 78, 
      title: 'Perebutan Kepulauan Rempah',
      desc: 'VOC berhasil menguasai Kepulauan Maluku dari Portugis dan Spanyol. Cengkeh dan pala dari Maluku menjadi komoditas paling berharga di dunia, memicu persaingan sengit antara bangsa-bangsa Eropa.'
    },
    { 
      name: 'Makassar', 
      year: '1667', 
      lat: 72, 
      lng: 68, 
      title: 'Perjanjian Bongaya',
      desc: 'Setelah perang panjang, Kerajaan Gowa-Tallo menandatangani Perjanjian Bongaya dengan VOC. Makassar yang sebelumnya merupakan pelabuhan bebas terpaksa menyerahkan monopoli perdagangan kepada Belanda.'
    },
    { 
      name: 'Surabaya', 
      year: '1743', 
      lat: 66, 
      lng: 48, 
      title: 'Ekspansi ke Jawa Timur',
      desc: 'VOC memperluas kekuasaannya ke Jawa Timur dengan menguasai Surabaya. Pelabuhan ini menjadi basis penting untuk mengontrol perdagangan gula, kopi, dan hasil bumi lainnya dari wilayah timur Jawa.'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [pathHistory, setPathHistory] = useState([]);
  const canvasRef = useRef(null);

  const current = locations[currentIndex];
  const next = locations[(currentIndex + 1) % locations.length];

  const generateCurvedPath = (start, end) => {
    const dx = end.lng - start.lng;
    const dy = end.lat - start.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const midX = (start.lng + end.lng) / 2;
    const midY = (start.lat + end.lat) / 2;
    
    const offsetX = -dy * 0.3;
    const offsetY = dx * 0.3;
    
    const control1X = start.lng + dx * 0.25 + offsetX * 0.8;
    const control1Y = start.lat + dy * 0.25 + offsetY * 0.8;
    
    const control2X = start.lng + dx * 0.75 + offsetX * 0.8;
    const control2Y = start.lat + dy * 0.75 + offsetY * 0.8;
    
    return { control1X, control1Y, control2X, control2Y };
  };

  const getBezierPoint = (t, p0, p1, p2, p3) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    
    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
  };

  const getShipPosition = () => {
    const t = progress / 100;
    const { control1X, control1Y, control2X, control2Y } = generateCurvedPath(current, next);
    
    const lng = getBezierPoint(t, current.lng, control1X, control2X, next.lng);
    const lat = getBezierPoint(t, current.lat, control1Y, control2Y, next.lat);
    
    return { lng, lat };
  };

  useEffect(() => {
    if (!isAuto || isWaiting) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsWaiting(true);
          return 100;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isAuto, isWaiting]);

  useEffect(() => {
    if (isWaiting && !showInfo) {
      const waitTimer = setTimeout(() => {
        setShowInfo(true);
      }, 2000);
      return () => clearTimeout(waitTimer);
    }
    
    if (isWaiting && showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false);
        setTimeout(() => {
          const { control1X, control1Y, control2X, control2Y } = generateCurvedPath(current, next);
          setPathHistory(prev => [...prev, {
            start: current,
            end: next,
            control1X,
            control1Y,
            control2X,
            control2Y
          }]);
          setCurrentIndex((idx) => (idx + 1) % locations.length);
          setProgress(0);
          setIsWaiting(false);
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isWaiting, showInfo, current, next]);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const t = progress / 100;
      const t2 = Math.min((progress + 2) / 100, 1);
      
      const { control1X, control1Y, control2X, control2Y } = generateCurvedPath(current, next);
      
      const lng1 = getBezierPoint(t, current.lng, control1X, control2X, next.lng);
      const lat1 = getBezierPoint(t, current.lat, control1Y, control2Y, next.lat);
      
      const lng2 = getBezierPoint(t2, current.lng, control1X, control2X, next.lng);
      const lat2 = getBezierPoint(t2, current.lat, control1Y, control2Y, next.lat);
      
      const angle = Math.atan2(lat2 - lat1, lng2 - lng1) * (180 / Math.PI);
      setRotation(angle + 90);
    }
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 12;
      
      ctx.rotate((rotation * Math.PI) / 180);
      
      const bobbing = Math.sin(time * 3) * 2;
      ctx.translate(0, bobbing);
      
      const scale = 1.2;
      ctx.scale(scale, scale);
      
      ctx.fillStyle = '#4A2511';
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(-18, 25);
      ctx.lineTo(18, 25);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = '#2C1810';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const gradient = ctx.createLinearGradient(-20, 0, 20, 0);
      gradient.addColorStop(0, '#6B3410');
      gradient.addColorStop(0.5, '#8B4513');
      gradient.addColorStop(1, '#6B3410');
      ctx.fillStyle = gradient;
      ctx.fillRect(-3, -35, 6, 60);
      
      ctx.fillStyle = '#2C1810';
      ctx.fillRect(-3, -35, 6, 3);
      ctx.fillRect(-3, -15, 6, 3);
      ctx.fillRect(-3, 5, 6, 3);
      
      const sailGradient = ctx.createLinearGradient(0, -30, 30, 0);
      sailGradient.addColorStop(0, '#FFF8DC');
      sailGradient.addColorStop(0.5, '#F5E6D3');
      sailGradient.addColorStop(1, '#E8D4B8');
      ctx.fillStyle = sailGradient;
      
      ctx.beginPath();
      ctx.moveTo(3, -30);
      const wind = Math.sin(time * 2) * 3;
      ctx.quadraticCurveTo(30 + wind, -20, 32 + wind, -5);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = '#D4A574';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(3, -15);
      ctx.quadraticCurveTo(28 + wind, -18, 30 + wind, -8);
      ctx.lineTo(3, -10);
      ctx.closePath();
      ctx.fillStyle = '#E8C9A8';
      ctx.fill();
      
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = '#A0826D';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(3, -28 + i * 7);
        ctx.lineTo(30, -25 + i * 7);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#8B6F47';
      ctx.fillRect(-22, 20, 44, 8);
      
      ctx.fillStyle = '#6B5435';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(-20 + i * 10, 22, 8, 4);
      }
      
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(-10, 23, 2, 0, Math.PI * 2);
      ctx.arc(10, 23, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#CD853F';
      ctx.fillRect(-1, 22, 2, 6);
      
      ctx.restore();
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [rotation]);

  const handleNext = () => {
    setIsAuto(false);
    setShowInfo(false);
    setIsWaiting(false);
    
    if (progress < 100) {
      const { control1X, control1Y, control2X, control2Y } = currentPath;
      setPathHistory(prev => [...prev, {
        start: current,
        end: next,
        control1X,
        control1Y,
        control2X,
        control2Y
      }]);
    }
    
    setCurrentIndex((idx) => (idx + 1) % locations.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setIsAuto(false);
    setShowInfo(false);
    setIsWaiting(false);
    
    if (pathHistory.length > 0) {
      setPathHistory(prev => prev.slice(0, -1));
    }
    
    setCurrentIndex((idx) => (idx - 1 + locations.length) % locations.length);
    setProgress(0);
  };

  const shipPos = getShipPosition();
  const currentPath = generateCurvedPath(current, next);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-4 sm:p-6 md:p-8 rounded-t-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Anchor className="w-8 h-8 md:w-10 md:h-10 text-amber-100" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-50 tracking-tight">
              Jalur Pelayaran Nusantara
            </h1>
          </div>
          <p className="text-amber-100 text-sm sm:text-base md:text-xl">Perjalanan Sejarah Maritim Indonesia Abad 16-18</p>
        </div>

        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-3xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
            <div className="relative w-full aspect-[16/10] bg-blue-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500">
              <img 
                src="/peta/indonesia.png" 
                alt="Peta Indonesia"
                className="w-full h-full object-cover opacity-90"
              />
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {pathHistory.map((path, idx) => (
                  <g key={idx}>
                    <path
                      d={`M ${path.start.lng} ${path.start.lat} 
                         C ${path.control1X} ${path.control1Y},
                           ${path.control2X} ${path.control2Y},
                           ${path.end.lng} ${path.end.lat}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      opacity="0.5"
                    />
                    <path
                      d={`M ${path.start.lng} ${path.start.lat} 
                         C ${path.control1X} ${path.control1Y},
                           ${path.control2X} ${path.control2Y},
                           ${path.end.lng} ${path.end.lat}`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="2,6"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </g>
                ))}
                
                {progress > 0 && (
                  <path
                    d={`M ${current.lng} ${current.lat} 
                       C ${currentPath.control1X} ${currentPath.control1Y},
                         ${currentPath.control2X} ${currentPath.control2Y},
                         ${next.lng} ${next.lat}`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="4"
                    strokeDasharray="8,4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    opacity="0.9"
                    strokeDashoffset={600 - (progress / 100) * 600}
                    style={{ strokeDasharray: '600', transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                )}
              </svg>
              
              {locations.map((loc, idx) => (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${loc.lng}%`, top: `${loc.lat}%`, zIndex: 3 }}
                >
                  <div className="relative group">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${idx === currentIndex ? 'bg-amber-400 animate-pulse' : 'bg-red-500'} border-2 border-white shadow-lg`}></div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-semibold shadow-xl border border-amber-500">
                        {loc.name} ({loc.year})
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear"
                style={{ 
                  left: `${shipPos.lng}%`, 
                  top: `${shipPos.lat}%`,
                  zIndex: 4
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse" style={{ width: '60px', height: '60px', left: '-10px', top: '-10px' }}></div>
                  <canvas 
                    ref={canvasRef} 
                    width="100" 
                    height="100"
                    className="relative z-10"
                  />
                </div>
              </div>

              <div className={`absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center transition-opacity duration-500 ${showInfo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 5 }}>
                <div className="text-center text-white p-6 sm:p-8 max-w-2xl mx-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-amber-500 shadow-2xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-amber-400">{current.title}</h2>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-amber-300">{current.name} - {current.year}</p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">{current.desc}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAuto(!isAuto)}
                className={`flex-1 ${isAuto ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'} text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base`}
              >
                {isAuto ? 'Stop Auto' : 'Auto Play'}
              </button>
              <button
                onClick={handlePrev}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAuto(false);
                    setCurrentIndex(idx);
                    setProgress(0);
                    setShowInfo(false);
                    setIsWaiting(false);
                  }}
                  className={`p-2 sm:p-3 rounded-xl transition-all text-left ${
                    idx === currentIndex 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg scale-105' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <p className="font-bold text-white text-xs sm:text-sm">{loc.name}</p>
                  <p className="text-[10px] sm:text-xs text-amber-200">{loc.year}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}