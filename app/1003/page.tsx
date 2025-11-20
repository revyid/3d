'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Vector3, Quaternion, TextureLoader, Texture } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const artworkData = [
  {
    "id": "1",
    "title": "Taman Patung Buddha & Padmakirti",
    "year": "",
    "src": "/ms/1001/1.jpeg",
    "description": "Tempat pemujaan outdoor yang menggambarkan Buddha duduk dalam kedamaian. Digunakan untuk meditasi luar ruangan, foto kenangan, atau perayaan Waisak. Tulisan Padmakirti merujuk pada makna teratai kemuliaan, simbol kemurnian hati dalam Buddhisme."
  },
  {
    "id": "2",
    "title": "Kuil Kecil / Pavilion Persembahan",
    "year": "",
    "src": "/ms/1001/2.jpeg",
    "description": "Digunakan sebagai tempat menyalakan dupa, membakar hio, atau memohon berkah sebelum memasuki aula utama. Kadang menjadi tempat patung kecil, lonceng, atau tempat abu hio. Fungsinya untuk membersihkan batin atau pemanasan spiritual sebelum sembahyang utama."
  },
  {
    "id": "3",
    "title": "Taman Pagoda & Jembatan Hias",
    "year": "",
    "src": "/ms/1001/3.jpeg",
    "description": "Merupakan taman simbolis yang sering menggambarkan konsep kedamaian, kemurnian, dan perjalanan spiritual. Pagoda kecil dipakai sebagai tempat meditasi ringan, berfoto, atau tempat umat merenung dalam suasana tenang. Jembatan melambangkan perjalanan menuju pencerahan."
  },
  {
    "id": "4",
    "title": "Aula Utama / Balai Sembahyang",
    "year": "",
    "src": "/ms/1001/4.jpeg",
    "description": "Ini adalah rumah ibadah utama vihara. Di dalamnya biasanya terdapat altar Buddha, rupang, meja persembahyangan, serta tempat umat melakukan puja, chanting, meditasi, dan kebaktian hari besar. Bangunan luas memungkinkan kegiatan bersama seperti paritta, dhammatalk, atau sekolah minggu Buddhis."
  },
  {
    "id": "5",
    "title": "Gerbang Dan Halaman Depan Vihara",
    "year": "",
    "src": "/ms/1001/5.jpeg",
    "description": "Merupakan area pintu masuk atau aula penerima tamu. Biasanya dipakai untuk registrasi acara keagamaan, tempat kumpul sebelum sembahyang, atau ruang administrasi vihara. Halaman luas di tengah dapat digunakan untuk upacara hari besar Buddha, latihan barongsai, atau kegiatan sosial umat."
  }
];

const SPACING = 10;
const WALL_OFFSET = 13;
const BASE_HEIGHT = 3.8;
const ENTRANCE_ZONE = 30;

const generateArtworkPositions = (artworks: typeof artworkData) => {
  return artworks.map((artwork, index) => {
    const isLeftWall = index % 2 === 0;
    const groupIndex = Math.floor(index / 2);
    
    return {
      ...artwork,
      position: {
        x: isLeftWall ? -WALL_OFFSET : WALL_OFFSET,
        y: BASE_HEIGHT,
        z: -groupIndex * SPACING - 8,
      },
      wall: isLeftWall ? 'left' : 'right',
    };
  });
};

const positionedArtworks = generateArtworkPositions(artworkData);

const AUTOPLAY_DELAY = 3.0;

const generateCameraWaypoints = (artworks: ReturnType<typeof generateArtworkPositions>) => {
  return artworks.map((artwork) => {
    const zOffset = 3.5;
    const camX = artwork.position.x < 0 ? -WALL_OFFSET + 8 : WALL_OFFSET - 8;

    return {
      pos: [camX, 4.0, artwork.position.z + zOffset] as [number, number, number],
      look: [artwork.position.x, artwork.position.y, artwork.position.z] as [number, number, number],
      duration: 3.5,
    };
  });
};

const cameraWaypoints = generateCameraWaypoints(positionedArtworks);

const galleryLength = Math.abs(positionedArtworks[positionedArtworks.length - 1].position.z) + 40;

const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function createTextureFromCanvas(width: number, height: number, generator: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  generator(ctx);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  return texture;
}

function generateMarbleTexture() {
  return createTextureFromCanvas(1024, 1024, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#f5f5f0');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#f8f8f3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 100 + 50;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(180, 180, 175, ${Math.random() * 0.15})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
    }
    
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
      ctx.bezierCurveTo(
        Math.random() * 1024, Math.random() * 1024,
        Math.random() * 1024, Math.random() * 1024,
        Math.random() * 1024, Math.random() * 1024
      );
      ctx.strokeStyle = `rgba(160, 160, 155, ${Math.random() * 0.08})`;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.stroke();
    }
  });
}

function generateWoodTexture() {
  return createTextureFromCanvas(512, 512, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, '#8b6f47');
    gradient.addColorStop(0.5, '#a0845a');
    gradient.addColorStop(1, '#8b6f47');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      ctx.fillStyle = `rgba(70, 55, 35, ${Math.random() * 0.3})`;
      ctx.fillRect(x, 0, Math.random() * 2 + 0.5, 512);
    }
    
    for (let i = 0; i < 30; i++) {
      const y = Math.random() * 512;
      const height = Math.random() * 20 + 5;
      ctx.fillStyle = `rgba(60, 45, 30, ${Math.random() * 0.2})`;
      ctx.fillRect(0, y, 512, height);
    }
  });
}

function OrnatePedestal({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
        <meshStandardMaterial 
          color="#2c2416" 
          roughness={0.3} 
          metalness={0.7}
          envMapIntensity={1.2}
        />
      </mesh>
      
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.6, 32]} />
        <meshStandardMaterial 
          color="#3a2d1a" 
          roughness={0.25} 
          metalness={0.75}
          envMapIntensity={1.3}
        />
      </mesh>
      
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.45, 0.1, 32]} />
        <meshStandardMaterial 
          color="#b8985d" 
          roughness={0.2} 
          metalness={0.85}
          envMapIntensity={1.5}
        />
      </mesh>
      
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 16]} />
        <meshStandardMaterial 
          color="#1a1410" 
          roughness={0.35} 
          metalness={0.65}
        />
      </mesh>
      
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.42;
        const z = Math.sin(rad) * 0.42;
        return (
          <mesh key={i} position={[x, 0.75, z]} castShadow>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.15} 
              metalness={0.9}
              emissive="#8b7355"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
      
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.48, 0.15, 32]} />
        <meshStandardMaterial 
          color="#4a3a28" 
          roughness={0.25} 
          metalness={0.75}
        />
      </mesh>
      
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[1.1, 0.15, 1.1]} />
        <meshStandardMaterial 
          color="#5a4530" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {[-0.45, 0.45].map((offset, i) => (
        <React.Fragment key={i}>
          <mesh position={[offset, 1.95, -0.45]} castShadow>
            <boxGeometry args={[0.08, 0.05, 0.08]} />
            <meshStandardMaterial color="#c9a870" roughness={0.15} metalness={0.9} />
          </mesh>
          <mesh position={[offset, 1.95, 0.45]} castShadow>
            <boxGeometry args={[0.08, 0.05, 0.08]} />
            <meshStandardMaterial color="#c9a870" roughness={0.15} metalness={0.9} />
          </mesh>
          <mesh position={[-0.45, 1.95, offset]} castShadow>
            <boxGeometry args={[0.08, 0.05, 0.08]} />
            <meshStandardMaterial color="#c9a870" roughness={0.15} metalness={0.9} />
          </mesh>
          <mesh position={[0.45, 1.95, offset]} castShadow>
            <boxGeometry args={[0.08, 0.05, 0.08]} />
            <meshStandardMaterial color="#c9a870" roughness={0.15} metalness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

function CrystalChandelier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.5, 0.4, 32]} />
        <meshStandardMaterial 
          color="#b8985d" 
          roughness={0.25} 
          metalness={0.85}
          envMapIntensity={1.5}
        />
      </mesh>
      
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.75, 0.04, 16, 32]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.2} 
          metalness={0.9}
          emissive="#8b7355"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.65;
        const z = Math.sin(rad) * 0.65;
        return (
          <group key={i}>
            <mesh position={[x, 0.3, z]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#8b7355" roughness={0.3} metalness={0.8} />
            </mesh>
            
            <mesh position={[x, 0, z]}>
              <coneGeometry args={[0.08, 0.25, 6]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent
                opacity={0.95}
                roughness={0.05}
                metalness={0.1}
                envMapIntensity={2}
              />
            </mesh>
            
            <mesh position={[x, -0.15, z]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial 
                color="#fff9e6" 
                emissive="#ffebb3" 
                emissiveIntensity={2.5}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
            
            <pointLight
              position={[x, -0.15, z]}
              intensity={3.0}
              distance={18}
              color="#ffe8b8"
              decay={1.6}
            />
          </group>
        );
      })}
      
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.3;
        const z = Math.sin(rad) * 0.3;
        return (
          <mesh key={`inner-${i}`} position={[x, 0.15, z]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent
              opacity={0.9}
              roughness={0.05}
              metalness={0.2}
              envMapIntensity={2.5}
            />
          </mesh>
        );
      })}
      
      <pointLight
        position={[0, 0, 0]}
        intensity={2.0}
        distance={22}
        color="#fff5e0"
        decay={1.7}
      />
    </group>
  );
}

function ArtLightRig({ position, direction }: { position: [number, number, number]; direction: 'left' | 'right' }) {
  const angle = direction === 'left' ? 0.5 : -0.5;
  
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.9}
          envMapIntensity={1.2}
        />
      </mesh>
      
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.25} 
          metalness={0.85}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[angle, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 12]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      <mesh position={[0, -0.15, 0.15]} rotation={[angle + 0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.1, 0.28, 24]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.25} 
          metalness={0.85}
        />
      </mesh>
      
      <mesh position={[0, -0.3, 0.22]} rotation={[angle + 0.4, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 24]} />
        <meshStandardMaterial 
          color="#fff9f0" 
          emissive="#ffe5b3"
          emissiveIntensity={0.8}
          roughness={0.05} 
          metalness={0.95}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      <mesh position={[0, -0.18, 0.17]} rotation={[angle + 0.4, 0, 0]}>
        <torusGeometry args={[0.13, 0.015, 12, 24]} />
        <meshStandardMaterial 
          color="#8b7355" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      <spotLight
        position={[0, -0.35, 0.25]}
        angle={0.75}
        penumbra={0.7}
        intensity={4.5}
        distance={25}
        color="#fff8e6"
        castShadow={false}
        decay={1.5}
      />
      
      <pointLight
        position={[0, -0.3, 0.2]}
        intensity={1.5}
        distance={10}
        color="#fffaf0"
        decay={1.8}
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
    const targetScale = isActive ? 1.08 : 1;
    groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const frameWidth = 4.5;
  const frameHeight = 4.5;
  const frameDepth = 0.35;
  const frameThickness = 0.25;
  const matteWidth = 0.35;

  const isLeftWall = artwork.wall === 'left';
  const rotation: [number, number, number] = isLeftWall ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];
  const pedestalOffset = isLeftWall ? -0.8 : 0.8;

  return (
    <>
      <group ref={groupRef} position={[artwork.position.x, artwork.position.y, artwork.position.z]} rotation={rotation}>
        {imageLoaded && (
          <mesh position={[0, 0, 0.18]} castShadow>
            <planeGeometry args={[frameWidth - matteWidth * 2 - frameThickness * 2, frameHeight - matteWidth * 2 - frameThickness * 2]} />
            {texture ? (
              <meshStandardMaterial 
                map={texture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#888" roughness={0.8} />
            )}
          </mesh>
        )}

        <mesh position={[0, 0, 0.14]} receiveShadow>
          <planeGeometry args={[frameWidth - frameThickness * 2, frameHeight - frameThickness * 2]} />
          <meshStandardMaterial 
            color="#fefefe" 
            roughness={0.25} 
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, frameHeight / 2 - frameThickness / 2, 0.08]}>
          <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
          <meshStandardMaterial 
            color="#3a2d1a" 
            roughness={0.2} 
            metalness={0.15}
            envMapIntensity={0.6}
          />
        </mesh>

        <mesh position={[0, -(frameHeight / 2 - frameThickness / 2), 0.08]}>
          <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
          <meshStandardMaterial 
            color="#3a2d1a" 
            roughness={0.2} 
            metalness={0.15}
            envMapIntensity={0.6}
          />
        </mesh>

        <mesh position={[-(frameWidth / 2 - frameThickness / 2), 0, 0.08]}>
          <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
          <meshStandardMaterial 
            color="#3a2d1a" 
            roughness={0.2} 
            metalness={0.15}
            envMapIntensity={0.6}
          />
        </mesh>

        <mesh position={[(frameWidth / 2 - frameThickness / 2), 0, 0.08]}>
          <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
          <meshStandardMaterial 
            color="#3a2d1a" 
            roughness={0.2} 
            metalness={0.15}
            envMapIntensity={0.6}
          />
        </mesh>

        {[-0.15, -0.05, 0.05, 0.15].map((offset, i) => (
          <React.Fragment key={i}>
            <mesh position={[0, frameHeight / 2 - frameThickness / 2 + offset, offset * 0.3]}>
              <boxGeometry args={[frameWidth - 0.1, 0.03, 0.03]} />
              <meshStandardMaterial 
                color="#b8985d" 
                roughness={0.15} 
                metalness={0.85}
              />
            </mesh>
            <mesh position={[0, -(frameHeight / 2 - frameThickness / 2 + offset), offset * 0.3]}>
              <boxGeometry args={[frameWidth - 0.1, 0.03, 0.03]} />
              <meshStandardMaterial 
                color="#b8985d" 
                roughness={0.15} 
                metalness={0.85}
              />
            </mesh>
            <mesh position={[-(frameWidth / 2 - frameThickness / 2 + offset), 0, offset * 0.3]}>
              <boxGeometry args={[0.03, frameHeight - 0.1, 0.03]} />
              <meshStandardMaterial 
                color="#b8985d" 
                roughness={0.15} 
                metalness={0.85}
              />
            </mesh>
            <mesh position={[(frameWidth / 2 - frameThickness / 2 + offset), 0, offset * 0.3]}>
              <boxGeometry args={[0.03, frameHeight - 0.1, 0.03]} />
              <meshStandardMaterial 
                color="#b8985d" 
                roughness={0.15} 
                metalness={0.85}
              />
            </mesh>
          </React.Fragment>
        ))}

        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[frameWidth, frameHeight, 0.16]} />
          <meshStandardMaterial 
            color="#2a2016" 
            roughness={0.4} 
            metalness={0.2}
          />
        </mesh>

        <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0]}>
          <boxGeometry args={[frameWidth + 0.04, frameHeight + 0.04, 0.08]} />
          <meshStandardMaterial 
            color="#5a4530" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>

        {[
          [-frameWidth / 2 + 0.3, -frameHeight / 2 + 0.3],
          [frameWidth / 2 - 0.3, -frameHeight / 2 + 0.3],
          [-frameWidth / 2 + 0.3, frameHeight / 2 - 0.3],
          [frameWidth / 2 - 0.3, frameHeight / 2 - 0.3],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.18]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.15} 
              metalness={0.9}
              emissive="#8b7355"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        <mesh position={[0, -(frameHeight / 2 + 0.4), 0.12]}>
          <boxGeometry args={[frameWidth * 0.5, 0.18, 0.12]} />
          <meshStandardMaterial 
            color="#1a1410" 
            roughness={0.15} 
            metalness={0.85}
          />
        </mesh>

        {isActive && (
          <>
            <spotLight
              position={[0, 4.0, 4.0]}
              angle={0.5}
              penumbra={0.7}
              intensity={12}
              distance={20}
              color="#fff5e1"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.00003}
              decay={1.6}
            />
            
            <pointLight
              position={[0, 2.5, 3.0]}
              intensity={5.0}
              distance={14}
              color="#fffaf0"
              decay={1.7}
            />
            
            <pointLight
              position={[artwork.position.x > 0 ? 5 : -5, 5, artwork.position.z]}
              intensity={4.0}
              distance={12}
              color="#ffecd9"
              decay={1.9}
            />
            
            <pointLight
              position={[artwork.position.x > 0 ? -3 : 3, 3.5, artwork.position.z -1.5]}
              intensity={2.5}
              distance={10}
              color="#fff4e0"
              decay={2.0}
            />
          </>
        )}
      </group>
      <OrnatePedestal 
        position={[artwork.position.x + pedestalOffset, 0, artwork.position.z]} 
        rotation={rotation}
      />
    </>
  );
}

function GalleryEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);
  const marbleTexture = useMemo(() => generateMarbleTexture(), []);
  const woodTexture = useMemo(() => generateWoodTexture(), []);

  return (
    <group>
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]} receiveShadow>
        <planeGeometry args={[32, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          map={marbleTexture}
          color="#f5f5f0" 
          roughness={0.2} 
          metalness={0.15}
          envMapIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-16, 7.5, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]}>
        <boxGeometry args={[0.6, 15, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          color="#e8e5df" 
          roughness={0.5} 
          metalness={0.05}
        />
      </mesh>

      <mesh position={[16, 7.5, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]}>
        <boxGeometry args={[0.6, 15, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          color="#e8e5df" 
          roughness={0.5} 
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, 15, -(galleryLength + ENTRANCE_ZONE) / 2 + ENTRANCE_ZONE / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          color="#fafaf8" 
          roughness={0.4} 
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, 7.5, -galleryLength + ENTRANCE_ZONE / 2 - 1]}>
        <boxGeometry args={[32, 15, 2]} />
        <meshStandardMaterial 
          color="#e8e5df" 
          roughness={0.5} 
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, 7.5, ENTRANCE_ZONE / 2 + 1]}>
        <boxGeometry args={[32, 15, 2]} />
        <meshStandardMaterial 
          color="#e8e5df" 
          roughness={0.5} 
          metalness={0.05}
        />
      </mesh>

      {[...Array(Math.ceil(galleryLength / 14))].map((_, i) => {
        const zPos = 20 - i * 14;
        const showBench = i % 2 === 0;
        
        return (
          <React.Fragment key={`furniture-${i}`}>
            {showBench && (
              <group>
                <mesh position={[0, 0.45, zPos]} castShadow receiveShadow>
                  <boxGeometry args={[3.5, 0.12, 1.2]} />
                  <meshStandardMaterial 
                    map={woodTexture}
                    color="#8b6f47" 
                    roughness={0.4} 
                    metalness={0.2}
                  />
                </mesh>
                
                <mesh position={[0, 0.25, zPos]} castShadow>
                  <boxGeometry args={[3.3, 0.4, 1.0]} />
                  <meshStandardMaterial 
                    color="#7a5f3a" 
                    roughness={0.45} 
                    metalness={0.15}
                  />
                </mesh>
                
                {[-1.5, 1.5].map((xPos, idx) => (
                  <group key={idx}>
                    <mesh position={[xPos, 0.03, zPos]} castShadow>
                      <boxGeometry args={[0.3, 0.4, 0.3]} />
                      <meshStandardMaterial color="#6a5230" roughness={0.5} metalness={0.15} />
                    </mesh>
                    
                    <mesh position={[xPos, 0.03, zPos - 0.4]} castShadow>
                      <boxGeometry args={[0.25, 0.4, 0.25]} />
                      <meshStandardMaterial color="#6a5230" roughness={0.5} metalness={0.15} />
                    </mesh>
                    
                    <mesh position={[xPos, 0.03, zPos + 0.4]} castShadow>
                      <boxGeometry args={[0.25, 0.4, 0.25]} />
                      <meshStandardMaterial color="#6a5230" roughness={0.5} metalness={0.15} />
                    </mesh>
                  </group>
                ))}
                
                <mesh position={[0, 0.85, zPos - 0.5]} castShadow>
                  <boxGeometry args={[3.5, 0.6, 0.12]} />
                  <meshStandardMaterial 
                    map={woodTexture}
                    color="#8b6f47" 
                    roughness={0.4} 
                    metalness={0.2}
                  />
                </mesh>
                
                {[-1.4, 0, 1.4].map((xPos, idx) => (
                  <mesh key={idx} position={[xPos, 0.85, zPos - 0.45]} castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
                    <meshStandardMaterial color="#5a4530" roughness={0.45} metalness={0.2} />
                  </mesh>
                ))}
              </group>
            )}
          </React.Fragment>
        );
      })}

      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, galleryLength + ENTRANCE_ZONE]} />
        <meshStandardMaterial 
          color="#c9b8a0" 
          roughness={0.65} 
          metalness={0.05}
        />
      </mesh>

      {[...Array(Math.ceil(galleryLength / 12))].map((_, i) => (
        <React.Fragment key={`ceiling-detail-${i}`}>
          <mesh position={[-13, 14.5, 18 - i * 12]}>
            <boxGeometry args={[2.5, 0.3, 0.3]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.2} 
              metalness={0.85}
              emissive="#8b7355"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[13, 14.5, 18 - i * 12]}>
            <boxGeometry args={[2.5, 0.3, 0.3]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.2} 
              metalness={0.85}
              emissive="#8b7355"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          <mesh position={[-13, 14.3, 18 - i * 12]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color="#b8985d" roughness={0.25} metalness={0.8} />
          </mesh>
          <mesh position={[13, 14.3, 18 - i * 12]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color="#b8985d" roughness={0.25} metalness={0.8} />
          </mesh>
        </React.Fragment>
      ))}

      {[...Array(7)].map((_, i) => (
        <group key={`column-${i}`}>
          <mesh position={[-14, 7.5, 15 - i * 16]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.5, 15, 24]} />
            <meshStandardMaterial 
              map={marbleTexture}
              color="#f0ebe5" 
              roughness={0.3} 
              metalness={0.15}
            />
          </mesh>
          <mesh position={[14, 7.5, 15 - i * 16]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.5, 15, 24]} />
            <meshStandardMaterial 
              map={marbleTexture}
              color="#f0ebe5" 
              roughness={0.3} 
              metalness={0.15}
            />
          </mesh>
          
          <mesh position={[-14, 15.2, 15 - i * 16]}>
            <cylinderGeometry args={[0.65, 0.45, 0.5, 24]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.2} 
              metalness={0.85}
            />
          </mesh>
          <mesh position={[14, 15.2, 15 - i * 16]}>
            <cylinderGeometry args={[0.65, 0.45, 0.5, 24]} />
            <meshStandardMaterial 
              color="#d4af37" 
              roughness={0.2} 
              metalness={0.85}
            />
          </mesh>
          
          <mesh position={[-14, 0.3, 15 - i * 16]}>
            <cylinderGeometry args={[0.55, 0.5, 0.6, 24]} />
            <meshStandardMaterial 
              color="#c5b5a5" 
              roughness={0.35} 
              metalness={0.2}
            />
          </mesh>
          <mesh position={[14, 0.3, 15 - i * 16]}>
            <cylinderGeometry args={[0.55, 0.5, 0.6, 24]} />
            <meshStandardMaterial 
              color="#c5b5a5" 
              roughness={0.35} 
              metalness={0.2}
            />
          </mesh>
          
          {[0, 90, 180, 270].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const xOffset = Math.cos(rad) * 0.42;
            const zOffset = Math.sin(rad) * 0.42;
            return (
              <React.Fragment key={idx}>
                <mesh position={[-14 + xOffset, 7.5, 15 - i * 16 + zOffset]}>
                  <boxGeometry args={[0.08, 14, 0.08]} />
                  <meshStandardMaterial color="#b8985d" roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh position={[14 + xOffset, 7.5, 15 - i * 16 + zOffset]}>
                  <boxGeometry args={[0.08, 14, 0.08]} />
                  <meshStandardMaterial color="#b8985d" roughness={0.3} metalness={0.7} />
                </mesh>
              </React.Fragment>
            );
          })}
        </group>
      ))}

      <group position={[0, 0, ENTRANCE_ZONE / 2 - 6]}>
        <mesh position={[-6.5, 5.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 11, 0.8]} />
          <meshStandardMaterial 
            map={woodTexture}
            color="#5a4530" 
            roughness={0.35} 
            metalness={0.25}
          />
        </mesh>
        <mesh position={[6.5, 5.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 11, 0.8]} />
          <meshStandardMaterial 
            map={woodTexture}
            color="#5a4530" 
            roughness={0.35} 
            metalness={0.25}
          />
        </mesh>
        
        <mesh position={[0, 11.2, 0]} castShadow>
          <boxGeometry args={[15, 1.0, 0.8]} />
          <meshStandardMaterial 
            map={woodTexture}
            color="#5a4530" 
            roughness={0.35} 
            metalness={0.25}
          />
        </mesh>
        
        {[-1, 1].map((side, idx) => (
          <mesh key={idx} position={[side * 6.8, 8, 0]} castShadow>
            <boxGeometry args={[0.6, 5.5, 0.8]} />
            <meshStandardMaterial color="#6a5330" roughness={0.4} metalness={0.2} />
          </mesh>
        ))}
        
        <mesh position={[0, 11.9, 0]} castShadow>
          <boxGeometry args={[15.5, 0.4, 1.0]} />
          <meshStandardMaterial 
            color="#d4af37" 
            roughness={0.2} 
            metalness={0.85}
            emissive="#8b7355"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {[-5, -2.5, 0, 2.5, 5].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0.6, 0]}>
            <cylinderGeometry args={[0.15, 0.18, 1.2, 16]} />
            <meshStandardMaterial color="#4a3a28" roughness={0.4} metalness={0.25} />
          </mesh>
        ))}
      </group>

      {[...Array(Math.ceil(galleryLength / 22))].map((_, i) => (
        <CrystalChandelier 
          key={`chandelier-${i}`}
          position={[0, 13, 12 - i * 22]} 
        />
      ))}

      {positionedArtworks.map((artwork, i) => (
        <React.Fragment key={`spotlight-${i}`}>
          <ArtLightRig 
            position={[
              artwork.position.x,
              artwork.position.y + 4.0,
              artwork.position.z
            ]}
            direction={artwork.wall === 'left' ? 'left' : 'right'}
          />
        </React.Fragment>
      ))}
    </group>
  );
}

function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fffefb" />
      
      <directionalLight
        position={[30, 50, 40]}
        intensity={1.0}
        color="#fffcf5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-bias={-0.0001}
      />
      
      <hemisphereLight
        args={['#fffef8', '#8a7a65', 0.5]}
        position={[0, 35, 0]}
      />
      
      <directionalLight
        position={[-25, 30, -25]}
        intensity={0.4}
        color="#fff9f0"
      />
      
      {positionedArtworks.map((artwork, i) => (
        <React.Fragment key={`ceiling-light-${i}`}>
          <spotLight
            position={[artwork.position.x > 0 ? 7 : -7, 13.5, artwork.position.z]}
            intensity={1.8}
            angle={0.7}
            penumbra={0.65}
            distance={25}
            color="#fffcf2"
            castShadow={false}
            decay={1.7}
          />
          <pointLight
            position={[artwork.position.x > 0 ? -5 : 5, 10, artwork.position.z]}
            intensity={0.8}
            distance={14}
            color="#fff7eb"
            decay={1.9}
          />
        </React.Fragment>
      ))}

      {[...Array(Math.ceil(galleryLength / 10))].map((_, i) => (
        <React.Fragment key={`ambient-${i}`}>
          <pointLight
            position={[0, 12, 22 - i * 10]}
            intensity={0.6}
            distance={20}
            color="#fffaf2"
            decay={1.8}
          />
          <pointLight
            position={[-10, 9, 22 - i * 10]}
            intensity={0.3}
            distance={15}
            color="#fff8ed"
            decay={2.0}
          />
          <pointLight
            position={[10, 9, 22 - i * 10]}
            intensity={0.3}
            distance={15}
            color="#fff8ed"
            decay={2.0}
          />
        </React.Fragment>
      ))}
      
      {[...Array(Math.ceil(galleryLength / 18))].map((_, i) => (
        <React.Fragment key={`wall-wash-${i}`}>
          <pointLight
            position={[-14, 8, 18 - i * 18]}
            intensity={0.35}
            distance={9}
            color="#fff9f0"
            decay={2.1}
          />
          <pointLight
            position={[14, 8, 18 - i * 18]}
            intensity={0.35}
            distance={9}
            color="#fff9f0"
            decay={2.1}
          />
        </React.Fragment>
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
      const t = easeInOutCubic(Math.min(state.progress / duration, 1));

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
    
    if (state.progress > duration) {
      const sway = Math.sin(clock.elapsedTime * 0.25) * 0.012;
      const bob = Math.sin(clock.elapsedTime * 0.4) * 0.008;
      camera.position.x += sway;
      camera.position.y += bob;
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
      transition={{ duration: 0.5 }}
      className="pointer-events-none flex h-screen items-center justify-center"
    >
      <div className="w-80 h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/20 shadow-2xl">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/50"
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
        camera={{ position: [0, 4.0, 15], fov: isMobile ? 75 : 60, far: 700 }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isMobile ? 1.4 : 1.5,
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
        <fog attach="fog" args={['#0a0a0a', 50, 120]} />
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
                'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.15) 0%, transparent 55%)',
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
                <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-extralight tracking-[0.35em] text-white drop-shadow-2xl">
                  Perkembangan Vihara Padmakirti
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-0.5 w-28 sm:w-32 md:w-36 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8 md:mb-12"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mb-6 text-lg sm:text-2xl md:text-3xl text-gray-100 font-extralight tracking-wide"
              >
                Galeri Seni Digital Premium
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mb-10 md:mb-14 text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-xl mx-auto px-4"
              >
                Rasakan pengalaman galeri kelas dunia dengan detail arsitektur mewah, pencahayaan profesional, 
                dan koleksi yang dipresentasikan dengan standar museum internasional.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: '0 30px 60px rgba(217, 119, 6, 0.6)' }}
                whileTap={{ scale: 0.95 }}onClick={() => setHasEntered(true)}
                className="group px-12 sm:px-18 md:px-24 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-500 text-white font-semibold text-base sm:text-lg md:text-xl rounded-full transition-all shadow-2xl relative overflow-hidden"
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
                className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4"
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
                      <span>Tur Otomatis</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span>Geser kiri/kanan untuk navigasi</span>
                    <span>Tap tombol play untuk tur otomatis</span>
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
            className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-50"
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
                className="text-5xl md:text-7xl font-extralight text-white mb-8 tracking-widest"
              >
                SELAMAT DATANG
              </motion.h2>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="h-px w-40 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-10"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-3xl text-gray-300 mb-14 font-light leading-relaxed"
              >
                Nikmati perjalanan visual melalui galeri dengan arsitektur neoklasik yang memukau. 
                Setiap karya dipamerkan pada pedestal ornamental dengan pencahayaan kristal yang elegan.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex items-center gap-3 text-base text-amber-400">
                  <kbd className="px-5 py-3 bg-white/10 rounded-lg border border-amber-500/30 font-mono shadow-lg">
                    Tekan tombol apa saja atau tap layar
                  </kbd>
                </div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-6"
                >
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="absolute top-5 sm:top-7 md:top-10 right-5 sm:right-7 md:right-10 px-5 sm:px-6 md:px-7 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-xl md:rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 z-20 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/60" />
              <span className="text-sm sm:text-base text-gray-200 font-light whitespace-nowrap">
                {isPlaying ? 'Tur Aktif' : 'Mode Manual'}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-28 sm:bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 w-56 sm:w-72 md:w-80 z-20"
          >
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/20 shadow-xl">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/50"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / cameraWaypoints.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-3 text-center text-sm sm:text-base text-gray-400 font-light">
              Karya {currentIndex + 1} dari {cameraWaypoints.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 md:gap-5 z-20"
          >
            <motion.button
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-20 disabled:cursor-not-allowed p-3 sm:p-4 md:p-5 text-white transition-all backdrop-blur-xl border border-white/25 shadow-2xl"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 p-3 sm:p-4 md:p-5 text-white transition-all shadow-2xl shadow-amber-500/40"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                {isPlaying ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex((p) => Math.min(cameraWaypoints.length - 1, p + 1))}
              disabled={currentIndex === cameraWaypoints.length - 1}
              className="rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-20 disabled:cursor-not-allowed p-3 sm:p-4 md:p-5 text-white transition-all backdrop-blur-xl border border-white/25 shadow-2xl"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        </>
      )}

      {hasEntered && positionedArtworks[currentIndex] && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-8 sm:top-10 md:top-12 left-5 sm:left-7 md:left-12 max-w-sm sm:max-w-md md:max-w-xl z-20"
        >
          <div className="rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/80 via-black/70 to-black/80 p-6 sm:p-8 md:p-12 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extralight text-white mb-3 md:mb-4 tracking-wide line-clamp-2">
                {positionedArtworks[currentIndex].title}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 md:mb-6 tracking-wide">
                {positionedArtworks[currentIndex].year}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-px bg-gradient-to-r from-amber-400 via-amber-500 to-transparent mb-5 md:mb-7"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-7 md:mb-10 font-light line-clamp-3 md:line-clamp-none">
                {positionedArtworks[currentIndex].description}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs sm:text-sm md:text-base text-gray-500 pt-5 md:pt-7 border-t border-white/20"
            >
              <span className="font-medium">Karya {currentIndex + 1} dari {positionedArtworks.length}</span>
              <span className="text-amber-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Navigasi dengan tombol panah
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}