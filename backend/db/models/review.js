'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hooks: true
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    };
  };
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Stars must be an integer from 1 to 5' },
        min: { args: [1], msg: 'Stars must be an integer from 1 to 5' },
        max: { args: [5], msg: 'Stars must be an integer from 1 to 5' }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
