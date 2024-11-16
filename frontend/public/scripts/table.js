import { createItem, deleteItem, getItems, filterItems } from "./api.js";

function drawTable(items) {
  const table = document.getElementById("main-table-body");

  table.innerHTML = "";
  for (const item of items) {
    const row = table.insertRow();
    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.subject;
    row.insertCell().innerText = item.note;

    const button = document.createElement("button");
    button.addEventListener("click", () => handleDeleteItem(item._id));
    button.innerText = "ลบ";

    row.insertCell().appendChild(button);
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
  const nameToAdd = document.getElementById("name-to-add");
  const subjectToAdd = document.getElementById("subject-to-add");
  const noteToAdd = document.getElementById("note-to-add");

  if (!nameToAdd.value.trim() || subjectToAdd.value.trim()==="ทั้งหมด" || !noteToAdd.value.trim()) {
    alert("Name, Subject, and Note are required!");
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
    
    nameToAdd.value = "0";
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