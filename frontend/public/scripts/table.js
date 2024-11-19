import { createItem, deleteItem, getItems, filterItems, postComment, getComments} from "./api.js";

function drawTable(items) {
  const table = document.getElementById("main-table-body");
  table.innerHTML = ""; // Clear the table before rendering
  for (const item of items) {
    const row = table.insertRow(); // Create a new row
    // Populate row with data
    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.subject;
    row.insertCell().innerText = item.note;
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
    
        await postComment(item._id, commentText);
        e.target.disabled = false;
        actionCell.removeChild(postCommentButton);
        actionCell.removeChild(textArea);
        actionCell.removeChild(cancelButton);
        alert("Comment posted successfully!");
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
      const comments = await getComments(item._id);
    
      const commentList = document.createElement("ul");
      commentList.id = `comments-${item._id}`;
      comments.forEach((comment) => {
        const listItem = document.createElement("li");
        listItem.innerText = comment;
        commentList.appendChild(listItem);
      });
    
      const existingCommentList = document.getElementById(`comments-${item._id}`);
      if (existingCommentList) {
        existingCommentList.remove();
      } else {
        actionCell.appendChild(commentList);
      }
    });
    

    actionCell.appendChild(deleteButton);
    actionCell.appendChild(commentButton);
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