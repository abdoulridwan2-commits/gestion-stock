// Rôle : la page du tableau de bord. Elle va chercher les chiffres à Django
// et les affiche : cartes, graphique et liste d'alertes.
import { useEffect, useState } from "react";
import api from "../api";
import CarteKpi from "../components/CarteKpi";
import GraphiqueSemaine from "../components/GraphiqueSemaine";
import ListeAlertes from "../components/ListeAlertes";

function TableauDeBord() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api
      .get("/tableau-de-bord/")
      .then((reponse) => setDonnees(reponse.data))
      .catch(() =>
        setErreur(
          "Impossible de joindre le serveur. Vérifiez que Django tourne.",
        ),
      );
  }, []);

  if (erreur) return <p className="message erreur">{erreur}</p>;
  if (!donnees) return <p className="message">Chargement...</p>;

  const valeur = Number(donnees.valeur_stock).toLocaleString("fr-FR");

  return (
    <main className="page">
      <h1>Tableau de bord</h1>

      {/* Bloc 1 : les 4 cartes de chiffres */}
      <div className="grille-kpi">
        <CarteKpi
          titre="Valeur du stock"
          valeur={`${valeur} FCFA`}
          couleur="#0B6E64"
        />
        <CarteKpi
          titre="Produits"
          valeur={donnees.nombre_produits}
          couleur="#2F5FBF"
        />
        <CarteKpi
          titre="Stock bas"
          valeur={donnees.stock_bas}
          couleur="#8A4B08"
        />
        <CarteKpi
          titre="Ruptures"
          valeur={donnees.ruptures}
          couleur="#A3200F"
        />
      </div>

      {/* Bloc 2 : le graphique et la liste, EN DEHORS de la grille des cartes */}
      <div className="grille-deux">
        <GraphiqueSemaine donnees={donnees.mouvements_semaine} />
        <ListeAlertes produits={donnees.a_reapprovisionner} />
      </div>
    </main>
  );
}

export default TableauDeBord;
