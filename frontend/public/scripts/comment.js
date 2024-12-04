import {
  addComments,
  getComments,
  deleteComment,
} from "./api.js";

export async function handleCreateComment(actionCell, newrow, item, e,viewCommentButton) {
    e.target.disabled = true;
    let textArea = document.createElement("textarea");
    const postCommentButton = document.createElement("button");
    textArea.id = "comment-section";
    postCommentButton.innerText = "Post";
    postCommentButton.id = "post-comment-button";
    //post
    postCommentButton.addEventListener("click", async () => {
        const commentText = textArea.value.trim();
        if (!commentText) {
            alert("Comment cannot be empty!");
            return;
        }
        const author = localStorage.getItem("userName");
        // Post the comment to the server
        await addComments(item._id, commentText, author);

        // Clear the text area and UI elements for comment input
        e.target.disabled = false;
        actionCell.removeChild(postCommentButton);
        actionCell.removeChild(textArea);
        actionCell.removeChild(cancelButton);

        // Fetch and display the updated comments list dynamically
        const comments = await getComments(item._id);
        handleViewComment(actionCell,viewCommentButton,newrow,item);
        updateCommentList(comments, newrow, item._id);
        
});

const cancelButton = document.createElement("button");
cancelButton.innerText = "❌";
cancelButton.addEventListener("click", () => {
    e.target.disabled = false;
    actionCell.removeChild(postCommentButton);
    actionCell.removeChild(textArea);
    actionCell.removeChild(cancelButton);
});

textArea.setAttribute("cols", "50");
textArea.setAttribute("rows", "5");
textArea.setAttribute("placeholder", "Enter your message here");
actionCell.appendChild(textArea);
actionCell.appendChild(postCommentButton);
actionCell.appendChild(cancelButton);
}

export async function handleViewComment(actionCell, viewCommentButton, newrow, item) {
    const hideCommentButton = document.createElement("button");
    hideCommentButton.innerText = "Hide Comments";
    actionCell.removeChild(viewCommentButton);
    actionCell.appendChild(hideCommentButton);

    const comments = await getComments(item._id);
    updateCommentList(comments, newrow, item._id);

    hideCommentButton.addEventListener("click", () => {
        handleHideComment(actionCell, viewCommentButton, hideCommentButton, item);
    });
}

export async function handleHideComment(actionCell, viewCommentButton, hideCommentButton, item) {
    const commentList = document.getElementById(`comments-${item._id}`);
    if (commentList) {
        commentList.remove();
    }
    actionCell.removeChild(hideCommentButton);
    actionCell.appendChild(viewCommentButton);
}

export async function updateCommentList(comments, actionCell, itemId) {
    // Check if a comment list already exists and remove it
    const existingCommentList = document.getElementById(`comments-${itemId}`);
    if (existingCommentList) {
        existingCommentList.remove();
    }

    // Create a new comment list
    const commentList = document.createElement("ul");
    commentList.id = `comments-${itemId}`;

    comments.forEach((comment) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${comment.author}: ${comment.text}`;

        // Create Edit button
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.style.marginLeft = "10px"; // Add spacing
        editButton.addEventListener("click", () => {
        const userName = localStorage.getItem("userName");
        if (userName === comment.author) {
            // Replace comment text with input field
            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = comment.text;
            editInput.style.marginRight = "10px";

            const saveButton = document.createElement("button");
            saveButton.innerText = "Save";
            saveButton.addEventListener("click", async () => {
            const newCommentText = editInput.value.trim();
            if (newCommentText) {
                // Update the comment in the database
                await addComments(itemId, newCommentText, comment.author); // Assuming `addComments` can update comments
                await deleteComment(itemId, comment._id);
                // Refresh comments
                const updatedComments = await getComments(itemId);
                updateCommentList(updatedComments, actionCell, itemId);
            } else {
                alert("Comment cannot be empty!");
            }
            });

            const cancelButton = document.createElement("button");
            cancelButton.innerText = "Cancel";
            cancelButton.addEventListener("click", () => {
            // Restore original comment text
            updateCommentList(comments, actionCell, itemId);
            });

            // Clear list item and add editing elements
            listItem.innerHTML = ""; // Clear the current content
            listItem.appendChild(editInput);
            listItem.appendChild(saveButton);
            listItem.appendChild(cancelButton);
        } else {
            alert("You can only edit your own comments.");
        }
        });

        // Create a Delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.marginLeft = "10px"; // Add spacing
        deleteButton.addEventListener("click", async () => {
        const userName = localStorage.getItem("userName");
        if (userName === comment.author) {
            const confirmDelete = confirm(
            "Are you sure you want to delete this comment?"
            );
            if (confirmDelete) {
            await deleteComment(itemId, comment._id); // Assuming `deleteComment` is the API function
            // alert("Comment deleted successfully!");

            // Fetch and update the comments list after deletion
            const updatedComments = await getComments(itemId);
            updateCommentList(updatedComments, actionCell, itemId);
            }
        } else {
            alert("This one is not yours.");
        }
        });

        // Append the Delete button to the list item
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        // Add the list item to the comment list
        commentList.appendChild(listItem);
    });

    // Append the updated comment list to the action cell
    actionCell.appendChild(commentList);
}