const router = require('express').Router();
const download = require('image-downloader')
// const fileUpload = require('express-fileupload')
const {AnimeModel} = require('../models');


const {admValidateSession} = require('../middleware');

// const IMG = {
//     url: 'https://cdn.myanimelist.net/images/anime/1548/116226.jpg',
//     dest: './images/image.jpg'                // will be saved to /path/to/dest/image.jpg
//   }
// download.image(IMG)
//   .then(({ filename }) => {
//     console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
//   })
//   .catch((err) => console.error(err))

// const file = require('../data1.json')
router.get('/json/:id', async(req, res) => {
    // const owner_id = req.admin.id;
    const file = await require('../data1.json')
    console.log(file)
    const animeGenre = req.params.id;
    // const animeName = req
    try {
        const query = {
            where: { 
                mal_id: animeGenre,
                // owner_id: owner_id
            }
        }
        console.log(query)
        let animesFind = await file.findOne(query);
        res.status(200).json({
            message: "Anime successfully find",
            find: animesFind,
            query: query
        });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
    // console.log(animeId)
    // console.log(animeName)
});

//! CREATE
router.post('/create', admValidateSession, async (req, res) => {
    let {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres, // !
    duration,
    rating,
    img, //!
    href // !?
} = req.body.anime


// const IMG = img.replace('https://cdn.myanimelist.net', 'http://localhost:3000')
const {id} = req.admin
    const IMG = {
        url: img,
        dest: `./images/3.jpg`
    }
    download.image(IMG)
    .then(({ filename }) => {
        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg\
    })
    .catch((err) => console.error(err))
let animeEntry = {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres, // !
    duration,
    rating,
    img: `http://localhost:3000/images/anime/2.jpg`, // !
    href, // !?
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

//! GET BY ONE GENRE
router.get('/:genres', async(req, res) => {
    // const owner_id = req.admin.id;
    const animeGenre = req.params.genres;
    // const animeName = req
    try {
        const query = {
            where: {
                genres: animeGenre,
                // owner_id: owner_id
            }
        }
        console.log(query)
        let animesFind = await AnimeModel.findAll(query);
        res.status(200).json({
            message: "Anime successfully find",
            find: animesFind,
            query: query
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
    // console.log(animeId)
    // console.log(animeName)
});


//! DELETE CAN ONLY ADMIN(any of the admins)
router.delete('/delete/:id', admValidateSession, async(req, res) => {
    // const owner_id = req.admin.id;
    const animeId = req.params.id;
    // const animeName = req
    try {
        const query = {
            where: {
                id: animeId,
                // owner_id: owner_id
            }
        }
        console.log(query)
        await AnimeModel.destroy(query);
        res.status(200).json({
            deleted: query,
            message: "Anime successfully deleted"
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
    // console.log(animeId)
    // console.log(animeName)
});




module.exports = router;