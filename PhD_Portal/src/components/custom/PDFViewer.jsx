import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  X,
  Loader2,
  FileText,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const PDFViewer = ({
  pdfUrl,
  onClose,
  type = "guide",
  title = "Guide List Document",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handleDownload = () => {
    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download =
      type === "preferences" ? "guide-preferences.pdf" : "guide-list.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* PDF controls - minimal version with just download and close */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="text-sm font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2 text-[#B7202E]" />
          {title}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(pdfUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" /> Open in New Tab
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* PDF placeholder with link */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#B7202E]" />
            <p className="mt-2 text-gray-600">Preparing document preview...</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-md max-w-md">
            <p className="text-red-600 mb-2">{error}</p>
            <Button
              className="bg-[#B7202E] hover:bg-[#9a1c27] text-white"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="text-center p-6 bg-white rounded-md shadow-md max-w-md">
            <FileText className="h-16 w-16 mx-auto mb-4 text-[#B7202E]" />
            <h3 className="text-lg font-medium mb-2">PDF Preview</h3>
            <p className="text-gray-600 mb-4">
              {type === "preferences"
                ? "Your guide preferences have been compiled into this PDF document."
                : "The PDF viewer is currently not available in the development environment."}
            </p>
            <div className="flex gap-2 justify-center">
              {type === "preferences" ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleDownload}
                >
                  <CheckCircle2 className="mr-2" size={16} /> Download
                  Preferences PDF
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-[#B7202E] hover:bg-[#9a1c27] text-white"
                    onClick={() => window.open(pdfUrl, "_blank")}
                  >
                    Open PDF in Browser
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    Download PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
