import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PostCard } from "../../components/PostCard";
import { supabase } from "../../config/supabase";
import { useAuthStore } from "../../store/authStore";
import { Post } from "../../types";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserPosts = async () => {
    if (!user) return;

    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const postIds = postsData?.map((p) => p.id) || [];

      const { data: likesData, error: likesError } = await supabase
        .from("likes")
        .select("post_id, user_id")
        .in("post_id", postIds.length > 0 ? postIds : [""]);

      if (likesError) throw likesError;

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("post_id")
        .in("post_id", postIds.length > 0 ? postIds : [""]);

      if (commentsError) throw commentsError;

      const likesCountMap = new Map<string, number>();
      const commentsCountMap = new Map<string, number>();
      const userLikedMap = new Set<string>();

      likesData?.forEach((like) => {
        likesCountMap.set(
          like.post_id,
          (likesCountMap.get(like.post_id) || 0) + 1
        );
        if (like.user_id === user.id) {
          userLikedMap.add(like.post_id);
        }
      });

      commentsData?.forEach((comment) => {
        commentsCountMap.set(
          comment.post_id,
          (commentsCountMap.get(comment.post_id) || 0) + 1
        );
      });

      const formattedPosts: Post[] = (postsData || []).map((post) => ({
        id: post.id,
        user_id: post.user_id,
        user_name: post.user_name,
        user_email: post.user_email,
        content: post.content,
        image_url: post.image_url,
        likes_count: likesCountMap.get(post.id) || 0,
        comments_count: commentsCountMap.get(post.id) || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user_liked: userLikedMap.has(post.id),
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserPosts();
    }, [user])
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user_posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUserPosts();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => {
          fetchUserPosts();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => {
          fetchUserPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserPosts();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.display_name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.display_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
      </View>

      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>My Posts</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onUpdate={fetchUserPosts} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't posted anything yet.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(tabs)/create")}
            >
              <Text style={styles.createButtonText}>
                Create Your First Post
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#6366f1",
    padding: 16,
    paddingTop: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileHeader: {
    backgroundColor: "#ffffff",
    paddingTop: 80,
    paddingBottom: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    position: "relative", // needed for logout absolute positioning
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  logoutButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  postsSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  listContent: {
    padding: 12,
  },
  emptyContainer: {
    padding: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
