'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-lg sm:text-xl lg:text-2xl whitespace-nowrap',
    lg: 'text-2xl lg:text-3xl',
  };

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`flex items-center gap-1 ${className}`}
      aria-label="My Dollar Store - Home"
    >
      <span
        className={`font-heading font-bold tracking-wider ${sizeClasses[size]} text-accent-gradient`}
        style={{ textShadow: '0 0 40px oklch(0.72 0.19 195 / 0.5)' }}
      >
        MY DOLLAR STORE
      </span>
    </button>
  );
};

export default Logo;
