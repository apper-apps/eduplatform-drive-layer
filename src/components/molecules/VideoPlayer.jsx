import { useState, useRef, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

// Sample educational video URLs for demonstration
const SAMPLE_VIDEOS = [
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Introduction to Computer Science",
    duration: "10:34"
  },
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
    title: "Mathematics Fundamentals",
    duration: "11:48"
  },
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Physics Concepts",
    duration: "15:26"
  }
]

function VideoPlayer({ lessonTitle = "Educational Video", className = "" }) {
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const currentVideo = SAMPLE_VIDEOS[currentVideoIndex]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      toast.success("Video completed!")
    }

    const handleError = () => {
      setIsLoading(false)
      toast.error("Failed to load video")
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [currentVideoIndex])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      toast.info("Video paused")
    } else {
      video.play()
      setIsPlaying(true)
      toast.success("Video playing")
    }
  }

  const handleProgressClick = (e) => {
    const video = videoRef.current
    const progressBar = progressRef.current
    if (!video || !progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration

    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return

    setVolume(newVolume)
    video.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
      toast.info("Audio unmuted")
    } else {
      video.volume = 0
      setIsMuted(true)
      toast.info("Audio muted")
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen()
      }
      setIsFullscreen(true)
      toast.info("Entered fullscreen mode")
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
      toast.info("Exited fullscreen mode")
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const changeVideo = (index) => {
    setCurrentVideoIndex(index)
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(true)
    toast.info(`Switched to: ${SAMPLE_VIDEOS[index].title}`)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentVideo.src}
        className="w-full aspect-video object-cover"
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex items-center space-x-2 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Loading video...</span>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
          >
            <ApperIcon name="Play" size={32} />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-200"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-10 h-10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </button>

            {/* Time Display */}
            <span className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-8 h-8 hover:bg-white/20 rounded-full transition-colors"
              >
                <ApperIcon 
                  name={isMuted ? "VolumeX" : volume > 0.5 ? "Volume2" : "Volume1"} 
                  size={16} 
                />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Video Selection */}
            <select
              value={currentVideoIndex}
              onChange={(e) => changeVideo(parseInt(e.target.value))}
              className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
            >
              {SAMPLE_VIDEOS.map((video, index) => (
                <option key={index} value={index} className="bg-black">
                  {video.title}
                </option>
              ))}
            </select>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-8 h-8 hover:bg-white/20 rounded-full transition-colors"
            >
              <ApperIcon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Title */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
          <h3 className="font-medium text-sm">{currentVideo.title}</h3>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer