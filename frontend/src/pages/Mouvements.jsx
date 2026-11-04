// Rôle : la page Mouvements. Elle permet d'enregistrer une entrée ou une sortie
// de stock (POST) et affiche l'historique des mouvements (GET).
import { useEffect, useState } from "react";
import api from "../api";

function Mouvements() {
  const [produits, setProduits] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [produit, setProduit] = useState("");
  const [type, setType] = useState("entree");
  const [quantite, setQuantite] = useState("");
  const [erreur, setErreur] = useState("");

  // Recharge les produits (pour voir le stock à jour) et l'historique
  function charger() {
    api.get("/produits/").then((r) => setProduits(r.data));
    api.get("/mouvements/").then((r) => setMouvements(r.data));
  }

  useEffect(() => {
    charger();
  }, []);

  function enregistrer(e) {
    e.preventDefault();
    setErreur("");
    api
      .post("/mouvements/", { produit, type, quantite })
      .then(() => {
        setQuantite("");
        charger(); // met à jour le stock et l'historique
      })
      .catch((err) => {
        // Django renvoie un message clair (ex : "Stock insuffisant pour cette sortie.")
        const messages = err.response?.data?.non_field_errors;
        setErreur(
          messages ? messages[0] : "Vérifiez le produit et la quantité.",
        );
      });
  }

  return (
    <main className="page">
      <h1>Mouvements de stock</h1>

      <form className="carte formulaire" onSubmit={enregistrer}>
        <h2 className="carte-h2">Enregistrer un mouvement</h2>
        <div className="champs">
          <label>
            Produit
            <select
              value={produit}
              onChange={(e) => setProduit(e.target.value)}
              required
            >
              <option value="">Choisir un produit</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({p.quantite} en stock)
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
            </select>
          </label>
          <label>
            Quantité
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              required
            />
          </label>
        </div>
        {erreur && <p className="erreur">{erreur}</p>}
        <button className="bouton" type="submit">
          Enregistrer
        </button>
      </form>

      <div className="carte" style={{ marginTop: 16 }}>
        <h2 className="carte-h2">Historique</h2>
        {mouvements.length === 0 && (
          <p className="message">Aucun mouvement pour l'instant.</p>
        )}
        {mouvements.map((m) => (
          <div className="alerte-ligne ligne-produit" key={m.id}>
            <div>
              <strong>{m.produit_nom}</strong>
              <div className="alerte-texte">
                {new Date(m.date).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <span
              className={
                m.type === "entree"
                  ? "badge badge-entree"
                  : "badge badge-rupture"
              }
            >
              {m.type === "entree" ? "+" : "-"}
              {m.quantite}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Mouvements;
