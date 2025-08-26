import { useState } from "react";
import "./userFolder.css"
import axios from "axios";

function UploadPhotoForm({user, setUser}) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null); 
  const imgSrc = user?.profileUrl
  ? `http://localhost:8080${user.profileUrl}` 
  : "/man.jpg"; // fallback

  // Handle file change (photo upload)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile); 

    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("file", photo); 
  
    try {
      // Send the data to the backend API
      const response = await axios.post(`http://localhost:8080/api/users/${user.id}/profile-photo`, formData, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
      });
  
      if (response.status === 200) {
        const profile_url = response.data; // the new photo url
        setUser(prevUser => ({ ...prevUser, profileUrl: profile_url }));
        console.log("Profile URL updated:", profile_url);
        alert("Photo uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo.");
    }
  };
  
  return (
    <div className="updatePhoto">
      <h2>update profile Photo</h2>
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
        {(
          <div className="preview">
            <img src={preview ? preview : imgSrc} alt="Preview" style={{ width: 100, height: 100 }} />
          </div>
        )}
      </div>
        <button type="submit">update profile Photo</button>
      </form>
    </div>
  );
}

export default UploadPhotoForm;
