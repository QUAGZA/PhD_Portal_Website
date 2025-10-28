import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, UserCheck, Shield } from "lucide-react"

export function AdminStatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-md border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground">All registered users</p>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{stats.totalStudents || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.assignedStudents || 0} assigned, {stats.unassignedStudents || 0} unassigned
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Guides</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{stats.totalGuides || 0}</div>
          <p className="text-xs text-muted-foreground">Active research guides</p>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
          <CardTitle className="text-sm font-medium">Faculty Coordinators</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{stats.totalFacultyCoordinators || 0}</div>
          <p className="text-xs text-muted-foreground">Department coordinators</p>
        </CardContent>
      </Card>
    </div>
  )
}
