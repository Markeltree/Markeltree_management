import { useRef, useState, ActionButton } from "@/common/imports";

export default function ImageUpload() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const validFiles = Array.from(newFiles).filter(
      (file) => allowedTypes.includes(file.type) && file.size <= 4 * 1024 * 1024
    );

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex flex-row justify-between items-center mb-3 !p-0">
        <h2 className="font-bold text-[12px] md:text-[20px] text-[#151D48] dark:text-[#F2F2FE] whitespace-nowrap">
          Product Info
        </h2>
        <div className="flex gap-2">
          <ActionButton
            label="Add new brand"
            labelClass="font-normal text-[9px] md:text-[12px]"
            buttonClass=" h-[30px] w-[80px] md:w-[115px] bg-white dark:bg-black text-[#555555] dark:text-[#D4D4D4CC] border border-[#555555] dark:border-[#D4D4D4CC] focus:outline-none focus:ring-0"
            // onClick={handleNext}
          />
          <ActionButton
            label="Add new type"
            labelClass="font-normal text-[9px] md:text-[12px]"
            buttonClass=" h-[30px] w-[80px] md:w-[115px] bg-[#22C55E] dark:bg-[#22C55E] text-[#FFFFFF] dark:text-[#000000] focus:outline-none focus:ring-0"
            // onClick={handleNext}
          />
        </div>
      </div>

      <div className="mt-5 mb-1 text-[12px] text-[#737791] dark:text-[#A9A9CD] font-normal">
        Add Image(Upload or Drag drop)
      </div>

      {/* Upload Box */}
      <div className="border border-[#73779140] rounded-lg p-4">
        <div
          className="border border-dashed border-[#5D5FEF] dark:border-[#7476F1] rounded-lg flex flex-col items-center justify-center py-6 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.xlsx,.xls"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {/* Upload Icon */}
          <div className="w-12 h-12 bg-[#f3f4f6] flex items-center justify-center rounded">
            <img
              src="/icons/imageUploadIcon.png"
              alt="upload Image"
              width="45"
              height="42"
            />
          </div>

          {/* Instructions */}
          <p className="text-[12px] md:text-[14px] text-[#737791] m-1 dark:text-[#A9A9CD] text-center">
            Supported formats: JPG, PNG, Excel file (Max size: 4mb)
          </p>
        </div>

        {/* Thumbnails */}
        {files.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {files.map((file, index) =>
              file.type.startsWith("image/") ? (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-500"
                >
                  {file.name.split(".").pop().toUpperCase()}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
