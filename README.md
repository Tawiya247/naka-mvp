# NAKA — MVP React (Smart Grid Companion)

MVP web de démonstration pour le sujet NAKA / FRESHYX SARL (Lomé) : mobilité électrique
décarbonée + stations solaires hybrides avec stockage et smart grid.

## Lancer

```bash
cd naka-mvp
npm install
npm run dev      # http://localhost:5173
npm run build    # vérification TypeScript + build de production
```

## Ce que couvre le MVP

- **Accueil** : bascule Trajet / Colis, recherche de destination avec suggestions, raccourcis
  Maison / Bureau, véhicules électriques avec batterie et autonomie, services Colis, portefeuille
  accessible en un clic, bandeau Premium compacté.
- **Carte** : stations solaires, batteries prêtes / total, part solaire, attente estimée, marqueurs
  ⚡, réservation de batterie, et **états d'erreur traités** (position GPS indisponible + nouvelle
  tentative) au lieu d'un message brut.
- **Réservation** : bottom sheet avec destination, prix estimé, CO₂ évité, station solaire,
  gestion du **solde insuffisant** avec recharge inline, puis course.
- **Suivi de course** : compteur de CO₂ évité **en direct**, progression, récapitulatif et
  alimentation de l'historique.
- **Activité** : état vide engageant puis historique des courses avec impact carbone.
- **Impact** : KPI, courbe hebdomadaire, jauge communauté (objectif 1 tonne), stations solaires
  contributrices.
- **Profil** : identité, édition, menu réel, à propos, aide, confidentialité.
- **Mode Partenaire** : gains du jour, carburant économisé, CO₂ évité, score de fiabilité,
  nombre d'échanges, accès direct aux batteries chargées.

## Démo pour la soutenance (3 minutes)

1. Accueil → choisir **Moto Éco** → destination → **Confirmer**.
2. Solde à 0 → la feuille propose une recharge (1 000/2 000/5 000 F) → confirmer.
3. Course : le compteur de grammes de CO₂ monte en direct → **Voir mon impact**.
4. Carte → activer **Coupure CEET** : les stations smart grid restent vertes et affichent
   « Smart Grid actif », les autres passent hors service.
5. Activer **Réseau GPS instable** : l'erreur est expliquée et **Réessayer** rétablit la carte.
6. Profil → **Mode Partenaire** : tableau de bord conducteur et bouton « Trouver une batterie
   chargée ».

## Limites assumées

- Données, paiement et positions sont simulés (aucun backend, aucune API externe).
- La carte est une carte schématique SVG (pas de tuiles Mapbox/Google) : aucun clé requise,
  fonctionne hors ligne.
- L'état de la démo (historique, solde, profil, mode Partenaire) est conservé dans le
  `localStorage` du navigateur : il survit à un rechargement. Les interrupteurs de démo
  (Coupure CEET, Réseau GPS instable) ne sont pas conservés. Pour repartir à zéro :
  `localStorage.removeItem('naka-mvp:state:v1')` dans la console.
