// Rôle : configurer axios une seule fois pour tout le projet.
// Ensuite, on écrit api.get("/produits/") au lieu de répéter l'adresse complète.
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // adresse de ton backend Django
});

export default api;
