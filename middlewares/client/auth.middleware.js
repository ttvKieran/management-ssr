exports.requireAuth = async (req, res, next) => {
    if(!res.locals.user){
        req.flash('error', `Need login!`);
        res.redirect(`/user/login`);
        return;
    }
    next();
};