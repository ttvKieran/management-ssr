module.exports.createValidate = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', `Product Category title is required.`);
        res.redirect('back');
        return;
    }
    next();
}