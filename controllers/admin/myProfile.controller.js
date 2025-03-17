const Account = require('../../models/accounts.model.js');
module.exports.index = (req, res) => {
    res.render('admin/pages/my-profile/index', {
        titlePage: "My Profile"
    });
}

module.exports.edit = async(req, res) => {
    try {
        const id = res.locals.user._id;
        const existEmail = await Account.find({ _id: {$ne: id} , email: req.body.email});
        if(existEmail.length > 0){
            req.flash('error', `Email has exist`);
            res.redirect('back');
            return;
        } else{
            const updatedBy = {
                account_id: id,
                updatedAt: Date.now()
            }
            await Account.updateOne({_id: id}, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
        }
    } catch (error) {
        req.flash('error', `The account does not exist.`);
        res.redirect('back');
        return;
    }
    
    req.flash('success', `Account edited successfully!`);
    res.redirect(`back`);
}