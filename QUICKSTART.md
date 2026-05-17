## 🚀 Quick Start Guide - Health Monitoring App

Your Expo Health Monitoring App is ready to run! Follow these steps:

### 1️⃣ Install Dependencies
```bash
cd c:\Users\Dyeie\Desktop\Ring\huck
npm install
```

### 2️⃣ Start Development Server
```bash
npm start
```

### 3️⃣ Choose Platform to Run

**Web Browser (Recommended for first test):**
- Press `w` in terminal
- App opens at http://localhost:19006 (or similar)

**iOS Simulator:**
- Press `i` in terminal
- Requires Xcode installed
- Device: iPhone

**Android Emulator:**
- Press `a` in terminal
- Requires Android Studio
- Device: Android phone/tablet

**Expo Go App (Physical Device):**
- Press `e` in terminal
- Scan QR code with Expo Go app
- Download Expo Go: https://expo.dev/go

---

## 📱 App Features at a Glance

| Screen | Features |
|--------|----------|
| 🏠 **Dashboard** | All metrics overview, 24h mini charts |
| ❤️ **Heart Rate** | BPM tracking, 24h/1h views, stats |
| 💨 **Oxygen** | SpO2 monitoring, alert system, ranges |
| 🧠 **Focus** | Concentration tracking, peak times |
| 😴 **Sleep** | Duration, stages, weekly overview |

---

## 🎨 Color Theme

- 🟢 **Teal (Primary):** Navigation & headers
- ❤️ **Red:** Heart rate data
- 🔵 **Blue:** Oxygen saturation
- 🟠 **Amber:** Focus levels
- 🟣 **Purple:** Sleep quality

---

## 📝 Project Structure

```
app/                    # All app screens
  ├─ _layout.tsx       # Navigation setup
  ├─ index.tsx         # Dashboard
  ├─ heart.tsx         # Heart rate
  ├─ oxygen.tsx        # Oxygen saturation
  ├─ focus.tsx         # Focus monitor
  └─ sleep.tsx         # Sleep quality

components/            # Reusable components
  ├─ MetricCard.tsx    # Individual metric card
  ├─ MiniChart.tsx     # Dashboard mini charts
  ├─ DetailChart.tsx   # Large detail charts
  └─ StatisticsGrid.tsx # Stats display
```

---

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server |
| `npm run web` | Run in web browser |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run lint` | Check code quality |

---

## 💡 Tips

1. **First time?** Start with `npm start` then press `w` for web
2. **Hot reload** works - changes appear instantly
3. **Check console** for any errors or warnings
4. **Mock data** is realistic but simulated
5. **Mobile first** - app is optimized for phones

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm start -- --tunnel
```

**Dependencies issues?**
```bash
npm install --force
```

**Clear cache and restart:**
```bash
npm start -- -c
```

---

## 📚 Learn More

- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Expo Router: https://docs.expo.dev/router/introduction/

---

**Ready? Run `npm start` and enjoy! 🚀**
