
import { BACKEND_URL } from "./config.js";

export async function getItems() {
  const items = await fetch(`${BACKEND_URL}/items`).then((r) => r.json());

  return items;
}

export async function createItem(item) {
    const response = await fetch(`${BACKEND_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    // ตรวจสอบสถานะการตอบกลับของคำขอ
    if (!response.ok) {
      throw new Error("Failed to create item");
    }

    // แปลงการตอบกลับจากเซิร์ฟเวอร์เป็น JSON
    const data = await response.json();

    // ส่งกลับ id ของไอเท็มใหม่
    return data.id;  // สมมติว่าเซิร์ฟเวอร์ส่งกลับ id ของไอเท็มใหม่
}

export async function deleteItem(id) {
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

export async function editItem(itemId,newNote,fileName,filePath) {
  //console.log(userId);
  await fetch(`${BACKEND_URL}/items/${itemId}/edit`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note: newNote , fileName: fileName, filePath: filePath}),
  });
}

export async function handleAddEditor(id,userName) {
  try {
    const response = await fetch(`${BACKEND_URL}/items/${id}/addeditor`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName }),
    });

    if (!response.ok) {
      // ถ้าเซิร์ฟเวอร์ตอบกลับไม่สำเร็จ (เช่น 400 หรือ 500)
      const errorData = await response.json();
      console.error("Failed to add editor:", errorData);
      return;  // คืนค่าหรือหยุดการทำงาน
    }

    const data = await response.json();
    console.log("Editor added successfully:", data);
  } catch (error) {
    console.error("Error adding editor:", error);
  }
}

export async function handleDelEditor(id,userName) {
    await fetch(`${BACKEND_URL}/items/${id}/deleditor`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName }),
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
export async function createMember(userName) {
  await fetch(`${BACKEND_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userName}),
  });
}

export async function updateMember(userName,id) {
  try {
    const response = await fetch(`${BACKEND_URL}/members`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, id: id }),
    });

    // ตรวจสอบสถานะของการตอบกลับ
    if (!response.ok) {
      throw new Error("Failed to update member");
    }

    const data = await response.json();  // รับข้อมูลจากการตอบกลับ

    
    

    return data;  // ส่งข้อมูลที่ได้รับกลับ (อาจเป็นข้อมูลของสมาชิกที่ได้รับการอัปเดต)
  } catch (err) {
    console.error("Error in updateMember:", err);
    throw err;
  }
}

// Get all members
export async function getMembers() {
  const members = await fetch(`${BACKEND_URL}/members`).then((r) => r.json());
  return members;
}

export async function findMember(userName) {
  try {
    const response = await fetch(`${BACKEND_URL}/members/find?userName=${userName}`);  // ส่ง query string ไปยัง API
    if (!response.ok) {
      throw new Error('Failed to fetch member');
    }
    const member = await response.json();  // แปลงข้อมูลเป็น JSON
    return member;  // ส่งข้อมูลสมาชิกกลับ
  } catch (err) {
    console.error('Error:', err);
  }
}

// Delete a member by ID
export async function deleteMember(userName) {
  await fetch(`${BACKEND_URL}/members/${userName}`, {
    method: "DELETE",
  });
}

// Post a comment
export async function addComments(itemId, commentText,author) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: commentText ,author: author}),
  });
  return response.json();
}

// Get comments
export async function getComments(itemId) {
  const response = await fetch(`${BACKEND_URL}/comments/${itemId}`);
  return response.json();
}

export async function deleteComment(itemId, commentId) {
  // console.log("Item ID:", itemId);
  // console.log("Comment ID:", commentId);
  const id = itemId;
  await fetch(`${BACKEND_URL}/comments/${id}/${commentId}`, {
    method: "DELETE",
  })
}

export async function uploadFile(formData){
  var fileName,filePath;
  try {
    const response = await fetch(`${BACKEND_URL}/file/upload`, {
      method: "POST",
      body: formData,
    }) .then((response) => response.json())
    .then((data) => {
        console.log(data.message); // Logs: File uploaded successfully!
        console.log("Uploaded File Name:", data.fileName);
        fileName = data.fileName;
        filePath = data.filePath;
    })
    .catch((error) => console.error("Error:", error));

    // if (!response.ok) {
    //   throw new Error(`Error: ${response.statusText}`);
    // }
    return {fileName : fileName, filePath : filePath};
    // document.getElementById("result").innerText = result;
  } catch (err) {
    console.error('Upload failed:', err);
    // document.getElementById("result").innerText = `Upload failed: ${err.message}`;
  }
}
export async function deleteFile(id){
  await fetch(`${BACKEND_URL}/file/delete/${id}`, {
      method: "DELETE",
    }) 
}