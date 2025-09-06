module.exports.createValidate = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', `Role title is required.`);
        res.redirect('back');
        return;
    }
    if(!req.body.description){
        req.flash('error', `Role description is required.`);
        res.redirect('back');
        return;
    }
    next();
}