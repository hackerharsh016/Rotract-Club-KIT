import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let isDisposed = false;

    try {
      const container = containerRef.current;
      const canvas = canvasRef.current;

      // 1. Scene & Camera setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 7.0);

      // 2. High-Fidelity WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // 3. Logo Root Group (Centered Background 3D Logo - Pure Unlit)
      const logoRoot = new THREE.Group();
      const logoMeshGroup = new THREE.Group();
      logoRoot.add(logoMeshGroup);
      scene.add(logoRoot);

      // Responsive Scale & Placement Helper
      const updateLogoLayout = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const aspect = width / height;

        // Balanced scale so the 3D logo sits elegantly in the background
        let scale: number;
        if (aspect < 0.75) {
          // Mobile Portrait
          scale = 1.7;
          camera.position.z = 7.5;
        } else if (aspect < 1.2) {
          // Tablet
          scale = 2.0;
          camera.position.z = 7.2;
        } else if (aspect < 1.8) {
          // Standard Desktop
          scale = 2.35;
          camera.position.z = 7.0;
        } else {
          // Ultrawide Screens
          scale = 2.5;
          camera.position.z = 7.0;
        }

        logoRoot.scale.set(scale, scale, scale);
        logoRoot.position.set(0, 0, 0);
      };
      updateLogoLayout();

      // Load High-Resolution Logo Texture
      const textureLoader = new THREE.TextureLoader();
      const logoTexture = textureLoader.load("/Rotract_logo.png", () => {
        logoTexture.colorSpace = THREE.SRGBColorSpace;
        logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
        logoTexture.magFilter = THREE.LinearFilter;
        logoTexture.generateMipmaps = true;
        logoTexture.needsUpdate = true;
      });

      // 4. Immersive 3D Volumetric Logo Construction (Pure True-Color - No Artificial Lights)
      const disposableGeometries: THREE.BufferGeometry[] = [];
      const disposableMaterials: THREE.Material[] = [];

      // Multi-layered 3D Depth Slices (Giving the emblem realistic volumetric thickness)
      const depthLayersCount = 8;
      const totalDepth = 0.12;

      for (let i = 0; i < depthLayersCount; i++) {
        const progress = i / (depthLayersCount - 1); // 0 (back) to 1 (front)
        const zPos = -totalDepth / 2 + progress * totalDepth;
        const layerScale = 1.0 - (1 - progress) * 0.025; // Subtle bevel taper

        const layerGeo = new THREE.PlaneGeometry(2.0 * layerScale, 2.0 * layerScale, 16, 16);
        disposableGeometries.push(layerGeo);

        // Gradient tint from deep brand cranberry at the back to bright clean white at front
        const layerColor = new THREE.Color().lerpColors(
          new THREE.Color(0x99114d),
          new THREE.Color(0xffffff),
          progress
        );

        const isFrontFace = i === depthLayersCount - 1;

        const layerMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.6, // Added to make it faint in color
          color: isFrontFace ? 0xffffff : layerColor,
        side: THREE.DoubleSide,
        });
        disposableMaterials.push(layerMat);

        const layerMesh = new THREE.Mesh(layerGeo, layerMat);
        layerMesh.position.z = zPos;
        logoMeshGroup.add(layerMesh);

        if (i === 0) {
          layerMesh.rotation.y = 0;
        }
      }

      // Micro-Glint Dust
      const particleCount = 120;
      const particleGeo = new THREE.BufferGeometry();
      disposableGeometries.push(particleGeo);

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const c1 = new THREE.Color("#FF77B5");
      const c2 = new THREE.Color("#FFD166");
      const c3 = new THREE.Color("#FFFFFF");

      for (let i = 0; i < particleCount; i++) {
        const radius = 1.2 + Math.random() * 2.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi) * 0.6;

        const pick = Math.random();
        const col = pick < 0.45 ? c1 : pick < 0.8 ? c2 : c3;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposableMaterials.push(particleMat);

      const particlePoints = new THREE.Points(particleGeo, particleMat);
      scene.add(particlePoints);

      // 5. Smooth Mouse & Touch State for 3D Interactivity
      const pointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        isInteracting: false,
      };

      const onMouseMove = (e: MouseEvent) => {
        pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        pointer.isInteracting = true;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          pointer.targetX = (t.clientX / window.innerWidth - 0.5) * 2;
          pointer.targetY = (t.clientY / window.innerHeight - 0.5) * 2;
          pointer.isInteracting = true;
        }
      };

      const onResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        updateLogoLayout();
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("resize", onResize);

      // 6. Render Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        if (isDisposed) return;
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Physics-smooth pointer interpolation
        pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, 0.055);
        pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, 0.055);

        // 3D Tilt in all directions responding dynamically to mouse
        const tiltX = pointer.y * 0.45 + Math.sin(time * 0.8) * 0.06;
        const tiltY = pointer.x * 0.55 + Math.cos(time * 0.6) * 0.08;
        const tiltZ = -pointer.x * pointer.y * 0.18 + Math.sin(time * 0.5) * 0.03;

        logoMeshGroup.rotation.x = THREE.MathUtils.lerp(logoMeshGroup.rotation.x, tiltX, 0.06);
        logoMeshGroup.rotation.y = THREE.MathUtils.lerp(logoMeshGroup.rotation.y, tiltY, 0.06);
        logoMeshGroup.rotation.z = THREE.MathUtils.lerp(logoMeshGroup.rotation.z, tiltZ, 0.06);

        // Harmonic Floating Breathing Motion (Subtle & Centered)
        const floatY = Math.sin(time * 1.1) * 0.08 - pointer.y * 0.1;
        const floatX = pointer.x * 0.12;
        const floatZ = Math.cos(time * 0.9) * 0.06;

        logoRoot.position.x = THREE.MathUtils.lerp(logoRoot.position.x, floatX, 0.05);
        logoRoot.position.y = THREE.MathUtils.lerp(logoRoot.position.y, floatY, 0.05);
        logoRoot.position.z = THREE.MathUtils.lerp(logoRoot.position.z, floatZ, 0.05);

        // Micro-glint rotation
        particlePoints.rotation.y = time * 0.03 + pointer.x * 0.1;
        particlePoints.rotation.x = time * 0.02 + pointer.y * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("resize", onResize);

        // Clean memory disposal
        disposableGeometries.forEach((g) => g.dispose());
        disposableMaterials.forEach((m) => m.dispose());
        logoTexture.dispose();

        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("[HeroParticles] WebGL initialization fallback:", err);
      setWebglSupported(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {webglSupported ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-brand-soft)" }}
        />
      )}
    </div>
  );
}

export default HeroParticles;
