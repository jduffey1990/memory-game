const express = require('express');
const scoreRoutes = require('./routes/scores');

const app = express();
app.use(express.json());
app.use('/api/score', scoreRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});