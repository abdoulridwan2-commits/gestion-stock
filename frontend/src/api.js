// Rôle : configurer axios une seule fois pour tout le projet.
// Nouveau : avant chaque requête, on ajoute automatiquement le token
// (la "clé" reçue à la connexion) pour prouver qui on est à Django.
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Intercepteur de requête : s'exécute AVANT chaque envoi au serveur
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Intercepteur de réponse : si Django répond "401 non autorisé",
// le token est invalide ou expiré, donc on renvoie vers la page de connexion.
api.interceptors.response.use(
  (reponse) => reponse,
  (erreur) => {
    if (erreur.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/connexion";
    }
    return Promise.reject(erreur);
  },
);

export default api;
