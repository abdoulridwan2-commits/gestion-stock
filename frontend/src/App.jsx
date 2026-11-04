// Rôle : le cadre de l'application. BrowserRouter gère les adresses,
// Routes choisit la page à afficher selon l'adresse (/ ou /produits),
// et le menu reste affiché à gauche en permanence.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuLateral from "./components/MenuLateral";
import TableauDeBord from "./pages/TableauDeBord";
import Produits from "./pages/Produits";

function App() {
  return (
    <BrowserRouter>
      <div className="cadre">
        <MenuLateral />
        <div className="contenu">
          <Routes>
            <Route path="/" element={<TableauDeBord />} />
            <Route path="/produits" element={<Produits />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
