import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GuideAssignmentCard from "./GuideAssignmentCard";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import CreateAssignmentForm from "./CreateAssignmentForm";
import {
  fetchAssignmentsByGuideId,
  selectGuideAssignments,
  selectAssignmentLoading,
  selectAssignmentError,
  createAssignment,
  selectCreateLoading,
} from "@/redux/slices/assignmentSlice";

export default function GuideAssignmentList() {
  const dispatch = useDispatch();
  const assignments = useSelector(selectGuideAssignments);
  const loading = useSelector(selectAssignmentLoading);
  const error = useSelector(selectAssignmentError);
  const createLoading = useSelector(selectCreateLoading);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    dispatch(fetchAssignmentsByGuideId());
  }, [dispatch]);

  const handleCreateAssignment = () => {
    setShowCreateForm(true);
  };

  const handlePostAnnouncement = () => {
    if (announcement.trim()) {
      console.log("Posting announcement:", announcement);
      setAnnouncement("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Assignments
                </h1>
                <p className="text-gray-600">
                  Manage and track student assignments
                </p>
              </div>
              <Button
                onClick={handleCreateAssignment}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">Loading assignments...</div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">Error: {error}</div>
                  <Button
                    onClick={() => dispatch(fetchAssignmentsByGuideId())}
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              ) : assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <GuideAssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    No assignments created yet
                  </div>
                  <Button
                    onClick={handleCreateAssignment}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Assignment
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <Megaphone className="w-5 h-5 mr-2 text-red-500" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write to students..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="min-h-[150px] border-gray-200 focus:border-red-300 focus:ring-red-200 resize-none"
                />
                <Button
                  onClick={handlePostAnnouncement}
                  disabled={!announcement.trim()}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-400"
                >
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Assignment Form Modal */}
      <CreateAssignmentForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  );
}
