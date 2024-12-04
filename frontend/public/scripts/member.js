// member.js

import { createMember, deleteMember, findMember, getMembers } from "./api.js";
import { fetchAndDrawTable } from "./table.js";

// Populate the member list and dropdowns
export async function populateMembers() {
  const memberList = document.getElementById("member-list");
  const filterSelect = document.getElementById("filter-name");
  const filterSelectEditor = document.getElementById("filter-name-editor");
  memberList.innerHTML = "";
  filterSelect.innerHTML = '<option value="ทั้งหมด">-- ทั้งหมด --</option>';
  filterSelectEditor.innerHTML = '<option value="">---------</option>';
  // Fetch all members from the backend
  const members = await getMembers();

  // Render members and their delete buttons
  members.forEach((member) => {
    const li = document.createElement("li");
    li.textContent = member.name;
    // const button = document.createElement("button");
    // button.addEventListener("click", () => handleDeleteMember(member.name));
    // button.innerText = "ไล่";

    const div = document.createElement("div");
    div.appendChild(li);
    // div.appendChild(button);
    memberList.appendChild(div);
  });

  // Add members to the "filter-name" dropdown
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = option.textContent = member.name;
    filterSelect.appendChild(option);
  });

  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = option.textContent = member.name;
    filterSelectEditor.appendChild(option);
  });
}

export async function handleCreateNewMember() {
  const userName = localStorage.getItem("userName");

  await createMember(userName);
  await fetchAndDrawTable();
  await populateMembers();
}
// Handle creating a new member
export async function handleCreateMember() {
  const nameToAdd = document.getElementById("member-name-to-add").innerText;
  const subjectToAdd = document.getElementById("subject-to-add");
  const noteToAdd = document.getElementById("note-to-add");

  if (
    !nameToAdd ||
    subjectToAdd.value.trim() === "ทั้งหมด" ||
    !noteToAdd.value.trim()
  ) {
    return; // Exit if validation fails
  } else {
    // Call the API to create the member
    await createMember(nameToAdd);

    // Refresh the member list and table
    await fetchAndDrawTable();
    await populateMembers();

    // Clear the input field
  }
}
// Handle deleting a member
export async function handleDeleteMember(userName) {
  // Call the API to delete the member
  // let items = await getItems();

  await deleteMember(userName);

  // Refresh the member list and table
  await fetchAndDrawTable();
  await populateMembers();
  location.reload();
}

export async function handleFindAndDeleteElementOfMember(userName) {
  const member = await findMember(userName);
  for (const itemId of member.items) {
    await deleteItem(itemId);
  }
}
