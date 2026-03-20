import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  /**
   * In development, Metro reload (`r`) re-executes JS but Expo Router can keep the
   * last URL, so you stay on e.g. /categories instead of the landing screen.
   * Reset to `/` once after load so reload always starts from the first page.
   * (Production is unchanged: __DEV__ is false.)
   */
  useEffect(() => {
    if (!__DEV__) return;
    const id = requestAnimationFrame(() => {
      router.replace('/');
    });
    return () => cancelAnimationFrame(id);
  }, [router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="section-select" />
        <Stack.Screen name="question-setup" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="results" />
      </Stack>
    </>
  );
}
