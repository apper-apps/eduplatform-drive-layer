import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95"
  
  const variants = {
    default: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-primary-500",
    secondary: "bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-secondary-500",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary-500",
    ghost: "text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 focus:ring-primary-500",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-emerald-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button