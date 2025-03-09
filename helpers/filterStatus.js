module.exports = (query) => {
    const filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ]

    if(query.status){
        const index = filterStatus.findIndex(item => item.status == query.status);
        if(index >= 0){
            filterStatus[index].class = "active";
        }
    } else{
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
}