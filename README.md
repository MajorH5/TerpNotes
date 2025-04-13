# TerpNotes


<p align="center">
  <img src="frontend/public/assets/images/logo.svg" alt="TerpNotes Logo" width="200">
</p>

TerpNotes is a collaborative note-sharing platform designed to help students share and access study materials efficiently. This project was developed as part of the University of Maryland's 2025 Bitcamp Hackathon.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## About the Project

TerpNotes is a platform that allows students to upload, browse, and share notes for various courses. It aims to foster collaboration and improve academic success by providing a centralized repository for study materials.

This project was built during the University of Maryland's 2025 Bitcamp Hackathon, showcasing teamwork, innovation, and technical expertise.

---

## Features

- **User Authentication**: Secure login and registration system.
- **Note Sharing**: Upload and share notes with peers.
- **Search and Browse**: Easily find notes by course or topic.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Privacy Controls**: Users can manage the visibility of their notes.

---

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Firebase Firestore, Node.js
- **Deployment**: AWS EC2
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git
- An AWS EC2 instance (for deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/TerpNotes.git
   cd TerpNotes
   ```

2. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Set up Firebase:

   - Create a Firebase project.
   - Enable Firestore and Authentication.
   - Add your Firebase configuration to `frontend/src/firebaseConfig.js`.

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## Usage

1. **Sign Up**: Create an account using your email.
2. **Upload Notes**: Share your notes by uploading them to the platform.
3. **Browse Notes**: Search for notes by course or topic.
4. **Collaborate**: Share links to notes with your peers.

---

## Deployment

The project is configured for deployment on AWS EC2 using GitHub Actions.

### Steps to Deploy

1. Add the following secrets to your GitHub repository:
   - `EC2_SSH_PRIVATE_KEY`: Your EC2 instance's private SSH key.
   - `EC2_USER`: The username for your EC2 instance (e.g., `ubuntu`).
   - `EC2_HOST`: The public IP address of your EC2 instance.

2. Push changes to the `main` branch. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy the latest code to your EC2 instance.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.