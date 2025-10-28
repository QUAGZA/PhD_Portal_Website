import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowRight, Search, Plus } from "lucide-react"
import { Link } from "react-router-dom"

export function AdminUserManagement({ users }) {
  // Show only first 5 users in dashboard
  const displayUsers = users?.slice(0, 5) || []

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: "bg-red-100 text-red-800",
      FacultyCoordinator: "bg-purple-100 text-purple-800",
      Guide: "bg-blue-100 text-blue-800",
      Student: "bg-green-100 text-green-800"
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#B7202E]" />
            User Management
          </CardTitle>
          <div className="flex items-center gap-2">
            {users && users.length > 5 && (
              <Link
                to="/admin/users"
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            <Button size="sm" className="bg-red-500 hover:bg-red-600 h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Users Found</p>
              <p className="text-xs text-gray-400 mt-1">Users will appear here</p>
            </div>
          ) : (
            displayUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#B7202E] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user.personalDetails?.firstName?.charAt(0) || "?"}
                      {user.personalDetails?.lastName?.charAt(0) || ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.fullName || "No Name"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.roles?.map((role, idx) => (
                    <Badge key={idx} className={getRoleBadgeColor(role)}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
