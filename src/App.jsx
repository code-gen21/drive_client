import { useEffect, useState } from "react";
import "./App.css";
import { FaDownload } from "react-icons/fa6"; // <FaDownload />
import { FaEye } from "react-icons/fa"; // <FaEye />
import { MdOutlineDriveFileRenameOutline } from "react-icons/md"; // <MdOutlineDriveFileRenameOutline />
import { RiDeleteBin6Line } from "react-icons/ri"; // <RiDeleteBin6Line />
import { LiaSave } from "react-icons/lia"; //<LiaSave />
import { IoCloseCircleSharp } from "react-icons/io5";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [newFilename, setNewFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [oldName, setOldName] = useState("");
  useEffect(() => {
    getDirectoryItems();
    // setDirectoryItems(data);
  }, []);

  async function getDirectoryItems() {
    const response = await fetch("https://drive-three-henna.vercel.app/");
    const data = await response.json();
    // console.log(data);
    setDirectoryItems(data);
  }

  async function uploadFile(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    // const response=await fetch("http://localhost:80/",{
    //     method:"POST",
    //     body: file,
    //     headers:{
    //         filename:file.name,
    //     }
    // })
    // const data=await response.json();
    // console.log(data);
    const name2 = file.name.replace(/ /g, "_");
    // file.name = name2;
    console.log(file.name);
    if (!checkFilename(name2)) {
      console.log("A file with this name already exists in server");
      return;
    }
    console.log("Uploading file....");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://drive-three-henna.vercel.app/", true);
    xhr.setRequestHeader("filename", name2);
    xhr.addEventListener("load", (e) => {
      // console.log(xhr.response);
      getDirectoryItems();
      setProgress(0);
    });
    xhr.addEventListener("progress", (e) => {
      console.log("Tracking download bar");
    });
    xhr.upload.addEventListener("progress", (e) => {
      // console.log(e);
      const progPercent = ((e.loaded / e.total) * 100).toFixed(2);
      setProgress(progPercent);
    });
    xhr.send(file);
  }

  async function handleDelete(filename) {
    // console.log(filename);
    const response = await fetch(
      "https://drive-three-henna.vercel.app/delete",
      {
        method: "DELETE",
        headers: { file: filename },
      }
    );
    const data = await response.json();
    // console.log(data);
    console.log(data.message);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    const changeNameContainer = document.querySelector(".changeName");
    console.log(changeNameContainer);
    changeNameContainer.classList.add("visibilityBlock");
    setNewFilename(oldFilename);
    setOldName(oldFilename);
  }
  async function saveFilename(oldFilename) {
    if (newFilename === "") {
      console.log("Enter some value");
      return;
    }
    if (!checkFilename(newFilename)) {
      console.log("A file with this name already exists in server");
      return;
    }
    const response = await fetch("https://drive-three-henna.vercel.app/", {
      method: "PATCH",
      body: JSON.stringify({ oldFilename, newFilename }),
    });
    const data = await response.text();
    console.log(data);
    const changeNameContainer = document.querySelector(".changeName");
    // console.log(changeNameContainer);
    changeNameContainer.classList.remove("visibilityBlock");
    setNewFilename("");
    getDirectoryItems();
  }

  function checkFilename(filename) {
    return directoryItems.every((item) => {
      if (item === filename) return false;
      else return true;
    });
  }
  function closeRename() {
    const changeNameContainer = document.querySelector(".changeName");
    // console.log(changeNameContainer);
    changeNameContainer.classList.remove("visibilityBlock");
  }

  return (
    <div className="root-container">
      <h2 className="heading">Files in your drive</h2>
      <div className="upload-file">
        <input type="file" onChange={uploadFile} />
        <h4>Progress of upload: {progress}%</h4>
      </div>
      <div className="changeName">
        <input
          type="text"
          onChange={(e) => {
            setNewFilename(e.target.value);
          }}
          value={newFilename}
        />
        <div className="icon-text save" onClick={() => saveFilename(oldName)}>
          <LiaSave />
          <button className="save">Save</button>
        </div>
        <div className="icon-text close" onClick={() => closeRename()}>
          <IoCloseCircleSharp />
          <button className="close">Close</button>
        </div>
      </div>

      <div className="directory-items">
        {/* <ul> */}
        {directoryItems.map((item, key) => {
          return (
            <div className="items-list" key={key}>
              <div className="item-content">
                {item.length > 18 ? item.slice(0, 15) : item}
                {item.length > 18 ? "..." : ""}{" "}
              </div>
              <div className="all-buttons">
                <div className="icon-text preview">
                  <FaEye />
                  <a
                    href={`https://drive-three-henna.vercel.app/${item}?action=preview`}
                  >
                    Preview{" "}
                  </a>
                </div>

                <div className="icon-text download">
                  <FaDownload />
                  <a
                    href={`https://drive-three-henna.vercel.app/${item}?action=download`}
                  >
                    Download{" "}
                  </a>
                </div>

                <div
                  className="icon-text delete"
                  onClick={() => {
                    handleDelete(item);
                  }}
                >
                  <RiDeleteBin6Line />
                  <button className="delete">Delete</button>
                </div>

                <div
                  className="icon-text rename"
                  onClick={() => renameFile(item)}
                >
                  <MdOutlineDriveFileRenameOutline />
                  <button className="rename">Rename</button>
                </div>

                <br></br>
              </div>
            </div>
          );
        })}
        {/* </ul> */}
      </div>
      {/* {console.log(directoryItems)} */}
    </div>
  );
}

export default App;
