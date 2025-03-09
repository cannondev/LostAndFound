# Lost & Found

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

## Project Description:

"Lost and Found" is a web app where you send anonymous messages as paper airplanes that land on random spots across a world map for others to discover. Each day, unlock a new country to scratch off, explore fun facts, and uncover hidden messages. Collect unique stamps for your virtual passport as you complete countries and unlock achievements, creating a personalized journey of global stories and connections.


## URL
https://project-lost-and-found.onrender.com

## Architecture
- **Frontend:** React (v19), React Router (v7)  
- **UI Library:** MUI, Framer Motion, Remix Icons, Font Awesome  
- **State Management:** Zustand  
- **Mapping:** React-SVG-Worldmap  
- **Networking:** Axios  
- **Data Handling:** Mongo (for interactions with the backend)  
- **Tooling & Dev Dependencies:** Babel, ESLint (Airbnb config), Vite Plugin PWA

## Setup

### Clone the repository:  
```sh
git clone https://github.com/your-repo/lost-and-found-frontend.git
cd lost-and-found-frontend
```

### Install dependencies:
```
npm install
```

### Create a `.env` file in the root directory and add:  
```ini
AUTH_SECRET=your_auth_secret
AI_API_KEY=your_ai_api_key
```

### Start the development server:
```
npm start
```

## Deployment

### Push changes to github:
```
git add .
git commit -m "Your commit message"
git push origin main
```

### Manual Deployment:
Go to your Render dashboard.
Select the project.
Click "Redeploy latest commit" or trigger a build manually.

## Authors
- Yasmeen Hussein
- Peipei Soeung
- Cinay Dilibal
- Thomas Clark
