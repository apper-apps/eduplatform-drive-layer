import { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ 
  className, 
  placeholder = "Search courses...", 
  onSearch,
  value,
  onChange 
}) => {
  const [localValue, setLocalValue] = useState(value || "")
  
  const handleChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(localValue)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          className="pl-10 pr-4 bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg shadow-sm"
        />
      </div>
    </form>
  )
}

export default SearchBar