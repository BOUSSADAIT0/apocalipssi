import React from 'react';

function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f7971e 100%)',
      transition: 'background 0.5s',
    }} />
  );
}

export default Background3D; 