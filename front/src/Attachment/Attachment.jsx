import React from 'react';
import axios from 'axios';

export function UploadFiles({ emailID }) {

  // Function to trigger the file selection dialog
  const handleFileSelect = () => {
    // Create an input element dynamically
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;  // Allow multiple files to be selected

    // When files are selected, send them to the backend
    input.onchange = async (event) => {
      const files = event.target.files;

      if (files.length > 0) {
        // Prepare the FormData object
        const formData = new FormData();

        // Append selected files to FormData
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        // Append the email ID to the form data
        formData.append('emailId', emailID);

        // Send the data to the backend
        try {
          const response = await axios.post('http://localhost:8080/api/attachments/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Files uploaded successfully', response.data);
        } catch (error) {
          console.error('Error uploading files', error);
        }
      }
    };

    // Trigger the file input
    input.click();
  };

  return (
    <div>
      <button onClick={handleFileSelect}>Upload Files for Email ID {emailID}</button>
      {/* You can call handleFileSelect with other email IDs as needed */}
    </div>
  );
}

export default UploadFiles;
