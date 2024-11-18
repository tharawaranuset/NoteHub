import { BACKEND_URL } from "./config.js";

export async function getItems() {
  const items = await fetch(`${BACKEND_URL}/items`).then((r) => r.json());

  return items;
}

export async function createItem(item) {
  await fetch(`${BACKEND_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id, item) {
  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "DELETE",
  });
}

export async function filterItems(filterName, filterSubject) {
  // Build the query string with the parameters
  const queryString = new URLSearchParams({
    filterName,
    filterSubject
  }).toString();

  // Make the request with the query string
  const items = await fetch(`${BACKEND_URL}/items/filter?${queryString}`).then((r) => r.json());

  return items; // Return the filtered items
}

// api.js

// Create a new member
export async function createMember(member) {
  await fetch(`${BACKEND_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });
}

// Get all members
export async function getMembers() {
  const members = await fetch(`${BACKEND_URL}/members`).then((r) => r.json());
  return members;
}

// Delete a member by ID
export async function deleteMember(id) {
  await fetch(`${BACKEND_URL}/members/${id}`, {
    method: "DELETE",
  });
}

export async function addLike(like_member_id,like_item_id) {

    // ตรวจสอบว่าได้ค่าหรือไม่
    if (!like_member_id || !like_item_id) {
      console.error("Member ID หรือ Item ID ไม่ถูกต้อง");
      return;
    }
  await fetch(`${BACKEND_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      memberId: like_member_id,
      itemId: like_item_id,
    })
  });
}

export async function getLikes() {
  const likes = await fetch(`${BACKEND_URL}/likes`).then((r) => r.json());
  return likes;
}