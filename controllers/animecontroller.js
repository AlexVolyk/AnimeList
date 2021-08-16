const router = require('express').Router();
const {AnimeModel} = require('../models');

let validateJWT = require('../middleware/validation-session');

//! CREATE
router.post('/create', validateJWT, async (req, res) => {
    const {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres, // !
    duration,
    rating,
    img,//!
    href//!
} = req.body.anime
const {id} = req.admin
const animeEntry = {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres, // !
    duration,
    rating,
    img, //!
    href, //!
    owner_id: id
}

    try {
        const newAnime = await AnimeModel.create(animeEntry);
        res.status(201).json(newAnime);
    } catch (err) {
        res.status(500).json({error: err});
    }

});

//! ALL
router.get('/all', async (req, res) => {
    try {
        const allAnimes = await AnimeModel.findAll();
        res.status(200).json(allAnimes)
    } catch (err) {
        res.status(500).json({error: err});
    }
});


router.delete('/delete/:id', validateJWT, async(req, res) => {
    // const owner_id = req.admin.id;
    const animeId = req.params.id;
    // const animeName = req
    try {
        const query = {
            where: {
                id: animeId,
                owner_id: owner_id
            }
        }
        console.log(query)
        await AnimeModel.destroy(query);
        res.status(200).json({
            deleted: query,
            message: "Character successfully retired"
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
    // console.log(animeId)
    // console.log(animeName)
})


module.exports = router;