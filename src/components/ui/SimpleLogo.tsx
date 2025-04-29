import React from 'react';

const SimpleLogo = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="StrellerMinds Logo">
    {/* Using white for better contrast against the dark purple navbar background */}
    <rect x="4" y="4" width="16" height="16" rx="2" fill="white"/> {/* Added slight rounding */}
    <rect x="12" y="12" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/> {/* Added slight rounding */}
  </svg>
);

export default SimpleLogo;