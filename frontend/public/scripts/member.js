// member.js

import { createMember, deleteMember, getMembers } from "./api.js";
import { fetchAndDrawTable } from "./table.js";

// Populate the member list and dropdowns
export async function populateMembers() {
  const memberList = document.getElementById("member-list");
  const filterSelect = document.getElementById("filter-name");

  memberList.innerHTML = "";
  filterSelect.innerHTML = '<option value="ทั้งหมด">-- ชื่อผู้อัปโหลดทั้งหมด --</option>';

  // Fetch all members from the backend
  const members = await getMembers();

  // Render members and their delete buttons
  members.forEach((member) => {
    const li = document.createElement("li");
    li.textContent = member.name;
    const button = document.createElement("button");
    button.addEventListener("click", () => handleDeleteMember(member._id));
    button.innerText = "ไล่";

    const div = document.createElement("div");
    div.appendChild(li);
    div.appendChild(button);
    memberList.appendChild(div);
  });

  // Add members to the "filter-name" dropdown
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = option.textContent = member.name;
    filterSelect.appendChild(option);
  });
}

// Handle creating a new member
export async function handleCreateMember() {
  const nameToAdd = document.getElementById("member-name-to-add");
  const subjectToAdd = document.getElementById("subject-to-add");
  const noteToAdd = document.getElementById("note-to-add");

  if (!nameToAdd.value.trim()  || subjectToAdd.value.trim()==="ทั้งหมด" || !noteToAdd.value.trim()) {
    return; // Exit if validation fails
  }
  else {
    // Call the API to create the member
    await createMember({ name: nameToAdd.value.trim() });

    // Refresh the member list and table
    await fetchAndDrawTable();
    await populateMembers();

    // Clear the input field
    nameToAdd.value = "";
  }
  
}

// Handle deleting a member
export async function handleDeleteMember(id) {
  // Call the API to delete the member
  await deleteMember(id);

  // Refresh the member list and table
  await fetchAndDrawTable();
  await populateMembers();
}
