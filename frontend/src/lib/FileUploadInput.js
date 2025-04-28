import React, { useState } from "react";
import axios from "axios";
import apiList from "./apiList";

const FileUploadInput = ({ onResumeUpload, onProfileUpload }) => {
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeChange = (e) => {
    setSelectedResume(e.target.files[0]);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setSelectedProfilePic(file);

    // Create preview for profile picture
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setUploadStatus("Please login to upload files");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading files...");
    let uploadSuccess = true;
    
    // Upload resume if selected
    if (selectedResume) {
      try {
        const formData = new FormData();
        formData.append("resume", selectedResume);

        const response = await axios.post(apiList.uploadResume, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Resume upload response:", response.data);
        
        if (onResumeUpload) {
          onResumeUpload(response.data.file);
        }
      } catch (error) {
        uploadSuccess = false;
        console.error("Error uploading resume:", error);
      }
    }
    
    // Upload profile pic if selected
    if (selectedProfilePic) {
      try {
        const formData = new FormData();
        formData.append("profile", selectedProfilePic);

        const response = await axios.post(apiList.uploadProfileImage, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Profile upload response:", response.data);
        
        if (onProfileUpload) {
          onProfileUpload(response.data.file);
        }
      } catch (error) {
        uploadSuccess = false;
        console.error("Error uploading profile picture:", error);
      }
    }

    setIsUploading(false);
    if (uploadSuccess) {
      setUploadStatus("Files uploaded successfully!");
      // Clear selections after successful upload
      setSelectedResume(null);
      setSelectedProfilePic(null);
      setPreviewUrl("");
      
      // Reset file input fields by clearing their value
      document.getElementById("resume-input").value = "";
      document.getElementById("profile-input").value = "";
    } else {
      setUploadStatus("One or more uploads failed. Please try again.");
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Your Files</h2>

      <div className="upload-section">
        <h3>Resume</h3>
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
        />
        {selectedResume && <p>Selected resume: {selectedResume.name}</p>}
      </div>

      <div className="upload-section">
        <h3>Profile Picture</h3>
        <input
          id="profile-input"
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
        />
        {previewUrl && (
          <div className="image-preview">
            <img
              src={previewUrl}
              alt="Profile preview"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
      </div>
      
      <button
        onClick={handleUpload}
        disabled={(!selectedResume && !selectedProfilePic) || isUploading}
        className="upload-btn"
      >
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>
      
      {uploadStatus && (
        <p className={`status-message ${uploadStatus.includes("failed") ? "error" : "success"}`}>
          {uploadStatus}
        </p>
      )}

      <style jsx>{`
        .file-upload-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .upload-section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .upload-btn {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
          width: 100%;
        }
        .upload-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .status-message {
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          font-weight: bold;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
        .image-preview {
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

// Default props in case they're not provided
FileUploadInput.defaultProps = {
  onResumeUpload: null,
  onProfileUpload: null
};

export default FileUploadInput;