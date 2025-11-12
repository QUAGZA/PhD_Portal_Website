import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"
import {
  GuideStudentList,
  GuideAssignments,
  GuideSchedule,
  GuideAnnouncements
} from "@/components/guide-dashboard"
import { useState, useEffect } from "react"
import {
  getAssignedStudents,
  getGuideAssignments,
  getGuideProfile
} from "@/services/guideDashboardService"
import { Skeleton } from "@/components/ui/skeleton"

export default function GuideDashboard() {
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [profile, setProfile] = useState({ name: "Educator" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all dashboard data
        const [studentsData, assignmentsData, profileData] = await Promise.all([
          getAssignedStudents(),
          getGuideAssignments(),
          getGuideProfile(),
        ])

        setStudents(studentsData.students || [])
        setAssignments(assignmentsData.assignments || [])
        setProfile(profileData.profile || { name: "Educator" })
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/diverse-student-profiles.png" />
                <AvatarFallback className="bg-red-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, Prof. <span className="text-red-500">{profile.name}</span>
                </h1>
                <p className="text-sm text-gray-600">Manage your courses and students</p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
              <Bell className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Student List */}
          <div className="lg:col-span-1">
            <GuideStudentList students={students} />
          </div>

          {/* Center Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignments */}
            <GuideAssignments assignments={assignments} />

            {/* Schedule */}
            <GuideSchedule />
          </div>

          {/* Right Sidebar - Announcements */}
          <div className="lg:col-span-1">
            <GuideAnnouncements />
          </div>
        </div>
      </div>
    </div>
  )
}
