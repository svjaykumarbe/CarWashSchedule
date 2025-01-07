// backend/models/User.js
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database'); // Import the Sequelize instance

// Define the User model class
class User extends Model {
  // Method to compare passwords during authentication
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Define the schema for the User model
User.init(
  {
    // Define fields
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'User', // Model name
    tableName: 'users', // Table name in the database
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    hooks: {
      // Hook to hash password before saving to the database
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10); // Hash the password
        }
      },
    },
  }
);

module.exports = User;