
// import { addLike } from "./api.js";
import { deleteItem, findMember, getMembers } from "./api.js";
import { handleCreateMember, handleDeleteMember, populateMembers ,handleCreateNewMember } from "./member.js";
import { fetchAndDrawTable, handleCreateItem, handleDeleteItem, handleFilterItem, handleFindAndDeleteElementOfMember } from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
  
  
  fetchAndDrawTable();

  populateMembers();

  const userDisplayName = document.getElementById("userDisplayName");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const userForm = document.getElementById("userForm");

  // ตรวจสอบว่า userName มีอยู่ใน localStorage หรือไม่
  let userName = localStorage.getItem('userName');

  if (userName) {
    // ถ้ามีชื่อผู้ใช้ใน localStorage ให้แสดงข้อความทักทาย
    userDisplayName.textContent = userName;
    welcomeMessage.style.display = "block";
    userForm.style.display = "none";
  } else {
    // ถ้าไม่มีชื่อผู้ใช้ใน localStorage ให้แสดง form ให้กรอกชื่อ
    userForm.style.display = "block";
    welcomeMessage.style.display = "none";
  }

  // ฟังก์ชันบันทึกชื่อผู้ใช้
  const saveNameButton = document.getElementById("saveNameButton");
  saveNameButton.addEventListener("click", () => {
    const usernameInput = document.getElementById("username").value;
  
    if (usernameInput) {
      // 1. เก็บชื่อใน localStorage
      localStorage.setItem("userName", usernameInput);
      
      // 2. ส่งชื่อไปบันทึกใน MongoDB
      handleCreateNewMember();
      location.reload();
      
    } else {
      alert("กรุณากรอกชื่อผู้ใช้");
    }
  });

  // ฟังก์ชันเปลี่ยนชื่อผู้ใช้
  const changeNameButton = document.getElementById("changeNameButton");
  changeNameButton.addEventListener("click", () => {
    let userName = localStorage.getItem('userName');
    // delete from mongo
    
    //handleFindAndDeleteElementOfMember(userName);

    handleDeleteMember(userName);
    // ลบชื่อจาก localStorage
    //deleteItem()
    localStorage.removeItem("userName");
    
    
    // เปลี่ยนไปแสดงฟอร์มให้กรอกชื่อใหม่
    userForm.style.display = "block";
    welcomeMessage.style.display = "none";
    //location.reload();
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

  // const addMemberButton = document.getElementById("add-newrow");
  // addMemberButton.addEventListener("click", () => {
  //   handleCreateMember();
  // });
  
  const memberName = localStorage.getItem('userName');
  const memberNameElement = document.getElementById('member-name-to-add');

  // ตรวจสอบว่าอิลิเมนต์มีอยู่ใน DOM และให้ข้อมูลจาก localStorage
  if (memberNameElement) {
    if (memberName) {
      memberNameElement.textContent = memberName;
    } else {
      memberNameElement.textContent = 'กรุณากรอกชื่อ';
    }
  } else {
    console.error('ไม่พบอิลิเมนต์ที่มี id="member-name-to-add"');
  }

});
