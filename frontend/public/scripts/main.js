
// import { addLike } from "./api.js";
import { handleCreateMember, populateMembers } from "./member.js";
import { fetchAndDrawTable, handleCreateItem, handleFilterItem } from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
  
  fetchAndDrawTable();

  populateMembers();

  let userId = localStorage.getItem("userId");
  let userName = localStorage.getItem("userName");

  // ถ้าไม่มี userId, สร้าง userId ใหม่
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);  // เก็บ userId ลงใน Local Storage
  }

  // ถ้ามีชื่อผู้ใช้แล้ว แสดงข้อความทักทาย
  if (userName) {
    document.getElementById("welcomeMessage").style.display = "block";
    document.getElementById("userDisplayName").textContent = userName;
    document.getElementById("userForm").style.display = "none";
  } else {
    document.getElementById("userForm").style.display = "block";
    document.getElementById("welcomeMessage").style.display = "none";
  }

  // ฟังก์ชันบันทึกชื่อผู้ใช้
  const saveNameButton = document.getElementById("saveNameButton");
  saveNameButton.addEventListener("click", () => {
    const usernameInput = document.getElementById("username").value;
    if (usernameInput) {
      localStorage.setItem("userName", usernameInput);  // เก็บชื่อผู้ใช้ใน Local Storage
      document.getElementById("userDisplayName").textContent = usernameInput;
      document.getElementById("welcomeMessage").style.display = "block";
      document.getElementById("userForm").style.display = "none";
    } else {
      alert("กรุณากรอกชื่อผู้ใช้");
    }
  });

  // ฟังก์ชันเปลี่ยนชื่อผู้ใช้
  const changeNameButton = document.getElementById("changeNameButton");
  changeNameButton.addEventListener("click", () => {
    localStorage.removeItem("userName");  // ลบชื่อเดิม
    document.getElementById("userForm").style.display = "block";
    document.getElementById("welcomeMessage").style.display = "none";
  });
  
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

});
