// Rôle : la barre latérale de navigation, avec le bouton de déconnexion.
import { NavLink, useNavigate } from "react-router-dom";

function MenuLateral() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Déconnexion : on supprime le token du navigateur, puis retour à la page de connexion
  function deconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/connexion");
  }

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

      <div className="menu-bas">
        <p className="menu-utilisateur">Connecté : {username}</p>
        <button className="menu-deconnexion" onClick={deconnecter}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

export default MenuLateral;
