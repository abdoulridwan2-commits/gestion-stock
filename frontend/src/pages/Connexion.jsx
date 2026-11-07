// Rôle : la page de connexion ET d'inscription (on bascule de l'une à l'autre).
// En cas de succès, Django renvoie un token qu'on garde dans le navigateur (localStorage).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Connexion() {
  const navigate = useNavigate();
  // "inscription" vaut true quand on crée un compte, false quand on se connecte
  const [inscription, setInscription] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");

  function envoyer(e) {
    e.preventDefault();
    setErreur("");

    // On efface un éventuel ancien token : un token périmé ferait refuser la connexion
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    const adresse = inscription ? "/inscription/" : "/connexion/";

    api
      .post(adresse, { username, password })
      .then((reponse) => {
        // On garde le token : il sera ajouté automatiquement à chaque requête (voir api.js)
        localStorage.setItem("token", reponse.data.token);
        localStorage.setItem("username", username);
        navigate("/"); // direction le tableau de bord
      })
      .catch((err) => {
        const donnees = err.response?.data;
        // Django renvoie le message à des endroits différents selon l'erreur
        const message =
          donnees?.detail ||
          donnees?.non_field_errors?.[0] ||
          "Impossible de se connecter. Vérifiez vos informations.";
        setErreur(message);
      });
  }

  return (
    <main className="connexion">
      <form className="carte connexion-carte" onSubmit={envoyer}>
        <p
          className="menu-logo"
          style={{ color: "#0B6E64", margin: "0 0 4px" }}
        >
          Mon Stock
        </p>
        <h1 style={{ fontSize: 22 }}>
          {inscription ? "Créer un compte" : "Connexion"}
        </h1>

        <div className="champs" style={{ gridTemplateColumns: "1fr" }}>
          <label>
            Nom d'utilisateur
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={inscription ? "new-password" : "current-password"}
              required
            />
          </label>
        </div>

        {erreur && <p className="erreur">{erreur}</p>}

        <button className="bouton" type="submit" style={{ width: "100%" }}>
          {inscription ? "Créer mon compte" : "Se connecter"}
        </button>

        <button
          type="button"
          className="lien-bouton"
          onClick={() => {
            setInscription(!inscription);
            setErreur("");
          }}
        >
          {inscription
            ? "J'ai déjà un compte : me connecter"
            : "Pas de compte ? Créer un compte"}
        </button>
      </form>
    </main>
  );
}

export default Connexion;
