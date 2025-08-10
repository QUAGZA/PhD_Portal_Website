import { useState } from "react";

function FileInput({ label, id, onFileChange }) {
  const [fileName, setFileName] = useState("No file chosen");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "No file chosen");
    if (onFileChange) onFileChange(id, file);
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <label
        htmlFor={id}
        className="cursor-pointer bg-[#FFEBE9] hover:bg-[#FFD4D0] active:bg-[#FABEB9] text-black py-2 px-4 rounded-lg shadow transition duration-300 w-80 text-center"
      >
        {label}
      </label>

      <input
        id={id}
        type="file"
        name={label}
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <span className="text-gray-600 italic">{fileName}</span>
    </div>
  );
}

export default FileInput;
