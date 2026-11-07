// Rôle : le cadre de l'application.
// /connexion est publique. Toutes les autres pages sont PROTÉGÉES :
// sans token, on est renvoyé vers la page de connexion.
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import MenuLateral from "./components/MenuLateral";
import TableauDeBord from "./pages/TableauDeBord";
import Produits from "./pages/Produits";
import Mouvements from "./pages/Mouvements";
import Connexion from "./pages/Connexion";

// Cadre des pages protégées : vérifie le token, affiche le menu et la page demandée
function CadreProtege() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/connexion" replace />;
  }
  return (
    <div className="cadre">
      <MenuLateral />
      <div className="contenu">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route element={<CadreProtege />}>
          <Route path="/" element={<TableauDeBord />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/mouvements" element={<Mouvements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
