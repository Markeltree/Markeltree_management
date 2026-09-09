import { Icon, getFileIcon } from "@/common/imports";

export default function UploadingFileCard({
  fileName,
  uploadedKB,
  totalKB,
  percentage,
  onCancel,
  showProgress = true,
  statusText = "Uploading...",
  statusIcon = "eos-icons:loading",
  statusClassName = "text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4]",
  topIcon = "oui:cross-in-circle-empty",
}) {
  const fileIcon = getFileIcon(fileName);

  return (
    <div className="relative bg-[#7377911A] rounded-lg p-4 w-full h-auto">
      {/* Cancel icon */}
      {topIcon === "material-symbols-light:delete-outline-rounded" ? (
        <button
          className="absolute top-3 right-2 text-[#EF4444]"
          //   onClick={onCancel}
        >
          <Icon icon={topIcon} width="20" height="20" />
        </button>
      ) : (
        <button
          className="absolute top-2 right-2 text-[#EF4444]"
          onClick={onCancel}
        >
          <Icon icon={topIcon} width="16" height="19" />
        </button>
      )}

      {/* File Info */}
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <Icon
          icon={fileIcon}
          className="text-[#107C41]"
          width="40"
          height="40"
        />

        {/* Text Info */}
        <div className="flex flex-col text-sm">
          <span className="font-medium text-[#151D48] dark:text-[#B7BFEA]">
            {fileName}
          </span>
          <div className="flex flex-row gap-6 items-center">
            {/* File size */}
            <div className="text-[10px] text-[#737791] dark:text-[#737791]">
              {uploadedKB} KB of {totalKB} KB
            </div>

            {/* Uploading status */}
            <div className={`flex items-center gap-2 ${statusClassName}`}>
              <Icon
                icon={statusIcon}
                className={
                  statusIcon === "eos-icons:loading" ? "animate-spin" : ""
                }
                width="16"
              />
              {statusText}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar (optional) */}
      {showProgress && (
        <div className="relative pt-4">
          <div className="h-2 bg-[#D3D3F2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0CB91D] rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="absolute right-1 -top-1 text-[10px] text-[#8E8E9C] dark:text-[#8E8E9C] font-normal">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
