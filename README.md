# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7b039afc-a50b-4beb-8367-8c55462eac3e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7b039afc-a50b-4beb-8367-8c55462eac3e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Fonctionnalité d'Essayage Virtuel

### Description

L'assistant style IA permet maintenant aux utilisateurs de visualiser comment les vêtements d'une box leur iraient grâce à l'essayage virtuel alimenté par l'API Banana.

### Comment l'utiliser

1. **Accédez à l'Assistant Style** : Naviguez vers la page "Assistant Style"
2. **Choisissez une box** : Discutez avec l'IA pour obtenir des recommandations de box
3. **Cliquez sur "Essayer"** : Sur une box recommandée, cliquez sur le bouton "Essayer"
4. **Téléchargez votre photo** : Chargez une photo de vous en pied (format JPG ou PNG, max 5MB)
5. **Visualisez le résultat** : L'IA appliquera virtuellement les vêtements de la box sur votre photo
6. **Procédez au paiement** : Si vous êtes satisfait du résultat, cliquez sur "Procéder au paiement"

### Configuration de l'API Gemini (Nano Banana)

Pour utiliser l'essayage virtuel en production, vous devez configurer l'API Gemini avec Nano Banana :

1. Allez sur [Google AI Studio](https://aistudio.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Get API Key" puis "Create API Key"
4. Créez un fichier `.env` à la racine du projet (utilisez `.env.example` comme modèle)
5. Ajoutez votre clé :
   ```
   VITE_GEMINI_API_KEY=votre_cle_api_gemini
   ```

**Note** : En développement, un mode démo est activé qui retourne l'image originale sans transformation réelle.

### Architecture technique

- **Composant** : `src/components/VirtualTryOn.tsx` - Interface utilisateur pour l'essayage virtuel
- **Service** : `src/services/bananaApi.ts` - Intégration avec Gemini Flash + Nano Banana
- **Page** : `src/pages/StyleAssistant.tsx` - Page principale avec boutons d'essayage

### Dépendances

- `axios` : Pour les appels API vers Banana

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7b039afc-a50b-4beb-8367-8c55462eac3e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
