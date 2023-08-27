import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./Loading";
require('dotenv').config();

function UploadImage({ teamName, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [colors, setColors] = useState([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = e.target.result;
      console.log("img src", image.src);
      image.onload = function () {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        buildRgb(imageData);
        const dimensions = { width: image.width, height: image.height };
        setImageDimensions(dimensions);
      };
    };
    reader.readAsDataURL(file);
  };

  const buildRgb = (imageData) => {
    const rgbValues = [];
    console.log("data", imageData.data[1]);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const rgb = { r, g, b };

      const isUnique = rgbValues.every(
        (existingRgb) =>
          existingRgb.r !== r || existingRgb.g !== g || existingRgb.b !== b
      );

      if (isUnique) {
        rgbValues.push(rgb);
      }

      if (rgbValues.length >= 20) {
        break;
      }
    }
    setColors(rgbValues);
  };

  const handleInputChange = (event, setState) => {
    setState(event.target.value);
  };

  const addKeyword = () => {
    if (newKeyword.trim() !== "" && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const handleResponse = (response, successMessage) => {
    if (response.status === 200) {
      toast.success(successMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    onClose();
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        alert("You are not authorized, please log in");
      } else {
        alert("An error occurred");
      }
    } else {
      alert("An error occurred");
    }
  };

  const uploadImage = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("keywords", keywords.join(","));
    formData.append("image", selectedImage);
    formData.append("width", imageDimensions.width);
    formData.append("height", imageDimensions.height);
    formData.append("tag", tag);
    formData.append("teamName", teamName);
    colors.forEach((color) => {
      formData.append("colors[]", JSON.stringify(color));
    });
    console.log("formData", formData);
  
    try {
      const response = await axios.post(
        `{process.env.SERVER_URL}/images/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLoading(false);
      handleResponse(response, response.data.message);
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  };

  return (
    <div className="uploadModalBox">
      <div className="uploadModal">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <label className="modalTitle">Upload Image</label>
        <div className="container">
          <form className="imageForm" onSubmit={uploadImage}>
            <input
              className="imageBox"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageChange}
            />
            <canvas style={{ display: "none" }} id="canvas"></canvas>
            <div id="palette"></div>
            <div id="complementary"></div>
            {selectedImage && (
              <>
                <div className="inputContainer">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="inputField"
                    onChange={(e) => handleInputChange(e, setTitle)}
                    required
                  />
                </div>
                <div className="inputContainer">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    className="inputField"
                    onChange={(e) => handleInputChange(e, setDescription)}
                    required
                  />
                </div>
                <div className="inputContainer">
                  <label>Tags</label>
                  <input
                    type="text"
                    className="inputField"
                    placeholder="Enter tag"
                    value={tag}
                    onChange={(e) => handleInputChange(e, setTag)}
                    required
                  />
                </div>
                <div className="inputContainer">
                  <label>Keywords</label>
                  <input
                    type="text"
                    placeholder="Keyword"
                    className="inputField"
                    value={newKeyword}
                    onChange={(e) => handleInputChange(e, setNewKeyword)}
                  />
                  <input
                    type="button"
                    value="Add"
                    className="submitButton"
                    onClick={addKeyword}
                    required
                  />
                </div>
              </>
            )}
            <div className="keywordsContainer">
              {keywords.map((keyword, index) => (
                <div key={index} className="keywordItem">
                  {index > 0 && <span className="comma"> </span>}
                  {keyword}
                </div>
              ))}
            </div>
            {selectedImage && (
              <div className="submitButtonContainer">
                <input type="submit" value="Upload" className="submitButton" />
              </div>
            )}
          </form>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default UploadImage;
