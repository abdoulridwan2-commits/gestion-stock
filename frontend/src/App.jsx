// Rôle : le cadre de l'application. Chaque route associe une adresse à une page.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuLateral from "./components/MenuLateral";
import TableauDeBord from "./pages/TableauDeBord";
import Produits from "./pages/Produits";
import Mouvements from "./pages/Mouvements";

function App() {
  return (
    <BrowserRouter>
      <div className="cadre">
        <MenuLateral />
        <div className="contenu">
          <Routes>
            <Route path="/" element={<TableauDeBord />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/mouvements" element={<Mouvements />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
