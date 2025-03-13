module.exports.createValidate = (req, res, next) => {
    if(!req.body.fullname){
        req.flash('error', `Fullname is required.`);
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash('error', `Email is required.`);
        res.redirect('back');
        return;
    }if(!req.body.password){
        req.flash('error', `Password is required.`);
        res.redirect('back');
        return;
    }
    next();
}

module.exports.updateValidate = (req, res, next) => {
    if(!req.body.fullname){
        req.flash('error', `Fullname is required.`);
        res.redirect('back');
        return;
    }
    if(!req.body.email){
        req.flash('error', `Email is required.`);
        res.redirect('back');
        return;
    }
    next();
}