import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Megaphone, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import announcementService from "@/services/announcementService"

export default function FacultyAnnouncements() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      showMessage("Please enter both title and content", "error")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("content", content.trim())
      formData.append("type", "general")
      formData.append("targetAudience", JSON.stringify(["All"]))
      formData.append("priority", "normal")

      await announcementService.createAnnouncement(formData)
      showMessage("Announcement posted successfully!", "success")
      setTitle("")
      setContent("")
    } catch (error) {
      console.error("Error posting announcement:", error)
      showMessage(error.message || "Failed to post announcement", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-red-500" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="announcement-title" className="text-sm font-medium text-gray-700">
            Title
          </Label>
          <input
            id="announcement-title"
            type="text"
            placeholder="Enter announcement title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="announcement-content" className="text-sm font-medium text-gray-700">
            Content
          </Label>
          <Textarea
            id="announcement-content"
            placeholder="Write your announcement here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none min-h-[120px] text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
            disabled={loading}
          />
        </div>

        <Button
          onClick={handlePost}
          disabled={loading || !title.trim() || !content.trim()}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          {loading ? "Posting..." : "Post Announcement"}
        </Button>
      </CardContent>
    </Card>
  )
}
