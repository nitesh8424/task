import { useEffect, useState } from "react";
import "./App.css";
import UploadImage from "./uploadImageModal";
import axios from "axios";
import SelectedImage from "./selectedImageModal";
import User from "./User";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [images, setImages] = useState([]);
  const [searchedImages, setSearchedImages] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [filterType, setFilterType] = useState("text");
  const [searchValue, setSearchValue] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onChangeSearch, setOnChangeSearch] = useState(false);
  const itemsPerPage = 5;

  const serverUrl = "http://localhost:5000";
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const logout = () => {
    setIsLogin(false);
    localStorage.removeItem("token");
  };

  const handleSearchChange = (event) => {
    const newSearchValue = event.target.value;
    setSearchValue(newSearchValue);
    setOnChangeSearch(newSearchValue);

    if (newSearchValue) {
      const filteredImages = images.filter(
        (image) =>
          image.title.includes(newSearchValue) ||
          image.description.includes(newSearchValue)
      );
      setSearchedImages(filteredImages);
    } else {
      setSearchedImages([]); // Clear searchedImages when search input is empty
    }
  };

  const handleSearchClick = () => {
    getImages(searchValue);
  };

  const getImages = (useEmptyParams) => {
    const queryParams = {
      page: currentPage,
      perPage: itemsPerPage,
      teamName: teamName,
    };
    console.log("quiey", queryParams);
    if (useEmptyParams) {
      queryParams.keyword = ""; // Empty keyword to get all images
      queryParams.width = null; // Clear width filter
      queryParams.height = null; // Clear height filter
      queryParams.colorPalette = ""; // Clear colorPalette filter
      queryParams.date = ""; // Clear date filter
    } else {
      if (filterType === "text") {
        queryParams.keyword = searchValue;
      } else if (filterType === "date") {
        queryParams.date = searchValue;
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

    axios
      .get(`${serverUrl}/search`, {
        params: queryParams,
      })
      .then((res) => {
        if (res.data.images.length === 0) {
          toast.error("No results found", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setSearchValue("");
          setTimeout(() => {
            getImages(true);
          }, 5000);
        }
        if (!onChangeSearch) {
          setImages(res.data.images);
        } else {
          setSearchedImages(res.data.images);
        }
        setSearchValue("");
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
    const storedToken = localStorage.getItem("token");
    if (storedToken || isLogin) {
      const decodedToken = jwtDecode(storedToken);
      setUsername(decodedToken.username);
      setTeamName(decodedToken.teamName);
      setIsLogin(true);
    }

    axios
      .get(`${serverUrl}/search`, {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          teamName: teamName,
        },
      })
      .then((res) => {
        setImages(res.data.images); // Update the images state directly
      })
      .catch((error) => {
        toast.error(error);
      });
  }, [currentPage, isAdvanceSearch]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            {isLogin ? (
              <div>
                {" "}
                <p> Welcome {username}</p>
                <p onClick={logout}> Logout </p>{" "}
              </div>
            ) : (
              <div>
                <p
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setAction("register");
                  }}
                >
                  {" "}
                  Register{" "}
                </p>
                <p
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setAction("login");
                  }}
                >
                  {" "}
                  Login{" "}
                </p>{" "}
              </div>
            )}
          </div>
          <div className="upload-button-container">
            <button
              className="uploadButton"
              onClick={() => setIsUpload(!isUpload)}
            >
              Upload Image
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
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                {searchedImages.length > 0 && (
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
                          src={`${serverUrl}/${image.imageUrl}`}
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
                    className="inputFilter"
                    checked={filterType === "text"}
                    onChange={handleFilterChange}
                  />
                  keyword or title
                </label>
              </div>
              <button className="searchButton" onClick={handleSearchClick}>
                Search
              </button>
              <button
                className="searchButton"
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  setIsAdvanceSearch(!isAdvanceSearch);
                }}
              >
                Advance Search
              </button>
            </div>
          </div>
          {isAdvanceSearch && (
            <div className="advanceSearchContainer">
              <div className="advanceSearchFields">
                <label>Image Width:</label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Enter width"
                />
              </div>
              <div className="advanceSearchFields">
                <label>Image Height:</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height"
                />
              </div>
              <div className="advanceSearchFields">
                <label>Color Palette:</label>
                <input
                  type="text"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder="Enter color palette"
                />
              </div>
            </div>
          )}
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
              <img src={`${serverUrl}/${image.imageUrl}`} alt={image.title} />
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          ))
        ) : (
          <ToastContainer />
        )}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </button>
        <button
          disabled={images.length < itemsPerPage}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>

      {isUpload && (
        <UploadImage teamName={teamName} onClose={() => setIsUpload(false)} />
      )}
      {isOpen && (
        <User
          action={action}
          onClose={() => setIsOpen(false)}
          setIsLogin={() => setIsLogin(true)}
        />
      )}

      {isSelectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          onClose={() => setIsSelectedImage(false)}
        />
      )}
    </div>
  );
}
export default App;
