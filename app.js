const express = require('express')
let pokemons = require('./mock-pokemon') 
//const { Sequelize } = require('sequelize')
const PokemonModel = require('./src/models/pokemon')
const { Sequelize, DataTypes } = require('sequelize')
const { success, getUniqueId } = require('./helper')
const morgan = require('morgan')
const favicon = require('serve-favicon')

const app = express()
const port = 3000

const sequelize = new Sequelize (
  'pokedex', // nom de la BDD
  'root', // username
  '', // password
  {
    host : '127.0.0.1', //'192.168.64.2',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2'
    },
    logging: false
  }
)

sequelize.authenticate()
  .then(_ => console.log('Connection well established'))
  .catch(error => console.error('Unable to connect to BDD : ', error))

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true})
  .then(_ => {
    console.log('La BDD "pokedex" a bien été synchronisée.')
    // On initialise la base de données "Pokedex" avec 12 pokémons.
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types.join()
      }).then(pokemon => console.log(pokemon.toJSON()))
    })
    /* Pokemon.create({
      name: 'Bulbizarre',
      hp: 25,
      cp: 5,
      picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
      types: ["Plante", "Poison"].join()
    }).then(bulbizarre => console.log(bulbizarre.toJSON())) */
  })

/* app.use((req, res, next) => {
  console.log(`URL : ${req.url}`)
  next()
}) */
app
.use(favicon(__dirname + '/favicon.ico'))
.use(morgan('dev'))
.use(express.json())

app.get('/', (req, res) => res.send('Yellow, Express! <img draggable="false" width="200px" height="200px" role="img" class="emoji" alt="👋" src="https://s.w.org/images/core/emoji/13.0.1/svg/1f44b.svg">'))

app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemon = pokemons.find(pokemon => pokemon.id === id)
  const message = 'Un pokémon a bien été trouvé.'
  res.json(success(message, pokemon)) 
})

app.get('/api/pokemons', (req, res) => {
  const message = 'La liste des pokémons a bien été récupérée.'
  res.json(success(message, pokemons)) 
})

app.post('/api/pokemons', (req, res) => {
  const id = getUniqueId(pokemons)
  const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
  pokemons.push(pokemonCreated)
  const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
  res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonUpdated = { ...req.body, id: id}
  pokemons = pokemons.map(pokemon => {
    return pokemon.id === id ? pokemonUpdated : pokemon
  })
  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
  res.json(success(message, pokemonUpdated))
})

app.delete('api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
  pokemons = pokemons.filter (pokemon => pokemon.id !== id)
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
  res.json(success(message, pokemonDeleted))
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
