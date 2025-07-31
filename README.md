# LostAndFound

## Description
Lost and Found is a web app that I, alongside Cinay Dilibal, Peipei Soeung, and Yasmeen Hussein, created where you send anonymous messages as paper airplanes that land on random spots across a world map for others to discover. Each day, unlock a new country to scratch off, explore fun facts, and uncover hidden messages. Collect unique stamps for your virtual passport as you complete countries and unlock achievements, creating a personalized journey of global stories and connections.

## Deployed Application
https://project-lost-and-found-muix.onrender.com

NOTE: Go straight to sign up button and input information there. If from the US, use 'United States'.

## Video Demo
https://github.com/user-attachments/assets/96ea9dc5-63c1-43a7-9b8f-4096627b6266

##  Setup Instructions
Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone git@github.com:cannondev/LostAndFound.git

# 2. Navigate into the project folder
cd path/to/LostAndFound

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
```

## Learning Journey:
This project was a team effort and our final, open-ended project for COSC 52 Full-Stack Web Development. My contributions to this project that I wanted to highlight for the code snippet portion of the Dali Lab Application are the integration of OpenAI's API Platform to generate cultural, historical, and fun facts about countries discovered, and consolidating them, along with user's thoughts sent out across the map, in a responsive passport modal with original styling with carousels and multiple pages. This functionality can be seen in the video demo and deployed site.

Relevant frontend source code files include:
1 . src/components/Passport.jsx // dynamic Passport modal component with state management and axios functionality
2 . src/controllers/ThoughtsCarousel.jsx // ground-up thoughts carousel component
3 . src/components/FunFactsCarousel.jsx // ground-up carousel component

This was my first time taking on the challenge of integrating a professional third-party API completely unguided, so I enjoyed the process of reading through the documentation and tweaking my implementation as I progressed. The in-house CSS, flex, etc. styling of the modal was a challenge as well and a fun design process that I enjoyed collaborating on with my group members.

Additional note: this is a cloned repo from the private Dartmouth CS 52 25W org. I cloned it to be public so that I could use it for the DALI application. If need be, I will be more than willing to make any visibility changes necessary to this repo before, during, or after the application process.
