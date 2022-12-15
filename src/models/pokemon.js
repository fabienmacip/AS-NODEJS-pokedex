const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Le nom est déjà pris.'
      },
      validate: {
        notEmpty: { msg: 'Le nom doit contenir au minimum 1 caractère.'},
        notNull:{ msg: 'Le nom est une propriété requise.'}
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Utilisez uniquement des nombres entiers pour les points de vie.'},
        min: {
          args: [0],
          msg: 'Minimum 0 points de vie'
        },
        max: {
          args: [999],
          msg: 'Maximum 999 points de vie'
        },
        notNull:{ msg: 'Les points de vie sont une propriété requise.'}
      }
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.'},
        min: {
          args: [0],
          msg: 'Minimum 0 points de dégâts'
        },
        max: {
          args: [99],
          msg: 'Maximum 99 points de dégâts'
        },
        notNull:{ msg: 'Les points de dégâts sont une propriété requise.'}
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: { msg: 'Utilisez une URL correcte svp.'},
        notNull:{ msg: `'L'URL de l'image doit être renseignée'.`}
      }
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isTypesValid(value){
          if(!value) {
            throw new Error('Un pokdémon doit au moins avoir un type.')
          }
          if(value.split(',').length > 3) {
            throw new Error('Un pokémon ne peut pas avoir plus de trois types.')
          }
          value.split(',').forEach(type => {
            if(!validTypes.includes(type)) {
              throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`)
            }
          });
        }
      },
      get() {
        return this.getDataValue('types').split(',')
      },
      set(types) {
        this.setDataValue('types', types.join())
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}