// // const fileUpload = require('express-fileupload');
const router = require('express').Router();

// const router = require('./animecontroller');
// const { route } = require('./animecontroller');

// // https://cdn.myanimelist.net/images/anime/1252/115539.jpg
// // images
router.get('/top', async (req, res) => {
    // const animePicId = await req.params.id;
    try {
        console.log("-----------------------")

        let image = await require(`../images/dog.jpg`);
        console.log(image, '======================================')
        res.status(200).json({
            json: image
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});



module.exports = router;