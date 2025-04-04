'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import OptimizedRenderer from '../utils/optimization/OptimizedRenderer';

export const pauseThreeJsAnimations = () => {
  if (window._threeJsInstance) {
    window._threeJsInstance.isPaused = true;
  }
};

export const resumeThreeJsAnimations = () => {
  if (window._threeJsInstance) {
    window._threeJsInstance.isPaused = false;
  }
};

const WaveDots = () => {
  const [isPaused, setIsPaused] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    geometry: THREE.BufferGeometry | null;
    material: THREE.ShaderMaterial | null;
    animationFrameId: number | null;
    particles: THREE.Points | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    geometry: null,
    material: null,
    animationFrameId: null,
    particles: null
  });

  // Effect to mark component as ready after mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Main Three.js initialization and cleanup
  useEffect(() => {
    if (!isReady || !mountRef.current) return;
    
    // Clean up any existing instances first
    if (window._threeJsInstance) {
      const oldInstance = window._threeJsInstance;
      if (oldInstance.animationFrameId) {
        cancelAnimationFrame(oldInstance.animationFrameId);
      }
      
      if (oldInstance.renderer) {
        try {
          oldInstance.renderer.dispose();
          oldInstance.renderer.forceContextLoss();
        } catch (e) {
          console.log('Cleanup error (renderer):', e);
        }
      }
    }
    
    // Make separation and amount responsive to screen size
    const isMobile = window.innerWidth < 768;
    const SEPARATION = isMobile ? 80 : 100;
    const AMOUNTX = isMobile ? 60 : 80;
    const AMOUNTY = isMobile ? 60 : 80;
    
    // Base scale factor - larger for mobile
    const SCALE_FACTOR = isMobile ? 30 : 15;
    
    let frameCount = 0;
    const FRAME_SKIP = 2; // Only update every 2nd frame

    let count = 0;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let firstMove = false;

    try {
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current.scene = scene;
      scene.background = new THREE.Color(0xffffff);
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      sceneRef.current.camera = camera;
      camera.position.z = 1800;
      camera.position.x = 0;
      camera.position.y = 200;
      
      // Create renderer with stable settings
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
      });
      sceneRef.current.renderer = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Append to DOM only if mountRef exists
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Create particles
      const numParticles = AMOUNTX * AMOUNTY;
      const positions = new Float32Array(numParticles * 3);
      const scales = new Float32Array(numParticles);
      const zDepths = new Float32Array(numParticles); // For depth-based blur

      let i = 0, j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          positions[i + 1] = 0;
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
          scales[j] = 1;
          zDepths[j] = 0; // Will be updated in animation loop
          i += 3;
          j++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      sceneRef.current.geometry = geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('zDepth', new THREE.BufferAttribute(zDepths, 1));

      // Enhanced shader material with depth-based blur
      const material = new THREE.ShaderMaterial({
        uniforms: { 
          color: { value: new THREE.Color(0x000000) },
          focusDistance: { value: 1600.0 }, // Distance where dots are in focus
          focusRange: { value: 1000.0 }, // Range of focus
          maxBlur: { value: 0.3 } // Maximum blur amount
        },
        vertexShader: `
          attribute float scale;
          attribute float zDepth;
          varying float vZDepth;
          
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.2);
            gl_PointSize = scale * (150.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            // Pass depth to fragment shader
            vZDepth = -mvPosition.z;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float focusDistance;
          uniform float focusRange;
          uniform float maxBlur;
          varying float vZDepth;
          
          void main() {
            // Calculate distance from point to circle center
            vec2 center = vec2(0.5, 0.5);
            float dist = length(gl_PointCoord - center);
            
            // Calculate blur factor based on depth
            float depthDifference = abs(vZDepth - focusDistance);
            float blurFactor = clamp(depthDifference / focusRange, 0.0, maxBlur);
            
            // Apply blur by softening the dot edge
            float edge = 0.475; // Base edge sharpness
            float alpha = 1.0 - smoothstep(edge * (1.0 - blurFactor), edge + blurFactor * 0.4, dist);
            
            if (alpha < 0.05) discard; // Discard very transparent pixels
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true, // Enable transparency for blur effect
      });
      sceneRef.current.material = material;

      const particles = new THREE.Points(geometry, material);
      sceneRef.current.particles = particles;
      scene.add(particles);

      function onPointerMove(event: PointerEvent) {
        if (!event.isPrimary) return;
        firstMove = true;
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      }
      
      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      

      function animate() {
        // Early return if paused
        if (window._threeJsInstance?.isPaused) {
          sceneRef.current.animationFrameId = requestAnimationFrame(animate);
          return;
        }
        // Safety check to prevent errors if component is unmounting
        if (!sceneRef.current.scene) return;
        
        if (firstMove) {
          const targetX = mouseX * 0.3;
          camera.position.x += (targetX - camera.position.x) * 0.05;
        }
        
        camera.position.y = 230;
        camera.lookAt(scene.position);
      
        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            // Create a more dynamic wave with varying heights
            const height = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.3) * 50 - 100;
            positions[i + 1] = height;
            
            // Store z-depth for use in the shader
            const zPos = positions[i + 2];
            const xPos = positions[i];
            // Calculate depth based on position and wave height
            const depth = Math.sqrt(xPos*xPos + height*height + zPos*zPos);
            zDepths[j] = depth;
            
            scales[j] = (Math.sin((ix + count) * 0.3) + 1) * SCALE_FACTOR + 
                        (Math.sin((iy + count) * 0.3) + 1) * SCALE_FACTOR;
            
            i += 3;
            j++;
          }
        }

        frameCount++;
        if (frameCount % FRAME_SKIP === 0) {
          // Only update particles every N frames
          let i = 0, j = 0;
          for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
              // Update particle positions...
            }
          }
          
          // Update attributes
          if (particles && particles.geometry) {
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.scale.needsUpdate = true;
            particles.geometry.attributes.zDepth.needsUpdate = true;
          }
        }

        // Dynamically adjust focus distance based on sin wave for natural focusing effect
        if (sceneRef.current.material) {
          const focusWave = Math.sin(count * 0.03) * 300 + 1600;
          sceneRef.current.material.uniforms.focusDistance.value = focusWave;
        }

        // Always render
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
        
        count += 0.04; // Wave speed
        sceneRef.current.animationFrameId = requestAnimationFrame(animate);
      }

      // Add event listeners
      mountRef.current.addEventListener('pointermove', onPointerMove);
      window.addEventListener('resize', onWindowResize);
      
      // Store this instance globally
      window._threeJsInstance = sceneRef.current;
      
      // Start animation
      animate();

      // Cleanup function - only runs on unmount
      return () => {
        // Cancel animation frame first
        if (sceneRef.current.animationFrameId) {
          cancelAnimationFrame(sceneRef.current.animationFrameId);
          sceneRef.current.animationFrameId = null;
        }
        
        // Remove event listeners
        window.removeEventListener('resize', onWindowResize);
        if (mountRef.current) {
          mountRef.current.removeEventListener('pointermove', onPointerMove);
        }
        
        // Helper function to safely dispose objects
        const safeDispose = (obj: any) => {
          if (obj && typeof obj.dispose === 'function') {
            try {
              obj.dispose();
            } catch (e) {
              console.error('Dispose error:', e);
            }
          }
        };
        
        // Clean up Three.js resources
        if (sceneRef.current.geometry) {
          safeDispose(sceneRef.current.geometry);
          sceneRef.current.geometry = null;
        }
        
        if (sceneRef.current.material) {
          safeDispose(sceneRef.current.material);
          sceneRef.current.material = null;
        }
        
        if (sceneRef.current.scene && sceneRef.current.particles) {
          sceneRef.current.scene.remove(sceneRef.current.particles);
          sceneRef.current.particles = null;
        }
        
        if (sceneRef.current.scene) {
          sceneRef.current.scene.clear();
          sceneRef.current.scene = null;
        }
        
        if (sceneRef.current.renderer) {
          const renderer = sceneRef.current.renderer;
          
          // Remove DOM element
          if (mountRef.current && renderer.domElement && renderer.domElement.parentNode === mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
          }
          
          try {
            renderer.forceContextLoss();
            renderer.dispose();
          } catch (e) {
            console.error('Renderer cleanup error:', e);
          }
          
          sceneRef.current.renderer = null;
        }
        
        // Clear global instance
        if (window._threeJsInstance === sceneRef.current) {
          window._threeJsInstance = null;
        }
      };
    } catch (error) {
      console.error('Three.js initialization error:', error);
    }
  }, [isReady]); // Only depend on isReady state

  return (
    <OptimizedRenderer renderPriority='balanced'>
    <div 
      ref={mountRef} 
      className="w-full h-screen overflow-hidden wave-container"
    />
    </OptimizedRenderer>
  );
};

// Type definitions for global state
declare global {
  interface Window {
    _threeJsInstance?: any;
  }
}

export default WaveDots;