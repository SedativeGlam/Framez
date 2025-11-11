import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PostCard } from "../../components/PostCard";
import { supabase } from "../../config/supabase";
import { useAuthStore } from "../../store/authStore";
import { Post } from "../../types";

export default function Feed() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const postIds = postsData?.map((p) => p.id) || [];
      const { data: likesData, error: likesError } = await supabase
        .from("likes")
        .select("post_id, user_id");

      if (likesError) throw likesError;

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("post_id");

      if (commentsError) throw commentsError;

      const likesCountMap = new Map<string, number>();
      const commentsCountMap = new Map<string, number>();
      const userLikedMap = new Set<string>();

      likesData?.forEach((like) => {
        likesCountMap.set(
          like.post_id,
          (likesCountMap.get(like.post_id) || 0) + 1
        );
        if (like.user_id === user?.id) {
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
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          fetchPosts();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => {
          fetchPosts();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (loading) {
    return <LoadingSpinner message="Loading feed..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 Framez</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onUpdate={fetchPosts} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No posts yet. Be the first to share!
            </Text>
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
  },
});
