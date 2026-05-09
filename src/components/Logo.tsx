'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-sm sm:text-base tracking-wider',
    md: 'text-sm sm:text-lg lg:text-xl tracking-wide sm:tracking-wider whitespace-nowrap',
    lg: 'text-xl lg:text-3xl tracking-wider',
  };

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`flex items-center gap-1 ${className}`}
      aria-label="My Dollar Store - Home"
    >
      <span
        className={`font-heading font-bold ${sizeClasses[size]} text-accent-gradient`}
        style={{ textShadow: '0 0 40px oklch(0.72 0.19 195 / 0.5)' }}
      >
        MY DOLLAR STORE
      </span>
    </button>
  );
};

export default Logo;
