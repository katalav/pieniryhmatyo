const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
 
const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
 
// --- Rekisteröinti ---
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Sähköposti on jo käytössä" });
 
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashed },
    });
 
    res.json({ message: "Käyttäjä rekisteröity" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rekisteröinti epäonnistui" });
  }
});
 
// --- Kirjautuminen ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Virheelliset tunnukset" });
 
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Virheelliset tunnukset" });
 

    const token = jwt.sign({ id: user.id, authLevel: user.authLevel }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kirjautuminen epäonnistui" });
  }
});
 
module.exports = router;