# ♟️ Chess.com Mobile App

A beautiful **Chess.com desktop-to-mobile** app built with **React Native + Expo**. Enjoy the full Chess.com experience on your Android phone with a native dark-themed interface.

<p align="center">
  <img src="assets/icon.png" width="120" alt="Chess.com Mobile Logo"/>
</p>

---

## 📱 Features

| Feature | Description |
|---|---|
| ♟️ **Play Online** | Live chess games against real players |
| 🧩 **Puzzles** | Daily puzzles, Puzzle Rush & Puzzle Battle |
| 📚 **Learn** | Lessons, Analysis Board & Openings Explorer |
| 📺 **Watch** | Live broadcasts & leaderboards |
| 🏆 **Rankings** | Global leaderboards |
| 🔍 **Player Search** | Search any player and view Blitz, Rapid, Bullet & Tactics ratings |
| 💡 **Daily Puzzle** | View today's puzzle with board image and FEN |
| 🔄 **Navigation** | Back, Forward, and Reload controls |
| 🌙 **Dark Theme** | Beautiful Chess.com dark theme (`#161512`) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An [Expo account](https://expo.dev/signup) (free)

### Installation

```bash
# Clone the repo
git clone https://github.com/prakashtamil241/chess-com-mobile.git
cd chess-com-mobile

# Install dependencies
npm install
```

### Run on your phone (Expo Go)

```bash
npx expo start
```
Then scan the QR code with the **Expo Go** app on your Android phone.

---

## 📦 Build APK

Build a standalone Android APK using EAS Build (Expo's cloud build service):

```bash
# Login to Expo
npx eas-cli login

# Build APK
npx eas-cli build -p android --profile preview
```

After ~10 minutes, you'll get a **download link** for the APK. Install it directly on your Android phone.

---

## 🗂️ Project Structure

```
chess-com-mobile/
├── App.js                  # Root app — bottom tab navigator (5 tabs)
├── src/
│   └── ChessWebView.js     # WebView + header + player search + daily puzzle modals
├── assets/
│   ├── icon.png            # App icon
│   ├── splash-icon.png     # Splash screen
│   └── ...
├── app.json                # Expo project config
├── eas.json                # EAS build profiles (preview APK / production AAB)
└── package.json            # Dependencies
```

---

## 🛠️ Tech Stack

- **[React Native](https://reactnative.dev/)** — Cross-platform mobile framework
- **[Expo](https://expo.dev/)** — Build & deployment toolchain
- **[react-native-webview](https://github.com/react-native-webview/react-native-webview)** — WebView component
- **[@react-navigation/bottom-tabs](https://reactnavigation.org/)** — Bottom tab navigation
- **[Chess.com Public API](https://www.chess.com/news/view/published-data-api)** — Player stats & daily puzzle

---

## 📡 Chess.com API Used

| Endpoint | Used For |
|---|---|
| `GET /pub/player/{username}` | Player profile (name, avatar, title) |
| `GET /pub/player/{username}/stats` | Ratings (Blitz, Rapid, Bullet, Tactics) |
| `GET /pub/puzzle` | Today's daily puzzle |

---

## 📲 Install APK on Android

1. Download the APK from the EAS build link
2. Transfer to phone via WhatsApp / Telegram / USB
3. Open the APK on your phone
4. If prompted → **Settings → Allow Unknown Sources → Install**

---

## 🙌 Author

Made by **[prakashtamil241](https://github.com/prakashtamil241)**

Built from scratch with ❤️ using React Native + Expo.

---

## ⭐ Show your support

If you like this project, give it a **star** ⭐ on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/prakashtamil241/chess-com-mobile?style=social)](https://github.com/prakashtamil241/chess-com-mobile)
