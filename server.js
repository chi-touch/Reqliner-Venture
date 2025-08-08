const express = require('express');
const bodyParser = require('body-parser');
const parseRoute = require('./routes/parseRoute');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use('/', parseRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello Welcome to Reqline Parser.');
});
