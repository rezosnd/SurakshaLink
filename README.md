
# SurakshaLink

All Rights Reserved

Copyright (c) 2025 Rehan Suman

All rights are reserved. This source code and all associated files are the intellectual property of the author and may not be copied, used, modified, or distributed in any form without express written permission.

Unauthorized use of this code is a violation of copyright law.

For permission requests, please contact: rehansuman41008@gmail.com

## Overview

SurakshaLink is a cutting-edge emergency alert system designed to provide users with a discreet way to signal for help during dangerous situations. Using voice-activated code words, real-time location tracking, and emergency contact alerts, this cyberpunk-inspired application offers a layer of security for those who need it most.

The system continuously monitors for user-defined trigger words and immediately initiates emergency protocols when detected, capturing live video footage and precise location data to provide to emergency contacts.

## 🚀 Features

- **Voice-activated emergency triggers** with customizable code words
- **Real-time location tracking** and reverse geocoding
- **Live video footage capture** during emergencies
- **Emergency contact management** system
- **Volume button activation** for stealth operation
- **Cyberpunk-inspired UI design** for an immersive experience
- **User Authentication**: Secure login and registration using Firebase Authentication
- **Real-time Database**: Store and retrieve data in real-time with Firebase Realtime Database
- **Responsive Design**: Optimized for various devices using Tailwind CSS
- **Modular Architecture**: Organized codebase with clear separation of concerns

## 🛠️ Technologies Used

- **Frontend**: Vite, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions
- **Build Tools**: Bun
- **Configuration**: Capacitor, Vercel, Render

## 📁 Project Structure

```
SurakshaLink/
├── backend/           # Firebase backend functions
├── functions/         # Cloud functions
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # Reusable components
│   ├── pages/         # Application pages
│   └── utils/         # Utility functions
├── .firebaserc        # Firebase project configuration
├── capacitor.config.ts # Capacitor configuration
├── firebase.json      # Firebase settings
├── package.json       # Project metadata and scripts
├── tailwind.config.ts # Tailwind CSS configuration
└── vite.config.ts     # Vite build configuration
```

## 🔧 Getting Started

### Prerequisites

- Node.js and Bun installed
- Firebase CLI installed and configured

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rezosnd/SurakshaLink.git
   cd SurakshaLink
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure Firebase:
   ```bash
   firebase login
   firebase init
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

## 📱 How to Use

1. **FIRST**: GO TO SETUP and ADD a CODE WORD like "APPLE". When you SPEAK this code word, voice recording and location detection will automatically start.

2. **NEXT**: Add your EMERGENCY CONTACTS — these are the people who will be alerted.

3. **THEN**: Add YOUR OWN MOBILE NUMBER for verification.

4. **DONE!** You're now ready.

5. **On MOBILE**: You'll see an "INSTALL APP" button. Download it to enable features properly.

6. **DURING EMERGENCY**: Just open the app and SAY YOUR CODE WORD. That triggers recording, location detection, and prepares the emergency message.

7. A 'SEND' button will appear to send everything instantly.

8. In the MONITOR section, you'll find a SPEAK button.

> 🚧 The app is still under development — please wait patiently while we finalize the features.
