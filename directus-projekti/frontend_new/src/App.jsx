import { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import './App.css'
import axios from 'axios'



const API_URL = "http://localhost:3000/tasks";


function App() {
  const [tasks, setTasks] = useState([]);
  const [error, asetaError] = useState(null);
  const [tehtava, muokkaaTehtavaa] = useState(null);
  const [otsikko, muokkaaOtsikkoa] = useState("");
  const [kuvaus, muokkaaKuvausta] = useState("");

    const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 

  const unpackedToken = token ?  jwtDecode(token) : null;
  console.log(unpackedToken); 
  const userLevel = unpackedToken ? unpackedToken.authLevel : 0;// tämän perusteella päätetään mitä UI:ssä näytetään
  console.log(userLevel); 

  // Autentikaatiotokenin lisäys kyselyiden headeriin
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  }, [token]);
  

useEffect(() => {
async function fetchData() {
  if(token !== null)
  {
    const data = await getTasks();
    setTasks(data);
  }
  else
  {
    setTasks([]);
  }
}

fetchData();
}, [token]); // huom lataa tehtävät uusiksi aina kun tehtävät muuttuu


const getTasks = async () => {
  const response = await axios.get(API_URL, {
    headers: {Authorization: `Bearer ${token}`,},
  });
    return response.data;
};

const register = async (e) => {
    e.preventDefault();
    asetaError(null);
 
    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      asetaError("Rekisteröinti onnistui! Kirjaudu sisään.");
      setIsRegistering(false);
    } catch (err) {
      asetaError(
      );
    }
  };
   const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      asetaError(null);
    } catch (err) {
      asetaError("Kirjautuminen epäonnistui");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTasks([]);
  }; 
  
// Uuuden tehtävän lisääminen
const lisaaTehtava = async (e) => {
  try
  {
  const response = await axios.post( 
    API_URL,
    {"title": otsikko, "description": kuvaus },
    {
    headers: { "Content-Type": "application/json" }
    }
  );
  tyhjennaValinnat();
  }
  catch
  {
    asetaError("Tehtävän lisäämisessä tapahtui virhe!");
  }

};
const aloitaMuokkaus = (task) => {

  muokkaaTehtavaa(task);
  muokkaaOtsikkoa(task.title);
  muokkaaKuvausta(task.description);
  
};

const tyhjennaValinnat = () => {
  muokkaaTehtavaa(null);
  muokkaaOtsikkoa("");
  muokkaaKuvausta("");
  asetaError(null);

};

const paivitaTehtava = async (e) => {
  try
  {
      const response = await axios.put(
    API_URL + "/" + tehtava.id,
    {"title": otsikko, "description": kuvaus },
    {
    headers: { "Content-Type": "application/json" }
    }
  );
  const muutettuTehtava = tasks.find((elemet) => element.id == tehtava.id);
  muutettuTehtava.title = otsikko; 
  muutettuTehtava.description = kuvaus; 
  setTasks(tasks);

  tyhjennaValinnat();
  }
  catch
  {
    asetaError("Tehtävän päivityksessä tapahtui 'virhe'!");
  }
};
const poistaTehtava = async (task) => {
  try
  {
      const response = await axios.delete(API_URL +  "/" + task.id); 
      setTasks(    tasks.filter((tempTask) => tempTask.id != task.id));
      tyhjennaValinnat();
  }
  catch
  {
    asetaError("Tehtävän poisto epäonnistui!");
  }
};

const peruutaMuokkaus = () => {
   tyhjennaValinnat();
};   
  if (!token) {
    return (
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <h1>{isRegistering ? "Rekisteröidy" : "Kirjaudu sisään"}</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={isRegistering ? register : login}>
          <input
            type="email"
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegistering ? "Rekisteröidy" : "Kirjaudu"}
          </button>
        </form>
 
        <p style={{ marginTop: "1em" }}>
          {isRegistering ? (
            <>
              Palaa takaisin kirjautumisnäkymään?
              <button onClick={() => setIsRegistering(false)}>Palaa</button>
            </>
          ) : (
            <>
              Ei vielä käyttäjätiliä?
              <button onClick={() => setIsRegistering(true)}>Rekisteröidy</button>
            </>
          )}
        </p>
      </div>
    );
  }
  else  
  {
  return (
  <div>
      <h1>Task Planner</h1>
      <form onSubmit={tehtava != null ? paivitaTehtava : lisaaTehtava}>
      {error != null ? <p style={{ color: "red" }}>{error}</p> :""}

        <label>Tehtävän nimi</label>
        <input type="text" value={otsikko}onChange={(e) => muokkaaOtsikkoa(e.target.value)} />
        <label>Tehtävän kuvaus</label>
        <input type="text" value={kuvaus}onChange={(e)=> muokkaaKuvausta (e.target.value)} />

  
      {
      tehtava != null && userLevel > 0 ?
      <button type="submit">Tallenna Muokkaus</button> 
      :
      userLevel > 0 ?
      <button type="submit">Lisää tehtävä</button> 
      :
      <label></label>
    }

        {tehtava != null ? <button onClick={peruutaMuokkaus}>Peruuta</button> : ''}
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong> {task.title}</strong> {task.description}
            {userLevel > 0 && (<button onClick={(e) => aloitaMuokkaus(task)}>Muokkaa</button>)}
            {userLevel > 0 && (<button onClick={(e) => poistaTehtava(task)}>Poista</button>)}
        </li>
        ))}
      </ul>
      <button onClick={logout}>Kirjaudu ulos</button>
    </div>
  
    )
  }
}
export default App
