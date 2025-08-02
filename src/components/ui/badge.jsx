import { cn } from "@/lib/utils"

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-primary/10 text-primary ring-primary/20",
    outline: "bg-background/50 text-foreground ring-border",
    info: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
    success: "bg-green-500/10 text-green-600 ring-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
    error: "bg-red-500/10 text-red-600 ring-red-500/20",
    destructive: "bg-red-500/10 text-red-600 ring-red-500/20"
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  )
}

export { Badge }