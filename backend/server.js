// Required Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 30000,
  },
};

// Connect to Database
let pool;
(async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to Azure SQL Database');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

// 1. Add a new user
app.post('/api/signup', async (req, res) => {
  const { FullName, PhoneNumber, email, PasswordHash, userRole = 'User' } = req.body;

  if (!FullName || !PhoneNumber || !email || !PasswordHash) {
    return res.status(400).json({ error: 'All fields (FullName, PhoneNumber, Email, PasswordHash) are required' });
  }

  try {
    const result = await pool
      .request()
      .input('FullName', sql.NVarChar, FullName)
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .input('Email', sql.NVarChar, email)
      .input('PasswordHash', sql.NVarChar, PasswordHash)
      .input('UserRole', sql.NVarChar, userRole)
      .query(
        'INSERT INTO Users (FullName, PhoneNumber, Email, PasswordHash, UserRole) VALUES (@FullName, @PhoneNumber, @Email, @PasswordHash, @UserRole)'
      );

    res.status(201).json({ message: 'User added successfully', result });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Failed to add user, please try again later' });
  }
});

// 2. Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Users');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users, please try again later' });
  }
});

// 3. User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query(`SELECT * FROM Users WHERE Email = @email AND Password = @password`);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Save Car Details and Schedule
app.post('/api/bookings', async (req, res) => {
  const { userId, carMake, carModel, registrationNumber, color, additionalNotes, serviceId, scheduledDates, scheduledPackage, status = 'Scheduled' } = req.body;

  // Validate required fields
  if (!userId || !carMake || !carModel || !registrationNumber || !color || !serviceId || !scheduledDates || !Array.isArray(scheduledDates) || scheduledDates.length === 0) {
    return res.status(400).json({ error: 'All fields (userId, carMake, carModel, registrationNumber, color, serviceId, and scheduledDates) are required.' });
  }

  let transaction;

  try {
    // Start a transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const scheduleIds = []; // Store all generated Schedule IDs

    // Loop over scheduledDates array to insert each scheduled date
    for (let i = 0; i < scheduledDates.length; i++) {
      const scheduledDateTime = scheduledDates[i];  // Each scheduled date in ISO format

      // Insert Schedule
      const scheduleResult = await transaction
        .request()
        .input('UserID', sql.NVarChar, userId)
        .input('ServiceID', sql.Int, serviceId)
        .input('ScheduledPackage', sql.NVarChar, scheduledPackage)
        .input('Status', sql.NVarChar, status)
        .query(`
          INSERT INTO Schedules (UserID, ServiceID, ScheduledPackage, Status, CreatedAt)
          OUTPUT INSERTED.ScheduleID
          VALUES (@UserID, @ServiceID, @ScheduledPackage, @Status, GETDATE());
        `);

      const scheduleId = scheduleResult.recordset[0].ScheduleID;
      scheduleIds.push(scheduleId);

      // Insert CarDetails Table for each scheduled date
      const carDetailsResult = await transaction
        .request()
        .input('UserID', sql.NVarChar, userId)
        .input('ScheduleID', sql.Int, scheduleId)
        .input('CarMake', sql.NVarChar, carMake)
        .input('CarModel', sql.NVarChar, carModel)
        .input('RegistrationNumber', sql.NVarChar, registrationNumber)
        .input('Color', sql.NVarChar, color)
        .input('AdditionalNotes', sql.NVarChar, additionalNotes || null)
        .query(`
          INSERT INTO CarDetails (UserID, ScheduleID, CarMake, CarModel, RegistrationNumber, Color, AdditionalNotes, CreatedAt)
          OUTPUT INSERTED.CarID
          VALUES (@UserID, @ScheduleID, @CarMake, @CarModel, @RegistrationNumber, @Color, @AdditionalNotes, GETDATE());
        `);

      // Insert into ScheduledDates Table for each scheduled date
      await transaction
        .request()
        .input('ScheduleID', sql.Int, scheduleId)
        .input('ScheduledDateTime', sql.DateTime, scheduledDateTime)
        .query(`
          INSERT INTO ScheduledDates (ScheduleID, ScheduledDateTime)
          VALUES (@ScheduleID, @ScheduledDateTime);
        `);
    }

    // Commit Transaction
    await transaction.commit();

    res.status(201).json({
      message: 'Car details, schedules, and scheduled dates saved successfully.',
      scheduleIds,  // Return an array of all schedule IDs created
    });
  } catch (err) {
    // Rollback Transaction on Error
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error('Error during transaction rollback:', rollbackErr);
      }
    }

    console.error('Error saving car details, schedules, and scheduled dates:', err);
    res.status(500).json({ error: 'Failed to save car details, schedules, or scheduled dates. Please try again later.' });
  }
});

// Other Endpoints

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});