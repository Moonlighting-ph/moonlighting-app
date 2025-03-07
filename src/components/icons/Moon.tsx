
import { SVGProps } from 'react';

export function Moon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="relative p-2 group">
      <div className="absolute inset-0 rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-300"
        {...props}
      >
        <path d="M16 4a8 8 0 0 0 12 12 12 12 0 1 1-12-12z" />
        <circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
}
