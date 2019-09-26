const userModel = require('./user.model');

const userController = {};

userController.findAllUser = (req, res) => {
    userModel.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = user;
        });
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (users) {
            return res.send(userMap);
        }    
    });
}

module.exports = userController;