import React from "react";

export interface SendIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function SendIcon({ className = "w-4 h-4", ...props }: SendIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" />
    </svg>
  );
}

