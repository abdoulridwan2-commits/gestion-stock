// Rôle : afficher UNE carte (titre + gros chiffre).
// Un composant réutilisable : on lui passe des "props" (titre, valeur, couleur).
function CarteKpi({ titre, valeur, couleur }) {
  return (
    <div className="carte">
      <p className="carte-titre">{titre}</p>
      <p className="carte-valeur" style={{ color: couleur }}>
        {valeur}
      </p>
    </div>
  );
}

export default CarteKpi;
