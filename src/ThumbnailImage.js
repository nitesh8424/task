import React from "react";

const ThumbnailImage = ({ image, openSelectedImage, setIsSelectedImage }) => (
    <div
      key={image._id}
      className="thumbnailItem"
      style={{ cursor: "pointer" }}
      onClick={() => {
        openSelectedImage(image._id);
        setIsSelectedImage(true);
      }}
    >
      <img
        src={`${process.env.SERVER_URL}/${image.imageUrl}`}
        alt={image.title}
      />
      <div className="thumbnailDetails">
        <h3>{image.title}</h3>
        <p>ID: {image._id}</p>
        <p>
          Upload Date:{" "}
          {new Date(image.uploadDate).toLocaleDateString()}
        </p>
        <p>{image.description}</p>
      </div>
    </div>
);

export default ThumbnailImage;
