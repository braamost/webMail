import { useRef } from "react";

export const handleFileSelection = (e, props) => {
  e.preventDefault();
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true; // Allow multiple files to be selected

  input.onchange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();

      // Append selected files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      props.attachments.current = formData;
    }
  };
  input.click();
}
