import { cn } from "@/lib/utils"

const Badge = ({ children, variant = "default", className }) => {
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
      variant === "outline" && "bg-background/50 text-foreground ring-border",
      variant === "default" && "bg-primary/10 text-primary ring-primary/20",
      className
    )}>
      {children}
    </span>
  )
}

export { Badge }