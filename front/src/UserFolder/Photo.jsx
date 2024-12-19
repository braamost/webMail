import React, { useState } from "react";
import "./userFolder.css"
import axios from "axios";

function UploadPhotoForm({ email, setUser }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null); // State to store the photo preview

  // Handle file change (photo upload)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile); // Get the file from the input
    // Create a preview URL for the selected file (to show it before uploading)
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object to send both email and photo
    const formData = new FormData();
    formData.append("photo", photo); // Attach photo file
  
    try {
      // Send the data to the backend API
      const response = await axios.post(`http://localhost:8080/api/users/upload-photo/${email}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // After a successful upload, update the user with the new photo URL
      if (response.status === 200) {
        const updatedUser = response.data; // Assuming the backend returns the updated user data with a base64-encoded photo
        console.log(updatedUser);  ///
        // Check if the backend returns a base64 string for the image
          // If it's base64, convert it back to the original image format (Blob)
          const blob = base64ToBlob(updatedUser.photo);
          const url = URL.createObjectURL(blob);
  
          // Update the user's profile with the image URL
          setPreview(url); // Display the image on the UI
          updatedUser.photo = url; // Update the user data with the new image URL
          console.log(updatedUser);
          alert("Photo uploaded and updated successfully!");

        
        setUser(updatedUser); // Update the user state in the parent component
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo.");
    }
  };
  
  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64, contentType = 'image/jpeg') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    return new Blob(byteArrays, { type: contentType });
  };
  

  return (
    <div className="updatePhoto">
      <h2>Upload Photo</h2>
      <form onSubmit={handleSubmit}>
        <div className="selectPre">
        <div>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Display the selected photo preview */}
        {preview && (
          <div className="preview">
            <h3>Photo Preview:</h3>
            <img src={preview} alt="Preview" style={{ width: 100, height: 100 }} />
          </div>
        )}
      </div>
        <button type="submit">Upload Photo</button>
      </form>
    </div>
  );
}

export default UploadPhotoForm;
