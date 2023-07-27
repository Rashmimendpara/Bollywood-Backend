const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({ connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING });
app.use(cors())
app.use(express.json());

//Get all movies data
app.get('/api/movies', (req, res) => {
  pool
    .query('SELECT * FROM movies;')
    .then(data => {
      console.log(data);
      res.json(data.rows);
    })
    .catch(e => res.status(500).json({ message: e.message }));
});
//Get Single movie data by id
app.get('/api/movies/:id', (req, res) => {
      const { id } = req.params;
      const safeValues = [id]; //this need to be array!!
      pool
        .query('SELECT * FROM movies WHERE id=$1;', safeValues)
        .then(({ rowCount, rows }) => {
          // rowCount from the database response
          if (rowCount === 0) {
            res.status(404).json({ message: `Movie with id ${id} Not Found` });
          } else {
            console.log(rows);
            res.json(rows[0]); // rows is array of 1 item
          }
        })
        .catch(e => res.status(500).json({ message: e.message }));
    });
//Post  a new  movie
app.post('/api/movies', (req, res) => {
  const { title,director,year,rating,poster,runtime,genres } = req.body;
  const safeValues = [title,director,year,rating,poster,runtime,genres]; //this need to be array!!
  pool
    .query('INSERT INTO movies (title,director,year,rating,poster,runtime,genres) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;', safeValues)
    .then(({ rows }) => {
      console.log(rows);
      res.status(201).json(rows[0]);
    })
    .catch(e => res.status(500).json({ message: e.message }));
});
// put(Update) your movie
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title,director,year,rating,poster,runtime,genres } = req.body;
  const safeValues = [title,director,year,rating,poster,runtime,genres,id]; 
  pool
    .query('UPDATE movies SET title = $1, director = $2, year = $3, rating = $4, poster = $5, runtime = $6, genres = $7 WHERE id=$8 RETURNING *;', safeValues)
    .then(({ rows }) => {
      console.log(rows);
      res.status(202).json(rows[0]);
    })
    .catch(e => res.status(500).json({ message: e.message }));
});
// Delete the movie
app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const safeValues = [id]; 
    pool
    .query('DELETE FROM movies WHERE id=$1 RETURNING *;', safeValues)
    .then(({ rows }) => {
        console.log(rows);
        res.json(rows[0]);
    })
    .catch(e => res.status(500).json({ message: e.message }));
});

app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));
console.log("Work in progress...123455")









// {
//     "id": 9,
//     "title": "Kahaani\r\n",
//     "director": "Sujoy Ghosh",
//     "year": 2012,
//     "rating": 4,
//     "poster": "https://m.media-amazon.com/images/M/MV5BMTQ1NDI0NzkyOF5BMl5BanBnXkFtZTcwNzAyNzE2Nw@@._V1_UX100_CR0,0,100,100_AL_.jpg",
//     "runtime": "2h 2m",
//     "genres": "Thriller-Mystery"
// }

// {title,director,year,rating,poster,runtime,genres}