require('dotenv').config();
const Express = require('express');
const app = Express();

const dbConnetcion = require('./db');
const controllers = require('./controllers');
const middleware = require('./middleware');

app.use(middleware.CORS)

app.use(Express.json())


dbConnetcion.authenticate()
    .then(() => dbConnetcion.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[SERVER]: App is listening on ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(`[SERVER]: crashed ${err}`)
    })

    
app.use('/user', controllers.userController);
app.use('/admin', controllers.adminController);
app.use('/anime', controllers.animeController);



// app.listen(process.env.PORT, () => {
//     console.log(`[SERVER]: App is listening on ${process.env.PORT}`)
// });

