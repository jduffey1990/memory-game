const express = require('express');
const scoreRoutes = require('./routes/scores');

const app = express();
app.use(express.json());
app.use('/api/score', scoreRoutes);

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});