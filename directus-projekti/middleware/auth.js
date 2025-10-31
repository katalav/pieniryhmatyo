const jwt = require("jsonwebtoken");
 
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
 
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
 
  if (!token) return res.status(401).json({ error: "Token puuttuu" });
 
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Virheellinen token" });
    req.user = user;
    next();
  });
}
 
// Kuten aiempi AuthenticateToken, mutta nyt autentikoinnin lisäksi suoritetaan käyttöoikeustason tarkistus
function authorize(minAuthLevel = 0) {
  return function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token puuttuu" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Virheellinen token" });
      // user.authLevel oletetaan olevan tokenissa mukana(Muista lisätä se myös /login-käsittelijään tokenia luotaessa) )
      if (user.authLevel < minAuthLevel) {
        return res.status(403).json({ error: "Ei riittäviä oikeuksia" });
      }

      req.user = user;
      next();
    });
  };
}

module.exports = authorize;