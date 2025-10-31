const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth");
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;
 
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use('/tasks', taskRoutes);
 

app.get('/', (req, res) => {
    res.json({ message: 'Kanban API toimii!' });
});
 
app.listen(PORT, () => {
    console.log(`Serveri pyörii osoitteessa http://localhost:${PORT}`);
});