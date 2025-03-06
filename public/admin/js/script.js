//Nav
document.addEventListener("DOMContentLoaded", function() {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll(".menu-link");
    navLinks.forEach(link => {
        link.parentNode.classList.remove("active");
      if(link.getAttribute("href") == currentPath){
        link.parentNode.classList.add("active");
      }

    });
});
//End Nav

//Filter Status
const buttonStatus = document.querySelectorAll('[button-status]');
if(buttonStatus.length > 0){
    const url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status", status);
            } else{
                url.searchParams.delete("status");
            }
            window.location.href = url;
        });
    });
}
//End Filter Status

//Search Product
const formSearchProduct = document.querySelector("#form-search");
if(formSearchProduct){
    const url = new URL(window.location.href);
    formSearchProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set("keyword",keyword);
        } else{
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    });
}
//End Search Product

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination.length > 0){
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

// Change Status Product
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0){
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
// End Change Status Product

// Change Multi Status Product
    // CheckBox
const checkBoxAll = document.querySelector("input[name='check-box-all']");
const checkBoxItems = document.querySelectorAll("input[name='check-box-item']");
if(checkBoxAll && checkBoxItems.length > 0){
    checkBoxAll.addEventListener("click", () => {
        if(checkBoxAll.checked == true){
            checkBoxItems.forEach(checkBoxItem => {
                checkBoxItem.checked = true;
            }); 
        } else{
            checkBoxItems.forEach(checkBoxItem => {
                checkBoxItem.checked = false;
            }); 
        }
    });
    checkBoxItems.forEach(checkBoxItem => {
        checkBoxItem.addEventListener("click", () => {
            const countChecked = Array.from(checkBoxItems).filter(checkBoxItem => checkBoxItem.checked).length;
            if(countChecked == checkBoxItems.length){
                checkBoxAll.checked = true;
            } else{
                checkBoxAll.checked = false;
            }
        });
    });
}
    // End CheckBox
    
    // Form Change Multi Status
const formChangeMultiStatus = document.querySelector("#form-change-multi-status");
if(formChangeMultiStatus){
    formChangeMultiStatus.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputIds = formChangeMultiStatus.querySelector("input[name='ids']");
        if(checkBoxItems.length > 0){
            const ids = [];
            checkBoxItems.forEach(checkBoxItem => {
                if(checkBoxItem.checked){
                    ids.push(checkBoxItem.getAttribute("idItem"));
                }
            });
            if(ids.length > 0){
                inputIds.value = ids.join(", ");
                formChangeMultiStatus.submit();
            } else{
                alert("No checkboxes selected. Please choose at least one item.");
            }
        }
    });
}
    // End Form Change Multi Status
// End Change Multi Status Product

