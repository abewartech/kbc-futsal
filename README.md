<!-- GitAds-Verify: M2PYCTF3PHEKDOG39CACDEN1Y624GWX6 -->

# kbc-futsal

[![Version](https://img.shields.io/github/v/tag/abewartech/kbc-futsal?label=version&amp;sort=semver)](https://github.com/abewartech/kbc-futsal/tags)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Build Status](https://img.shields.io/github/actions/workflow/status/abewartech/kbc-futsal/ci.yml?branch=main)](https://github.com/abewartech/kbc-futsal/actions)
[![React Native](https://img.shields.io/badge/React%20Native-mobile--app-blue)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-green)](https://nodejs.org/)

Project Skripsi UNINDRA: **Aplikasi Penyewaan Online Lapangan Futsal Berbasis Android** pada KBC Futsal.  
This React Native application allows customers to browse available futsal schedules, book fields online, and manage their reservations from an Android device.  
It is designed for small futsal businesses that need a simple, mobile-first booking and management system.

[![KBC FUTSAL](https://media.giphy.com/media/daV6bIpq6EYlizelni/giphy.gif)](https://youtu.be/cru0oY3dHgU)
[![KBC FUTSAL](https://media.giphy.com/media/ek3tyR3bi6uBxHgGPn/giphy.gif)](https://youtu.be/cru0oY3dHgU)
[![KBC FUTSAL](https://media.giphy.com/media/mEJWc0jlHrPIlXz9PE/giphy.gif)](https://youtu.be/cru0oY3dHgU)

---

## ✨ Features

- Online futsal field browsing and booking
- Time-slot based scheduling with real-time availability
- Booking history and basic reservation management
- Simple and intuitive Android UI built with React Native
- API-driven architecture ready for backend integration
- Suitable as a reference project for final-year thesis (Skripsi)

---

## 📸 Screenshots

| ![Screenshot 1](screenshots/screen1.png) | ![Screenshot 2](screenshots/screen2.png) | ![Screenshot 3](screenshots/screen3.png) |
|:---:|:---:|:---:|
| *Home & schedule overview* | *Booking flow* | *Booking history / profile* |

> Note: Paths are examples; update them to match your actual screenshot files or adjust as needed.

---

## 🚀 Getting Started

These instructions will help you set up the project on your local machine for development and testing.

### ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Java JDK** and **Android SDK** (for Android development)
- **React Native CLI** environment set up  
  See the official guide: https://reactnative.dev/docs/environment-setup

### 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/abewartech/kbc-futsal.git
cd kbc-futsal

# Using npm
npm install

# Or using yarn
yarn install
```

---

## ▶️ Usage

### Run the Metro bundler

```bash
# Using npm
npm start

# Or using yarn
yarn start
```

### Run on Android device/emulator

In a new terminal:

```bash
# Using React Native CLI via npm
npx react-native run-android
```

Or, if you have the CLI installed globally:

```bash
react-native run-android
```

The application should now build and open on your Android emulator or connected device.

### Example: Adjusting API base URL

If the app talks to a backend API, you will typically find configuration in `src/` (for example `src/config.js`):

```js
// Example only – adjust to your real config file
export const API_BASE_URL = 'https://your-backend.example.com/api';
```

Update the URL above to point to your own backend service.

---

## 📁 Project Structure

A high-level overview of important files and directories:

- `App.js` – Main application entry point and root component
- `index.js` – React Native entry bootstrap
- `src/` – Application source code (screens, components, services, utilities)
- `assets/` – Images, icons, and other static resources
- `android/` – Native Android project (Gradle, manifests, native configuration)
- `ios/` – Native iOS project (if/when used)
- `__tests__/` – Jest test suites and mocks
- `package.json` – Project metadata, scripts, and dependencies
- `metro.config.js` / `babel.config.js` – Metro bundler and Babel configuration

Refer to the individual folders for more detailed structure.

---

## 🛠 Technologies & Tools

Core stack and tooling used in this project:

- ![React Native](https://img.shields.io/badge/React%20Native-0.x-blue?logo=react) – Mobile app framework
- ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript) – Primary language
- ![Node.js](https://img.shields.io/badge/Node.js-runtime-green?logo=node.js) – Dependency and tooling runtime
- ![Android](https://img.shields.io/badge/Android-mobile-green?logo=android) – Target platform
- ![Jest](https://img.shields.io/badge/Testing-Jest-blue?logo=jest) – Unit testing framework
- Other ecosystem tools from the React Native CLI and Metro bundler

---

## 🤝 Contributing

Contributions are welcome. To propose changes:

1. **Fork** the repository.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and add tests where appropriate.
4. **Run tests** (if configured):
   ```bash
   npm test
   # or
   yarn test
   ```
5. **Commit** your changes with a clear message.
6. **Push** your branch and open a **Pull Request** against the `main` branch, describing:
   - What you changed
   - Why the change is needed
   - Any relevant screenshots or testing notes

Please keep code style consistent with the existing project (ESLint/Prettier settings are provided in the repo).

---

## 👤 Authors

- **Rahmad Al Habib Khasary** – Initial work and project concept

---

## 📄 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software under the terms of the license.

If a `LICENSE` file is not present, you can create one with the standard MIT text:
https://opensource.org/licenses/MIT

---

## GitAds Sponsored

[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=abewartech/kbc-futsal@github)](https://gitads.dev/v1/ad-track?source=abewartech/kbc-futsal@github)

[![Anurag's github stats](https://github-readme-stats.vercel.app/api?username=abewartech)](https://github.com/abewartech/github-readme-stats)


