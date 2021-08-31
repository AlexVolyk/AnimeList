const router = require('express').Router();
const {AnimeModel} = require('../models');
const cheerio = require('cheerio');
const request = require('request');
const {admValidateSession} = require('../middleware');

// const download = require('image-downloader')
// const fileUpload = require('express-fileupload')
// const multer = require('multer');


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

            const animeType = await $("td.borderClass > div > div:nth-child(13)")
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

            const genres = await $("td.borderClass > div > div:nth-child(23) span")
            .text()
            .replace('Genres:', '')
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

            obj = {
                "description": description,
                "title_name": title_name,
                "title_english": title_english,
                "animeType": animeType,
                "episodes": episodes,
                "studios": studios,
                "genres": genres,
                "duration": duration,
                "rating": rating,
                "img": img,
                "youTubeVideo": youTubeVideo,
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
    genres,
    duration,
    rating,
    img,
    animeType,
    youTubeVideo,
} = req.body.anime
let {id} = req.admin

let animeEntry = {
    title_name,
    title_english,
    description,
    episodes,
    studios,
    genres,
    duration,
    rating,
    img,
    animeType,
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
    const animeGenre = req.params.genres;
    try {
        const query = {
            where: {
                genres: animeGenre,
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
    const animeTitle = req.params.title_name;
    try {
        const query = {
            where: {
                title_name: animeTitle,
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
        genres,
        duration,
        rating,
        img,
        animeType,
        youTubeVideo,
    } = req.body.anime
    const animeId = req.params.id;

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
        genres, 
        duration,
        rating,
        img, 
        animeType,
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
    const animeId = req.params.id;
    try {
        const query = {
            where: {
                id: animeId,
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