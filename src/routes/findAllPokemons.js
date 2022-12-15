const { Pokemon } = require('../db/sequelize')
const { Op }  = require('sequelize')

const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1)

module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name) {
      const name = req.query.name
      return Pokemon.findAndCountAll({ 
        where: { 
          name: {
            [Op.or]: {
              [Op.like]: `%${name}%`,
              [Op.startsWith]: capitalize(name)
            }
          }
        },
        limit: 3 
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} pokémon(s) qui correspondent au terme de recherche ${name}.`
        return res.json({ message, data: rows })
      })
    } 
    else {
      Pokemon.findAll()
        .then(pokemons => {
          const message = 'La liste des pokémons a bien été récupérée.'
          res.json({ message, data: pokemons })
        })
        .catch(error => {
          const message = `La liste des pokémons n'a pas pu être récupérée. 
                          Réessayez dans quelques instants.`
          res.status(500).json({ message, data: error })
        })
    }
  })
}