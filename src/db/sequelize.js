const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
 
/* const sequelize = new Sequelize('pokedex', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: true
}) */
 

// NOUVELLE CONNEXION BDD

if(process.env.NODE_ENV === 'production') {
  // Saisissez également vos nouveaux identifiants pour la production :
  sequelize = new Sequelize('pokedex', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
} else {
  sequelize = new Sequelize('pokedex', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
   
}

// FIN NOUVELLE CONNEXION BDD


const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes) 

const initDb = () => {
//  return sequelize.sync({force: true}).then(_ => {
    return sequelize.sync().then(_ => {
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types
        //types: pokemon.types.join()
      }).then(pokemon => console.log(pokemon.toJSON()))
    })

/*     User.create({
      username: 'pikachu',
      password: 'mlkjmlkj'
    }) */
    bcrypt.hash('mlkjmlkj', 10)
    .then(hash => User.create({username: 'pikachu', password: hash}))
    .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
  })
}
 
module.exports = { 
  initDb, Pokemon, User
}