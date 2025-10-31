const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {

    res.send('Tervetuloa Express-palvelimeen!');

});
// testataan et toimii
app.get('/testi', (req, res) => {

    res.send('testi');

});

app.listen(PORT, () => {
    console.log(`Palvelin käynnissä: http://localhost:${PORT}`);
});