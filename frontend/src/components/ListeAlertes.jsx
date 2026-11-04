// Rôle : afficher les produits à réapprovisionner (stock bas ou rupture),
// avec une barre qui montre le niveau de stock par rapport au seuil.
function ListeAlertes({ produits }) {
  return (
    <div className="carte">
      <h2 className="carte-h2">À réapprovisionner</h2>

      {/* S'il n'y a aucune alerte, on affiche un message positif */}
      {produits.length === 0 && (
        <p className="message">Tous vos produits sont suffisamment en stock.</p>
      )}

      {produits.map((p) => {
        const estRupture = p.statut === "rupture";
        // Largeur de la barre : quantité / seuil, entre 4 % et 100 %
        const largeur = Math.min(
          100,
          Math.max(4, (p.quantite / p.seuil_alerte) * 100),
        );

        return (
          <div className="alerte" key={p.id}>
            <div className="alerte-ligne">
              <strong>{p.nom}</strong>
              <span
                className={
                  estRupture ? "badge badge-rupture" : "badge badge-bas"
                }
              >
                {estRupture ? "Rupture" : "Stock bas"}
              </span>
            </div>
            <div className="barre">
              <div
                className="barre-niveau"
                style={{
                  width: `${largeur}%`,
                  background: estRupture ? "#D9483B" : "#E0A33B",
                }}
              />
            </div>
            <span className="alerte-texte">
              {p.quantite} en stock (seuil : {p.seuil_alerte})
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ListeAlertes;
