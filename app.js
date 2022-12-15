const express = require('express')
//const morgan = require('morgan')
//const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize')
 
const app = express()
const port = process.env.PORT || 3000
 
app
//.use(favicon(__dirname + '/favicon.ico'))
//.use(morgan('dev'))
.use(bodyParser.json())
 
sequelize.initDb()
 
// test HEROKU
app.get('/', (req, res) => {
  res.json('Hello, Heroku ! <img draggable="false" role="img" class="emoji" alt="" src="https://s.w.org/images/core/emoji/13.0.1/svg/1f44b.svg">')
})

// Ici, nous placerons nos futurs points de terminaisons !
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
  res.status(404).json({message});
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
