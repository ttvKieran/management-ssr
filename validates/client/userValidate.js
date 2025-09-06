module.exports.register = (req, res, next) => {
    if(!req.body.fullname){
        req.flash('error', `Full name is required.`);
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

module.exports.login = (req, res, next) => {
    if(!req.body.email){
        req.flash('error', `Email is required.`);
        res.redirect('back');
        return;
    }
    if(!req.body.password){
        req.flash('error', `Password is required.`);
        res.redirect('back');
        return;
    }
    next();
}

module.exports.forgot = (req, res, next) => {
    if(!req.body.email){
        req.flash('error', `Email is required.`);
        res.redirect('back');
        return;
    }
    next();
}

module.exports.reset = (req, res, next) => {
    if(!req.body.password){
        req.flash('error', `Password is required.`);
        res.redirect('back');
        return;
    }
    if(!req.body.confirmPassword){
        req.flash('error', `Confirm Password is required.`);
        res.redirect('back');
        return;
    }
    if(req.body.password != req.body.confirmPassword){
        req.flash('error', `Confirm password does not match.`);
        res.redirect('back');
        return;
    }
    next();
}