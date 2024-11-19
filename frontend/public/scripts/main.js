import { addLike } from "./api.js";
import { handleCreateMember, populateMembers } from "./member.js";
import { fetchAndDrawTable, handleCreateItem, handleFilterItem } from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDrawTable();

  populateMembers();

  const addItemButton = document.getElementById("add-newrow");
  addItemButton.addEventListener("click", () => {
    event.preventDefault();
    handleCreateItem();
  });

  const filterButton = document.getElementById("filter-button");
  filterButton.addEventListener("click", () => {
    handleFilterItem();
  });

  const addMemberButton = document.getElementById("add-newrow");
  addMemberButton.addEventListener("click", () => {
    handleCreateMember();
  });

  const addLikeButton = document.getElementById("add-like");
  addLikeButton.addEventListener("click", (event) => {
    const button = event.target;
    if (!button) {
      console.error("ปุ่มไม่ถูกต้อง");
      return;
    }
    const like_member_id = button.getAttribute("like_member_id");
    const like_item_id = button.getAttribute("like_item_id");

    if (!like_member_id || !like_item_id) {
      console.error("Member ID หรือ Item ID ไม่ถูกต้อง");
      return;
    }
    //console.log("like_member_id:", like_member_id, "like_item_id:", like_item_id);

    addLike(like_member_id, like_item_id);
  });

  // Get references to the elements
  // const noteInput = document.getElementById('note-to-add');
  // const addCommentButton = document.getElementById('add-comment-button');

  // // Listen for input events on the note-to-add field
  // noteInput.addEventListener('input', () => {
  //   if (noteInput.value.trim() !== '') {
  //     addCommentButton.style.display = 'block'; // Show the button
  //   } else {
  //     addCommentButton.style.display = 'none'; // Hide the button
  //   }
  // });

  // Optional: Add functionality for the Add Comment button
  // document.getElementById('add-comment-button').addEventListener('click', function () {
  //   const commentInputContainer = document.getElementById('comment-input-container');
  //   commentInputContainer.style.display = 'block'; // Show the input container
  // });
  
  // document.getElementById('post-comment-button').addEventListener('click', function () {
  //   const commentInput = document.getElementById('comment-input');
  //   const commentsList = document.getElementById('comments-list');
  
  //   const newComment = commentInput.value.trim();
  
  //   if (newComment) {
  //     const commentElement = document.createElement('p');
  //     commentElement.textContent = newComment;
  //     commentsList.appendChild(commentElement);
  
  //     commentInput.value = ''; // Clear the input field
  //     document.getElementById('comment-input-container').style.display = 'none'; // Hide the input container
  //   } else {
  //     alert('Please write a comment before posting!');
  //   }
  // });
  


});
