import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  size = 16, 
  interactive = false, 
  onRatingChange = null,
  className = "" 
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [tempRating, setTempRating] = useState(rating)

  const handleStarClick = (starValue) => {
    if (!interactive) return
    
    setTempRating(starValue)
    if (onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleMouseEnter = (starValue) => {
    if (!interactive) return
    setHoverRating(starValue)
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setHoverRating(0)
  }

  const getStarColor = (starIndex) => {
    const currentRating = interactive ? (hoverRating || tempRating) : rating
    
    if (starIndex <= Math.floor(currentRating)) {
      return 'text-yellow-400'
    } else if (starIndex === Math.floor(currentRating) + 1 && currentRating % 1 >= 0.5) {
      return 'text-yellow-400'
    } else {
      return 'text-gray-300'
    }
  }

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starIndex = index + 1
    const isActive = interactive ? (hoverRating || tempRating) >= starIndex : rating >= starIndex
    
    return (
      <button
        key={starIndex}
        type="button"
        disabled={!interactive}
        className={cn(
          "inline-flex items-center transition-colors duration-150",
          interactive && "hover:scale-110 cursor-pointer",
          !interactive && "cursor-default"
        )}
        onClick={() => handleStarClick(starIndex)}
        onMouseEnter={() => handleMouseEnter(starIndex)}
        onMouseLeave={handleMouseLeave}
      >
        <ApperIcon 
          name={isActive ? "Star" : "Star"} 
          size={size} 
          className={cn(
            "transition-colors duration-150",
            getStarColor(starIndex),
            isActive && "fill-current"
          )}
        />
      </button>
    )
  })

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars}
      </div>
    </div>
  )
}

export default StarRating