const Sequelize = require('sequelize')
const pkg = require('../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`, //will need to make sure local connections are set to trust in pg_hba.conf file
  {
    logging: false
  }
)
module.exports = db