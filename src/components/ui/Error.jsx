import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ className, message = "Something went wrong", onRetry }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center p-8", className)}>
      <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-red-600"
        />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" size={20} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error