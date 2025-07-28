import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border border-secondary-300",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge