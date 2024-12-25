import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Import the useAuth hook
import AuthTokenService from '../AuthTokenService';
const SignIn = () => {
  const { updateAuthentication } = useAuth(); // Access the updateAuthentication function from the AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleGoToSignup = () => {
    navigation.navigate("Signup");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to validate email format
  const validateEmail = (email) => {
    // Regular expression for a valid email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const apiEndpoint =
    "http://10.0.2.2:8080/api/login";

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    // Client-side email validation
    if (!validateEmail(email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error message
    //updateAuthentication(true);
    //navigation.navigate("Home");

    try {
      const response = await axios.post(apiEndpoint, {
        email,
        password,
      });

     if (response.status === 200) {
      // Login successful
        console.log(response.data.token);
        Alert.alert("Thành công", "Đăng nhập thành công!");
        await AuthTokenService.saveToken(response.data.token);
        updateAuthentication(true);
        navigation.navigate("Main");
        //navigation.navigate("Home");
      } else if (response.status === 401) {
        //setError("Email hoặc mật khẩu không đúng.");
        Alert.alert("Thất bại", "Email hoặc mật khẩu không đúng.");
      }else{
        Alert.alert("Thất bại", "Email hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      Alert.alert("Thất bại", "Email hoặc mật khẩu không đúng.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Đăng nhập</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={togglePasswordVisibility}
            >
              <Icon
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <CustomButton
            title={loading ? "Đăng nhập..." : "Đăng nhập"}
            onPress={handleSignIn}
            disabled={loading}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00b894" />
            </View>
          )}
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity onPress={handleGoToSignup} style={styles.link}>
            <Text style={styles.linkText}>Bạn chưa có tài khoản? Đăng kí</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#56428F",
  },
  input: {
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    padding: 3,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  passwordVisibilityButton: {
    padding: 10,
  },
  link: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    color: "#56428F",
    fontSize: 16,
  },
});

export default SignIn;
