'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Vector3, Quaternion, TextureLoader, Texture } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const artworkData = [
  {
    "id": "islamisasi-1",
    "title": "Masuknya Islam ke Nusantara",
    "year": "Abad ke-13 hingga ke-16 M",
    "src": "/ms/1.jpg",
    "description": "Islamisasi di Nusantara berlangsung secara damai melalui berbagai jalur, antara lain: Perkawinan, Perdagangan, Dakwah, Seni Budaya, dan Tasawuf. Terdapat juga beberapa teori mengenai asal dan waktu kedatangan Islam ke wilayah ini.",
    "theme": "Jalur-Jalur Utama"
  },
  {
    "id": "islamisasi-2",
    "title": "Jalur Perkawinan",
    "year": "Abad ke-15 M",
    "src": "/ms/2.jpg",
    "description": "Perkawinan adalah jalur yang efektif, di mana pedagang Muslim menikahi wanita pribumi (seringkali putri bangsawan) yang terlebih dahulu memeluk Islam, menghasilkan keturunan Muslim dan memperluas pengaruh agama hingga ke lingkungan istana.",
    "theme": "Jalur Perkawinan"
  },
  {
    "id": "islamisasi-3",
    "title": "Jalur Dakwah dan Pendidikan",
    "year": "Abad ke-15 M",
    "src": "/ms/3.jpg",
    "description": "Para ulama dan mubaligh (seperti Wali Songo di Jawa) menyebarkan Islam secara langsung melalui pengajaran di surau dan pesantren. Pesantren menjadi pusat pendidikan yang melahirkan generasi baru ulama dan pemimpin Muslim.",
    "theme": "Jalur Dakwah"
  },
  {
    "id": "islamisasi-4",
    "title": "Jalur Perdagangan",
    "year": "Abad ke-7 hingga ke-16 M",
    "src": "/ms/4.jpg",
    "description": "Para pedagang Muslim dari Arab, Persia, dan Gujarat singgah di pelabuhan Nusantara. Interaksi ekonomi yang intensif menumbuhkan komunitas Muslim di pesisir, yang menjadi cikal bakal permukiman dan pusat dakwah.",
    "theme": "Jalur Perdagangan"
  },
  {
    "id": "islamisasi-5",
    "title": "Jalur Seni dan Budaya",
    "year": "Abad ke-15 M",
    "src": "/ms/5.jpg",
    "description": "Penyebaran Islam dilakukan melalui adaptasi dan akulturasi budaya lokal. Contoh paling terkenal adalah Sunan Kalijaga yang menggunakan media seni wayang, ukiran, dan gending (lagu) untuk menyampaikan ajaran Islam secara halus dan mudah diterima.",
    "theme": "Jalur Seni & Budaya"
  },
  {
    "id": "islamisasi-6",
    "title": "Teori Gujarat (India)",
    "year": "Abad ke-13 M",
    "src": "/ms/6.jpg",
    "description": "Teori ini menyatakan bahwa Islam masuk ke Nusantara dari pedagang Gujarat (India) pada sekitar abad ke-13 M. Bukti pendukung utama adalah penemuan batu nisan Sultan Malik As-Saleh di Pasai yang mirip dengan corak nisan di Gujarat.",
    "theme": "Teori Islamisasi"
  },
  {
    "id": "islamisasi-7",
    "title": "Teori Arab/Mekkah",
    "year": "Abad ke-7 M",
    "src": "/ms/7.jpg",
    "description": "Teori ini berpendapat bahwa Islam datang langsung dari Arab (Timur Tengah) sejak abad ke-7 Masehi. Bukti pendukungnya adalah jalur perdagangan Arab yang sudah ramai sejak masa awal, serta kesamaan mazhab Syafi'i yang dianut di Nusantara dan Arab.",
    "theme": "Teori Islamisasi"
  },
  {
    "id": "islamisasi-8",
    "title": "Teori Persia",
    "year": "Abad ke-13 M",
    "src": "/ms/8.jpg",
    "description": "Teori ini menyebutkan bahwa Islam datang dari Persia (Iran). Bukti yang sering digunakan adalah kesamaan tradisi budaya Islam di Nusantara dengan Persia, seperti perayaan 10 Muharram (Asyura) di beberapa daerah yang mirip dengan budaya Syiah Persia.",
    "theme": "Teori Islamisasi"
  },
{
    "id": "islamisasi-9",
    "title": "Islamisasi di Muara Bungo (Jambi)",
    "year": "Abad ke-19 M",
    "src": "/ms/9.jpg",
    "description": "Proses Islamisasi di Muara Bungo merupakan bagian dari penyebaran Islam di hulu Sungai Batanghari, Kesultanan Jambi. Tokoh dakwah awal diyakini berasal dari jalur Jawa dan Minangkabau. Bukti penguatan Islam ditunjukkan dengan pembangunan masjid-masjid tua, seperti Masjid Al-Falah di Empelu (dibangun ulang 1827) dan Masjid Al-Munawwaroh (cikal bakal surau 1900) yang menjadi pusat pendidikan dan dakwah.",
    "theme": "Islamisasi Regional"
  },
  {
    "id": "islamisasi-10",
    "title": "Seni dan Budaya Islam Muara Bungo",
    "year": "Abad ke-19 M - Sekarang",
    "src": "/ms/10.jpg",
    "description": "Seni dan budaya Islam di Muara Bungo (Jambi) sangat kental dengan tradisi Melayu dan lokalitas. Ini terlihat pada arsitektur masjid tradisional yang menyerupai rumah panggung Melayu, serta seni ukir (kaligrafi) pada mimbar dan dinding. Tradisi lisan dan kesenian yang bernuansa Islami, seperti zikir maulid dan seni hadrah/rebana, digunakan untuk menyebarkan ajaran agama dalam acara adat dan keagamaan.",
    "theme": "Seni & Budaya Regional"
  },
  {
    "id": "islamisasi-11",
    "title": "Pawai Obor 10 Muharram (Asyura)",
    "year": "Masa Kini (Tradisi Tahunan)",
    "src": "/ms/11.jpg",
    "description": "Pawai Obor yang dilaksanakan di Muara Bungo sering terkait dengan peringatan 10 Muharram (Hari Asyura), di mana kegiatan ini menjadi simbol penyambutan dan penghormatan terhadap hari penting dalam kalender Hijriah. Pawai ini bertujuan mempererat kebersamaan dan memeriahkan hari raya Islam, yang sering diiringi dengan kegiatan amal atau pembacaan sholawat.",
    "theme": "Tradisi Keagamaan"
  },
  {
    "id": "islamisasi-12",
    "title": "Tradisi Betimbang/Mengembang Tando",
    "year": "Tradisi Lokal Melayu",
    "src": "/ms/12.jpg",
    "description": "Tradisi 'Betimbang' (atau 'Mengembang Tando' di beberapa dusun) terkait dengan ritual siklus hidup masyarakat, khususnya dalam adat pernikahan (Tando) atau penimbangan bayi (Betimbang). Meskipun memiliki akar adat pra-Islam, ritual ini telah diakulturasi dengan pembacaan doa-doa dan ayat suci Al-Qur'an, menjadikannya bagian dari budaya Islam Melayu setempat.",
    "theme": "Akulturasi Budaya"
  }
]

const SPACING = 8;
const WALL_OFFSET = 11;
const BASE_HEIGHT = 3.5;
const ENTRANCE_ZONE = 25;

const generateArtworkPositions = (artworks: typeof artworkData) => {
  return artworks.map((artwork, index) => {
    const isLeftWall = index % 2 === 0;
    const groupIndex = Math.floor(index / 2);
    
    return {
      ...artwork,
      position: {
        x: isLeftWall ? -WALL_OFFSET : WALL_OFFSET,
        y: BASE_HEIGHT,
        z: -groupIndex * SPACING - 5,
      },
      wall: isLeftWall ? 'left' : 'right',
    };
  });
};

const positionedArtworks = generateArtworkPositions(artworkData);

const AUTOPLAY_DELAY = 2.5;

const generateCameraWaypoints = (artworks: ReturnType<typeof generateArtworkPositions>) => {
  return artworks.map((artwork) => {
    const zOffset = 2.5;
    const camX = artwork.position.x < 0 ? -WALL_OFFSET + 7 : WALL_OFFSET - 7;

    return {
      pos: [camX, 3.5, artwork.position.z + zOffset] as [number, number, number],
      look: [artwork.position.x, artwork.position.y, artwork.position.z] as [number, number, number],
      duration: 3,
    };
  });
};

const cameraWaypoints = generateCameraWaypoints(positionedArtworks);

const galleryLength = Math.abs(positionedArtworks[positionedArtworks.length - 1].position.z) + 35;

const easeInOutQuart = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

function Easel({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1, 0.3]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshStandardMaterial color="#6b5744" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[-0.25, 1, -0.15]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshStandardMaterial color="#6b5744" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, 1, -0.15]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshStandardMaterial color="#6b5744" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#5a4936" roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh position={[0, 3.7, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.15]} />
        <meshStandardMaterial color="#4a3926" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#7a6349" roughness={0.65} metalness={0.08} />
      </mesh>
    </group>
  );
}

function Chandelier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#8b7355" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.55, 0.03, 12, 24]} />
        <meshStandardMaterial color="#b8985d" roughness={0.35} metalness={0.7} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.45;
        const z = Math.sin(rad) * 0.45;
        return (
          <group key={i}>
            <mesh position={[x, -0.15, z]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial 
                color="#fff9e6" 
                emissive="#ffebb3" 
                emissiveIntensity={1.8}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>
            <pointLight
              position={[x, -0.15, z]}
              intensity={1.5}
              distance={12}
              color="#ffe5b3"
            />
          </group>
        );
      })}
    </group>
  );
}

function WallLantern({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[0.15, 0.3, 0.08]} />
        <meshStandardMaterial color="#4a3926" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.25, -0.05]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.2]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.3} 
          metalness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0, -0.25, 0.06]}>
        <planeGeometry args={[0.18, 0.32]} />
        <meshStandardMaterial 
          color="#ffe5b3" 
          emissive="#ffebb3" 
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, -0.05, -0.05]}>
        <coneGeometry args={[0.14, 0.12, 4]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.5} />
      </mesh>
      <pointLight
        position={[0, -0.25, -0.05]}
        intensity={0.8}
        distance={6}
        color="#ffe5b3"
      />
    </group>
  );
}

function PictureFrame({
  artwork,
  isActive,
}: {
  artwork: ReturnType<typeof generateArtworkPositions>[0];
  isActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useMemo(() => {
    let isMounted = true;
    const loader = new TextureLoader();
    loader.load(
      artwork.src,
      (tex) => {
        if (!isMounted) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        setTexture(tex);
        setImageLoaded(true);
      },
      undefined,
      () => {
        if (isMounted) setImageLoaded(true);
      }
    );
    return () => { isMounted = false; };
  }, [artwork.src]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetScale = isActive ? 1.06 : 1;
    groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  const frameWidth = 4.2;
  const frameHeight = 4.2;
  const frameDepth = 0.25;
  const frameThickness = 0.2;
  const matteWidth = 0.3;

  const isLeftWall = artwork.wall === 'left';
  const rotation: [number, number, number] = isLeftWall ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];
  const easelOffset = isLeftWall ? -0.5 : 0.5;

  return (
    <>
    <group ref={groupRef} position={[artwork.position.x, artwork.position.y, artwork.position.z]} rotation={rotation}>
      {imageLoaded && (
        <mesh position={[0, 0, 0.13]} castShadow>
          <planeGeometry args={[frameWidth - matteWidth * 2 - frameThickness * 2, frameHeight - matteWidth * 2 - frameThickness * 2]} />
          {texture ? (
            <meshStandardMaterial 
              map={texture}
              toneMapped={false}
              emissive="#000000"
              emissiveIntensity={0}
            />
          ) : (
            <meshStandardMaterial color="#888" roughness={0.8} />
          )}
        </mesh>
      )}

      <mesh position={[0, 0, 0.1]} receiveShadow>
        <planeGeometry args={[frameWidth - frameThickness * 2, frameHeight - frameThickness * 2]} />
        <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.02} />
      </mesh>

      <mesh position={[0, frameHeight / 2 - frameThickness / 2, 0.06]}>
        <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
        <meshStandardMaterial 
          color="#7a6652" 
          roughness={0.3} 
          metalness={0.08}
          envMapIntensity={0.4}
        />
      </mesh>

      <mesh position={[0, -(frameHeight / 2 - frameThickness / 2), 0.06]}>
        <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
        <meshStandardMaterial 
          color="#7a6652" 
          roughness={0.3} 
          metalness={0.08}
          envMapIntensity={0.4}
        />
      </mesh>

      <mesh position={[-(frameWidth / 2 - frameThickness / 2), 0, 0.06]}>
        <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
        <meshStandardMaterial 
          color="#7a6652" 
          roughness={0.3} 
          metalness={0.08}
          envMapIntensity={0.4}
        />
      </mesh>

      <mesh position={[(frameWidth / 2 - frameThickness / 2), 0, 0.06]}>
        <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
        <meshStandardMaterial 
          color="#7a6652" 
          roughness={0.3} 
          metalness={0.08}
          envMapIntensity={0.4}
        />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.12]} />
        <meshStandardMaterial color="#fcfcfc" roughness={0.5} metalness={0.01} />
      </mesh>

      <mesh position={[0, 0, 0.04]} rotation={[0, 0, 0]}>
        <boxGeometry args={[frameWidth + 0.03, frameHeight + 0.03, 0.06]} />
        <meshStandardMaterial 
          color="#5f4f3d" 
          roughness={0.35} 
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, -(frameHeight / 2 + 0.3), 0.1]}>
        <boxGeometry args={[frameWidth * 0.45, 0.15, 0.1]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>

      {isActive && (
        <>
          <spotLight
            position={[0, 3.2, 2.8]}
            intensity={8}
            angle={0.35}
            penumbra={0.7}
            distance={16}
            color="#ffe5b3"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.00005}
            decay={2}
          />
          <pointLight
            position={[0, 1.5, 2.0]}
            intensity={3.0}
            distance={10}
            color="#fff7e6"
            decay={2}
          />
          <pointLight
            position={[artwork.position.x > 0 ? 3 : -3, 5, artwork.position.z]}
            intensity={2.5}
            distance={8}
            color="#ffd9a6"
            decay={2}
          />
        </>
      )}
    </group>
    <Easel 
      position={[artwork.position.x + easelOffset, 0, artwork.position.z]} 
      rotation={rotation}
    />
    </>
  );
}

function GalleryEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]} receiveShadow>
        <planeGeometry args={[28, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          color="#ebe7e1" 
          roughness={0.82} 
          metalness={0.03}
        />
      </mesh>

      <mesh position={[-14, 6.5, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]}>
        <boxGeometry args={[0.4, 13, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.68} metalness={0} />
      </mesh>

      <mesh position={[14, 6.5, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]}>
        <boxGeometry args={[0.4, 13, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.68} metalness={0} />
      </mesh>

      <mesh position={[0, 13, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial color="#fcfcfa" roughness={0.42} metalness={0.02} />
      </mesh>

      <mesh position={[0, 6.5, -galleryLength + ENTRANCE_ZONE / 2 - 0.7]}>
        <boxGeometry args={[28, 13, 1.4]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.68} metalness={0} />
      </mesh>

      <mesh position={[0, 6.5, ENTRANCE_ZONE / 2 + 0.7]}>
        <boxGeometry args={[28, 13, 1.4]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.68} metalness={0} />
      </mesh>

      {[...Array(Math.ceil(galleryLength / 12))].map((_, i) => {
        const zPos = 18 - i * 12;
        const showBench = i % 2 === 0;
        
        return (
          <React.Fragment key={`furniture-${i}`}>
            {showBench && (
              <group>
                <mesh 
                  position={[0, 0.01, zPos]} 
                  rotation={[-Math.PI / 2, 0, 0]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[3.2, 1, 0.6]} />
                  <meshStandardMaterial color="#8d7659" roughness={0.52} metalness={0.14} />
                </mesh>
                <mesh 
                  position={[-1.4, 0.01, zPos]} 
                  castShadow
                >
                  <boxGeometry args={[0.35, 0.35, 1]} />
                  <meshStandardMaterial color="#7a6349" roughness={0.5} metalness={0.12} />
                </mesh>
                <mesh 
                  position={[1.4, 0.01, zPos]} 
                  castShadow
                >
                  <boxGeometry args={[0.35, 0.35, 1]} />
                  <meshStandardMaterial color="#7a6349" roughness={0.5} metalness={0.12} />
                </mesh>
              </group>
            )}
          </React.Fragment>
        );
      })}

      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial color="#d9cfc0" roughness={0.68} metalness={0} />
      </mesh>



      {[...Array(Math.ceil(galleryLength / 10))].map((_, i) => (
        <React.Fragment key={`ceiling-detail-${i}`}>
          <mesh position={[-11, 12.6, 15 - i * 10]}>
            <boxGeometry args={[1.8, 0.2, 0.2]} />
            <meshStandardMaterial color="#e8e5df" roughness={0.58} metalness={0.06} />
          </mesh>
          <mesh position={[11, 12.6, 15 - i * 10]}>
            <boxGeometry args={[1.8, 0.2, 0.2]} />
            <meshStandardMaterial color="#e8e5df" roughness={0.58} metalness={0.06} />
          </mesh>
        </React.Fragment>
      ))}

      {[...Array(6)].map((_, i) => (
        <group key={`column-${i}`}>
          <mesh position={[-12, 6.5, 12 - i * 14]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 13, 12]} />
            <meshStandardMaterial color="#e5e0d8" roughness={0.65} metalness={0.05} />
          </mesh>
          <mesh position={[12, 6.5, 12 - i * 14]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 13, 12]} />
            <meshStandardMaterial color="#e5e0d8" roughness={0.65} metalness={0.05} />
          </mesh>
          <mesh position={[-12, 13.2, 12 - i * 14]}>
            <cylinderGeometry args={[0.5, 0.35, 0.4, 12]} />
            <meshStandardMaterial color="#d5d0c8" roughness={0.6} metalness={0.08} />
          </mesh>
          <mesh position={[12, 13.2, 12 - i * 14]}>
            <cylinderGeometry args={[0.5, 0.35, 0.4, 12]} />
            <meshStandardMaterial color="#d5d0c8" roughness={0.6} metalness={0.08} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0, ENTRANCE_ZONE / 2 - 5]}>
        <mesh position={[-5, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 9, 0.5]} />
          <meshStandardMaterial color="#8b7355" roughness={0.5} metalness={0.15} />
        </mesh>
        <mesh position={[5, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 9, 0.5]} />
          <meshStandardMaterial color="#8b7355" roughness={0.5} metalness={0.15} />
        </mesh>
        <mesh position={[0, 9.2, 0]} castShadow>
          <boxGeometry args={[11.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#8b7355" roughness={0.5} metalness={0.15} />
        </mesh>
        <mesh position={[-5.75, 7, 0]} castShadow>
          <boxGeometry args={[0.5, 4.4, 0.5]} />
          <meshStandardMaterial color="#9d8566" roughness={0.48} metalness={0.12} />
        </mesh>
        <mesh position={[5.75, 7, 0]} castShadow>
          <boxGeometry args={[0.5, 4.4, 0.5]} />
          <meshStandardMaterial color="#9d8566" roughness={0.48} metalness={0.12} />
        </mesh>
        <mesh position={[0, 9.8, 0]} castShadow>
          <boxGeometry args={[12, 0.3, 0.6]} />
          <meshStandardMaterial color="#7a6349" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {[...Array(Math.ceil(galleryLength / 20))].map((_, i) => (
        <Chandelier 
          key={`chandelier-${i}`}
          position={[0, 11, 10 - i * 20]} 
        />
      ))}

      {positionedArtworks.map((artwork, i) => (
        <React.Fragment key={`lantern-${i}`}>
          <WallLantern 
            position={[
              artwork.position.x,
              artwork.position.y + 3.0,
              artwork.position.z
            ]}
            rotation={[0, artwork.wall === 'left' ? 0 : Math.PI, 0]}
          />
        </React.Fragment>
      ))}
    </group>
  );
}

function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fefefe" />
      <directionalLight
        position={[30, 35, 30]}
        intensity={1.15}
        color="#fffaf2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0002}
      />
      <hemisphereLight
        args={['#ffffff', '#9a9288', 0.58]}
        position={[0, 28, 0]}
      />
      
      {positionedArtworks.map((artwork, i) => (
        <spotLight
          key={`ceiling-light-${i}`}
          position={[artwork.position.x > 0 ? 5 : -5, 11.5, artwork.position.z]}
          intensity={0.95}
          angle={0.72}
          penumbra={0.68}
          distance={18}
          color="#fffcf5"
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
      ))}

      {[...Array(Math.ceil(galleryLength / 10))].map((_, i) => (
        <pointLight
          key={`ambient-${i}`}
          position={[0, 9, 18 - i * 10]}
          intensity={0.45}
          distance={14}
          color="#fff9f0"
        />
      ))}
    </>
  );
}

function GalleryScene({
  currentIndex,
  isPlaying,
  onAnimComplete,
}: {
  currentIndex: number;
  isPlaying: boolean;
  onAnimComplete: () => void;
}) {
  const { camera } = useThree();
  const animState = useRef({ progress: 0, startPos: new Vector3(), startQuat: new Quaternion() });

  const waypoint = cameraWaypoints[Math.min(currentIndex, cameraWaypoints.length - 1)];

  useEffect(() => {
    animState.current.progress = 0;
    animState.current.startPos.copy(camera.position);
    animState.current.startQuat.copy(camera.quaternion);
  }, [currentIndex, camera]);

  useFrame(({ clock }) => {
    const state = animState.current;
    const duration = waypoint.duration * 60;

    if (state.progress < duration) {
      state.progress += 1;
      const t = easeInOutQuart(Math.min(state.progress / duration, 1));

      camera.position.lerpVectors(
        state.startPos,
        new Vector3(...waypoint.pos),
        t
      );

      const targetQuat = new Quaternion();
      const mat = new THREE.Matrix4();
      mat.lookAt(
        camera.position,
        new Vector3(...waypoint.look),
        camera.up
      );
      targetQuat.setFromRotationMatrix(mat);
      camera.quaternion.slerp(targetQuat, t);
    } else if (state.progress === duration) {
      state.progress += 1;
      onAnimComplete();
    }
    
    // Camera sway effect when animation is complete
    if (state.progress > duration) {
      const sway = Math.sin(clock.elapsedTime * 0.3) * 0.015;
      camera.position.x += sway;
    }
  });

  return (
    <>
      <LightingSetup />
      <GalleryEnvironment />
      {positionedArtworks.map((artwork, idx) => (
        <PictureFrame
          key={artwork.id}
          artwork={artwork}
          isActive={idx === currentIndex}
        />
      ))}
    </>
  );
}

function LoadingBar() {
  const { progress } = useProgress();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none flex h-screen items-center justify-center"
    >
      <div className="w-72 h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/20">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

export default function MuseumPage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent));
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Autoplay advancement is handled when the camera animation completes
    // (handled by `onAnimComplete`). This effect only keeps timers cleared
    // when the user stops autoplay.

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const handleWelcomeKeydown = (e: KeyboardEvent) => {
      if (showWelcome) {
        setShowWelcome(false);
      }
    };
    const handleWelcomeTouch = () => {
      if (showWelcome) {
        setShowWelcome(false);
      }
    };
    window.addEventListener('keydown', handleWelcomeKeydown);
    window.addEventListener('touchstart', handleWelcomeTouch);
    return () => {
      window.removeEventListener('keydown', handleWelcomeKeydown);
      window.removeEventListener('touchstart', handleWelcomeTouch);
    };
  }, [showWelcome]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((p) => Math.max(0, p - 1));
        setIsPlaying(false);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((p) => Math.min(cameraWaypoints.length - 1, p + 1));
        setIsPlaying(false);
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setCurrentIndex((p) => Math.min(cameraWaypoints.length - 1, p + 1));
        } else {
          setCurrentIndex((p) => Math.max(0, p - 1));
        }
        setIsPlaying(false);
      }
      setTouchStart(null);
    };
    
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart]);

  const handleAnimComplete = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isPlaying) {
      // schedule the next waypoint after a short pause so user can view the artwork
      if (currentIndex < cameraWaypoints.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentIndex((p) => {
            if (!isPlaying || p >= cameraWaypoints.length - 1) {
              setIsPlaying(false);
              return p;
            }
            return p + 1;
          });
        }, AUTOPLAY_DELAY * 1000);
      } else {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-zinc-900 to-black touch-none">
      <Canvas
        camera={{ position: [0, 3.2, 12], fov: isMobile ? 75 : 65, far: 600 }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isMobile ? 1.3 : 1.35,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          stencil: false,
          depth: true,
        }}
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        {hasEntered && (
          <GalleryScene
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onAnimComplete={handleAnimComplete}
          />
        )}
        <fog attach="fog" args={['#0f0f0f', 40, 100]} />
      </Canvas>

      <LoadingBar />

<AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.12) 0%, transparent 50%)',
            }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="text-center max-w-3xl px-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h1 className="mb-6 text-5xl sm:text-7xl md:text-9xl font-extralight tracking-[0.3em] text-white drop-shadow-2xl">
                  MUSEUM
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-0.5 w-24 sm:w-28 md:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8 md:mb-12"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mb-6 text-lg sm:text-2xl md:text-3xl text-gray-100 font-extralight tracking-wide"
              >
                Galeri Seni Digital Interaktif
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mb-10 md:mb-14 text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-xl mx-auto px-4"
              >
                Jelajahi koleksi karya seni kontemporer dalam lingkungan virtual yang dirancang dengan cermat. 
                Setiap karya dipresentasikan dengan pencahayaan profesional dan perspektif kurasi untuk pengalaman visual yang optimal.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(217, 119, 6, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasEntered(true)}
                className="group px-10 sm:px-16 md:px-20 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-500 text-white font-semibold text-sm sm:text-base md:text-lg rounded-full transition-all shadow-2xl relative overflow-hidden"
              >
                <span className="relative z-10">Masuki Galeri</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4"
              >
                {!isMobile ? (
                  <>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs">←</kbd>
                      <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs">→</kbd>
                      <span>Navigasi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs">Play</kbd>
                      <span>Mulai lewat tombol</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span>Gestur: Geser kiri/kanan untuk navigasi</span>
                    <span>Tap tombol untuk memulai tour</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {hasEntered && showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-2xl px-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-extralight text-white mb-6 tracking-widest"
              >
                SELAMAT DATANG
              </motion.h2>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-2xl text-gray-300 mb-12 font-light leading-relaxed"
              >
                Nikmati perjalanan visual melalui koleksi karya seni yang dipilih dengan cermat. 
                Setiap karya ditempatkan pada easel bergaya klasik dengan pencahayaan museum yang autentik.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3 text-sm text-amber-400">
                  <kbd className="px-4 py-2 bg-white/10 rounded-lg border border-amber-500/30 font-mono">
                    Tekan tombol apa saja atau tap di mana saja
                  </kbd>
                </div>
                
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-4"
                >
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasEntered && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-lg md:rounded-xl bg-black/60 backdrop-blur-lg border border-white/10 z-20 shadow-xl"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50" />
              <span className="text-xs sm:text-sm text-gray-300 font-light whitespace-nowrap">
                {isPlaying ? 'Tour Aktif' : 'Mode Manual'}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-72 z-20"
          >
            <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / cameraWaypoints.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 text-center text-xs sm:text-sm text-gray-400 font-light">
              {currentIndex + 1} / {cameraWaypoints.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4 z-20"
          >
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed p-2 sm:p-3 md:p-4 text-white transition-all backdrop-blur-lg border border-white/20 shadow-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 p-2 sm:p-3 md:p-4 text-white transition-all shadow-xl"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentIndex((p) => Math.min(cameraWaypoints.length - 1, p + 1))}
            disabled={currentIndex === cameraWaypoints.length - 1}
            className="rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed p-2 sm:p-3 md:p-4 text-white transition-all backdrop-blur-lg border border-white/20 shadow-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
        </>
      )}

      {hasEntered && positionedArtworks[currentIndex] && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 max-w-xs sm:max-w-sm md:max-w-lg z-20"
        >
          <div className="rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-black/70 via-black/60 to-black/70 p-4 sm:p-6 md:p-10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-white mb-2 md:mb-3 tracking-wide line-clamp-2">
                {positionedArtworks[currentIndex].title}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs sm:text-sm md:text-sm text-amber-400 font-medium mb-1 md:mb-2 tracking-wider uppercase">
                {positionedArtworks[currentIndex].artist}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs sm:text-xs md:text-xs text-gray-400 mb-3 md:mb-5 tracking-wide">
                {positionedArtworks[currentIndex].year}
              </p>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-px bg-gradient-to-r from-amber-400 via-amber-500 to-transparent mb-4 md:mb-6"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs sm:text-sm md:text-sm text-gray-300 leading-relaxed mb-6 md:mb-8 font-light line-clamp-3 md:line-clamp-none">
                {positionedArtworks[currentIndex].description}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-xs md:text-xs text-gray-500 pt-4 md:pt-6 border-t border-white/10"
            >
              <span className="font-medium">Karya {currentIndex + 1} dari {positionedArtworks.length}</span>
              <span className="text-amber-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Navigasi dengan panah
              </span>
            </motion.div>
          </div>cl
        </motion.div>
      )}

      {hasEntered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-6 sm:top-8 md:top-10 right-4 sm:right-6 md:right-10 px-4 sm:px-5 md:px-6 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-lg md:rounded-xl bg-black/50 backdrop-blur-lg border border-white/10 z-20"
        >
          <div className="flex items-center gap-2 sm:gap-3 md:gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm md:text-sm text-gray-300 font-light">
              {isPlaying ? 'Tour Aktif' : 'Mode Manual'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}