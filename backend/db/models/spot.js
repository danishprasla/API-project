'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner"
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        hooks: true,
        onDelete: 'CASCADE'
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        hooks: true,
        onDelete: 'CASCADE'
      })

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        hooks: true,
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users'
      },
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 56]
      }
    },
    lat: {
      type: DataTypes.DECIMAL(9, 6)
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6)
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [30, 1000]
      }
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};