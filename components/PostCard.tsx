// import React from "react";
// import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
// import { Post } from "../types";
// import { formatTimestamp } from "../utils/helpers";

// interface PostCardProps {
//   post: Post;
// }

// const { width } = Dimensions.get("window");

// export const PostCard: React.FC<PostCardProps> = ({ post }) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>
//             {post.user_name.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//         <View style={styles.userInfo}>
//           <Text style={styles.userName}>{post.user_name}</Text>
//           <Text style={styles.timestamp}>
//             {formatTimestamp(post.created_at)}
//           </Text>
//         </View>
//       </View>

//       {post.image_url && (
//         <Image
//           source={{ uri: post.image_url }}
//           style={styles.image}
//           resizeMode="cover"
//         />
//       )}

//       <View style={styles.content}>
//         <Text style={styles.contentText}>{post.content}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#ffffff",
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#6366f1",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   avatarText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   userInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1f2937",
//   },
//   timestamp: {
//     fontSize: 12,
//     color: "#9ca3af",
//     marginTop: 2,
//   },
//   image: {
//     width: width,
//     height: width,
//     backgroundColor: "#f3f4f6",
//   },
//   content: {
//     padding: 12,
//   },
//   contentText: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 22,
//   },
// });

import { Ionicons } from "@expo/vector-icons"; // <-- Make sure this is installed
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Post } from "../types";
import { formatTimestamp } from "../utils/helpers";

interface PostCardProps {
  post: Post;
}

const { width } = Dimensions.get("window");

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const handleLike = () => {
    console.log("Liked:", post.id);
  };

  const handleComment = () => {
    console.log("Comment on:", post.id);
  };

  const handleShare = () => {
    console.log("Share:", post.id);
  };

  return (
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

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons name="heart-outline" size={24} color="#374151" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons name="chatbubble-outline" size={24} color="#374151" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#374151" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#374151",
  },
});
