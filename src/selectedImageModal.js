import "./App.css";

function SelectedImage({ selectedImage, onClose }) {
  const serverUrl = "http://localhost:5000";
  return (
    <div className="uploadModalBox">
      <div className="uploadModal" style={{height: '400px', overflowY:'scroll', scrollBehavior:'auto'}}>
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <label className="modalTitle">Selected Image</label>
        <div className="container">
          <div className="imageList">
            <div className="imageItem">
              <img
                src={`${serverUrl}/${selectedImage.imageData.imageUrl}`}
                alt={selectedImage.imageData.title}
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <h3>Title : {selectedImage.imageData.title}</h3>
              <p>Description : {selectedImage.imageData.description}</p>
              <div className="keywordsContainer">
                Keyword :{" "}
                {selectedImage.imageData.keywords.map((keyword, index) => (
                  <div key={index} className="keywordItem">
                    {keyword}
                  </div>
                ))}
              </div>
              <p>ID : {selectedImage.imageData.id}</p>
              <p>Upload Date : {selectedImage.imageData.uploadDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedImage;
