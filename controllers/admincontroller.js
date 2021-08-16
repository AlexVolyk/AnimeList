const router = require('express').Router(); 
const {AdminModel} = require('../models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



router.get('/animeAll', async (req, res) => {
    let data1 = require('../data1.json');
    res.status(200).json({
        json: data1[6].episodes
    })
});

// ? REGISTER ADMIN
router.post('/register', async (req, res) => {
    let {username,
        email,
        password,
        isAdmin,
    } = req.body.admin


    try {
        let Admin = await AdminModel.create({
            isAdmin: true,
            username,
            email,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: Admin.id}, process.env.ADMIN_JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "Admin successfully registered",
            user: Admin,
            adminSessionToken: token,
            // status: "admin"
        })

    } catch (err) {
        res.status(500).json({
            message: `Failse to register admin ${err}`
        })
    }
});


// ! think here about universal endpoint what for user and admin login

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
            // let adminNameHashComprasion = bcrypt.compareSync(adminName, adminLogin.adminName)
            // not work neeed  logic with bcrypt adminName

            if (passwordHashComprasion) {
                //            if (passwordHashComprasion && adminNameHashComprasion) {


                let token = jwt.sign({id: adminLogin.id}, process.env.ADMIN_JWT_SECRET, {expiresIn: 60 * 60 * 24})
                res.status(200).json({
                    message: "Admin successfully logged in",
                    admin: adminLogin,
                    adminSessionToken: token,
                    // status: "admin"
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

module.exports = router;