<<<<<<< HEAD
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

export async function likeItem(itemId,userId,likeButton) {
  //console.log(userId);
  await fetch(`${BACKEND_URL}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userId }),
  })
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

// Post a comment
export async function addComments(itemId, commentText) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: commentText }),
  });
  return response.json();
}

// Get comments
export async function getComments(itemId) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`);
  return response.json();
}

export async function deleteComment(itemId, commentId) {
  console.log("Item ID:", itemId);
  console.log("Comment ID:", commentId);
  const id = itemId;
  await fetch(`${BACKEND_URL}/comments/${id}/${commentId}`, {
    method: "DELETE",
  })
}

||||||| empty tree
=======
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

// Post a comment
export async function addComments(itemId, commentText) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: commentText }),
  });
  return response.json();
}

// Get comments
export async function getComments(itemId) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`);
  return response.json();
}

export async function deleteComment(itemId, commentId) {
  console.log("Item ID:", itemId);
  console.log("Comment ID:", commentId);
  
  await fetch(`${BACKEND_URL}/comments/${itemId}/${commentId}`, {
    method: "DELETE",
  })
}

>>>>>>> 4cbffb31080ae9ff1a84befa383667974a90a44d
