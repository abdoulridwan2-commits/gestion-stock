// Rôle : la page Produits. Elle liste les produits (GET) et permet
// d'en ajouter un nouveau (POST) via un formulaire.
import { useEffect, useState } from "react";
import api from "../api";

// Valeurs de départ du formulaire (champs vides)
const FORMULAIRE_VIDE = {
  nom: "",
  categorie: "",
  prix: "",
  quantite: 0,
  seuil_alerte: 5,
};

function Produits() {
  const [produits, setProduits] = useState([]);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState("");

  // Va chercher la liste des produits à Django
  function charger() {
    api
      .get("/produits/")
      .then((reponse) => setProduits(reponse.data))
      .catch(() => setErreur("Impossible de charger les produits."));
  }

  // Charge la liste une seule fois, à l'affichage de la page
  useEffect(() => {
    charger();
  }, []);

  // Met à jour le champ modifié dans le formulaire
  function modifier(e) {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  }

  // Envoie le nouveau produit à Django, puis recharge la liste
  function ajouter(e) {
    e.preventDefault(); // empêche le rechargement de la page
    setErreur("");
    api
      .post("/produits/", formulaire)
      .then(() => {
        setFormulaire(FORMULAIRE_VIDE);
        charger();
      })
      .catch(() =>
        setErreur("Vérifiez les champs : le nom et le prix sont obligatoires."),
      );
  }

  return (
    <main className="page">
      <h1>Produits</h1>

      <form className="carte formulaire" onSubmit={ajouter}>
        <h2 className="carte-h2">Ajouter un produit</h2>
        <div className="champs">
          <label>
            Nom
            <input
              name="nom"
              value={formulaire.nom}
              onChange={modifier}
              required
            />
          </label>
          <label>
            Catégorie
            <input
              name="categorie"
              value={formulaire.categorie}
              onChange={modifier}
            />
          </label>
          <label>
            Prix (FCFA)
            <input
              name="prix"
              type="number"
              min="0"
              value={formulaire.prix}
              onChange={modifier}
              required
            />
          </label>
          <label>
            Quantité
            <input
              name="quantite"
              type="number"
              min="0"
              value={formulaire.quantite}
              onChange={modifier}
            />
          </label>
          <label>
            Seuil d'alerte
            <input
              name="seuil_alerte"
              type="number"
              min="0"
              value={formulaire.seuil_alerte}
              onChange={modifier}
            />
          </label>
        </div>
        {erreur && <p className="erreur">{erreur}</p>}
        <button className="bouton" type="submit">
          + Ajouter
        </button>
      </form>

      <div className="carte" style={{ marginTop: 16 }}>
        <h2 className="carte-h2">Liste des produits ({produits.length})</h2>
        {produits.length === 0 && (
          <p className="message">Aucun produit pour l'instant.</p>
        )}
        {produits.map((p) => (
          <div className="alerte-ligne ligne-produit" key={p.id}>
            <div>
              <strong>{p.nom}</strong>
              <div className="alerte-texte">
                {p.categorie || "Sans catégorie"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>{Number(p.prix).toLocaleString("fr-FR")} FCFA</div>
              <div className="alerte-texte">{p.quantite} en stock</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Produits;
