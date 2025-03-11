let count = 1;
function createTree(arr, parentId = ""){
    const tree = [];
    arr.forEach(item => {
        if(item.parent_id === parentId){
            const newItem = item;
            newItem.index = count++;
            const children = createTree(arr, item.id);
            if(children.length > 0){
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}
module.exports.create = (records, parentId) => {
    count = 1;
    return createTree(records, parentId);
}