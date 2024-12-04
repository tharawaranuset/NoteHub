import { BACKEND_URL } from "./config.js";

export async function handleCreteFileBox(fileCell) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.id = "container-edit";
  
    // Create file input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "files-edit";
    fileInput.name = "file";
  
    // Create response div
    const responseDiv = document.createElement("div");
    responseDiv.id = "response";
    responseDiv.classList.add("response");
  
    // Append file input and response div to container
    container.appendChild(fileInput);
    container.appendChild(responseDiv);
  
    // Append container to the body (or any specific parent element)
    fileCell.appendChild(container);
  }
  
  export async function display_file(fileName, id, fileCell){
    if(fileName==null){
        fileCell.innerText = "No file"; 
        return;
    }
    const fileList = document.createElement("div");
    fileList.id = `file-list${fileName}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = `${BACKEND_URL}/file/download/${id}`;
    downloadLink.target = "_blank";
    downloadLink.textContent = fileName.split("-",2)[1];
  
    fileList.appendChild(downloadLink);
  
    fileCell.appendChild(fileList);
  }