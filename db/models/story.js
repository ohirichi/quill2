const Sequelize = require('sequelize')
const db = require('../db')


const Story = db.define("story", {
   title:{
    type: Sequelize.STRING,
    allowNull: false
   },
   description:{
    type: Sequelize.STRING(500),
    allowNull: false
   },
   category: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  public: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }

})

module.exports = Story