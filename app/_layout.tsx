import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { supabase } from "../config/supabase";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser({
                id: data.id,
                email: data.email,
                display_name: data.display_name,
                avatar_url: data.avatar_url,
                created_at: data.created_at,
              });
            } else {
              setLoading(false);
            }
          });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setUser({
            id: data.id,
            email: data.email,
            display_name: data.display_name,
            avatar_url: data.avatar_url,
            created_at: data.created_at,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
