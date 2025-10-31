
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');


const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// Minimi authLevel 0 jotta uudet käyttäjät näkevät tehtäväkortit mutta eivät voi niitä lisätä, muokata tai poistaa
router.get('/', authorize(0), getTasks);
// POST vaatii admin-tason authLevel 1
router.post('/', authorize(1), createTask);
// PUT vaatii vähintään authLevel 1
router.put('/:id', authorize(1), updateTask);
// DELETE vaatii admin-tason 2
router.delete('/:id', authorize(2), deleteTask);
 
module.exports = router;