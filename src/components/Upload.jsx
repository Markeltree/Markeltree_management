import { Icon, useRef } from "@/common/imports";

export default function Upload({
  label = "Upload Invoice",
  description = "PDF, JPG, XLV and CSV formats, up to 50MB",
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log("Files selected:", files);
      // You can handle the upload manually here or pass to backend
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[12px] font-normal text-[#737791] dark:text-[#A9A9CD]">
        {label}
        {/* Upload Invoice */}
      </label>

      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.jpg,.jpeg,.xlsx,.csv"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drop Area */}
      <div
        className="w-full border border-[#73779140] rounded-md p-2 h-[135px]"
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          console.log("Files dropped:", files);
          // handleFileUpload(files)
        }}
      >
        <div className="h-[116px] border-2 border-dashed border-[#5D5FEF] dark:border-[#7476F1] rounded-md p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]">
          {/* Row 1: Icon + Click here to upload */}
          <div className="flex items-center gap-2 text-[#5D5FEF] dark:text-[#7476F1] font-normal text-[12px] hover:underline hover:font-semibold">
            <Icon
              icon="proicons:cloud-add"
              className="text-lg text-[#5D5FEF] dark:text-[#7476F1]"
              width="32"
              height="27"
            />
            Click here to upload
          </div>

          {/* Row 2: Drag and Drop */}
          <div className="text-[14px] text-[#737791] dark:text-[#A9A9CD] font-medium hover:font-semibold">
            Drag and Drop
          </div>

          {/* Row 3: File types and size */}
          <div className="text-[12px] font-light text-[#737791] dark:text-[#A9A9CD] mt-1 hover:font-semibold">
            {description}
            {/* PDF, JPG, XLV and CSV formats, up to 50MB */}
          </div>
        </div>
      </div>
    </div>
  );
}
