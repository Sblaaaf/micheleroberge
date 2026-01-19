# Atelier Michèle Roberge - Site vitrine - Artiste Céramiste

Bienvenue sur le dépôt du site vitrine et de gestion pour l'artiste céramiste **Michèle Roberge**. Ce projet a pour but de présenter ses œuvres uniques, gérer ses expositions et faciliter les réservations de pièces via une interface moderne et épurée.

## Contexte du Projet

### Le Client
Michèle Roberge crée des pièces uniques en Raku. Elle avait besoin d'une présence en ligne pour exposer son travail.
**Contrainte majeure :** Mettre en avant les pièces de collections, affichage des valeurs estimés des oeuvres  sans pour autant faire de la vente directe en ligne et logistique d'envoi complexe.
**Solution :** J'ai opté pour un système de **"Demande de Réservation"**. Le client manifeste son intérêt, et l'artiste valide la vente manuellement après échange (paiement/livraison hors site).

---

## Stack Technique & Justifications

Pour répondre à la demande client et demande projet d'étude (contrainte JS) : un site performant et facile à maintenir, j'ai choisi la stack suivante :

### Frontend : **Next.js 15 (App Router)**
* **Pourquoi ?** Léger, optimiser et idéal avec Vercel pour l'optimisation automatique des images (`next/image`) qui est cruciale pour un portfolio.
* **Langage :** **TypeScript** (Mode Strict) pour garantir la robustesse du code et éviter les erreurs de typage au runtime.
* **Style :** **Tailwind CSS** pour un développement rapide d'une interface responsive et un design système cohérent.

### Backend : **PocketBase**
* **Pourquoi ?** Un choix pragmatique. Plutôt que de développer un backend lourd (Node/Express/SQL) pour un simple CMS, PocketBase offre une solution **"Backend-as-a-Service"** tout-en-un : Base de données, Authentification, et Stockage de fichiers.
* **Hébergement :** PocketHost (Cloud).

### Outils Annexes
* **Sonner :** Pour la gestion des notifications utilisateurs (Toasts) modernes.
* **Lucide React :** Pour des icônes légères et standardisées.

---

## User Stories

### Pour le Visiteur (Front-Office)
* **Voir la galerie :** Affichage dynamique des œuvres avec chargement optimisé.
* **Consulter une œuvre :** Page détail avec zoom photo, description, dimensions et statut.
* **Réserver une pièce :** Formulaire "Acquérir cette œuvre" (enregistrement BDD).
* **Suivre l'actualité :** Page "Expositions" listant les événements en cours et à venir.
* **Contacter :** Formulaire de contact général via modale.

### Pour l'Administrateur (Back-Office)
* **Authentification :** LogIn : Accès sécurisé via email/mot de passe.
* **Gestion des Œuvres (CRUD) :** Ajouter (avec upload multiple d'images), Modifier, Supprimer des pièces.
* **Gestion des Réservations :** Tableau de bord pour voir les demandes, les accepter (passe l'œuvre en "Réservé") ou les refuser.
* **Collections & News :** Gestion des catégories et des dates d'exposition.

---

## Installation & Lancement

Pour tester le projet en local :

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://github.com/votre-username/atelier-michele-roberge.git](https://github.com/votre-username/atelier-michele-roberge.git)
    cd atelier-michele-roberge
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configuration :**
    * Le projet est configuré pour pointer vers l'instance PocketBase de production (`sblaaaf.pockethost.io`).
    * Aucun fichier `.env` complexe n'est requis pour le lancement basique (les clés publiques sont intégrées).

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Améliorations Futures

Dans une optique de V2, voici les évolutions envisagées :

1.  **EmailJS :** Pour l'envoi d'emails (notifications de réservation coté admin et user) sans serveur SMTP complexe.
2.  **Multilangue :** Traduction du site en Anglais pour toucher une clientèle internationale.
3.  **Newsletter :** Inscription automatique des emails des visiteurs intéressés dans une liste de diffusion (via PocketBase ou Mailchimp).
4.  **Paiement en ligne (Stripe) :** Si l'artiste trouve une solution logistique pour l'envoi sécurisé, réactiver le module de paiement Stripe initialement prévu.

---

## Auteur

**LOURGOUILLOUX Renaud**
Projet réalisé dans le cadre de la formation B3 Frameworks JS (avec CINQUIN Andy) - EPSI.
