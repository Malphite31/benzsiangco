import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all duration-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden active:scale-95";

  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.8)] hover:bg-blue-500",
    secondary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20",
    outline: "border border-white/10 hover:border-blue-500/50 text-white bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />

      {/* Background Pulse for Primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Internal Inner Border for depth */}
      <div className="absolute inset-[1px] rounded-full border border-white/20 pointer-events-none opacity-50" />

      <div className="relative z-10 flex items-center justify-center py-3 px-6 md:py-4 md:px-10">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-3" />
        ) : icon ? (
          <span className="flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">{icon}</span>
        ) : null}
        <span className="relative">
          {children}
          {/* Animated Underline on Hover */}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full opacity-50" />
        </span>
      </div>
    </button>
  );
};