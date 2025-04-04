'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OptimizedRendererProps {
  children: React.ReactNode;
  performanceMode?: boolean;
  renderPriority?: 'quality' | 'performance' | 'balanced';
}

const OptimizedRenderer: React.FC<OptimizedRendererProps> = ({
  children,
  performanceMode = false,
  renderPriority = 'balanced'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const fpsCounterRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Only show FPS counter in performance mode
    if (performanceMode && !fpsCounterRef.current) {
      const counter = document.createElement('div');
      counter.style.position = 'fixed';
      counter.style.top = '0';
      counter.style.right = '0';
      counter.style.backgroundColor = 'rgba(0,0,0,0.5)';
      counter.style.color = 'white';
      counter.style.padding = '4px';
      counter.style.fontSize = '12px';
      counter.style.zIndex = '1000';
      document.body.appendChild(counter);
      fpsCounterRef.current = counter;
      
      return () => {
        if (fpsCounterRef.current) {
          document.body.removeChild(fpsCounterRef.current);
          fpsCounterRef.current = null;
        }
      };
    }
  }, [performanceMode]);

  // Expose configuration to parent Three.js components
  useEffect(() => {
    if (!window._threeJsOptimizer) {
      window._threeJsOptimizer = {
        // Determine device capabilities
        isMobile: window.innerWidth < 768,
        isLowPerfDevice: 
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
          (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4),
        
        // Set quality multipliers based on render priority
        getQualitySettings() {
          const base = this.isMobile ? 0.5 : 1;
          const multipliers = {
            'quality': this.isMobile ? 0.8 : 1,
            'balanced': this.isMobile ? 0.5 : 0.8,
            'performance': this.isMobile ? 0.3 : 0.5
          };
          return {
            particleDensity: base * multipliers[renderPriority],
            pixelRatio: Math.min(window.devicePixelRatio, renderPriority === 'performance' ? 1 : 2),
            maxFPS: this.isMobile ? (renderPriority === 'performance' ? 30 : 60) : 60
          };
        },
        
        // FPS monitoring
        lastFrameTime: 0,
        frameCount: 0,
        fps: 0,
        
        // Throttle rendering when tab is not visible
        isTabVisible: true,
        
        // Update FPS counter
        updateFPSCounter(timestamp: number) {
          if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
            return;
          }
          
          this.frameCount++;
          
          // Update once per second
          if (timestamp - this.lastFrameTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFrameTime));
            
            if (fpsCounterRef.current) {
              fpsCounterRef.current.textContent = `FPS: ${this.fps} | Priority: ${renderPriority}`;
            }
            
            this.lastFrameTime = timestamp;
            this.frameCount = 0;
          }
        }
      };
    }
    
    // Update render priority whenever it changes
    window._threeJsOptimizer.renderPriority = renderPriority;
    
    // Handle tab visibility to reduce resource usage when hidden
    function handleVisibilityChange() {
      if (window._threeJsOptimizer) {
        window._threeJsOptimizer.isTabVisible = document.visibilityState === 'visible';
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [renderPriority]);

  return <div ref={containerRef} className="w-full h-full">{children}</div>;
};

// Global type declaration
declare global {
  interface Window {
    _threeJsOptimizer?: {
      isMobile: boolean;
      isLowPerfDevice: boolean;
      renderPriority: 'quality' | 'performance' | 'balanced';
      getQualitySettings: () => {
        particleDensity: number;
        pixelRatio: number;
        maxFPS: number;
      };
      lastFrameTime: number;
      frameCount: number;
      fps: number;
      isTabVisible: boolean;
      updateFPSCounter: (timestamp: number) => void;
    };
  }
}

export default OptimizedRenderer;