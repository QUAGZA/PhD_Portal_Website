import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, Shield, Mail, Building2, Calendar, Plus } from "lucide-react"
import adminService from "@/services/adminService"

export default function FacultyCoordinators() {
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCoordinators()
  }, [])

  const fetchCoordinators = async () => {
    try {
      setLoading(true)
      const response = await adminService.getFacultyCoordinators(1, 100)
      setCoordinators(response.facultyCoordinators || [])
    } catch (error) {
      console.error("Error fetching coordinators:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCoordinators = coordinators.filter((coordinator) =>
    coordinator.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="p-6 font-[Marcellus]">
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Coordinators</h1>
        <p className="text-gray-600">Manage department faculty coordinators</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Coordinators</p>
              <p className="text-2xl font-bold">{coordinators.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">
                {coordinators.filter((c) => c.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold">
                {new Set(coordinators.map((c) => c.programDetails?.department)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button className="bg-[#B7202E] hover:bg-[#A01B26]">
                <Plus className="h-4 w-4 mr-2" />
                Add Coordinator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Coordinators List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Coordinator</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Department</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Institute</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Joined</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoordinators.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No faculty coordinators found
                    </td>
                  </tr>
                ) : (
                  filteredCoordinators.map((coordinator) => (
                    <tr key={coordinator._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#B7202E] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {coordinator.personalDetails?.firstName?.charAt(0) || "?"}
                              {coordinator.personalDetails?.lastName?.charAt(0) || ""}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{coordinator.fullName || "No Name"}</p>
                            <p className="text-sm text-gray-500">
                              {coordinator.personalDetails?.title || "Faculty Coordinator"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {coordinator.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {coordinator.programDetails?.department || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {coordinator.programDetails?.institute || "N/A"}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(coordinator.status)}>
                          {coordinator.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(coordinator.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredCoordinators.length} of {coordinators.length} faculty coordinators
      </div>
    </div>
  )
}
