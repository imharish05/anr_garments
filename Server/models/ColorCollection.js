'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ColorCollection = sequelize.define('ColorCollection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  hex: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '#1A175A',
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(300),
    allowNull: true,
    defaultValue: '#scrubs-collection',
  },
  badge: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'color_collections',
  timestamps: true,
});

module.exports = ColorCollection;
