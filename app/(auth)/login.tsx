// import { Stack, useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { supabase } from "../../config/supabase";
// import { validateEmail, validatePassword } from "../../utils/helpers";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!validateEmail(email)) {
//       Alert.alert("Invalid Email", "Please enter a valid email address.");
//       return;
//     }

//     if (!validatePassword(password)) {
//       Alert.alert(
//         "Invalid Password",
//         "Password must be at least 6 characters."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;
//       router.replace("/(tabs)/feed");
//     } catch (error: any) {
//       Alert.alert("Login Failed", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <Stack.Screen options={{ headerShown: false }} />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <Text style={styles.logo}>📱</Text>
//           <Text style={styles.title}>Framez</Text>
//           <Text style={styles.subtitle}>Share your moments</Text>
//         </View>

//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoComplete="email"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               autoCapitalize="none"
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? "Signing in..." : "Sign In"}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
//               <Text style={styles.linkText}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 24,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 48,
//   },
//   logo: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#1f2937",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//   },
//   form: {
//     width: "100%",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "#f9fafb",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: "#1f2937",
//   },
//   button: {
//     backgroundColor: "#6366f1",
//     borderRadius: 12,
//     padding: 16,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   linkText: {
//     fontSize: 14,
//     color: "#6366f1",
//     fontWeight: "600",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../config/supabase";
import { validateEmail, validatePassword } from "../../utils/helpers";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.replace("/(tabs)/feed");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>📱</Text>
          <Text style={styles.title}>Framez</Text>
          <Text style={styles.subtitle}>Share your moments</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    paddingRight: 48, // space for eye icon
    fontSize: 16,
    color: "#1f2937",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
});
