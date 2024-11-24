
import { createItem, deleteItem, getItems, filterItems, addComments, getComments,deleteComment,likeItem, editItem} from "./api.js";

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
    row.insertCell().innerText = item.likes.length;
    
    const actionCell = row.insertCell();

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", () => handleDeleteItem(item._id));
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
      localStorage.setItem("userId", userId);  // เก็บ userId ลงใน Local Storage
    }

    const likeButton = document.createElement("button");
    likeButton.innerText = "ไลค์";
    if(item.likes.includes(userId)){
      likeButton.innerText = "อันไลค์";
    }
    likeButton.addEventListener("click", () => handleLikeItem(item._id,likeButton));

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
      
        // Post the comment to the server
        await addComments(item._id, commentText);
      
        // Clear the text area and UI elements for comment input
        e.target.disabled = false;
        actionCell.removeChild(postCommentButton);
        actionCell.removeChild(textArea);
        actionCell.removeChild(cancelButton);
      
        alert("Comment posted successfully!");
      
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
    editButton.addEventListener("click", () => handleEditItem(item._id, item,noteCell));
    actionCell.appendChild(editButton);

    actionCell.appendChild(deleteButton);
    actionCell.appendChild(commentButton);
    actionCell.appendChild(likeButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(viewCommentButton);
  }
}


export async function fetchAndDrawTable() {
  const items = await getItems();

  drawTable(items);
}

export async function handleDeleteItem(id) {
  await deleteItem(id);
  await fetchAndDrawTable();
  clearFilter();
}

export async function handleLikeItem(itemId,likeButton) {
  // console.log("handle table");
  let userId = localStorage.getItem("userId");

  if (!userId) {
    // ถ้าไม่มี userId, สร้าง userId ใหม่
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);  // เก็บ userId ลงใน Local Storage
  }

  await likeItem(itemId,userId,likeButton);

  await fetchAndDrawTable();
  clearFilter();
}

async function handleEditItem(itemId, item, noteCell) {
  // ลบข้อความเดิมออกจาก noteCell
  noteCell.innerHTML = "";

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
    if (newNote.trim() !== "") {
      // เรียก API แก้ไขโน้ต
      await editItem(itemId, newNote); 
      
      // อัปเดตข้อมูลในแถวและเซลล์
      item.note = newNote;
      noteCell.innerText = newNote; // แสดงข้อความที่แก้ไขแล้ว
    } else {
      alert("ข้อความไม่ควรว่างเปล่า!");
    }
  });

  // สร้างปุ่มยกเลิก (ถ้าผู้ใช้ต้องการยกเลิกการแก้ไข)
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "ยกเลิก";
  cancelButton.addEventListener("click", () => {
    // คืนค่าให้เป็นข้อความเดิม
    noteCell.innerText = item.note;
  });

  // เพิ่ม input, ปุ่มบันทึก และปุ่มยกเลิกใน noteCell
  noteCell.appendChild(input);
  noteCell.appendChild(saveButton);
  noteCell.appendChild(cancelButton); // เพิ่มปุ่มยกเลิก
}

export async function handleCreateItem() {
  const nameToAdd = document.getElementById("member-name-to-add");
  const subjectToAdd = document.getElementById("subject-to-add");
  const noteToAdd = document.getElementById("note-to-add");

  if (!nameToAdd.value.trim() || subjectToAdd.value.trim()==="ทั้งหมด" || !noteToAdd.value.trim()) {
    alert("All fields are required!");
    return; // Exit if validation fails
  }
  else {
    const payload = {
      name: nameToAdd.value.trim(),
      subject: subjectToAdd.value.trim(),
      note: noteToAdd.value.trim(),
      like: 0,
    };

    await createItem(payload);
    await fetchAndDrawTable();
    
    nameToAdd.value = "";
    subjectToAdd.value = "ทั้งหมด";
    noteToAdd.value = "";

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

    // Create a Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.marginLeft = "10px"; // Add spacing
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this comment?");
      if (confirmDelete) {
        await deleteComment(itemId, comment._id); // Assuming `deleteComment` is the API function
        alert("Comment deleted successfully!");

        // Fetch and update the comments list after deletion
        const updatedComments = await getComments(itemId);
        updateCommentList(updatedComments, actionCell, itemId);
      }
    });

    // Append the Delete button to the list item
    listItem.appendChild(deleteButton);

    // Add the list item to the comment list
    commentList.appendChild(listItem);
  });

  // Append the updated comment list to the action cell
  actionCell.appendChild(commentList);
}

