// Rôle : la barre latérale de navigation, visible sur toutes les pages.
// NavLink est un lien React Router : il change de page SANS recharger le site,
// et ajoute la classe "actif" au lien de la page courante.
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
      </nav>
    </aside>
  );
}

export default MenuLateral;
