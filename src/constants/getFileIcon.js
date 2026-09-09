export const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return "material-icon-theme:pdf";
    case "jpg":
      return "streamline-ultimate-color:image-file-jpg";
    case "csv":
    case "xlsx":
    case "xls":
    case "xlv":
      return "vscode-icons:file-type-excel";
    default:
      return "mdi:file-document-outline";
  }
};
