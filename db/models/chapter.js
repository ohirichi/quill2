const Sequelize = require('sequelize')
const db = require('../db')



const Chapter = db.define('chapter', {
   title:{
    type: Sequelize.TEXT,
    allowNull: false
   },
   content:{
    type: Sequelize.STRING,
    allowNull: false
   },
   public: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  earlyAccess: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  earlyAccessUsers:{
      type:Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue:[]
  }



})

module.exports = Chapter