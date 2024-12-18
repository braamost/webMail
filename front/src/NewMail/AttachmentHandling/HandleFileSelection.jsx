
export const handleFileSelection = (e,attachments , setAttachedFiles ) => {
  console.log("handleFileSelection")
  console.log(attachments.current)
  e.preventDefault();
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true; // Allow multiple files to be selected

  input.onchange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();
      const fileArray = Array.from(files);
      setAttachedFiles(prevFiles => [...prevFiles, ...fileArray]);

      // Append selected files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append("files", fileArray[i]);
      }
      attachments.current = formData;
    }
  };
  input.click();
}
