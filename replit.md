# Adventure Game - Atari Style Quest

## Overview

This project is a web-based recreation of the classic Atari Adventure game from 1979. It features a 2D maze-based adventure game where players navigate through obstacles to collect keys, treasures, and avoid enemies. The application is built using a modern full-stack architecture with React frontend and Express backend, styled with a retro Atari aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: Custom React hooks for game state management
- **Styling**: Tailwind CSS with custom Atari-themed CSS variables and shadcn/ui components
- **Canvas Rendering**: HTML5 Canvas API for pixel-perfect game graphics with anti-aliasing disabled
- **Data Fetching**: TanStack React Query for API communication

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints with `/api` prefix
- **Session Management**: Express session middleware with PostgreSQL session storage
- **Development**: Vite development server integration for hot module replacement

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon Database serverless)
- **Schema**: Shared schema definitions between frontend and backend
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Game Engine (`client/src/lib/gameEngine.ts`)
- Maze rendering system with predefined 2D array layout
- Collision detection for walls, objects, and enemies
- Enemy AI with basic patrol patterns
- Object interaction system (keys, treasures)
- Canvas-based drawing functions with retro styling

### Game State Management
- **useGameState**: Manages core game state (score, health, items, player position)
- **useGameLoop**: Handles the main game loop, input processing, and canvas rendering
- Custom hooks pattern for separating concerns

### UI Components
- **GameCanvas**: Canvas wrapper with pixel-perfect rendering settings
- **GameUI**: Heads-up display showing score, health, and inventory
- **GameModals**: Victory and game over overlays
- Retro-styled controls and interface elements

### Database Schema (`shared/schema.ts`)
- **users**: User authentication (id, username, password)
- **gameScores**: High score tracking with completion times and difficulty levels
- Zod integration for runtime schema validation

## Data Flow

1. **Game Initialization**: Player starts at position (1,1) in the maze
2. **Input Processing**: Keyboard events captured and processed in game loop
3. **State Updates**: Player movement, collision detection, and object interactions
4. **Rendering**: Canvas redrawn each frame with maze, player, objects, and enemies
5. **Score Persistence**: Game completion triggers API call to save score to database

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with TypeScript support
- Drizzle ORM with Neon Database connector

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- shadcn/ui component library
- Custom CSS variables for Atari color palette

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- ESLint and Prettier for code quality
- Replit-specific development plugins

### Game-Specific Libraries
- HTML5 Canvas API for graphics rendering
- Custom game engine with no external game libraries
- React hooks for state management

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Express server runs concurrently
- Replit-optimized configuration with runtime error overlay
- TypeScript compilation in watch mode

### Production Build
- Vite builds the frontend to `dist/public`
- ESBuild bundles the Express server to `dist/index.js`
- Static file serving from the Express server
- Environment variable configuration for database connection

### Database Management
- Drizzle migrations stored in `./migrations`
- Database schema defined in shared TypeScript files
- Connection via environment variable `DATABASE_URL`
- Session storage using PostgreSQL with connect-pg-simple

The application follows a typical full-stack pattern with clear separation between frontend game logic, backend API services, and database persistence, all optimized for the retro gaming experience with modern web technologies.

## Recent Changes

### January 21, 2025
- **Major Feature: Dungeon Crawler Transformation**: Transformed single-room game into multi-room dungeon crawler with 5 procedurally generated rooms
- **Procedural Generation**: Implemented room generation algorithm with increasing complexity, lane-based enemy movement, and strategic item placement
- **Combat System**: Added sword collection and combat mechanics - players can attack adjacent enemies with spacebar
- **Enhanced Enemy AI**: Dragons now patrol in lanes (horizontal/vertical) across entire room sections, making movement more predictable but strategic
- **Room Navigation**: Added green exit portals for transitioning between rooms with proper player positioning
- **Expanded Game Loop**: Key in Room 1, Sword in Room 2, Treasure in Room 5, return to Room 1 start to win
- **UI Enhancements**: Added room counter, sword item tracking, updated combat controls and objectives
- **Game Balance Improvements**: Fixed dragon movement speed (now moves every 30 frames instead of every frame) and increased direction change interval to 180 frames for more strategic gameplay
- **Bug Fix**: Moved treasure from position (15,8) which was inside a wall to position (17,9) in an accessible open space
- **Mobile Optimization**: Added mobile button controls with touch/click support for movement and attack actions
- **Attack Key Change**: Changed attack key from SPACE to F for better accessibility
- **Dragon Movement Improvements**: Made dragon movement completely random instead of lane-based for more unpredictable gameplay
- **Visual Clarity Enhancements**: Added letter labels with boxes for all game objects (K=Key, S=Sword, T=Treasure, D=Dragon)
- **Mobile Movement Fix**: Added 200ms throttling to prevent multiple moves per button tap, ensuring single-tile movement
- **Mobile Viewport Optimization**: Fixed responsive layout with overflow-x hidden, proper mobile scaling, and improved touch controls
- **Responsive UI Updates**: Added mobile-first responsive design with smaller text and padding on mobile devices
- **Mobile Layout Redesign**: Reduced canvas size (480x360) and restructured layout with controls underneath for better mobile viewing
- **Canvas Optimization**: Reduced cell size from 32px to 24px for better mobile fit while maintaining game playability
- **Room Transition Fix**: Fixed teleportation issue where players were spawning at start position instead of proper entry points when moving between rooms
- **Entry Position System**: Added proper entry position calculation based on exit direction (left/right) for seamless room transitions
- **Dragon Movement Enhancement**: Increased dragon movement speed from 30 frames to 15 frames (doubled speed) for more challenging gameplay
- **Dragon Spawn Fix**: Improved dragon spawn system to only place them in valid open positions, preventing wall spawning issues
- **Dragon Position Randomization**: Added random starting frames and positions for more varied dragon behavior across rooms
- **Dragon Wall Collision Fix**: Enhanced collision detection to prevent dragons from moving through walls with proper boundary checking
- **Dragon Movement Smoothness**: Fixed stopping behavior by implementing immediate direction changes when hitting walls instead of pausing
- **Fresh Dragon Spawning**: Each room transition now generates completely new dragons instead of reusing the same ones
- **Dragon Collision Thinking Fix**: Eliminated pause when dragons hit walls by resetting frame counter and immediate direction change
- **Unique Dragon Generation**: Added unique IDs and forced fresh generation to ensure completely different dragons per room
- **Complete Dragon Logic Rewrite**: Rewrote dragon system from scratch with clean spawning and movement logic
- **Smart Wall Avoidance**: Dragons now pre-calculate valid directions to eliminate thinking delays when hitting walls
- **Single Dragon Per Room**: Each room spawns exactly one dragon that despawns when leaving the room
- **Instant Direction Changes**: Dragons immediately pick valid directions without any pause or delay
- User feedback: Dragons were too fast and treasure was unreachable - both issues resolved