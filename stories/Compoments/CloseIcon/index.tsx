import React from 'react';

const CloseIcon = ({ className, color = '#fff' }: { className?: string; color?: string }) => (
  <svg fill="none" width="12" height="12" viewBox="0 0 12 12" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.314 1.414L9.9 0 5.657 4.243 1.414 0 0 1.414l4.243 4.243L0 9.9l1.414 1.414L5.657 7.07 9.9 11.314 11.314 9.9 7.07 5.657l4.243-4.243z"
      fill={color}
    />
  </svg>
);

export default CloseIcon;
