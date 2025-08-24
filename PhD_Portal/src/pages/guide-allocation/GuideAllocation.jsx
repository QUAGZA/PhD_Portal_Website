import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Info,
  FileText,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PDFViewer from "../../components/custom/PDFViewer";

const GuideAllocation = () => {
  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);

  // State for form values
  const [preferences, setPreferences] = useState({
    preference1: {
      guideId: "",
      guideName: "",
      researchArea: "",
    },
    preference2: {
      guideId: "",
      guideName: "",
      researchArea: "",
    },
    preference3: {
      guideId: "",
      guideName: "",
      researchArea: "",
    },
  });

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [isPreferencesPdfViewerOpen, setIsPreferencesPdfViewerOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mock guides data - replace with API call in production
  const guides = [
    { 
      id: "g1", 
      title: "Dr.", 
      name: "ABC DEF", 
      researchAreas: ["AI", "ML"] },
    {
      id: "g2",
      title: "Dr.",
      name: "GHI JKL",
      researchAreas: ["Data Science", "Networking"],
    },
    {
      id: "g3",
      title: "Dr.",
      name: "MNO PQR",
      researchAreas: ["Cybersecurity", "Cloud Computing"],
    },
  ];

  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Sample PDF URL - in production this would be your actual guide list PDF
  const guidePdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  const handlePreferenceChange = (preferenceKey, field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceKey]: {
        ...prev[preferenceKey],
        [field]: value,
      },
    }));

    // If guide selection changes, also update the name based on the selected ID
    if (field === "guideId") {
      const selectedGuide = guides.find((guide) => guide.id === value);
      if (selectedGuide) {
        setPreferences((prev) => ({
          ...prev,
          [preferenceKey]: {
            ...prev[preferenceKey],
            guideName: `${selectedGuide.title} ${selectedGuide.name}`,
          },
        }));
      }
    }
  };

  // Form validation
  const isFormValid = () => {
    return (
      preferences.preference1.guideId &&
      preferences.preference1.researchArea &&
      preferences.preference2.guideId &&
      preferences.preference2.researchArea &&
      preferences.preference3.guideId &&
      preferences.preference3.researchArea
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        console.log("Preferences submitted:", preferences);
        // Send the preferences to the backend and generate PDF
        setPdfGenerating(true);
        setErrorMessage("");

        const response = await userService.submitGuidePreferences(preferences);
        console.log("Response:", response.data);

        setPdfGenerated(true);
        setFormSubmitted(true);
        setShowPreferences(true);

        // You can uncomment this if you have toast component set up
        // toast({
        //   title: "Success!",
        //   description:
        //     "Your guide preferences have been submitted and PDF generated.",
        //   variant: "success",
        // });

        // Reset form submission status after delay
        setTimeout(() => {
          setFormSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error submitting preferences:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Error submitting preferences. Please try again.",
        );
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to submit preferences. Please try again.",
          variant: "destructive",
        });
      } finally {
        setPdfGenerating(false);
      }
    } else {
      alert("Please fill all required fields before submitting");
    }
  };

  const handleViewGuideList = () => {
    // Open the PDF viewer for viewing
    setIsPdfViewerOpen(true);
  };

  const handleDownloadGuideList = () => {
    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = guidePdfUrl;
    link.download = "guide-list.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPreferencesPdf = async () => {
    try {
      setPdfGenerating(true);
      setErrorMessage("");
      const response = await userService.getGuidePreferencesPdf();

      // Create blob from response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = user?.personalDetails?.aadhar
        ? `${user.personalDetails.aadhar}_guide_preferences.pdf`
        : "guide_preferences.pdf";
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // You can uncomment this if you have toast component set up
      // toast({
      //   title: "Success",
      //   description: "PDF downloaded successfully",
      //   variant: "success",
      // });
    } catch (error) {
      console.error("Error downloading preferences PDF:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error downloading preferences PDF. Please try again.",
      );
      // You can uncomment this if you have toast component set up
      // toast({
      //   title: "Download Failed",
      //   description:
      //     error.response?.data?.message ||
      //     "Failed to download preferences PDF. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setPdfGenerating(false);
    }
  };

  // Get the guide name based on ID
  const getGuideName = (guideId) => {
    const guide = guides.find((g) => g.id === guideId);
    return guide ? `${guide.title} ${guide.name}` : "Not selected";
  };

  // Toggle preferences summary
  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  const handleViewPreferencesPdf = () => {
    // Open the PDF viewer for preferences PDF
    setIsPreferencesPdfViewerOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Guide Allocation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Preference Selection */}
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-[#B7202E] text-white p-4">
            <CardTitle>Guide Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Preference 1 */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Preference 1 (First Choice)
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="w-20">
                    <Input
                      type="text"
                      value="Dr./Mr."
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={preferences.preference1.guideId}
                      onValueChange={(value) =>
                        handlePreferenceChange("preference1", "guideId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {guides.map((guide) => (
                          <SelectItem key={guide.id} value={guide.id}>
                            {guide.title} {guide.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  placeholder="Research Areas / Interest"
                  className="w-full"
                  value={preferences.preference1.researchArea}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "preference1",
                      "researchArea",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Preference 2 */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Preference 2 (Second Choice)
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="w-20">
                    <Input
                      type="text"
                      value="Dr./Mr."
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={preferences.preference2.guideId}
                      onValueChange={(value) =>
                        handlePreferenceChange("preference2", "guideId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {guides.map((guide) => (
                          <SelectItem key={guide.id} value={guide.id}>
                            {guide.title} {guide.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  placeholder="Research Areas / Interest"
                  className="w-full"
                  value={preferences.preference2.researchArea}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "preference2",
                      "researchArea",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Preference 3 */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Preference 3 (Third Choice)
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="w-20">
                    <Input
                      type="text"
                      value="Dr./Mr."
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={preferences.preference3.guideId}
                      onValueChange={(value) =>
                        handlePreferenceChange("preference3", "guideId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {guides.map((guide) => (
                          <SelectItem key={guide.id} value={guide.id}>
                            {guide.title} {guide.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  placeholder="Research Areas / Interest"
                  className="w-full"
                  value={preferences.preference3.researchArea}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "preference3",
                      "researchArea",
                      e.target.value,
                    )
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#B7202E] hover:bg-[#9a1c27] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={!isFormValid() || formSubmitted}
              >
                {formSubmitted ? "Submitted ✓" : "Submit Preferences"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right side - Info and Download */}
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-[#B7202E] text-white p-4">
            <CardTitle>Guide Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex-1">
              <div className="text-center mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Info size={32} className="text-[#B7202E] mx-auto mb-2" />
                <p className="text-gray-700">
                  Download the complete guide list to view all available guides
                  and their research areas before making your selection.
                </p>
              </div>

              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Select your top 3 guide preferences</li>
                  <li>For each preference, specify your research interest</li>
                  <li>
                    Make sure your research interests align with the guide's
                    expertise
                  </li>
                  <li>Submit your preferences before the deadline</li>
                </ul>

                {showPreferences && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">
                      Your Preferences
                    </h3>
                    <div className="overflow-auto bg-white rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Preference</th>
                            <th className="px-4 py-2 text-left">Guide</th>
                            <th className="px-4 py-2 text-left">
                              Research Area
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="px-4 py-2 font-medium">
                              First Choice
                            </td>
                            <td className="px-4 py-2">
                              {getGuideName(preferences.preference1.guideId)}
                            </td>
                            <td className="px-4 py-2">
                              {preferences.preference1.researchArea || "-"}
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-4 py-2 font-medium">
                              Second Choice
                            </td>
                            <td className="px-4 py-2">
                              {getGuideName(preferences.preference2.guideId)}
                            </td>
                            <td className="px-4 py-2">
                              {preferences.preference2.researchArea || "-"}
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-4 py-2 font-medium">
                              Third Choice
                            </td>
                            <td className="px-4 py-2">
                              {getGuideName(preferences.preference3.guideId)}
                            </td>
                            <td className="px-4 py-2">
                              {preferences.preference3.researchArea || "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button
                onClick={handleViewGuideList}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <FileText className="mr-2" size={16} /> View Guide List
              </Button>
              <Button
                onClick={handleDownloadGuideList}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <Download className="mr-2" size={16} /> Download Guide List
              </Button>
              {pdfGenerated && (
                <>
                  <Button
                    onClick={handleViewPreferencesPdf}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                    disabled={pdfGenerating}
                  >
                    {pdfGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2" size={16} /> View Your
                        Preferences PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownloadPreferencesPdf}
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                    disabled={pdfGenerating}
                    variant="outline"
                  >
                    <Download className="mr-2" size={16} /> Download Preferences
                    PDF
                  </Button>
                </>
              )}
              <Button
                onClick={() => window.open(guidePdfUrl, "_blank")}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <ExternalLink className="mr-2" size={16} /> Open in Browser
              </Button>
              {isFormValid() && (
                <Button
                  onClick={togglePreferences}
                  variant="outline"
                  className="w-full border-[#B7202E] border text-[#B7202E] hover:bg-[#B7202E] hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                >
                  {showPreferences
                    ? "Hide Preferences"
                    : "Show Your Preferences"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success notification */}
      {formSubmitted && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          <div>
            <p className="font-bold">Success!</p>
            <p className="text-sm">
              Your guide preferences have been submitted.
            </p>
          </div>
        </div>
      )}

      {/* Guide List PDF Viewer Modal */}
      <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>PhD Guide List</DialogTitle>
            <DialogDescription>
              Review the complete guide list with research areas and
              availability
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <PDFViewer
              pdfUrl={guidePdfUrl}
              onClose={() => setIsPdfViewerOpen(false)}
              type="guide"
              title="Guide List Document"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Preferences PDF Viewer Modal */}
      <Dialog
        open={isPreferencesPdfViewerOpen}
        onOpenChange={setIsPreferencesPdfViewerOpen}
      >
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Your Guide Preferences</DialogTitle>
            <DialogDescription>
              Review your submitted guide preferences
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {errorMessage ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Error Loading PDF</h3>
                <p className="text-gray-600 mb-4">{errorMessage}</p>
                <Button
                  onClick={() => {
                    setErrorMessage("");
                    setIsPreferencesPdfViewerOpen(false);
                  }}
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                >
                  Close
                </Button>
              </div>
            ) : (
              <PDFViewer
                // Use the getPreferencesPdf endpoint directly
                pdfUrl="http://localhost:9999/guide-preferences/pdf"
                onClose={() => setIsPreferencesPdfViewerOpen(false)}
                type="preferences"
                title="Guide Preferences Document"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuideAllocation;
