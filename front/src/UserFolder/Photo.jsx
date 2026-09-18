import { useState } from "react";
import { uploadWithToken } from "../utils/apiUtils";

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
      const response = await uploadWithToken(`http://localhost:8080/api/users/${user.id}/profile-photo`, formData);
  
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
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-4">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Update Profile Photo</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-4 w-full">
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900"
          />
          {/* Display the selected photo preview */}
          <div className="flex items-center justify-center bg-blue-100 rounded-full shadow-inner w-28 h-28 mb-2 overflow-hidden">
            <img src={preview ? preview : imgSrc} alt="Preview" className="object-cover w-24 h-24 rounded-full border-4 border-blue-400 shadow" />
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          Update Profile Photo
        </button>
      </form>
    </div>
  );
}

export default UploadPhotoForm;
