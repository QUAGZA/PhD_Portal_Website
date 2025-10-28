import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"

export function AdminAnalytics({ analytics }) {
  const departmentDistribution = analytics?.departmentDistribution?.slice(0, 5) || []
  const guideWorkload = analytics?.guideWorkload?.slice(0, 5) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#B7202E]" />
            Department Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {departmentDistribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Data Available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {departmentDistribution.map((dept, index) => (
                <div
                  key={dept._id || index}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{dept._id || "Unknown"}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {dept.count || 0} students
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#B7202E]" />
            Guide Workload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {guideWorkload.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Data Available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {guideWorkload.map((guide, index) => (
                <div
                  key={guide.guideId || index}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {guide.guideName || "Unknown Guide"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{guide.department || "N/A"}</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 ml-2">
                    {guide.studentCount || 0} students
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
