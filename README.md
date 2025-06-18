# Rover Control System

Un système de contrôle de rover avec support pour les séquences de commandes et la découverte d'obstacles.

## Fonctionnalités

- **Commandes individuelles** : Z (avancer), S (reculer), Q (gauche), D (droite), scan, return
- **Séquences de commandes** : Possibilité de saisir des séquences comme "zzdzzz" pour exécuter plusieurs commandes d'affilée
- **Détection d'obstacles** : Le rover détecte et évite les obstacles
- **Affichage de carte** : Visualisation en temps réel de la position du rover et des obstacles
- **Communication WebSocket** : Communication bidirectionnelle avec le rover

## Installation

```bash
npm install
```

## Utilisation

### Démarrer l'application

```bash
npm start
```

### Commandes disponibles

- **Z** : Faire avancer le rover
- **S** : Faire reculer le rover  
- **Q** : Tourner le rover vers la gauche
- **D** : Tourner le rover vers la droite
- **scan** : Scanner les obstacles à proximité
- **return** : Quitter l'application

### Séquences de commandes

Vous pouvez saisir des séquences de commandes pour exécuter plusieurs mouvements d'affilée :

- **zzdzzz** : Avancer deux fois, tourner à droite, avancer trois fois
- **qdqd** : Tourner à gauche, avancer, tourner à droite, avancer
- **ssqq** : Reculer deux fois, tourner à gauche deux fois

### Exemples d'utilisation

```
Enter command or sequence (Z,S,Q,D,scan,return): zzdzzz
Executing command sequence: ZZDZZZ
Executing command: Z
Moving forward. New position: { x: 0, y: 1, z: 0 }
Executing command: Z
Moving forward. New position: { x: 0, y: 2, z: 0 }
Executing command: D
Turning right. New orientation: E
Executing command: Z
Moving forward. New position: { x: 1, y: 2, z: 0 }
Executing command: Z
Moving forward. New position: { x: 2, y: 2, z: 0 }
Executing command: Z
Moving forward. New position: { x: 3, y: 2, z: 0 }
```

## Architecture

Le système est organisé en modules :

- **rover** : Services de localisation, mouvement et détection d'obstacles
- **ui** : Services d'interface utilisateur (input, carte, retour)
- **network** : Communication WebSocket
- **mission-control** : Services de communication avec le rover

## Développement

```bash
# Compiler le projet
npm run build

# Mode développement avec rechargement automatique
npm run dev
```
