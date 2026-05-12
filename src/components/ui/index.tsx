'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#8B1A1A] text-white hover:bg-[#6B1212] active:scale-[0.98]',
  secondary: 'bg-[#FBF7F1] text-[#1a0505] hover:bg-[#F0E8E0] active:scale-[0.98]',
  outline: 'border-2 border-[#8B1A1A]/20 bg-white text-[#8B1A1A] hover:bg-[#8B1A1A]/5 active:scale-[0.98]',
  ghost: 'bg-transparent text-[#3a1a1a]/70 hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A] active:scale-[0.98]',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export function Card({ children, className = '', padding = 'md', hover = false, onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={[
        'bg-white rounded-[24px] border border-[#8B1A1A]/10 shadow-sm',
        paddingClasses[padding],
        hover ? 'hover:shadow-md hover:border-[#8B1A1A]/20 transition-all duration-200 cursor-pointer' : '',
        onClick ? 'w-full text-left' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function Input({ label, error, icon, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3a1a1a]/50">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B1A1A]/40">
            {icon}
          </div>
        )}
        <input
          className={[
            'w-full rounded-xl border border-[#8B1A1A]/10 bg-white px-4 py-3 text-sm outline-none transition-all',
            'focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/30',
            icon ? 'pl-10' : '',
            error ? 'border-red-500 focus:ring-red-500/20' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#3a1a1a]/40">{helperText}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3a1a1a]/50">
          {label}
        </label>
      )}
      <select
        className={[
          'w-full rounded-xl border border-[#8B1A1A]/10 bg-white px-4 py-3 text-sm outline-none transition-all',
          'focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/30',
          error ? 'border-red-500 focus:ring-red-500/20' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-[#8B1A1A]/10 text-[#8B1A1A]',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default', size = 'md', icon, className = '' }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-full',
      badgeVariants[variant],
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      className,
    ].join(' ')}>
      {icon}
      {children}
    </span>
  );
}

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export function Loading({ text = 'Memuat...', size = 'md', centered = true }: LoadingProps) {
  const sizeMap = { sm: 16, md: 24, lg: 32 };
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  
  return (
    <div className={[
      'flex items-center gap-2 text-[#8B1A1A]',
      centered ? 'justify-center py-12' : '',
    ].join(' ')}>
      <Loader2 size={sizeMap[size]} className="animate-spin" />
      <span className={`font-medium ${textSize}`}>{text}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#8B1A1A]/5 flex items-center justify-center mb-4 text-[#8B1A1A]/30">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#1a0505] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#3a1a1a]/50 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ label, title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div>
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
            {label}
          </span>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <h1 className="text-2xl md:text-3xl font-serif text-[#1a0505]" style={{ fontFamily: 'var(--font-fraunces)' }}>
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-[#3a1a1a]/50 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-[#8B1A1A]/10 ${className}`} />;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ label, value, icon, trend, trendUp = true, color = 'bg-[#8B1A1A]/10 text-[#8B1A1A]' }: StatCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#8B1A1A]/10 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
          </div>
        )}
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3a1a1a]/40">{label}</span>
      </div>
      <div className="text-3xl font-black text-[#1a0505] tracking-tight">{value}</div>
      {trend && (
        <p className={`text-xs font-medium mt-2 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}