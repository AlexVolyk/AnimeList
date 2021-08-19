const router = require('express').Router(); 
const {AdminModel, UserModel} = require('../models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {admValidateSession} = require('../middleware');



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
            message: "Admin successfully deleted",
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
                // if (passwordHashComprasion && adminNameHashComprasion) {


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

// ! DELETE ADMIN
router.delete('/delete/user/:id', admValidateSession, async(req, res) => {
    // const owner_id = req.admin.id;
    const adminId = req.params.id;
    // const animeName = req
    console.log("SMT");
    try {
        const query = {
            where: {
                id: adminId,
                // owner_id: owner_id
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
    // console.log(animeId)
    // console.log(animeName)
})


// ! DELETE USER CAN ADMIN(any of the admins)
router.delete('/delete/user/by/admin/:id', admValidateSession, async(req, res) => {
    const adminId = req.admin.id;
    const animeId = req.params.id;
    // const animeName = req
    console.log("SMT");
    try {
        const query = {
            where: {
                id: animeId,
                // owner_id: owner_id
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
    // console.log(animeId)
    // console.log(animeName)
})

module.exports = router;