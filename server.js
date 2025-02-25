
const { json } = require('express');
const express = require('express');
const path = require('path');
const multer = require('multer');

const PORT = 8888;
const app = express();
const pool = require("./data/db");

/* 
    THINGS TO FIX
    1. when the record of movie is deleted remove corresponding photo too
    2. make upload sequence more foolproof, currently you can upload everything
    3. add support for more img formats than jpg
    4. learn about sequelize
    5. hide passwords in .env file 


*/


const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./client/components/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.params.id + '.jpg');
    }
});

const upload = multer({storage: imageStorage});


const cors = require('cors'); 
app.use(cors()); // not very secure 

console.log('running on: http://127.0.0.1:' + PORT);


app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.listen(PORT);

app.get('/', (req,res) => {

    res.sendFile(path.resolve(__dirname + '/public/index.html'))
} );

// dodaj film
app.post('/movies', async (req,res) => {
    try{
        const item = req.body;
        const newItem = await pool.query(
            "INSERT INTO movie_list (title, release_date, rating, director, genere) VALUES ($1, $2, $3, $4, $5)",
            [item.title, JSON.stringify(new Date(item.release_date)), item.rating, item.director, item.genere]
        );
        res.send(newItem);
    }
    catch (err) {
        res.send(err.detail);
    }

});
//edytuj film 
app.put('/movies/:id', async (req,res) => {
    try {
        const item = req.body;
        const Item = await pool.query(
            "UPDATE movie_list SET title = $2, release_date = $3, rating = $4, director = $5, genere = $6 WHERE id = $1 ",
            [req.params.id,item.title, JSON.stringify(new Date(item.release_date)), item.rating, item.director, item.genere]
        );
        res.send( Item.rows);

    } catch (err) {
        res.send(err);
    }
});
//usuń film 
app.delete('/movies/:id', async (req,res) => {
    try {
        const Item = await pool.query(
            "DELETE FROM movie_list WHERE id = $1",
            [req.params.id]
        );
        res.send(Item);

    } catch (err) {
        res.send(err.detail);
    }
});
//zobacz wszystkie filmy 
app.get('/movies', async (req,res) => {
    try {
        const allItems = await pool.query(
            "SELECT * FROM movie_list"
        );
        res.send(allItems.rows);
    } catch (err) {
        res.send(err.detail);
    }
});
//zobacz jeden wybrany film 
app.get('/movies/:id', async (req,res) => {
    try {
        const Item = await pool.query(
            "SELECT * FROM movie_list WHERE id = $1",
            [req.params.id]
        );
        res.send(Item.rows.length === 0 ? JSON.stringify('wrong id') : Item.rows);

    } catch (err) {
        res.send(err.detail);
    }
});
app.post('/image/:id', upload.single("image"), (req, res) => {
    console.log(req);
    res.send('uploaded!');
});
app.get('/image/:id', (req, res) => {
    res.sendFile(path.resolve( __dirname + '/client/components/images/' + req.params.id + '.jpg'));
});