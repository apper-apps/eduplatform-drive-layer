import { cn } from "@/utils/cn"

const Loading = ({ className, type = "courses" }) => {
  if (type === "course-detail") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-64 w-full rounded-xl mb-8"></div>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-3/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-5/6 rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-4/5 rounded"></div>
          
          <div className="pt-6">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 w-32 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-4 rounded-full"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-48 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "lesson") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-3/4 rounded-lg mb-6"></div>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-96 w-full rounded-xl mb-8"></div>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-5/6 rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-4/5 rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-3/4 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 w-full rounded-t-xl"></div>
          <div className="bg-white p-6 rounded-b-xl border border-t-0 space-y-4">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 w-3/4 rounded"></div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-5/6 rounded"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-20 rounded"></div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-16 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading