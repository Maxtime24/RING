import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../src/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        headerStyle: styles.header,
        headerTintColor: COLORS.text,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
          headerTitle: '스마트링 대시보드',
        }}
      />
      <Tabs.Screen
        name="heart"
        options={{
          title: '심박수',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart-pulse" size={24} color={color} />
          ),
          headerTitle: '심박수 리포트',
        }}
      />
      <Tabs.Screen
        name="oxygen"
        options={{
          title: '산소도',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="lungs" size={24} color={color} />
          ),
          headerTitle: '혈중 산소도',
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: '집중도',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="brain" size={24} color={color} />
          ),
          headerTitle: '집중도 리포트',
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: '수면',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="moon-waning-crescent" size={24} color={color} />
          ),
          headerTitle: '수면 리포트',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 80,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    paddingTop: 10,
  },
  header: {
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});

