import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import ChessWebView from './src/ChessWebView';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Play',    url: 'https://www.chess.com/play/online',  icon: '♟️' },
  { name: 'Puzzles', url: 'https://www.chess.com/puzzles',       icon: '🧩' },
  { name: 'Learn',   url: 'https://www.chess.com/lessons',       icon: '📚' },
  { name: 'Watch',   url: 'https://www.chess.com/watch',         icon: '📺' },
  { name: 'Ranks',   url: 'https://www.chess.com/leaderboards',  icon: '🏆' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#21201d" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#21201d',
              borderTopColor: '#383531',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 6,
              paddingTop: 4,
            },
            tabBarActiveTintColor: '#81b64c',
            tabBarInactiveTintColor: '#bababa',
            tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
            tabBarIcon: () => {
              const tab = TABS.find(t => t.name === route.name);
              return <Text style={{ fontSize: 18 }}>{tab?.icon}</Text>;
            },
          })}
        >
          {TABS.map(tab => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              children={() => <ChessWebView initialUrl={tab.url} />}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
