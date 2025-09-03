const menuBtn = document.getElementById("menuBtn");
const hamburgerIcon = document.getElementById("hamburger-icon");
const sideBar = document.getElementById("sideBar");
const open_folder_modal = document.getElementById("open-folder-modal");
const new_folder_modal = document.getElementById("new-folder-modal");
const closefolderModal = document.getElementById("closefolderModal");
const editInput = document.getElementById("edit-folder-input");
const edit_folder_modal = document.getElementById("edit-folder-modal");

menuBtn.addEventListener("click", () => {
  hamburgerIcon.classList.toggle("open");
  sideBar.classList.toggle("-translate-x-full");
});

// DIALOG
document.querySelectorAll(".items").forEach((btn, index) => {
  const modals = document.querySelectorAll(".file-modal")[index];
  const closeModal = document.querySelectorAll(".close-modal-btn")[index];

  btn.addEventListener("click", () => {
    modals.showModal();
  });

  closeModal.addEventListener("click", () => {
    modals.close();
  });
});

document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const foldername = btn.getAttribute("data-name");
    editInput.value = foldername;
    edit_folder_modal.showModal();
  });
});
// folder button
document.querySelectorAll(".action-menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dropDown = btn.nextElementSibling;
    dropDown.classList.toggle("hidden");
  });
});

open_folder_modal.addEventListener("click", () => {
  new_folder_modal.showModal();
});

document.querySelectorAll(".closefolderModal").forEach((btn) => {
  btn.addEventListener("click", () => {
    new_folder_modal.close();
    edit_folder_modal.close();
  });
});
