const express = require('express');
const cors = require('cors');


const app = express();
const PORT = 3000;
 
app.use(cors());
app.use(express.json());
 

app.get('/', (req, res) => {
    res.json({ message: 'Kanban API toimii!' });
});
 
app.listen(PORT, () => {
    console.log(`Serveri pyörii osoitteessa http://localhost:${PORT}`);
});