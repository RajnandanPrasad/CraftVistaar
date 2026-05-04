
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export default function ARViewer({ modelUrl, className = '' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelError, setModelError] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!modelUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setModelError(false);

    const timer = setTimeout(() => {
      if (loading) {
        toast('Loading AR model...', { id: 'ar-load' });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [modelUrl]);

  const handleModelLoad = useCallback(() => {
    setLoading(false);
    toast.dismiss('ar-load');
    toast.success('AR model loaded! Tap to place in your space');
  }, []);

  const handleModelError = useCallback((event) => {
    console.error('Model load error:', event);
    setLoading(false);
    setModelError(true);
    setError('Failed to load 3D model. Please try refreshing.');
    toast.error('Model failed to load');
  }, []);

  const handleProgress = useCallback((event) => {
    const progress = Math.floor(event.detail.totalProgress * 100);
    if (progress === 100) {
      setLoading(false);
    }
  }, []);

  if (!modelUrl) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300 text-center ${className}`}>
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">AR Preview Not Available</h3>
        <p className="text-gray-600 max-w-sm leading-relaxed">
          This product doesn't have a 3D model configured yet.
        </p>
      </div>
    );
  }

  if (modelError || error) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 px-8 bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl border-2 border-dashed border-rose-300 text-center ${className}`}>
        <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-rose-900 mb-2">Model Load Failed</h3>
        <p className="text-rose-700 max-w-sm leading-relaxed mb-6">
          {error || 'Unable to load 3D model. Please check your connection and try again.'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[500px] lg:h-[600px] min-h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl ${className}`}>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center z-10">
          <div className="w-20 h-20 border-4 border-teal-500/20 border-t-teal-500 rounded-2xl animate-spin mb-6 shadow-xl"></div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Loading AR Model...</h3>
            <p className="text-teal-100 text-sm">Preparing 3D preview for your space</p>
            <div className="flex gap-2 mt-4 text-sm text-teal-200">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* AR Viewer */}
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        alt={`${product?.title || 'Product'} 3D AR preview`}
        ar
        ar-modes="scene-viewer webxr quick-look"
        camera-controls
        auto-rotate
        auto-rotate-delay="2000"
        shadow-intensity="1"
        exposure="0.8"
        environment-image="neutral"
        loading="eager"
        style={{ 
          width: "100%", 
          height: "100%",
          '--poster-color': loading ? '#1e293b' : 'transparent'
        }}
        onLoad={handleModelLoad}
        onError={handleModelError}
        progress={handleProgress}
      >
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-900 text-white text-2xl font-bold">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-teal-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Loading 3D Model...</span>
          </div>
        </div>
      </model-viewer>

      {/* AR Instructions */}
      {!loading && !modelError && (
        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/20 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Tap AR icon to place in your space • Pinch to zoom • Drag to rotate</span>
        </div>
      )}
    </div>
  );
}
