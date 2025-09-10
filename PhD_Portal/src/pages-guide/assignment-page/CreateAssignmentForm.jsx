import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload, X, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createAssignment,
  selectCreateLoading,
  selectAssignmentError,
  clearError,
} from "@/redux/slices/assignmentSlice";

export default function CreateAssignmentForm({ open, onClose }) {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectCreateLoading);
  const error = useSelector(selectAssignmentError);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: null,
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    const validFiles = newFiles.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/zip",
        "application/x-zip-compressed",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert(
          `File ${file.name} has an unsupported format. Please use PDF, DOC, DOCX, TXT, or ZIP files.`,
        );
        return false;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    event.target.value = ""; // Reset file input
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Assignment description is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = "Deadline must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline,
        attachments: files.map((file) => ({
          filename: file.name,
          mimetype: file.type,
          size: file.size,
        })),
      };

      await dispatch(createAssignment(assignmentData)).unwrap();

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        deadline: null,
      });
      setFiles([]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };

  const handleClose = () => {
    if (createLoading) return; // Prevent closing while creating

    setFormData({
      title: "",
      description: "",
      deadline: null,
    });
    setFiles([]);
    setErrors({});
    dispatch(clearError());
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Assignment
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new assignment for your students. Fill in all required
            fields.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Assignment Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter assignment title"
              className={cn(
                "border-gray-300 focus:border-red-500 focus:ring-red-500",
                errors.title && "border-red-300 focus:border-red-500",
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Assignment Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter assignment description and instructions"
              rows={4}
              className={cn(
                "border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none",
                errors.description && "border-red-300 focus:border-red-500",
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Deadline *
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="deadline-date"
                  className="text-xs text-gray-600"
                >
                  Date
                </Label>
                <Input
                  id="deadline-date"
                  type="date"
                  value={
                    formData.deadline
                      ? new Date(formData.deadline).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value);
                      // Keep existing time or set to end of day
                      if (formData.deadline) {
                        const existingTime = new Date(formData.deadline);
                        date.setHours(
                          existingTime.getHours(),
                          existingTime.getMinutes(),
                        );
                      } else {
                        date.setHours(23, 59, 59, 999);
                      }
                      handleInputChange("deadline", date);
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className={cn(
                    "border-gray-300 focus:border-red-500 focus:ring-red-500",
                    errors.deadline && "border-red-300 focus:border-red-500",
                  )}
                />
              </div>
              <div>
                <Label
                  htmlFor="deadline-time"
                  className="text-xs text-gray-600"
                >
                  Time
                </Label>
                <Input
                  id="deadline-time"
                  type="time"
                  value={
                    formData.deadline
                      ? new Date(formData.deadline).toTimeString().slice(0, 5)
                      : "23:59"
                  }
                  onChange={(e) => {
                    if (e.target.value && formData.deadline) {
                      const date = new Date(formData.deadline);
                      const [hours, minutes] = e.target.value.split(":");
                      date.setHours(parseInt(hours), parseInt(minutes));
                      handleInputChange("deadline", date);
                    }
                  }}
                  className={cn(
                    "border-gray-300 focus:border-red-500 focus:ring-red-500",
                    errors.deadline && "border-red-300 focus:border-red-500",
                  )}
                />
              </div>
            </div>
            {formData.deadline && (
              <p className="text-xs text-gray-600">
                Deadline:{" "}
                {new Date(formData.deadline).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {errors.deadline && (
              <p className="text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>

          {/* File Attachments */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Attachments (Optional)
            </Label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.zip"
              />

              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, ZIP (max 10MB each)
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Files ({files.length})
                </p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {createLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
