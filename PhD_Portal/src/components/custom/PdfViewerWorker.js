import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

// Set up the PDF.js worker source
const PdfViewerWorker = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Set worker path to CDN
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.workerPort.version}/pdf.worker.min.js`;
};

export default PdfViewerWorker;
