const DataTypes = require('sequelize');
const db = require('../db')

const Anime = db.define('anime', {
    title_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true ,
    },
    title_english: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
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
    animeType: {
        type: DataTypes.STRING,
        allowNull:false
    },
    youTubeVideo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Anime;
