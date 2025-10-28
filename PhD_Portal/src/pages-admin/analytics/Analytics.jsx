import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, GraduationCap, UserCheck } from "lucide-react"
import adminService from "@/services/adminService"

export default function Analytics() {
  const [stats, setStats] = useState({
    departmentDistribution: [],
    guideWorkload: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await adminService.getSystemStats()
      setStats(response)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">System-wide analytics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Guides</p>
              <p className="text-2xl font-bold">{stats.totalGuides || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assignment Rate</p>
              <p className="text-2xl font-bold">{stats.assignmentPercentage || 0}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution and Guide Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#B7202E]" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.departmentDistribution && stats.departmentDistribution.length > 0 ? (
              <div className="space-y-4">
                {stats.departmentDistribution.map((dept, index) => (
                  <div key={dept._id || index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{dept._id || "Unknown"}</span>
                      <Badge className="bg-blue-100 text-blue-800">{dept.count || 0} students</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${((dept.count || 0) / (stats.totalStudents || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No department data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#B7202E]" />
              Guide Workload Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.guideWorkload && stats.guideWorkload.length > 0 ? (
              <div className="space-y-4">
                {stats.guideWorkload.slice(0, 10).map((guide, index) => (
                  <div key={guide.guideId || index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{guide.guideName || "Unknown"}</p>
                        <p className="text-xs text-gray-500 truncate">{guide.department || "N/A"}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 ml-2">{guide.studentCount || 0} students</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(((guide.studentCount || 0) / 15) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No guide workload data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Student Assignment Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Assigned Students</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.assignedStudents || 0}</p>
                  <p className="text-xs text-gray-500">{stats.assignmentPercentage || 0}%</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Unassigned Students</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{stats.unassignedStudents || 0}</p>
                  <p className="text-xs text-gray-500">{100 - (stats.assignmentPercentage || 0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Registration Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Complete Registrations</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(((stats.totalUsers || 0) * (stats.registrationPercentage || 0)) / 100)}
                  </p>
                  <p className="text-xs text-gray-500">{stats.registrationPercentage || 0}%</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Incomplete Registrations</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(((stats.totalUsers || 0) * (100 - (stats.registrationPercentage || 0))) / 100)}
                  </p>
                  <p className="text-xs text-gray-500">{100 - (stats.registrationPercentage || 0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
