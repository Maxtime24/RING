# Health Monitoring App 🏥

A comprehensive health monitoring application built with Expo and React Native, featuring real-time health metrics tracking across multiple dimensions.

## 🏥 Features

### Dashboard
- **All-in-one overview** of key health metrics
- Quick access to Heart Rate, Oxygen Level, Focus Level, and Sleep Duration
- 24-hour trend charts for each metric
- Visual indicators for current status

### Heart Rate Monitor
- **Real-time heart rate tracking** with current BPM
- 24-hour trends visualization
- Detailed 1-hour breakdown
- Statistics: Current, Average, Max, Min
- Insights about daily heart rate patterns

### Oxygen Saturation Monitor
- **Blood oxygen level tracking** (SpO2 percentage)
- Comprehensive oxygen saturation ranges
- Alert system with visual indicators
- 24-hour and 1-hour detailed charts

### Focus Monitor
- **Concentration level tracking** throughout the day
- Peak focus time identification
- Time-based focus patterns
- Daily focus insights and recommendations

### Sleep Quality Monitor
- **Sleep duration and quality tracking**
- Weekly and monthly trend views
- Sleep stage breakdown
- Weekly overview of sleep quality

## 🎨 Design Features

- **Modern UI** with teal/blue gradient theme
- **Color-coded metrics** for easy identification
- **Responsive design** optimized for mobile devices
- **Bottom tab navigation** for easy access
- **Interactive charts** with smooth animations

## 🛠 Technologies Used

- **Expo** - React Native framework
- **React Native** - JavaScript framework
- **Expo Router** - File-based routing
- **React Navigation** - Bottom tabs navigation
- **React Native Chart Kit** - Chart visualization
- **Expo Linear Gradient** - Gradient backgrounds
- **TypeScript** - Type-safe development

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional: `npm install -g expo-cli`)

### Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## 📱 Running on Different Platforms

### Web
```bash
npm run web
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## 📂 Project Structure

```
huck/
├── app/
│   ├── _layout.tsx          # Main layout with tab navigation
│   ├── index.tsx            # Dashboard screen
│   ├── heart.tsx            # Heart rate monitor screen
│   ├── oxygen.tsx           # Oxygen saturation screen
│   ├── focus.tsx            # Focus monitor screen
│   └── sleep.tsx            # Sleep quality screen
├── components/
│   ├── MetricCard.tsx       # Individual metric display card
│   ├── MiniChart.tsx        # Small chart for dashboard
│   ├── DetailChart.tsx      # Large chart for detail screens
│   └── StatisticsGrid.tsx   # Statistics display grid
├── app-example/             # Example starter code (can be removed)
└── assets/                  # Images and icons
```

## 🎯 App Screens

### Dashboard (Home)
Main entry point showing all health metrics with mini charts and quick status indicators.

### Heart Rate
Detailed heart rate analysis with 24-hour and 1-hour views.

### Oxygen Saturation
Blood oxygen level monitoring with alert system and ranges.

### Focus
Concentration level tracking with peak time identification.

### Sleep Quality
Sleep analysis with stage breakdown and weekly overview.

## 🎨 Color Palette

- Primary/Header: Teal (#0d9488)
- Heart Rate: Red (#ef4444)
- Oxygen: Blue (#3b82f6)
- Focus: Amber (#f59e0b)
- Sleep: Purple (#8b5cf6)

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Run in web browser
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run lint` - Run ESLint

## 🚀 Future Enhancements

- Real health data integration (HealthKit, Health Connect)
- User authentication and accounts
- Data persistence with local storage
- Cloud synchronization
- Push notifications for health alerts
- Wearable device integration

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Monitoring! 🏥💚**
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
