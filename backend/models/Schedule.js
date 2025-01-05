// backend/models/Schedule.js
const mongoose = require('mongoose');

// Define the schema for the Schedule model
const scheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    package: { type: String, required: true },
    carDetails: {
      carMake: { type: String, required: true },
      carModel: { type: String, required: true },
      registrationNumber: { type: String, required: true },
      color: { type: String, required: true },
    },
    status: { type: String, enum: ['Scheduled', 'Used', 'Missed'], default: 'Scheduled' },
    dates: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ['Scheduled', 'Used', 'Missed'], default: 'Scheduled' },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Schedule', scheduleSchema);