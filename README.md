# Nappio Frontend

This is the frontend application for Nappio, a reusable nappy subscription service. The frontend is built with **SvelteKit** and is responsible for handling the user interface, interacting with the backend API, and delivering a smooth and responsive experience for customers.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Building the Project](#building-the-project)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)

## Prerequisites

Before running the frontend application, ensure you have the following installed on your machine:
- **Node.js** (v16.8 or later) - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

## Installation

### 1. Clone the repository to your local machine:

```bash
git clone git@github.com:your-username/nappio-frontend.git
cd nappio-frontend
```
### 2. Install the required dependencies:

```bash
    npm install
```

## Running the Development Server

To start the development server and view the application locally:

### 1.Run the following command:

```bash
    npm run dev
```

### 2. Open your browser and go to http://localhost:3000 to see the app in action. The app will automatically reload if you make changes to the code.

## Building the Project

To build the project for production, use the following command:

```bash
npm run build
```

This will generate a static site in the build/ directory, which can be deployed to any static hosting service (like Netlify or Vercel).
Deployment

The frontend is deployed using Netlify. After pushing changes to your GitHub repository, Netlify will automatically build and deploy the application.

## Deployment Steps:

- Push your changes to the main branch of the repository.
- Netlify will automatically detect changes and begin the deployment process.
- You can monitor the deployment status in the Netlify dashboard.