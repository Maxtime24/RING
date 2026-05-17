## 🎯 App Architecture & Navigation Flow

### Navigation Structure

```
┌─────────────────────────────────────┐
│   App (_layout.tsx)                 │
│   └─ Bottom Tab Navigation          │
└─────────────────────────────────────┘
         ↓
    ┌────┬────┬────┬────┬────┐
    ↓    ↓    ↓    ↓    ↓
  [🏠]  [❤️]  [💨]  [🧠]  [😴]
  Home Heart  O2  Focus Sleep
```

---

## 📊 Component Hierarchy

```
App (_layout.tsx)
│
├── Dashboard (index.tsx)
│   ├── LinearGradient (Header)
│   ├── MetricCard × 4
│   │   ├── LinearGradient (Background)
│   │   ├── Icon
│   │   ├── Value
│   │   └── Status
│   └── MiniChart × 4
│       └── LineChart
│
├── Heart Rate (heart.tsx)
│   ├── LinearGradient (Header)
│   ├── StatisticsGrid
│   │   └── StatCard × 4
│   ├── Time Range Buttons
│   ├── DetailChart
│   │   └── LineChart
│   └── Insights Box
│
├── Oxygen (oxygen.tsx)
│   ├── LinearGradient (Header)
│   ├── Alert Box
│   ├── StatisticsGrid
│   ├── Time Range Buttons
│   ├── DetailChart
│   └── Range Info Cards
│
├── Focus (focus.tsx)
│   ├── LinearGradient (Header)
│   ├── Tips Box
│   ├── StatisticsGrid
│   ├── Time Range Buttons
│   ├── DetailChart
│   ├── Focus Patterns
│   └── Tips Container
│
└── Sleep (sleep.tsx)
    ├── LinearGradient (Header)
    ├── Quality Box
    ├── StatisticsGrid
    ├── Time Range Buttons
    ├── DetailChart
    ├── Sleep Stages
    └── Weekly Overview
```

---

## 🔄 Data Flow

```
┌──────────────────────┐
│   Mock Data Gen      │
│  (generateData())    │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  Component State     │
│  (useEffect, etc)    │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  Component Render    │
│  (JSX/TSX)          │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  Charts & Display    │
│  (LineChart, etc)    │
└──────────────────────┘
         ↓
┌──────────────────────┐
│   User Sees App      │
└──────────────────────┘
```

---

## 📐 Screen Layout Pattern

```
All Detail Screens Follow This Pattern:

┌─────────────────────────────────┐
│     Gradient Header             │  LinearGradient
│     [Current Value Display]     │  Font: 48px
│     [Status Text]               │  White text
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Optional Alert/Tips Box       │  Info box
│   (Optional)                    │  With icon
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│     Statistics Grid             │  2-column grid
│   ┌──────┐  ┌──────┐           │
│   │ Stat │  │ Stat │           │
│   └──────┘  └──────┘           │
│   ┌──────┐  ┌──────┐           │
│   │ Stat │  │ Stat │           │
│   └──────┘  └──────┘           │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  Time Range Selector Buttons    │  2 buttons
│   [24h/1h] or [Week/Month]     │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│       Detail Chart              │  LineChart
│    (24-hour or 1-hour)         │  Height: 280px
│                                 │
│  ─────────────────────────     │
│    /  \   /  \   /  \         │
│   /    \ /    \ /    \        │
│  /      ╱      ╲      \       │
│                                 │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Additional Content            │  Info boxes,
│   (Insights, Ranges, Patterns)  │  Lists, etc
└─────────────────────────────────┘
```

---

## 🎨 Styling System

### Colors (Tailwind-inspired)

```
Primary Palette:
├── Teal
│   ├── Light: #d1fae5
│   ├── Main:  #0d9488
│   └── Dark:  #047857
│
├── Red (Heart Rate)
│   ├── Light: #fecaca
│   ├── Main:  #ef4444
│   └── Dark:  #dc2626
│
├── Blue (Oxygen)
│   ├── Light: #bfdbfe
│   ├── Main:  #3b82f6
│   └── Dark:  #1d4ed8
│
├── Amber (Focus)
│   ├── Light: #fed7aa
│   ├── Main:  #f59e0b
│   └── Dark:  #d97706
│
└── Purple (Sleep)
    ├── Light: #e9d5ff
    ├── Main:  #8b5cf6
    └── Dark:  #7c3aed

Neutral:
├── Gray-100: #f9fafb (Background)
├── Gray-300: #d1d5db (Borders)
├── Gray-500: #6b7280 (Secondary text)
└── Gray-900: #111827 (Primary text)
```

### Typography

```
Headlines:
├── Header Title: 24px, weight 700
├── Section Title: 18px, weight 600
├── Card Title: 14px, weight 600
└── Label: 12px, weight 500

Body:
├── Body Large: 16px, weight 400
├── Body Normal: 14px, weight 400
└── Caption: 12px, weight 400
```

### Spacing (8px base unit)

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
2xl: 24px
```

---

## 📱 Breakpoints (Responsive)

```
Mobile:  320px - 480px ✅ Optimized
Tablet:  481px - 768px  (supported)
Desktop: 769px+         (supported)
```

---

## 🔌 Component Props

### MetricCard Props
```typescript
{
  title: string,           // "Heart Rate"
  value: number,          // 72
  unit: string,           // "bpm"
  status: string,         // "Normal"
  color: string,          // "#ef4444"
  icon: string,           // "heart-pulse"
}
```

### MiniChart Props
```typescript
{
  title: string,                    // "Heart Rate"
  data: Array<{time, value}>,      // Chart data
  color: string,                   // "#ef4444"
}
```

### DetailChart Props
```typescript
{
  data: Array<{time, value, id}>,  // Chart data
  color: string,                   // "#ef4444"
  height?: number,                 // 280
}
```

### StatisticsGrid Props
```typescript
{
  stats: Array<{label, value, unit}>,  // Stats to display
}
```

---

## 🔄 State Management Pattern

### Local State (useState)
```typescript
const [timeRange, setTimeRange] = useState<'24h' | '1h'>('24h');
const [data, setData] = useState([]);
```

### Conditional Rendering
```typescript
chartData = timeRange === '24h' ? data24h : data1h;
```

### Event Handling
```typescript
onPress={() => setTimeRange('1h')}
```

---

## ⚡ Performance Optimization

### Memoization
```typescript
React.memo(Component)  // Prevent unnecessary re-renders
useMemo()             // Memoize expensive calculations
useCallback()         // Memoize callbacks
```

### Lazy Loading (Future)
```typescript
const LazyComponent = lazy(() => import('./Component'));
```

---

## 📡 API Integration Points

For future real data:

```
┌────────────────────────┐
│   Health API           │
│   (HealthKit/HC)       │
└────────────────────────┘
           ↓
┌────────────────────────┐
│   Service Layer        │
│   (healthService.ts)   │
└────────────────────────┘
           ↓
┌────────────────────────┐
│   Custom Hooks         │
│   (useHeartRate, etc)  │
└────────────────────────┘
           ↓
┌────────────────────────┐
│   Screen Components    │
│   (Display data)       │
└────────────────────────┘
```

---

## 🧪 Testing Points

1. **Navigation** - All tabs work
2. **Charts** - Display correctly
3. **Time toggles** - Switch views
4. **Responsiveness** - Various screen sizes
5. **Mock data** - Realistic values
6. **Scroll** - No layout issues

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Easy to maintain and extend
- ✅ Reusable components
- ✅ Scalable structure
- ✅ Type safety with TypeScript
