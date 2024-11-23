// import { addLike } from "./api.js";
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

  // const addLikeButton = document.getElementById("add-like");
  // addLikeButton.addEventListener("click", (event) => {
  //   const button = event.target;
  //   if (!button) {
  //     console.error("ปุ่มไม่ถูกต้อง");
  //     return;
  //   }
  //   const like_member_id = button.getAttribute("like_member_id");
  //   const like_item_id = button.getAttribute("like_item_id");

  //   if (!like_member_id || !like_item_id) {
  //     console.error("Member ID หรือ Item ID ไม่ถูกต้อง");
  //     return;
  //   }
  //   //console.log("like_member_id:", like_member_id, "like_item_id:", like_item_id);

  //   addLike(like_member_id, like_item_id);
  // });

});
