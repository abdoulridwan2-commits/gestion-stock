// Rôle : afficher le graphique en barres des entrées et sorties des 7 derniers jours.
// On utilise Recharts, la bibliothèque de graphiques installée tout à l'heure.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function GraphiqueSemaine({ donnees }) {
  // Django envoie des dates complètes ("2026-11-03") : on les transforme
  // en jour court ("mar.") et on donne aux séries les noms affichés dans la légende.
  const data = donnees.map((j) => ({
    jour: new Date(j.jour + "T12:00:00").toLocaleDateString("fr-FR", {
      weekday: "short",
    }),
    Entrées: j.entrees,
    Sorties: j.sorties,
  }));

  return (
    <div className="carte">
      <h2 className="carte-h2">Mouvements de la semaine</h2>
      {/* ResponsiveContainer adapte le graphique à la largeur de l'écran */}
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="jour" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Entrées" fill="#0B6E64" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Sorties" fill="#E0A33B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraphiqueSemaine;
