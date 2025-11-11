import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../config/supabase";
import { useAuthStore } from "../store/authStore";
import { Comment, Post } from "../types";
import { formatNumber, formatTimestamp } from "../utils/helpers";

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
}

const { width } = Dimensions.get("window");

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(post.user_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: user.id,
        });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      onUpdate?.();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    try {
      const { error } = await supabase.from("comments").insert({
        post_id: post.id,
        user_id: user.id,
        user_name: user.display_name,
        content: commentText.trim(),
      });

      if (error) throw error;

      setCommentText("");
      setCommentsCount((prev) => prev + 1);
      fetchComments();
      onUpdate?.();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleShowComments = () => {
    setShowComments(true);
    fetchComments();
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.user_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{post.user_name}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(post.created_at)}
            </Text>
          </View>
        </View>

        {post.image_url && (
          <Image
            source={{ uri: post.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <Text style={styles.contentText}>{post.content}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#ed4956" : "#262626"}
            />
            <Text style={styles.actionText}>{formatNumber(likesCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShowComments}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#262626" />
            <Text style={styles.actionText}>{formatNumber(commentsCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#262626" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showComments}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>
                    {item.user_name
                      ? item.user_name.charAt(0).toUpperCase()
                      : "?"}
                  </Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentUserName}>
                    {item.user_name || "Unknown"}
                  </Text>

                  <Text style={styles.commentText}>{item.content}</Text>
                  <Text style={styles.commentTimestamp}>
                    {formatTimestamp(item.created_at)}
                  </Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <Text style={styles.emptyCommentsText}>
                  {loadingComments
                    ? "Loading..."
                    : "No comments yet. Be the first!"}
                </Text>
              </View>
            }
          />

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: "#f3f4f6",
  },
  content: {
    padding: 12,
  },
  contentText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    color: "#262626",
    fontWeight: "600",
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#6366f1",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  closeButton: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  emptyComments: {
    padding: 48,
    alignItems: "center",
  },
  emptyCommentsText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
