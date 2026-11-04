// Rôle : la page Produits. Elle liste les produits, permet d'en ajouter,
// de les modifier (PUT) et de les supprimer (DELETE).
import { useEffect, useState } from "react";
import api from "../api";

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
  // "enEdition" contient l'id du produit qu'on modifie (null = on ajoute un nouveau produit)
  const [enEdition, setEnEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  function charger() {
    api
      .get("/produits/")
      .then((reponse) => setProduits(reponse.data))
      .catch(() => setErreur("Impossible de charger les produits."));
  }

  useEffect(() => {
    charger();
  }, []);

  function modifier(e) {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  }

  // Remet le formulaire à zéro et quitte le mode édition
  function reinitialiser() {
    setFormulaire(FORMULAIRE_VIDE);
    setEnEdition(null);
    setErreur("");
  }

  // Ajoute un produit OU enregistre les modifications, selon le mode
  function envoyer(e) {
    e.preventDefault();
    setErreur("");
    const requete = enEdition
      ? api.put(`/produits/${enEdition}/`, formulaire)
      : api.post("/produits/", formulaire);

    requete
      .then(() => {
        reinitialiser();
        charger();
      })
      .catch(() =>
        setErreur("Vérifiez les champs : le nom et le prix sont obligatoires."),
      );
  }

  // Remplit le formulaire avec les infos du produit choisi
  function commencerEdition(p) {
    setEnEdition(p.id);
    setFormulaire({
      nom: p.nom,
      categorie: p.categorie,
      prix: p.prix,
      quantite: p.quantite,
      seuil_alerte: p.seuil_alerte,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Supprime un produit après confirmation
  function supprimer(p) {
    const ok = window.confirm(
      `Supprimer « ${p.nom} » ? Ses mouvements de stock seront aussi supprimés.`,
    );
    if (!ok) return;
    api
      .delete(`/produits/${p.id}/`)
      .then(() => charger())
      .catch(() => setErreur("La suppression a échoué."));
  }

  return (
    <main className="page">
      <h1>Produits</h1>

      <form className="carte formulaire" onSubmit={envoyer}>
        <h2 className="carte-h2">
          {enEdition ? "Modifier le produit" : "Ajouter un produit"}
        </h2>
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
        <div className="actions">
          <button className="bouton" type="submit">
            {enEdition ? "Enregistrer les modifications" : "+ Ajouter"}
          </button>
          {enEdition && (
            <button
              className="bouton-secondaire"
              type="button"
              onClick={reinitialiser}
            >
              Annuler
            </button>
          )}
        </div>
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
            <div className="droite-produit">
              <div style={{ textAlign: "right" }}>
                <div>{Number(p.prix).toLocaleString("fr-FR")} FCFA</div>
                <div className="alerte-texte">{p.quantite} en stock</div>
              </div>
              <button
                className="bouton-secondaire"
                onClick={() => commencerEdition(p)}
              >
                Modifier
              </button>
              <button className="bouton-danger" onClick={() => supprimer(p)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Produits;
