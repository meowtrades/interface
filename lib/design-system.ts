/**
 * Professional Trading Dashboard Design System
 * 
 * This file contains the design system configuration for the professional
 * trading dashboard, including color palettes, typography, spacing, and
 * component specifications.
 */

// Professional Color Palette
export const colors = {
  // Base colors
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  
  // Semantic colors
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  
  // Trading-specific colors
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
    subtle: "hsl(var(--success) / 0.1)",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
    subtle: "hsl(var(--warning) / 0.1)",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
    subtle: "hsl(var(--destructive) / 0.1)",
  },
  
  // UI elements
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  
  // Chart colors
  chart: {
    1: "hsl(var(--chart-1))",
    2: "hsl(var(--chart-2))",
    3: "hsl(var(--chart-3))",
    4: "hsl(var(--chart-4))",
    5: "hsl(var(--chart-5))",
  },
} as const;

// Professional Typography System
export const typography = {
  display: "text-display font-bold",
  headline: "text-headline font-semibold",
  title: "text-title font-semibold",
  subtitle: "text-subtitle font-medium",
  body: "text-body font-normal",
  caption: "text-caption font-normal",
  overline: "text-overline font-medium uppercase",
  
  // Metric display (for financial numbers)
  metric: "metric-display font-mono font-medium",
  
  // Special typography
  profit: "text-profit font-medium",
  loss: "text-loss font-medium",
} as const;

// Professional Spacing System
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "80px",
} as const;

// Professional Shadow System
export const shadows = {
  card: "shadow-card",
  cardHover: "shadow-card-hover",
  cardLg: "shadow-card-lg",
  professional: "shadow-professional",
  professionalHover: "shadow-professional-hover",
} as const;

// Professional Component Variants
export const components = {
  // Card variants
  card: {
    default: "bg-card border border-border rounded-lg shadow-card",
    hover: "hover:shadow-card-hover transition-shadow duration-200",
    interactive: "hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200",
    bordered: "border-2 border-border",
    elevated: "shadow-card-lg",
  },
  
  // Button variants
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "bg-success text-success-foreground hover:bg-success/90",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
  
  // Input variants
  input: {
    default: "form-input border border-input bg-background",
    error: "form-input border border-destructive bg-background",
    success: "form-input border border-success bg-background",
  },
  
  // Status indicator variants
  status: {
    active: "status-dot status-active",
    inactive: "status-dot status-inactive",
    warning: "status-dot status-warning",
    error: "status-dot status-error",
  },
  
  // Progress bar variants
  progress: {
    default: "progress-bar",
    success: "progress-bar progress-fill-success",
    warning: "progress-bar progress-fill-warning",
    error: "progress-bar progress-fill-error",
  },
  
  // Badge variants
  badge: {
    default: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    success: "bg-success-subtle text-success border border-success/20",
    warning: "bg-warning-subtle text-warning border border-warning/20",
    destructive: "bg-destructive-subtle text-destructive border border-destructive/20",
    secondary: "bg-secondary text-secondary-foreground border border-border",
  },
  
  // Table variants
  table: {
    default: "table-professional w-full",
    header: "table-professional th",
    cell: "table-professional td",
    row: "table-professional tr",
  },
} as const;

// Professional Layout System
export const layout = {
  container: {
    default: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
    tight: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8",
    wide: "mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8",
  },
  
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    tight: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    wide: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  },
  
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    column: "flex flex-col",
  },
} as const;

// Professional Animation System
export const animations = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in",
  shimmer: "animate-shimmer",
  
  // Hover effects
  hoverCard: "hover-card",
  hoverLift: "hover:transform hover:-translate-y-1 transition-transform duration-200",
  
  // Loading states
  loadingSkeleton: "loading-skeleton",
} as const;

// Professional Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Professional Design Tokens
export const tokens = {
  borderRadius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
  },
  
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  
  lineHeight: {
    tight: "1.2",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.6",
  },
  
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
  },
} as const;

// Professional Theme Configuration
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  components,
  layout,
  animations,
  breakpoints,
  tokens,
} as const;

// Utility functions for consistent styling
export const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Helper functions for trading-specific styling
export const getProfitLossColor = (value: number) => {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
};

export const getProfitLossBackground = (value: number) => {
  if (value > 0) return "bg-profit-subtle";
  if (value < 0) return "bg-loss-subtle";
  return "bg-muted";
};

export const getProfitLossBorder = (value: number) => {
  if (value > 0) return "border-profit";
  if (value < 0) return "border-loss";
  return "border-border";
};

// Professional metric formatting
export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

export const formatPercentage = (
  value: number,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value / 100);
};

export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

// Professional design system export
export default theme; 