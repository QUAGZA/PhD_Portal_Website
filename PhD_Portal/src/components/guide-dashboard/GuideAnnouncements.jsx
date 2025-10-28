import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import announcementService from "@/services/announcementService";

export function GuideAnnouncements() {
  const [announcement, setAnnouncement] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePost = async () => {
    if (!announcement.trim()) {
      showMessage("Please enter an announcement", "error");
      return;
    }

    try {
      setIsPosting(true);

      const formData = new FormData();
      formData.append("title", "Announcement");
      formData.append("content", announcement);
      formData.append("type", "general");
      formData.append("targetAudience", JSON.stringify(["Student"]));
      formData.append("priority", "medium");

      await announcementService.createAnnouncement(formData);

      showMessage("Announcement posted successfully", "success");
      setAnnouncement("");
    } catch (error) {
      console.error("Error posting announcement:", error);
      showMessage(
        error.response?.data?.message || "Failed to post announcement",
        "error"
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pt-4 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5 text-red-500" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Textarea
          placeholder="Write to students..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="min-h-32 resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
          disabled={isPosting}
        />
        <Button
          onClick={handlePost}
          disabled={isPosting || !announcement.trim()}
          className="w-full bg-red-500 hover:bg-red-600 text-white gap-2 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPosting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Post Announcement
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}