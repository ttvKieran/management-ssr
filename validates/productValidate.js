module.exports.createValidate = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', `Product title is required.`);
        res.redirect('back');
        return;
    }
    next();
}