const router = require('express').Router(); 
const {AdminModel, UserModel} = require('../models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {admValidateSession} = require('../middleware');



// ? REGISTER ADMIN
router.post('/register', async (req, res) => {
    let {username,
        email,
        password,
        isAdmin,
    } = req.body.admin


    try {
        if (!isAdmin) {
            isAdmin = false
        } else if (isAdmin === true) {
            isAdmin = true
        } else {
            isAdmin = false
        }
        let Admin = await AdminModel.create({
            isAdmin: isAdmin,
            username,
            email,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: Admin.id}, process.env.ADMIN_JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "Admin successfully deleted",
            user: Admin,
            adminSessionToken: token,
        })

    } catch (err) {
        res.status(500).json({
            message: `Failse to register admin ${err}`
        })
    }
});


// ? LOGIN ADMIN
router.post('/login', async (req, res) => {
    let {username,
        email,
        password,
    } = req.body.admin

    try {
        let adminLogin = await AdminModel.findOne({
            where:{
                email: email
            }
        })


        if (adminLogin){

            let passwordHashComprasion = bcrypt.compareSync(password, adminLogin.password)

            if (passwordHashComprasion) {


                let token = jwt.sign({id: adminLogin.id}, process.env.ADMIN_JWT_SECRET, {expiresIn: 60 * 60 * 24})
                res.status(200).json({
                    message: "Admin successfully logged in",
                    admin: adminLogin,
                    adminSessionToken: token,
                })
            } else {
                res.status(401).json({
                    message: "Admin not authorized"
                })
            }


        } else {
            res.status(401).json({
                message: "Incorrect email or password or maybe username"
            })
        }


    } catch (err) {
        res.status(500).json({
            message: `Failed to login ${err}`
        })
    }
});

// ! DELETE ADMIN
router.delete('/delete/user/:id', admValidateSession, async(req, res) => {
    const adminId = req.params.id;
    console.log("SMT");
    try {
        const query = {
            where: {
                id: adminId,
            }
        }
        console.log(query)
        const bye = await AdminModel.findOne(query)
        await UserModel.destroy(query);
        res.status(200).json({
            message: "Admin successfully deleted",
            admin_deleted: bye,
            deleted: query
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
})


// ! DELETE USER CAN ADMIN(any of the admins)
router.delete('/delete/user/by/admin/:id', admValidateSession, async(req, res) => {
    const adminId = req.admin.id;
    const animeId = req.params.id;
    console.log("SMT");
    try {
        const query = {
            where: {
                id: animeId,
            }
        }
        console.log(query)
        const bye = await UserModel.findOne(query)
        await UserModel.destroy(query);
        res.status(200).json({
            message: `User successfully deleted by admin ${adminId}`,
            user_deleted: bye,
            deleted: query
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
})

module.exports = router;