// Rôle : la barre latérale de navigation, visible sur toutes les pages.
import { NavLink } from "react-router-dom";

function MenuLateral() {
  return (
    <aside className="menu">
      <p className="menu-logo">Mon Stock</p>
      <nav>
        <NavLink to="/" end className="menu-lien">
          Tableau de bord
        </NavLink>
        <NavLink to="/produits" className="menu-lien">
          Produits
        </NavLink>
        <NavLink to="/mouvements" className="menu-lien">
          Mouvements
        </NavLink>
      </nav>
    </aside>
  );
}

export default MenuLateral;
