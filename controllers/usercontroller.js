const router = require('express').Router();
const {UserModel} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {useValidateSession} = require('../middleware');


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
            isAdmin: false, //!
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
                message: "Incorrect email or password"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: `Failed to login ${err}`
        })
    }
})

router.put('/edit/user/:id', useValidateSession, async (req, res) => {
    let {username,
        email,
        password
    } = req.body.user;
    const userId = req.params.id;
    // const username = req.user.username;

    const query = {
        where: {
            id: userId,
        }
    };

    const updateUser = {
        username,
        email,
        password
    };

    try {
        const updated = await User.update(updateUser, query);
        res.status(200).json({
            message: 'User updated successfully',
            update: updateUser,
            updateUser: updated
        });
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.delete('/delete/user/:id', useValidateSession, async(req, res) => {
    // const owner_id = req.admin.id;
    const userId = req.params.id;
    // const animeName = req
    try {
        const query = {
            where: {
                id: userId,
            }
        }
        console.log(query)
        const bye = await UserModel.findOne(query)
        await UserModel.destroy(query);
        res.status(200).json({
            message: "User successfully deleted",
            user_deleted: bye,
            deleted: query
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
});

module.exports = router;