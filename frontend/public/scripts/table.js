import {handleCreateComment, handleViewComment} from "./comment.js"
import { handleCreteFileBox, display_file } from "./file.js";
import {
  createItem,
  deleteItem,
  getItems,
  filterItems,
  likeItem,
  editItem,
  updateMember,
  findMember,
  uploadFile,
  deleteFile,
  handleAddEditor,
  handleDelEditor,
  getMembers,
} from "./api.js";

function drawTable(items) {
  const table = document.getElementById("main-table-body");
  table.innerHTML = ""; // Clear the table before rendering
  for (const item of items) {
    const row = table.insertRow(); // Create a new row

    // Populate row with data
    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.subject;
    const noteCell = row.insertCell();
    noteCell.innerText = item.note; // เพิ่มโน้ต

    const fileCell = row.insertCell();

    const editorList = document.createElement("div");
    const editorCell = row.insertCell();
    // เพิ่มสมาชิกใน editor ลงใน editorList
    item.editor.forEach((editorName) => {
      const editorNameSpan = document.createElement("span");
      editorNameSpan.textContent = "• " + editorName;
      editorList.appendChild(editorNameSpan);
    });

    const editorSelect = document.createElement("select");
    editorSelect.innerHTML = '<option value="">-- เลือก Co-Editor --</option>';

    getMembers()
      .then((members) => {
        members.forEach((member) => {
          if(member.name!==item.name){
          editorSelect.innerHTML += `<option value="${member.name}">${member.name}</option>`;
          }
        });
      })
      .catch((error) => console.error("ไม่สามารถดึงข้อมูลสมาชิกได้:", error));

    const editorButton = document.createElement("button");
    editorButton.addEventListener("click", () =>
      handleAddEditorin(item._id,item.name ,editorSelect.value)
    );
    editorButton.innerText = "เพิ่ม";

    const delEditorButton = document.createElement("button");
    delEditorButton.addEventListener("click", () =>
      handleDelEditorin(item._id,item.name , editorSelect.value)
    );
    delEditorButton.innerText = "ลบ";

    editorCell.appendChild(editorList);
    editorCell.appendChild(editorSelect);
    editorCell.appendChild(editorButton);
    editorCell.appendChild(delEditorButton);

    row.insertCell().innerText = item.likes.length;

    const actionCell = row.insertCell();

    if (item.fileName) {
      display_file(item.fileName, item._id, fileCell);
    } else {
      fileCell.innerText = "No file"; // Indicate no file is available
    }

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", () =>
      handleDeleteItem(item._id, item.name, item.fileName)
    );
    deleteButton.innerText = "ลบ";

    // Create Comment button
    const commentButton = document.createElement("button");
    commentButton.innerText = "Comment";
    const viewCommentButton = document.createElement("button");
    viewCommentButton.innerText = "View Comments";

    // Create Like button
    let userId = localStorage.getItem("userId");

    if (!userId) {
      // ถ้าไม่มี userId, สร้าง userId ใหม่
      userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId); // เก็บ userId ลงใน Local Storage
    }

    const likeButton = document.createElement("button");
    likeButton.innerText = "ไลค์";
    if (item.likes.includes(userId)) {
      likeButton.innerText = "อันไลค์";
    }
    likeButton.addEventListener("click", () =>
      handleLikeItem(item._id, likeButton)
    );

    const newrow = table.insertRow();
    commentButton.addEventListener("click", (e) => {
      handleCreateComment(actionCell, newrow, item ,e, viewCommentButton);
    });

    viewCommentButton.addEventListener("click", async () => {
      handleViewComment(actionCell,viewCommentButton,newrow,item);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "แก้ไข";
    editButton.addEventListener("click", () =>{
      editButton.disabled = true;
      handleEditItem(item._id, item, noteCell, fileCell, editButton)
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    actionCell.appendChild(commentButton);
    actionCell.appendChild(likeButton);
    actionCell.appendChild(viewCommentButton);
  }
}

export async function fetchAndDrawTable() {
  const items = await getItems();

  drawTable(items);
}

export async function handleDeleteItem(id, name, fileName) {
  if (name === localStorage.getItem("userName")) {
    if (fileName) {
      await deleteFile(id);
    }
    await deleteItem(id);
    await fetchAndDrawTable();
    clearFilter();
  } else {
    alert("This one is not yours.");
  }
}

export async function handleLikeItem(itemId, likeButton) {
  // console.log("handle table");
  let userId = localStorage.getItem("userId");

  if (!userId) {
    // ถ้าไม่มี userId, สร้าง userId ใหม่
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId); // เก็บ userId ลงใน Local Storage
  }

  await likeItem(itemId, userId, likeButton);

  await fetchAndDrawTable();
  clearFilter();
}

export async function handleEditItem(itemId, item, noteCell, fileCell, editButton) {
  var container;
  const userName = localStorage.getItem("userName");
  if (userName === item.name || item.editor.includes(userName)) {
    // ลบข้อความเดิมออกจาก noteCell
    noteCell.innerHTML = "";
    console.log(item.fileName)
    if (item.fileName) {
      const deleteButton = document.createElement("button");
      deleteButton.id = `delete-edit-${item._id}`;
      deleteButton.addEventListener("click", () => {
        fileCell.removeChild(
          document.getElementById(`file-list${item.fileName}`)
        );
        deleteFile(itemId);
        // Create container div
        handleCreteFileBox(fileCell);
        fileCell.removeChild(deleteButton);
      });
      deleteButton.innerText = "ลบ";
      fileCell.appendChild(deleteButton);
    } else {
      fileCell.innerHTML = "";
      handleCreteFileBox(fileCell);
    }
    // สร้าง input สำหรับแก้ไขข้อความ
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.note; // แสดงโน้ตเดิมใน input

    // ปรับขนาดให้เหมาะสม
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.height = "30px"; // ความสูงของ input อาจปรับได้ตามต้องการ

    // สร้างปุ่มบันทึก
    const saveButton = document.createElement("button");
    saveButton.innerText = "บันทึก";
    saveButton.addEventListener("click", async () => {
      editButton.disabled = false;
      const newNote = input.value; // รับค่าที่ผู้ใช้แก้ไข
      var filename = "",
        filepath = "";
      const fileInput = document.getElementById("files-edit");
      const fileContainer = document.getElementById(`container-edit`);
      if(fileContainer)fileCell.removeChild(fileContainer);
      
      if (fileInput && fileInput.files[0]) {
        
        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) {
          alert("Please select a file.");
          return;
        }
        if (file.size > maxSize) {
          alert("File too large. Max size is 5MB.");
          fileInput.value = ""; // Clear the input
          return;
        }
        const formData = new FormData();
        formData.append("file", file);

        const { fileName, filePath } = await uploadFile(formData);
        filename = fileName;
        filepath = filePath;

      } else {
        filename = item.fileName;
        filepath = item.filePath;
      }
      
      const deleteButton = document.getElementById(`delete-edit-${item._id}`);
      if (newNote.trim() !== "") {
      // เรียก API แก้ไขโน้ต
          await editItem(itemId, newNote, filename, filepath);
          // อัปเดตข้อมูลในแถวและเซลล์
          item.note = newNote;
          noteCell.innerText = newNote; // แสดงข้อความที่แก้ไขแล้ว
          location.reload();
      } else {
          alert("ข้อความไม่ควรว่างเปล่า!");
      }
      
      if (!fileCell.hasChildNodes() && fileInput.files[0]) {
          console.log(0);
          display_file(filename, item._id, fileCell);
      }else if(!fileCell.hasChildNodes() ) {
          console.log(1);
          fileCell.innerText = "No file"; 
      }
      else{
          console.log(2);
          fileCell.removeChild(deleteButton)
      }

    });

    // สร้างปุ่มยกเลิก (ถ้าผู้ใช้ต้องการยกเลิกการแก้ไข)
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "ยกเลิก";
    cancelButton.addEventListener("click", () => {
      // คืนค่าให้เป็นข้อความเดิม
      editButton.disabled = false;

      const deletebutton = document.getElementById(`delete-edit-${item._id}`);
      const fileContainer = document.getElementById(`container-edit`);
      noteCell.innerText = item.note;
      if (fileContainer) {
        fileCell.removeChild(fileContainer);
        fileCell.innerText = "No file"; 
      }
      if (deletebutton) {
        fileCell.removeChild(deletebutton);
      }
    });

    // เพิ่ม input, ปุ่มบันทึก และปุ่มยกเลิกใน noteCell
    noteCell.appendChild(input);
    noteCell.appendChild(saveButton);
    noteCell.appendChild(cancelButton); // เพิ่มปุ่มยกเลิก
  } else {
    alert("This one is not yours.");
  }
}

export async function handleAddEditorin(id, name, userName) {
  if(name===localStorage.getItem("userName")){
    const subjectToAdd = document.getElementById("subject-to-add");
    const noteToAdd = document.getElementById("note-to-add");
    const fileInput = document.getElementById("files");
    if(userName===""){
      alert("Please select valid user.");
      return;
    }
    await handleAddEditor(id, userName);
    await fetchAndDrawTable();
    subjectToAdd.value = "ทั้งหมด";
    noteToAdd.value = "";
    fileInput.value = "";
    clearFilter();
  }
  else{
    alert("This one is not yours.");
  }
}

export async function handleDelEditorin(id, name, userName) {
  if(name===localStorage.getItem("userName")){
    const subjectToAdd = document.getElementById("subject-to-add");
    const noteToAdd = document.getElementById("note-to-add");
    const fileInput = document.getElementById("files");
    if(userName===""){
      alert("Please select valid user.");
      return;
    }
    await handleDelEditor(id, userName);
    await fetchAndDrawTable();
    subjectToAdd.value = "ทั้งหมด";
    noteToAdd.value = "";
    fileInput.value = "";
    clearFilter();
  }
  else{
    alert("This one is not yours.");
  }
}

export async function handleCreateItem() {
  const nameToAdd = document.getElementById("member-name-to-add").textContent;
  const editor = document.getElementById("filter-name-editor").value;
  const subjectToAdd = document.getElementById("subject-to-add");
  const noteToAdd = document.getElementById("note-to-add");
  const fileInput = document.getElementById("files");

  if (nameToAdd === "กรุณากรอกชื่อ") {
    alert("กรุณากรอกชื่อ");
    return;
  }
  if (subjectToAdd.value.trim() === "ทั้งหมด" || !noteToAdd.value.trim()) {
    alert("All fields are required!");
    return; // Exit if validation fails
  } else {
    var payload = {
      name: nameToAdd,
      subject: subjectToAdd.value.trim(),
      note: noteToAdd.value.trim(),
      editor: editor,
      like: 0,
    };

    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!file) {
        alert("Please select a file.");
        return;
      }
      if (file.size > maxSize) {
        alert("File too large. Max size is 5MB.");
        fileInput.value = ""; // Clear the input
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const { fileName, filePath } = await uploadFile(formData);
      console.log(fileName);
      // console.log(filename.filename);
      payload = {
        name: nameToAdd,
        subject: subjectToAdd.value.trim(),
        note: noteToAdd.value.trim(),
        like: 0,
        editor: editor,
        fileName: fileName,
        filePath: filePath,
      };
    }
    const id = await createItem(payload);
    const userName = nameToAdd;
    await updateMember(userName, id);
    await fetchAndDrawTable();

    subjectToAdd.value = "ทั้งหมด";
    noteToAdd.value = "";
    fileInput.value = "";
    clearFilter();
  }
}

export async function clearFilter() {
  document.getElementById("filter-name").value = "ทั้งหมด";
  document.getElementById("filter-subject").value = "ทั้งหมด";
}

export async function handleFilterItem() {
  const name = document.getElementById("filter-name").value;
  const subject = document.getElementById("filter-subject").value;

  const items = await filterItems(name, subject);
  await drawTable(items);
}

export async function handleFindAndDeleteElementOfMember(userName) {
  const member = await findMember(userName);
  for (const itemId of member.items) {
    console.log(itemId);
    deleteItem(itemId);
  }
}
