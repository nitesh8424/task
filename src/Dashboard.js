import React, { useEffect, useState } from "react";
import "./App.css";
import UploadImage from "./uploadImageModal";
import axios from "axios";
import SelectedImage from "./selectedImageModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./Loading";
import { useSelector, useDispatch } from "react-redux";
import { searchValue } from "./actions";
import { ChromePicker } from "react-color";
require('dotenv').config()

function Dashboard() {
  const [images, setImages] = useState([]);
  const [searchedImages, setSearchedImages] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [filterType, setFilterType] = useState("text");
  const [selectedImage, setSelectedImage] = useState();
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [colorPalette, setColorPalette] = useState(null);
  const [color, setColor] = useState({ r: 255, g: 255, b: 255 }); // Initial color
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const itemsPerPage = 3;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const search = useSelector((state) => state.searchValue);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    // console.log("filter", filterType);
    dispatch(searchValue(event.target.value));
  };

  const handleChangeComplete = (newColor) => {
    if (newColor.rgb) {
      setColor(newColor.rgb);
      setColorPalette({
        r: newColor.rgb.r,
        g: newColor.rgb.g,
        b: newColor.rgb.b,
      });
    } else {
      setColorPalette({
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      });
    }
  };

  const handleColorInputChange = (event, channel) => {
    const newValue = parseInt(event.target.value, 10) || 0;
    const newColor = { ...color, [channel]: newValue };
    setColor(newColor);
    handleChangeComplete(newColor);
  };

  useEffect(() => {
    console.log("colorPalette", colorPalette);
  }, [colorPalette]);

  const handleSearchChange = (event) => {
    dispatch(searchValue(event.target.value));
    // getOnSearchImages();
  };

  const handleClearAll = () => {
    dispatch(searchValue(''));
    setWidth("");
    setHeight("");
    setColorPalette('');
    getImages();
  };

  const handleSearchClick = async () => {
    setIsLoading(true);
    try {
      await getImages();
      dispatch(searchValue(""));
      if (filterType === "date") {
        setFilterType("text");
      }
    } catch (error) {
      toast.error("An error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  const getImages = async () => {
    const queryParams = {
      page: currentPage,
      perPage: itemsPerPage,
      teamName: user?.teamName,
    };
    if (search !== "") {
      if (filterType === "text") {
        queryParams.keyword = search;
      } else if (filterType === "date") {
        queryParams.date = search;
      }
    }
    if (width) {
      queryParams.width = width;
    }
    if (height) {
      queryParams.height = height;
    }
    if (colorPalette) {
      queryParams.colorPalette = JSON.stringify(colorPalette);
    }
    console.log("query", queryParams);
    try {
      const response = await axios.get(`${process.env.SERVER_URL}/images/search`, {
        params: queryParams,
      });
      if (response.data.images.length === 0) {
        toast.error("No results found", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setImages(response.data.images);
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const getOnSearchImages = () => {
    const queryParams = {
      page: currentPage,
      perPage: itemsPerPage,
      teamName: user?.teamName,
    };
    if (search !== "") {
      if (filterType === "text") {
        queryParams.keyword = search;
      } else if (filterType === "date") {
        queryParams.date = search;
      }
      if (width) {
        queryParams.width = width;
      }
      if (height) {
        queryParams.height = height;
      }
      if (colorPalette) {
        queryParams.colorPalette = colorPalette;
      }
    }
    console.log("query", queryParams);
    axios
      .get(`${process.env.SERVER_URL}/images/search`, {
        params: queryParams,
      })
      .then((res) => {
        if (res.data.images.length === 0) {
          toast.error("No results found", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setSearchedImages(res.data.images);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const openSeletedImage = (imageId) => {
    const imageData = images.find((img) => img._id === imageId);
    setSelectedImage({ imageData });
  };

  useEffect(() => {
    setIsLoading(true);
    getImages();
    console.log("response", images);
  }, [user, currentPage]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="upload-button-container">
            <button
              className="uploadButton"
              onClick={() => setIsUpload(!isUpload)}
            >
              {" "}
              Upload Image{" "}
            </button>
          </div>
          <div className="imagesContainer">
            <div className="searchContainer">
              <div className="searchBox">
                <input
                  className="searchInput"
                  style={{ width: "360px" }}
                  type={filterType === "date" ? "date" : "text"}
                  placeholder={`Search using ${
                    filterType === "date" ? "date" : "title or keyword"
                  }`}
                  value={search}
                  onChange={handleSearchChange}
                />
                {searchedImages.length > 0 && search !== "" && (
                  <div className="thumbnailList">
                    {searchedImages.map((image) => (
                      <div
                        key={image._id}
                        className="thumbnailItem"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          openSeletedImage(image._id);
                          setIsSelectedImage(!isSelectedImage);
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
                    ))}
                  </div>
                )}
              </div>
              <div className="filterBox">
                <label>
                  <input
                    type="radio"
                    name="filter"
                    value="date"
                    className="dateFilter"
                    checked={filterType === "date"}
                    onChange={handleFilterChange}
                  />
                  Date
                </label>
                <label>
                  <input
                    type="radio"
                    name="filter"
                    value="text"
                    className="textFilter"
                    checked={filterType === "text"}
                    onChange={handleFilterChange}
                  />
                  Title/Keyword
                </label>
              </div>
              <button className="searchButton" onClick={handleSearchClick}>
                {" "}
                Search{" "}
              </button>
              <button
                className="searchButton"
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  setIsAdvanceSearch(!isAdvanceSearch);
                }}
              >
                {" "}
                Advance Search{" "}
              </button>
              <button
                className="searchButton"
                style={{ marginLeft: "20px" }}
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
            {isAdvanceSearch && (
              <div className="advanceSearchContainer">
                <div className="advanceSearchFields">
                  <label>Width:</label>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="advanceSearchFields">
                  <label>Height:</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="advanceSearchFields">
                  <label>Color Palette:</label>
                </div>
                <div className="advanceSearchFields">
                  <label>RGB Values:</label>
                  <input
                    type="number"
                    value={color.r}
                    className="inputColors"
                    onChange={(e) => handleColorInputChange(e, "r")}
                  />
                  <input
                    type="number"
                    value={color.g}
                    className="inputColors"
                    onChange={(e) => handleColorInputChange(e, "g")}
                  />
                  <input
                    type="number"
                    value={color.b}
                    className="inputColors"
                    onChange={(e) => handleColorInputChange(e, "b")}
                  />
                </div>

                <div className="advanceSearchFields">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>click on color Show/Hide</p>
                    <div
                      style={{
                        backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                        width: "30px",
                        height: "30px",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowColorPicker(!showColorPicker);
                      }}
                    ></div>
                  </div>
                  {showColorPicker && (
                    <div style={{ position: "absolute", right: "10px" }}>
                      <ChromePicker
                        color={color}
                        onChangeComplete={handleChangeComplete}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="imageList">
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image._id}
              className="imageItem"
              style={{ cursor: "pointer" }}
              onClick={() => {
                openSeletedImage(image._id);
                setIsSelectedImage(!isSelectedImage);
              }}
            >
              <img src={`${process.env.SERVER_URL}/${image.imageUrl}`} alt={image.title} />
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          ))
        ) : (
          <ToastContainer />
        )}
      </div>
      {images && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            {" "}
            Previous{" "}
          </button>
          <button
            disabled={images.length < itemsPerPage}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            {" "}
            Next{" "}
          </button>
        </div>
      )}

      {/* Modals */}
      {isUpload && (
        <UploadImage
          teamName={user?.teamName}
          onClose={() => setIsUpload(false)}
        />
      )}
      {isSelectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          onClose={() => setIsSelectedImage(false)}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default Dashboard;
