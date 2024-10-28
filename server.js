const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Schema and Model
const DataSchema = new mongoose.Schema({
  value: { type: String, required: true },
});

const Data = mongoose.model('Data', DataSchema);

// Routes
// Get all data
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Post new data
app.post('/data', async (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ msg: 'Please provide a value' });
  }

  try {
    const newData = new Data({ value });
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
