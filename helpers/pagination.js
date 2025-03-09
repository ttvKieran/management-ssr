module.exports = (objectPagination, query, totalItem) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.totalPage = Math.ceil(totalItem / objectPagination.limit);
    objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limit;
    return objectPagination;
}