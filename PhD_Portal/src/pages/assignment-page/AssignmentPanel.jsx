import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignmentCard from "./AssignmentCard";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchAssignmentsByGuide,
  selectFilteredAssignments,
  selectAssignmentLoading,
  selectAssignmentError,
  setSearchTerm,
  selectSearchTerm,
} from "@/redux/slices/assignmentSlice";

export default function AssignmentsPanel() {
  const dispatch = useDispatch();
  const assignments = useSelector(selectFilteredAssignments);
  const loading = useSelector(selectAssignmentLoading);
  const error = useSelector(selectAssignmentError);
  const searchTerm = useSelector(selectSearchTerm);

  useEffect(() => {
    dispatch(fetchAssignmentsByGuide());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Manage your course assignments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-64 border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
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
              onClick={() => dispatch(fetchAssignmentsByGuide())}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : assignments && assignments.length > 0 ? (
          assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No assignments found</div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
