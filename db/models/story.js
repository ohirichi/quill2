const Sequelize = require('sequelize')
const db = require('../db')

module.exports = Story

const Story = Sequelize.define(story, {
   title:{
    type: Sequelize.STRING,
    allowNull: false
   },
   description:{
    type: Sequelize.STRING,
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