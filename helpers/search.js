module.exports = (query) => {
    const object = {
        keyword: ""
    }
    if(query.keyword){
        object.keyword = query.keyword;
        const regex = RegExp(object.keyword, "i");
        object.regex = regex;
    }
    return object;
}   