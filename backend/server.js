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
  server: process.env.DB_SERVER, // Azure SQL server
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: true, // Set to true if self-signed certs are used
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
    process.exit(1); // Exit process if the database connection fails
  }
})();

// API Endpoints

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
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const result = await pool
      .request()
      .input('Email', sql.NVarChar, email)
      .input('PasswordHash', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE Email = @Email AND PasswordHash = @PasswordHash');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.status(200).json({ success: true, message: 'Login successful', user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'An error occurred during login. Please try again later.' });
  }
});

// 4. Save Car Details and Scheduled Dates
app.post('/api/car-details', async (req, res) => {
  const { userId, carMake, carModel, registrationNumber, color, scheduledDates } = req.body;

  // Validate input
  if (!userId || !carMake || !carModel || !registrationNumber || !color || !Array.isArray(scheduledDates) || scheduledDates.length === 0) {
    return res.status(400).json({ error: 'All fields (userId, carMake, carModel, registrationNumber, color, scheduledDates) are required and scheduledDates must be a non-empty array.' });
  }

  let transaction;

  try {
    // Start transaction for car details and scheduled dates
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Insert car details into CarDetails table
    const carResult = await transaction
      .request()
      .input('UserId', sql.Int, userId)
      .input('CarMake', sql.NVarChar, carMake)
      .input('CarModel', sql.NVarChar, carModel)
      .input('RegistrationNumber', sql.NVarChar, registrationNumber)
      .input('Color', sql.NVarChar, color)
      .query(
        'INSERT INTO CarDetails (UserId, CarMake, CarModel, RegistrationNumber, Color) OUTPUT INSERTED.CarId VALUES (@UserId, @CarMake, @CarModel, @RegistrationNumber, @Color)'
      );

    const carId = carResult.recordset[0].CarId;

    // Insert each scheduled date into ScheduledDates table
    for (const date of scheduledDates) {
      await transaction
        .request()
        .input('CarId', sql.Int, carId)
        .input('ScheduledDate', sql.Date, new Date(date))
        .query('INSERT INTO ScheduledDates (CarId, ScheduledDate) VALUES (@CarId, @ScheduledDate)');
    }

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ message: 'Car details and scheduled dates saved successfully.' });
  } catch (err) {
    // Rollback transaction if there is an error
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error('Error during transaction rollback:', rollbackErr);
      }
    }

    console.error('Error saving car details and scheduled dates:', err);
    res.status(500).json({ error: 'Failed to save car details or scheduled dates. Please try again later.' });
  }
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});