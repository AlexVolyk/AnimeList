const router = require('express').Router();
const download = require('image-downloader')
// const fileUpload = require('express-fileupload')
const {AnimeModel} = require('../models');
// const multer = require('multer');

const cheerio = require('cheerio');
const request = require('request');


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
// router.get('/json/:id', async(req, res) => {
//     // const owner_id = req.admin.id;
//     const file = await require('../data1.json')
//     console.log(file)
//     const animeGenre = req.params.id;
//     // const animeName = req
//     try {
//         const query = {
//             where: { 
//                 mal_id: animeGenre,
//                 // owner_id: owner_id
//             }
//         }
//         console.log(query)
//         let animesFind = await file.findOne(query);
//         res.status(200).json({
//             message: "Anime successfully find",
//             find: animesFind,
//             query: query
//         });
//     } catch (err) {
//         res.status(500).json({error: err.message})
//     }
//     // console.log(animeId)
//     // console.log(animeName)
// });


//! PARSER
router.post('/pars', admValidateSession,  async(req, res) => {
    let{
        parsUrl
    } = req.body.pars
    
    const URL = parsUrl;
    
    async function requ(URL) {
        request(URL, async(err, res, html) => {
            if (!err && res.statusCode == 200) {
                const $ = await cheerio.load(html);
                // console.log($)
                setTimeout(() => {
                    che($)
                }, 4000);
        } else {
            console.log("Not Found")
        }
    })
}
    async function che($) {
        // console.log(che)
            const title_name = await $('.edit-info')
            .find('.title-name')
            .text()
            .trim()

            const title_english = await $('.edit-info')
            .find('.title-english')
            .text()
            .trim();

            const description = await $("table tbody tr:nth-child(1) td > p")
            .text()
            .replace('[Written by MAL Rewrite]', '')
            .trim();

            const type = await $("td.borderClass > div > div:nth-child(13)")
            .text()
            .replace('Type:', '')
            .trim();

            const episodes =await  $("td.borderClass > div > div:nth-child(14)")
            .text()
            .replace('Episodes:', '')
            .trim();

            const studios = await $("td.borderClass > div > div:nth-child(21)")
            .text()
            .replace('Studios:', '')
            .trim();

            const genres = await $("td.borderClass > div > div:nth-child(23)")
            .text()
            .replace('Genres:', '')
            // .replace('Genres:', '')
            .trim();

            const duration = await  $("td.borderClass > div > div:nth-child(24)")
            .text()
            .replace('Duration:', '')
            .trim();

            const rating =  await $("td.borderClass > div > div:nth-child(25)")
            .text()
            .replace('Rating:', '')
            .trim();

            const img = await $("td.borderClass > div > div:nth-child(1) > a > img")
            .attr("data-src")

            const youTubeVideo = await $(".video-promotion")
            .find("a")
            .attr("href")

            const youTubeImg = await $(".video-promotion")
            .find("a")
            .attr("style")
            .replace("background-image:url", '')
            .replace("(", '')
            .replace(")", '')
            .replace("'", '')
            .replace("'", '')

            obj = {
                "description": description,
                "title_name": title_name,
                "title_english": title_english,
                "type": type,
                "episodes": episodes,
                "studios": studios,
                "genres": genres,
                "duration": duration,
                "rating": rating,
                "img": img,
                "youTubeVideo": youTubeVideo,
                "youTubeImg": youTubeImg
            }
            result = await obj
                try {
        res.status(201).json({
            message: "Anime successfully pars",
            parsThis: result,
        })
    } catch (err) {
        res.status(500).json({error: err});
    }
        }
    

        requ(URL)
    
})

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
    youTubeImg,
    youTubeVideo,
} = req.body.anime
let {id} = req.admin
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../images')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname) // ID of Anime
//     }
// })
// var upload = multer({ storage: storage })
// console.log(upload, 'HERE+++++++++++++++++++++++++')

// app.use(express.static(__dirname + '/public'));
// app.use('/uploads', express.static('uploads'));

// app.post('/profile-upload-single', upload.single('profile-file'), function 
// const IMG = img.replace('https://cdn.myanimelist.net', 'http://localhost:3000')
// const {id} = req.admin
//     const IMG = {
//         url: img,
//         dest: `./images/3.jpg`
//     }
//     download.image(IMG)
//     .then(({ filename }) => {
//         console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg\
//     })
//     .catch((err) => console.error(err))
let animeEntry = {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres, // !
    duration,
    rating,
    img,
    // img: `http://localhost:3000/images/anime/2.jpg`, // !
    youTubeImg,
    youTubeVideo,
    owner_id: id
}

    try {
        const newAnime = await AnimeModel.create(animeEntry);
        res.status(201).json({
            message: "Anime successfully create",
            anime: newAnime,
        }
            );
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
});

//! GET BY ONE GENRE
router.get('/find/:title_name', async(req, res) => {
    // const owner_id = req.admin.id;
    const animeTitle = req.params.title_name;
    // const animeName = req
    try {
        const query = {
            where: {
                title_name: animeTitle,
                // owner_id: owner_id
            }
        }
        console.log(query)
        const animeFind = await AnimeModel.findOne(query);
        res.status(200).json({
            message: "Anime successfully find",
            find: animeFind,
            query: query
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
});

//! EDIT ANIME
router.put('/edit/:id', admValidateSession, async (req, res) => {
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
        youTubeImg,
        youTubeVideo,
    } = req.body.anime
    const animeId = req.params.id;
    // const username = req.user.username;

    const query = {
        where: {
            id: animeId,
        }
    };

    const updateAnime = {
        title_name,
        title_english,
        description,
        episodes,
        studios,
        genres, // !
        duration,
        rating,
        img, //!
        youTubeImg,
        youTubeVideo,
    };

    try {
        const updated = await AnimeModel.update(updateAnime, query);
        res.status(200).json({
            message: 'Anime updated successfully',
            update: updateAnime,
            updatedAnime: updated
        });
    } catch (err) {
        res.status(500).json({error: err});
    }
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
});

module.exports = router;