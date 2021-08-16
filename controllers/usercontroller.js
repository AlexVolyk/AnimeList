const router = require('express').Router();
const {UserModel} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ? REGISTE USER
router.post('/register', async (req, res) => {
    let {username,
        email,
        password
    } = req.body.user;

    try {
        let User = await UserModel.create({
            username,
            email,
            isAdmin: false,
            password: bcrypt.hashSync(password, 7)
        });

        let token = jwt.sign({id: User.id}, process.env.USER_JWT_SECRET, {expiresIn: 60 * 60 * 24})
        
        res.status(201).json({
            message: "User successfully registered",
            user: User,
            userSessionToken: token,
        })
    } catch (err) {
        res.status(500).json({
            message: `Failse to register user ${err}`
        })
    }
});

// ? LOGIN USER
router.post('/login', async (req, res) => {
    let {email, password} = req.body.user;
    
    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email
            }
        });

        if (loginUser) {

            let passwordHashComprasion = await bcrypt.compare(password, loginUser.password)

            if (passwordHashComprasion){

                let token = jwt.sign({id: loginUser.id}, process.env.USER_JWT_SECRET, {expiresIn: 60 * 60 * 24})
                res.status(200).json({
                    message: "User successfully logged in",
                    user: loginUser,
                    userSessionToken: token,
                    // status: "user",
                })
            } else {
                res.status(401).json({
                    message: "User not authorized"
                })
            }
        } else {
            res.status(401).json({
                message: "incorrect email or password"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: `Failed to login ${err}`
        })
    }
})

module.exports = router;