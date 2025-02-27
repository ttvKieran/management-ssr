//Nav
document.addEventListener("DOMContentLoaded", function() {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll(".menu-link");
    console.log(navLinks);
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