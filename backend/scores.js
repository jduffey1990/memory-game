const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { firstName, lastName, time } = req.body;
    // Handle database interactions
    res.json({ success: true });
});

router.get('/', (req, res) => {
    // Retrieve scores from database and send as response
    res.json(/* array of scores */);
});

module.exports = router;