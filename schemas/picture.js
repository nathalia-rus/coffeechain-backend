const sequelize = require('../models/sequelize');
const Sequelize = require('sequelize');

const Picture = sequelize.define('Picture', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Picture;
