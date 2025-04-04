'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Constants for configuration
const BACKGROUND_COLOR = 0x111111; // Slightly softer dark grey
const PARTICLE_COLOR = 0xffffff; // White particles for a clean look
const GRID_WIDTH = 30;           // Slightly denser grid
const GRID_HEIGHT = 15;
const PARTICLE_BASE_SIZE = 0.28; // Slightly smaller base size
const MOUSE_INFLUENCE_RADIUS = 0.4; // How far the mouse effect reaches (in normalized coords)
const MOUSE_REPEL_STRENGTH = 0.3; // How strongly particles are pushed
const MOUSE_DEPTH_STRENGTH = 0.3; // How much particles move on Z-axis
const DAMPING_FACTOR = 0.06;     // Easing factor for returning to original position (lower = slower/smoother)


const StartSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null); // To store animation frame ID for cleanup

  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current; // Capture ref value

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    // --- Camera Setup ---
    let aspectRatio = currentContainer.clientWidth / currentContainer.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.1, 1000
    );
    camera.position.z = 5;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for potential future background layers
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improve sharpness on high DPI screens
    currentContainer.appendChild(renderer.domElement);

    // --- Particle Grid Setup ---
    const particlesCount = GRID_WIDTH * GRID_HEIGHT;
    const spacingX = (10 * aspectRatio) / (GRID_WIDTH - 1);
    const spacingY = 10 / (GRID_HEIGHT - 1);

    const positions = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const targetPositions = new Float32Array(particlesCount * 3); // Store target positions for smooth interpolation

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const i = y * GRID_WIDTH + x;
        const idx = i * 3;
        const posX = x * spacingX - 5 * aspectRatio;
        const posY = y * spacingY - 5;
        const posZ = 0;

        positions[idx] = originalPositions[idx] = targetPositions[idx] = posX;
        positions[idx + 1] = originalPositions[idx + 1] = targetPositions[idx + 1] = posY;
        positions[idx + 2] = originalPositions[idx + 2] = targetPositions[idx + 2] = posZ;
        sizes[i] = PARTICLE_BASE_SIZE;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // We can set size here, but the shader defines a fixed size. Let's adjust the shader.
    // particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // --- Particle Material (Shader) ---
    const particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Additive blending gives a nice glow effect
      uniforms: {
        color: { value: new THREE.Color(PARTICLE_COLOR) },
        pointSize: { value: PARTICLE_BASE_SIZE * window.innerHeight * 0.15 } // Adjust size based on viewport height
      },
      vertexShader: `
        uniform float pointSize;
        varying vec3 vColor; // Not used but often kept for potential future use
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize / -mvPosition.z; // Make points smaller further away (perspective scaling)
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vColor;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          // Smoother falloff (quadratic) for softer edges
          float intensity = pow(max(0.0, 1.0 - dist * 2.0), 2.0);
          if (intensity < 0.01) discard; // Discard transparent fragments
          gl_FragColor = vec4(color, intensity * 0.8); // Slightly reduced max alpha
        }
      `
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mousePosition.current.x = (event.clientX / currentContainer.clientWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / currentContainer.clientHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
        if (!currentContainer) return;
        aspectRatio = currentContainer.clientWidth / currentContainer.clientHeight;

        // Update Camera
        camera.left = -5 * aspectRatio;
        camera.right = 5 * aspectRatio;
        camera.top = 5;
        camera.bottom = -5;
        camera.updateProjectionMatrix();

        // Update Renderer
        renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update particle size uniform based on new height
        particlesMaterial.uniforms.pointSize.value = PARTICLE_BASE_SIZE * currentContainer.clientHeight * 0.15;

        // Update particle spacing and original positions based on new aspect ratio
        const newSpacingX = (10 * aspectRatio) / (GRID_WIDTH - 1);
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const i = y * GRID_WIDTH + x;
                const idx = i * 3;
                originalPositions[idx] = x * newSpacingX - 5 * aspectRatio;
                // If not interacting, snap current position too to avoid jump on resize
                if (Math.abs(positions[idx] - targetPositions[idx]) < 0.001) {
                   positions[idx] = originalPositions[idx];
                }
                 targetPositions[idx] = originalPositions[idx]; // Update target as well
            }
        }
        // Need to update buffer if positions snapped
         particlesGeometry.attributes.position.needsUpdate = true;
    };
    window.addEventListener('resize', handleResize);
     handleResize(); // Initial call to set aspect ratio etc.

    // --- Animation Loop ---
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const currentPositions = particlesGeometry.attributes.position.array as Float32Array;
      const mouseX = mousePosition.current.x * (5 * aspectRatio); // Convert normalized mouse X to world coords
      const mouseY = mousePosition.current.y * 5;                 // Convert normalized mouse Y to world coords

      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        const originalX = originalPositions[idx];
        const originalY = originalPositions[idx + 1];
        const originalZ = originalPositions[idx + 2];

        // Calculate distance in world coordinates
        const dx = originalX - mouseX;
        const dy = originalY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate influence based on distance (smoother falloff)
        // Use normalized distance for consistent radius effect regardless of aspect ratio
        const normalizedDx = dx / (5 * aspectRatio);
        const normalizedDy = dy / 10;
        const normalizedDistance = Math.sqrt(normalizedDx * normalizedDx + normalizedDy * normalizedDy);

        let targetX = originalX;
        let targetY = originalY;
        let targetZ = originalZ;

        if (normalizedDistance < MOUSE_INFLUENCE_RADIUS) {
          // Calculate force magnitude with smooth falloff (e.g., quadratic)
          const influence = Math.pow(1.0 - normalizedDistance / MOUSE_INFLUENCE_RADIUS, 2.0);

          // Calculate displacement vector (normalized)
          const displacementX = dx / distance;
          const displacementY = dy / distance;

          // Apply repulsion force
          targetX = originalX + displacementX * influence * MOUSE_REPEL_STRENGTH * (5 * aspectRatio); // Scale X displacement by world width
          targetY = originalY + displacementY * influence * MOUSE_REPEL_STRENGTH * 5;                 // Scale Y displacement by world height
          targetZ = originalZ + influence * MOUSE_DEPTH_STRENGTH; // Apply depth displacement
        }

        // Store target positions
        targetPositions[idx] = targetX;
        targetPositions[idx + 1] = targetY;
        targetPositions[idx + 2] = targetZ;
      }

        // Apply smooth interpolation (easing) towards the target position
      for (let i = 0; i < particlesCount * 3; i++) {
           currentPositions[i] += (targetPositions[i] - currentPositions[i]) * DAMPING_FACTOR;
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      // Dispose of Three.js resources
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      scene.clear(); // Remove objects from scene
      if (currentContainer && renderer.domElement) {
         try {
            currentContainer.removeChild(renderer.domElement);
         } catch (e) {
            console.warn("Failed to remove renderer DOM element:", e);
         }
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1, background: `rgb(${BACKGROUND_COLOR >> 16 & 0xff}, ${BACKGROUND_COLOR >> 8 & 0xff}, ${BACKGROUND_COLOR & 0xff})` }} />;
};

export default StartSection;