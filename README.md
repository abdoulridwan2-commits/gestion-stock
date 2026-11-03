# Gestion de Stock

Application web qui aide les petits commerces à suivre leur stock : produits, entrées et sorties, alertes de rupture et tableau de bord.

> Projet en cours de développement.

## Le problème

Beaucoup de petites boutiques notent encore leur stock sur un cahier ou dans des messages. Résultat : des ruptures non détectées, des pertes et aucune vue claire de la valeur du stock. Cette application propose un outil simple, utilisable depuis un téléphone.

## Fonctionnalités prévues

- Connexion et inscription (chaque commerçant voit ses propres données)
- Gestion des produits : ajouter, modifier, supprimer (nom, catégorie, prix, quantité)
- Enregistrement des entrées et sorties de stock
- Alerte quand un produit passe sous son seuil
- Tableau de bord : valeur du stock, produits en stock bas, ruptures, mouvements de la semaine
- Design responsive, pensé d'abord pour le téléphone

## Technologies

| Partie          | Outils                                      |
| --------------- | ------------------------------------------- |
| Frontend        | React (Vite), React Router, Axios, Recharts |
| Backend         | Django, Django REST Framework               |
| Base de données | SQLite (développement)                      |
| Versionnage     | Git et GitHub                               |

## Structure du projet

```
gestion-stock/
  backend/    API Django (config/, stock/)
  frontend/   Interface React
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le backend tourne sur `http://127.0.0.1:8000` et le frontend sur `http://localhost:5173`.

## Auteur

Abdoulaye Ridwan, étudiant et développeur en formation.
GitHub : [abdoulridwan2-commits](https://github.com/abdoulridwan2-commits)
