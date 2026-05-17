## 🎨 Customization Guide

### Changing Colors

Colors are defined in each screen file. Here are the current color scheme:

**Dashboard (_layout.tsx):**
```typescript
headerStyle: styles.header,  // Change header color here
```

**Each Screen Header (heart.tsx, oxygen.tsx, etc.):**
```typescript
<LinearGradient
  colors={['#ef4444', '#f87171']}  // Change gradient colors
  ...
>
```

**Color Reference:**
```
Red (Heart):     #ef4444, #f87171
Blue (Oxygen):   #3b82f6, #60a5fa
Amber (Focus):   #f59e0b, #fbbf24
Purple (Sleep):  #8b5cf6, #a78bfa
Teal (Primary):  #0d9488, #14b8a6
```

---

### Modifying Mock Data

Each screen generates mock data in its component. To customize:

**Heart Rate (heart.tsx):**
```typescript
// Change current value
<Text style={styles.currentValue}>72</Text>

// Modify chart data generation
const data24h = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 60 + Math.sin(i / 4) * 20 + Math.random() * 10,  // Adjust range
}));
```

**Statistics Values:**
```typescript
const stats = [
  { label: 'Current', value: '72', unit: 'bpm' },
  { label: 'Average', value: '68', unit: 'bpm' },
  // Edit these values
];
```

---

### Adding Real Health Data

1. **Install Health API Library:**
   ```bash
   npm install expo-health
   ```

2. **Create a Data Service (services/healthService.ts):**
   ```typescript
   import * as Health from 'expo-health';

   export async function getHeartRateData() {
     const today = new Date();
     const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
     
     const heartRate = await Health.getHeartRateSamples({
       startDate: yesterday,
       endDate: today,
     });
     
     return heartRate;
   }
   ```

3. **Use in Component:**
   ```typescript
   import { getHeartRateData } from '../services/healthService';
   
   useEffect(() => {
     getHeartRateData().then(data => {
       setChartData(data);
     });
   }, []);
   ```

---

### Changing Chart Styles

**Chart Configuration (components/DetailChart.tsx):**
```typescript
chartConfig={{
  backgroundColor: '#fff',  // Chart background
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.1})`,  // Grid color
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,  // Text color
}}
```

---

### Modifying Typography

Text sizes are defined in `StyleSheet.create()`:

```typescript
headerTitle: {
  fontSize: 24,  // Change size
  fontWeight: '700',  // Bold levels: 400, 500, 600, 700
  color: '#fff',  // Color
},
```

**Common Font Weights:**
- 400: Normal
- 500: Medium
- 600: Semi-bold
- 700: Bold

---

### Customizing Layout

**Card Padding (MetricCard.tsx):**
```typescript
padding: 16,  // Increase/decrease space inside cards
```

**Gap Between Items:**
```typescript
gap: 12,  // Space between cards/items
```

**Border Radius (roundness):**
```typescript
borderRadius: 12,  // Higher = more rounded
```

---

### Adding New Screens

1. **Create new file (app/newscreen.tsx):**
   ```typescript
   export default function NewScreen() {
     return (
       // Your content
     );
   }
   ```

2. **Add to Navigation (_layout.tsx):**
   ```typescript
   <Tabs.Screen
     name="newscreen"
     options={{
       title: 'New Screen',
       tabBarIcon: ({ color }) => (
         <MaterialCommunityIcons name="heart" size={24} color={color} />
       ),
     }}
   />
   ```

---

### Changing Tab Icons

Available icons from `@expo/vector-icons`:
- `heart` - Heart
- `heart-pulse` - Heart with pulse
- `lung` - Lungs
- `brain` - Brain
- `moon-waning-crescent` - Moon
- `home` - Home
- `chart-line` - Chart
- `activity` - Activity
- `target` - Target

Find more at: https://icons.expo.fyi/

---

### Styling Buttons

**Button Style in TimeRangeSelector:**
```typescript
timeButton: {
  paddingVertical: 10,    // Vertical padding
  paddingHorizontal: 16,  // Horizontal padding
  backgroundColor: '#e5e7eb',  // Color when inactive
  borderRadius: 8,  // Roundness
},
```

---

### Dark Mode Support

To add dark mode, wrap components:
```typescript
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

// Use conditionally
backgroundColor: isDark ? '#1f2937' : '#f9fafb'
```

---

### Responsive Design

**Get Screen Width:**
```typescript
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
```

**Responsive Sizes:**
```typescript
fontSize: width < 400 ? 16 : 18,  // Smaller on small phones
```

---

### Adding Animations

Install Reanimated (already included):
```typescript
import Animated, { 
  FadeIn, 
  BounceInRight 
} from 'react-native-reanimated';

<Animated.View entering={FadeIn}>
  {/* Content */}
</Animated.View>
```

---

### Performance Tips

1. **Use `React.memo()` for components:**
   ```typescript
   export default React.memo(function MetricCard(props) {
     // Component
   });
   ```

2. **Optimize re-renders with `useMemo`:**
   ```typescript
   const chartData = useMemo(() => generateData(), [deps]);
   ```

3. **Use FlatList for long lists:**
   ```typescript
   <FlatList data={items} renderItem={renderItem} keyExtractor={key} />
   ```

---

### Testing

To test changes:
1. Save file - auto hot reload in Expo
2. Check console for errors
3. Use React DevTools (optional)
4. Test on physical device if possible

---

**Need Help?** Check the Expo documentation or modify components gradually!
