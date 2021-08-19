const jwt = require('jsonwebtoken');
const {UserModel} = require('../models');

const validateJWT = async (req, res, next) => {
    if (req.method == "OPTIONS") {
        next();

    } else if (
        req.headers.authorization &&
        req.headers.authorization.includes(process.env.SECRET_USER_KEY)
        ) {

            const {authorization} = req.headers;

            // console.log(authorization, 'authorization-------------------------------');

            const payload = authorization ? jwt.verify(authorization.includes(process.env.SECRET_USER_KEY)
            ? authorization.split(' ')[1]
            : authorization, process.env.USER_JWT_SECRET
            )
            : undefined;

            // console.log(payload, 'payload===========================================')
            
            if (payload) {
                
                let foundAdmin = await UserModel.findOne({
                    where: {id: payload.id}
                })

                // console.log(foundAdmin, 'foundAdmin++++++++++++++++++++++++++++++++++++++')


                if (foundAdmin) {
                    req.admin = foundAdmin;
                    next();

                } else {
                    req.status(400).send({message: "Not Authorized"
                    });
                }

            } else {
                res.status(401).send({
                    message: "Invalid toke"
                });
            }

    } else {
        res.status(403).send({
            message: "Forbidden"
        });
    }
};

module.exports = validateJWT;