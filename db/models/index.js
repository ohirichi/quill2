//import all models into one central location
const User = require('./user')
const Story = require('./story')
const Chapter = require('./chapter')


//declare associations between models

User.hasMany(Story)
Story.belongsTo(User)

Story.hasMany(Chapter)
Chapter.belongsTo(Story)

//export all Models

module.exports = {
    User,
    Story,
    Chapter
};