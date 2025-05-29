const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// CRUD Operations

// Route to save person data
app.post('/students', async (req, res) => {
  console.log('Received data:', req.body);
  const { id, firstName, lastName, age, gender, civilStatus, occupation, address, income } = req.body;

  // Validate input fields
  if (!id || !firstName || !lastName || !age || !gender || !civilStatus || !occupation || !address || !income) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if person already exists
    const existingPerson = await client.hGetAll(`person:${id}`);
    if (Object.keys(existingPerson).length > 0) {
      return res.status(400).json({ message: `Person with ID ${id} already exists` });
    }

    // Save person data in Redis hash
    await client.hSet(`person:${id}`, 'firstName', firstName);
    await client.hSet(`person:${id}`, 'lastName', lastName);
    await client.hSet(`person:${id}`, 'age', age);
    await client.hSet(`person:${id}`, 'gender', gender);
    await client.hSet(`person:${id}`, 'civilStatus', civilStatus);
    await client.hSet(`person:${id}`, 'occupation', occupation);
    await client.hSet(`person:${id}`, 'address', address);
    await client.hSet(`person:${id}`, 'income', income);

    // Respond with success message
    res.status(201).json({ message: 'Person saved successfully' });
  } catch (error) {
    console.error('Error saving person:', error);
    res.status(500).json({ message: 'Failed to save person', error: error.message });
  }
});

// Read (R)
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  const person = await client.hGetAll(`person:${id}`);
  if (Object.keys(person).length === 0) {
    return res.status(404).json({ message: 'Person not found' });
  }
  res.json({ id, ...person });
});

// Read all persons
app.get('/students', async (req, res) => {
  const keys = await client.keys('person:*');
  const persons = await Promise.all(keys.map(async (key) => {
    return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));
  res.json(persons);
});

// Update (U)
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, age, gender, civilStatus, occupation, address, income } = req.body;

  if (!firstName && !lastName && !age && !gender && !civilStatus && !occupation && !address && !income) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingPerson = await client.hGetAll(`person:${id}`);
    if (Object.keys(existingPerson).length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Update person data in Redis
    if (firstName) await client.hSet(`person:${id}`, 'firstName', firstName);
    if (lastName) await client.hSet(`person:${id}`, 'lastName', lastName);
    if (age) await client.hSet(`person:${id}`, 'age', age);
    if (gender) await client.hSet(`person:${id}`, 'gender', gender);
    if (civilStatus) await client.hSet(`person:${id}`, 'civilStatus', civilStatus);
    if (occupation) await client.hSet(`person:${id}`, 'occupation', occupation);
    if (address) await client.hSet(`person:${id}`, 'address', address);
    if (income) await client.hSet(`person:${id}`, 'income', income);

    res.status(200).json({ message: 'Person updated successfully' });
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ message: 'Failed to update person' });
  }
});

// Delete (D)
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  await client.del(`person:${id}`);
  res.status(200).json({ message: 'Person deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});