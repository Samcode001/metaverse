# Nexus

## Overview
Nexus is a real-time, interactive digital space designed for seamless collaboration. It allows users to explore, connect, and engage with others in a shared virtual environment with smooth movement and persistent interactions.

![Nexus Preview](Screenshot-283.png)  


## Features
- **Real-time Multiplayer:** Instant player interactions using WebSockets.  
- **Seamless Collaboration:** Explore, chat, and engage with others in a shared world.  
- **Persistent Player State:** Users retain their position and interactions across sessions.  
- **Optimized Performance:** Test-driven architecture ensuring a smooth experience.  
- **Scalable Infrastructure:** Built using modern web technologies and containerized for deployment.  

## Tech Stack
- **Frontend:** React.js, Next.js, PixiJS for rendering.  
- **Backend:** Node.js, WebSockets for real-time communication.  
- **Database:** PostgreSQL with Prisma ORM.  
- **Infrastructure:** Dockerized services, running on AWS-EC2.  
- **State Management:** Server-side reconciliation with Redis caching.  

## Setup & Installation
### Prerequisites
- Node.js 
- Docker & Docker Compose
- PostgreSQL (or use the provided Docker container)

### Steps
1. Clone the repository:
   cd nexus
   ```
2. Install dependencies:
   pnpm install
   ```
3. Start the database:
 docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecret -d postgres
   ```
4. Run the services:
   pnpm run dev

## Contribution
Feel free to submit pull requests or open issues for feature suggestions and improvements.

## License
This project is licensed under the MIT License.

