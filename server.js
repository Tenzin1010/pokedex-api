require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json');


const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`,
  `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`,
  `Psychic`, `Rock`, `Steel`, `Water`]

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next();
})

app.get('/types', function handleGetTypes(req, res) {
  res.json(validTypes)
})


app.get('/pokemon', function handleGetPokemon(req, res) {
  // res.send('Hello, pokemon')
  const { name } = req.query;
  const { type } = req.query;
  //case insensitive 
  let response = POKEDEX.pokemon;

  if (name) {
    response = response
      .filter(pokemon =>
        pokemon
          .name
          .toLowerCase()
          .includes(name.toLowerCase()));
  }

  if (type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(type)
    )
  }

  res.json(response)
})


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})