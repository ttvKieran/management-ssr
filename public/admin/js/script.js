//Nav
document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll(".menu-link");
    navLinks.forEach(link => {
        link.parentNode.classList.remove("active");
        if (link.getAttribute("href") == currentPath) {
            link.parentNode.classList.add("active");
            let parentLink = link.closest("li.menu-item.root-menu");
            if(parentLink){
                parentLink.classList.add("active");
                parentLink.classList.add("open");
            }
        }
    });
});
//End Nav

//Filter Status
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    const url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url;
        });
    });
}
//End Filter Status

//Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    const url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    });
}
//End Search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const url = new URL(window.location.href);

            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url;
        });
    });
}
//End Pagination

// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("statusCurrent");
            const statusUpdate = (statusCurrent == "active") ? "inactive" : "active";
            const idItem = button.getAttribute("idItem");
            formChangeStatus.action = `${formChangeStatus.getAttribute("path")}/${statusUpdate}/${idItem}?_method=PATCH`;
            formChangeStatus.submit();
        });
    });
}
// End Change Status

// Change Multi
// CheckBox
const checkBoxAll = document.querySelector("input[name='check-box-all']");
const checkBoxItems = document.querySelectorAll("input[name='check-box-item']");
if (checkBoxAll && checkBoxItems.length > 0) {
    checkBoxAll.addEventListener("click", () => {
        if (checkBoxAll.checked == true) {
            checkBoxItems.forEach(checkBoxItem => {
                checkBoxItem.checked = true;
            });
        } else {
            checkBoxItems.forEach(checkBoxItem => {
                checkBoxItem.checked = false;
            });
        }
    });
    checkBoxItems.forEach(checkBoxItem => {
        checkBoxItem.addEventListener("click", () => {
            const countChecked = Array.from(checkBoxItems).filter(checkBoxItem => checkBoxItem.checked).length;
            if (countChecked == checkBoxItems.length) {
                checkBoxAll.checked = true;
            } else {
                checkBoxAll.checked = false;
            }
        });
    });
}
// End CheckBox

// Form Change Multi 
const formChangeMulti = document.querySelector("#form-change-multi");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputIds = formChangeMulti.querySelector("input[name='ids']");
        const action = formChangeMulti.querySelector("select").value;
        if (checkBoxItems.length > 0) {
            const ids = [];
            checkBoxItems.forEach(checkBoxItem => {
                if (checkBoxItem.checked) {
                    if (action == "position") {
                        const position = checkBoxItem.closest("tr").querySelector("input[name='position']").value;
                        ids.push(checkBoxItem.getAttribute("idItem") + "-" + position);
                    } else {
                        ids.push(checkBoxItem.getAttribute("idItem"));
                    }
                }
            });
            if (ids.length > 0) {
                inputIds.value = ids.join(", ");
                if (action == "delete") {
                    const isConfirm = confirm("Are you sure you want to delete these products?");
                    if (!isConfirm) {
                        return;
                    }
                }
                formChangeMulti.submit();
            } else {
                alert("No checkboxes selected. Please choose at least one item.");
            }
        }
    });
}
// End Form Change Multi 
// End Change Multi

// Form Delete
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDelete = document.querySelector("#form-delete");
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const idItem = button.getAttribute("idItem");
            formDelete.action = `${formDelete.getAttribute("path")}/${idItem}?_method=DELETE`;
            formDelete.submit();
        });
    });
}
// End Form Delete

//Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const dataTime = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, dataTime);
}
//End Show Alert

/* Image Preview */
const inputUploadImage = document.querySelector("input[input-upload-image]");
if(inputUploadImage){
    inputUploadImage.addEventListener("change", (e) => {
        const [file] = e.target.files;
        if(file){
            const imagePreviewUpload = document.querySelector("[image-preview-upload]");
            imagePreviewUpload.classList.remove("d-none");
            imagePreviewUpload.classList.add("d-block");
            imagePreviewUpload.src = URL.createObjectURL(file);
        }
    }); 
}
const buttonResetPreviewImage = document.querySelector("span[button-reset-preiview-image]");
if(buttonResetPreviewImage){
    buttonResetPreviewImage.addEventListener("click", () => {
        const avatar = document.getElementById("uploadedAvatar");
        avatar.src = buttonResetPreviewImage.getAttribute("user-avatar");
    });
}
  /* End Image Preview */

// Sort Multi 
const sortMulti = document.querySelector("select[name='sort']");
if(sortMulti){
    const url = new URL(window.location.href);
    sortMulti.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split('-');
        if(sortKey && sortValue){
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            window.location.href = url;
        }
    });
    const sortKey = (url.searchParams.get("sortKey"));
    const sortValue = (url.searchParams.get("sortValue"));
    if(sortKey && sortValue){
        const option = sortMulti.querySelector(`option[value='${sortKey}-${sortValue}']`);
        option.selected = true;
    }
    const buttonClear = document.querySelector("button[button-clear-sort]");
    buttonClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url;
    });
}
// End Sort Multi 
