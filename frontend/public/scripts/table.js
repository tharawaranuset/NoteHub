import { BACKEND_URL } from "./config.js";

import {
  createItem,
  deleteItem,
  getItems,
  filterItems,
  addComments,
  getComments,
  deleteComment,
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
          editorSelect.innerHTML += `<option value="${member.name}">${member.name}</option>`;
        });
      })
      .catch((error) => console.error("ไม่สามารถดึงข้อมูลสมาชิกได้:", error));

    const editorButton = document.createElement("button");
    editorButton.addEventListener("click", () =>
      handleAddEditorin(item._id, editorSelect.value)
    );
    editorButton.innerText = "เพิ่ม";

    const delEditorButton = document.createElement("button");
    delEditorButton.addEventListener("click", () =>
      handleDelEditorin(item._id, editorSelect.value)
    );
    delEditorButton.innerText = "ลบ";

    editorCell.appendChild(editorList);
    editorCell.appendChild(editorSelect);
    editorCell.appendChild(editorButton);
    editorCell.appendChild(delEditorButton);

    row.insertCell().innerText = item.likes.length;

    const actionCell = row.insertCell();

    if (item.fileName) {
      const fileList = document.createElement("div");
      fileList.id = `file-list${item.fileName}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = `${BACKEND_URL}/file/download/${item._id}`;
      downloadLink.target = "_blank";
      downloadLink.textContent = item.fileName;

      fileList.appendChild(downloadLink);

      fileCell.appendChild(fileList);
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
      e.target.disabled = true;
      let textArea = document.createElement("textarea");
      const postCommentButton = document.createElement("button");
      textArea.id = "comment-section";
      postCommentButton.innerText = "Post";
      postCommentButton.id = "post-comment-button";
      //post
      postCommentButton.addEventListener("click", async () => {
        const commentText = textArea.value.trim();
        if (!commentText) {
          alert("Comment cannot be empty!");
          return;
        }
        const author = localStorage.getItem("userName");
        // Post the comment to the server
        await addComments(item._id, commentText, author);

        // Clear the text area and UI elements for comment input
        e.target.disabled = false;
        actionCell.removeChild(postCommentButton);
        actionCell.removeChild(textArea);
        actionCell.removeChild(cancelButton);

        // alert("Comment posted successfully!");

        // Fetch and display the updated comments list dynamically
        const comments = await getComments(item._id);
        updateCommentList(comments, newrow, item._id);
      });

      const cancelButton = document.createElement("button");
      cancelButton.innerText = "❌";
      cancelButton.addEventListener("click", () => {
        e.target.disabled = false;
        actionCell.removeChild(postCommentButton);
        actionCell.removeChild(textArea);
        actionCell.removeChild(cancelButton);
      });

      textArea.setAttribute("cols", "50");
      textArea.setAttribute("rows", "5");
      textArea.setAttribute("placeholder", "Enter your message here");
      actionCell.appendChild(textArea);
      actionCell.appendChild(postCommentButton);
      actionCell.appendChild(cancelButton);
    });

    viewCommentButton.addEventListener("click", async () => {
      const hideCommentButton = document.createElement("button");
      hideCommentButton.innerText = "Hide Comments";
      actionCell.removeChild(viewCommentButton);
      actionCell.appendChild(hideCommentButton);

      const comments = await getComments(item._id);
      updateCommentList(comments, newrow, item._id);

      hideCommentButton.addEventListener("click", () => {
        const commentList = document.getElementById(`comments-${item._id}`);
        if (commentList) {
          commentList.remove();
        }
        actionCell.removeChild(hideCommentButton);
        actionCell.appendChild(viewCommentButton);
      });
    });

    const editButton = document.createElement("button");
    editButton.innerText = "แก้ไข";
    editButton.addEventListener("click", () =>
      handleEditItem(item._id, item, noteCell, fileCell)
    );

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
    alert("This one is not your");
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

export async function handleEditItem(itemId, item, noteCell, fileCell) {
  var container;
  const userName = localStorage.getItem("userName");
  if (userName === item.name || item.editor.includes(userName)) {
    // ลบข้อความเดิมออกจาก noteCell
    noteCell.innerHTML = "";
    if (item.fileName) {
      const deleteButton = document.createElement("button");
      deleteButton.id = "delete-edit";
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
      const newNote = input.value; // รับค่าที่ผู้ใช้แก้ไข
      var filename = "",
        filepath = "";
      const fileInput = document.getElementById("files-edit");
      const fileContainer = document.getElementById(`container-edit`);
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
        filename = fileName;
        filepath = filePath;
      } else {
        filename = "";
        filepath = "";
      }
      fileCell.removeChild(fileContainer);
      if (newNote.trim() !== "") {
        // เรียก API แก้ไขโน้ต
        await editItem(itemId, newNote, filename, filepath);

        // อัปเดตข้อมูลในแถวและเซลล์
        item.note = newNote;
        noteCell.innerText = newNote; // แสดงข้อความที่แก้ไขแล้ว
        if (item.fileName) {
          const fileList = document.createElement("div");
          fileList.id = `file-list${item.fileName}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = `${BACKEND_URL}/file/download/${item._id}`;
          downloadLink.target = "_blank";
          downloadLink.textContent = item.fileName;

          fileList.appendChild(downloadLink);

          fileCell.appendChild(fileList);
        } else {
          fileCell.innerText = "No file"; // Indicate no file is available
        }
      } else {
        alert("ข้อความไม่ควรว่างเปล่า!");
      }
    });

    // สร้างปุ่มยกเลิก (ถ้าผู้ใช้ต้องการยกเลิกการแก้ไข)
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "ยกเลิก";
    cancelButton.addEventListener("click", () => {
      // คืนค่าให้เป็นข้อความเดิม
      const deletebutton = document.getElementById(`delete-edit`);
      const fileContainer = document.getElementById(`container-edit`);
      noteCell.innerText = item.note;
      if (fileContainer) {
        fileCell.removeChild(fileContainer);
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
    alert("This one is not your");
  }
}

export async function handleAddEditorin(id, userName) {
  await handleAddEditor(id, userName);
  await fetchAndDrawTable();
}

export async function handleDelEditorin(id, userName) {
  await handleDelEditor(id, userName);
  await fetchAndDrawTable();
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

function updateCommentList(comments, actionCell, itemId) {
  // Check if a comment list already exists and remove it
  const existingCommentList = document.getElementById(`comments-${itemId}`);
  if (existingCommentList) {
    existingCommentList.remove();
  }

  // Create a new comment list
  const commentList = document.createElement("ul");
  commentList.id = `comments-${itemId}`;

  comments.forEach((comment) => {
    const listItem = document.createElement("li");
    // console.log("Item ID:", itemId);
    // console.log("Comment ID:", comment._id);
    // Display the comment text
    listItem.innerText = `${comment.author}: ${comment.text}`;

    // Create Edit button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.style.marginLeft = "10px"; // Add spacing
    editButton.addEventListener("click", () => {
      const userName = localStorage.getItem("userName");
      if (userName === comment.author) {
        // Replace comment text with input field
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = comment.text;
        editInput.style.marginRight = "10px";

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", async () => {
          const newCommentText = editInput.value.trim();
          if (newCommentText) {
            // Update the comment in the database
            await addComments(itemId, newCommentText, comment.author); // Assuming `addComments` can update comments
            await deleteComment(itemId, comment._id);
            // Refresh comments
            const updatedComments = await getComments(itemId);
            updateCommentList(updatedComments, actionCell, itemId);
          } else {
            alert("Comment cannot be empty!");
          }
        });

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => {
          // Restore original comment text
          updateCommentList(comments, actionCell, itemId);
        });

        // Clear list item and add editing elements
        listItem.innerHTML = ""; // Clear the current content
        listItem.appendChild(editInput);
        listItem.appendChild(saveButton);
        listItem.appendChild(cancelButton);
      } else {
        alert("You can only edit your own comments.");
      }
    });

    // Create a Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.marginLeft = "10px"; // Add spacing
    deleteButton.addEventListener("click", async () => {
      const userName = localStorage.getItem("userName");
      if (userName === comment.author) {
        const confirmDelete = confirm(
          "Are you sure you want to delete this comment?"
        );
        if (confirmDelete) {
          await deleteComment(itemId, comment._id); // Assuming `deleteComment` is the API function
          // alert("Comment deleted successfully!");

          // Fetch and update the comments list after deletion
          const updatedComments = await getComments(itemId);
          updateCommentList(updatedComments, actionCell, itemId);
        }
      } else {
        alert("This one is not your");
      }
    });

    // Append the Delete button to the list item
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    // Add the list item to the comment list
    commentList.appendChild(listItem);
  });

  // Append the updated comment list to the action cell
  actionCell.appendChild(commentList);
}

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
