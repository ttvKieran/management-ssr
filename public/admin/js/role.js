// Permission
const buttonSubmit = document.querySelector("[button-submit]");
if(buttonSubmit){
    buttonSubmit.addEventListener("click", () => {
        permissions = []
        const tableChangePermission = document.querySelector("[table-change-permission]");
        const rows = tableChangePermission.querySelectorAll("tr[data-name]");
        rows.forEach(row => {
            const dataName = row.getAttribute("data-name");
            if(dataName == "id"){
                const ids = row.querySelectorAll("input");
                ids.forEach(id => {
                    permissions.push({id: id.value});
                });
            } else{
                const selects = row.querySelectorAll("input[type='checkbox']");
                selects.forEach((select, index) => {
                    if(select.checked){
                        if(!("permissions" in permissions[index]))
                            permissions[index].permissions = []
                        permissions[index].permissions.push(dataName);
                    }
                })
            }
        });
        const formChangePermission = document.querySelector("#form-change-permission");
        const inputChangePermission = formChangePermission.querySelector("input");
        inputChangePermission.value = JSON.stringify(permissions);
        formChangePermission.submit();
    });
}
// End Permission

// Permission Display
const formChangePermission = document.querySelector("#form-change-permission");
if(formChangePermission){
    const inputChangePermission = formChangePermission.querySelector("input");
    const permissions = JSON.parse(inputChangePermission.value);
    const tableChangePermission = document.querySelector("[table-change-permission]");
    permissions.forEach((permission, index) => {
        const rows = tableChangePermission.querySelectorAll("tr[data-name]");
        rows.forEach(row => {
            const dataName = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(permission.permissions.includes(dataName)){
                inputs[index].checked = true;
            }
        });
    });
}
// End Permission Display




