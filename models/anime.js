const DataTypes = require('sequelize');
const db = require('../db')

const Anime = db.define('anime', {
    title_name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true // think
    },
    title_english: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true // think
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    episodes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studios: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    href: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Anime;


        // console.log(description); //  !descroption
        // console.log(title_name); //  !title
        // console.log(title_english); //  !titlte_eng
        // console.log(episodes); // ! episodes
        // console.log(studios) // ! studios
        // console.log(genres); // ! genres
        // console.log(duration); // ! duration
        // console.log(rating); // ! rating
        // console.log(img); // ! img 
        // console.log(href); // ! video href