import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)/feed");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LoadingSpinner message="Loading Framez..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
