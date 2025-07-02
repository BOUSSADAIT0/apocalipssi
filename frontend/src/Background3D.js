import React from 'react';
import Wavify from 'react-wavify';

function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: 'linear-gradient(135deg, #23243a 0%, #3a2d5c 60%, #5e3c58 100%)',
      overflow: 'hidden',
    }}>
      <Wavify
        fill="url(#gradient)"
        paused={false}
        options={{
          height: 38,
          amplitude: 22,
          speed: 0.13,
          points: 4
        }}
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', minHeight: 110 }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffb3c6" />
            <stop offset="50%" stopColor="#6c4f8c" />
            <stop offset="100%" stopColor="#23243a" />
          </linearGradient>
        </defs>
      </Wavify>
    </div>
  );
}

export default Background3D; 