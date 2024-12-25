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
import {Picker} from "@react-native-picker/picker"
const SignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [gender, setGender] = useState("male");
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const apiRegisterEndpoint = "http://10.0.2.2:8080/api/register";
  const apiVerifyOtpEndpoint = "http://10.0.2.2:8080/api/mail-verifycation";

  const handleSignUp = async () => {
    if (!name || !phone || !address || !email || !password || !confirmPassword || !otp) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Vui lòng nhập email đúng định dạng.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Dữ liệu gửi lên API
      const requestData = {
        name,
        phone,
        address,
        email,
        password,
        otpCode: otp, // Đổi tên để khớp với API
        gender: "male", // Bạn có thể thay đổi giá trị này từ form
        description: "", // Thêm mô tả nếu cần
        roleId: 4, // Ví dụ: 2 là vai trò người dùng bình thường
        isActive: 1, // Mặc định là active
      };

      const response = await axios.post(apiRegisterEndpoint, requestData);

      if (response.status === 201) {
        Alert.alert("Thành công", "Đăng kí thành công.");
        //setStep(2); // Chuyển bước tiếp theo nếu có
      } else {
        // Hiển thị thông báo lỗi nếu không tạo được tài khoản
        setError(response.data.message || "Đăng kí thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      // Xử lý lỗi từ server
      if (error.response) {
        setError(error.response.data.message || "Đăng kí thất bại. Vui lòng kiểm tra lại.");
      } else {
        setError("Đăng kí thất bại. Vui lòng kiểm tra lại kết nối.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Vui lòng nhập mã email.");
      return;
    }

    try {
      // Logic to send OTP goes here (API call)
      const response = await axios.post(apiVerifyOtpEndpoint, {
          email
      });
      if (response.status == 200){
        Alert.alert("Thành công", "OTP đã được gửi đến email của bạn và có hiệu lực trong vòng 10 phút.");
      }else{
        Alert.alert("Lỗi","Có lỗi xảy ra. Vui lòng thử lại!")
      }
    } catch (error) {
      setError("Gửi mã OTP thất bại. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Vui lòng nhập mã OTP đã được gửi đến mail của bạn.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(apiVerifyOtpEndpoint, {
        email,
        otp,
      });

      if (response.status === 200) {
        Alert.alert("Thành công", "Xác nhận thành công!");
        navigation.navigate("SignIn");
      } else {
        setError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Xác nhận mã OTP thất bại. Vui lòng kiểm tra lại.");
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
          {step === 1 && (
            <>
              <Text style={styles.title}>Đăng ký tài khoản</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(value) => setGender(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Nam" value="male" />
                    <Picker.Item label="Nữ" value="female" />
                    <Picker.Item label="Khác" value="other" />
                  </Picker>
                </View>
              <TextInput
                style={styles.input}
                placeholder="Điện thoại"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={(text) => setAddress(text)}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOtp}
                >
                  <Text style={styles.buttonText}>Gửi OTP</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                  style={styles.input}
                  placeholder="Nhập OTP"
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                  keyboardType="phone-pad"
                />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholder="Mật khẩu"
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
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={(text) => setConfirmPassword(text)}
                  value={confirmPassword}
                  placeholder="Nhập lại mật khẩu"
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
                title={loading ? "Đang đăng ký..." : "Đăng ký"}
                onPress={handleSignUp}
                disabled={loading}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.title}>Verify OTP</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOtp}
                >
                  <Text style={styles.buttonText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
              <CustomButton
                title={loading ? "Verifying..." : "Verify OTP"}
                onPress={handleVerifyOtp}
                disabled={loading}
              />
            </>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00b894" />
            </View>
          )}
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          {step === 1 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Signin")}
              style={styles.link}
            >
              <Text style={styles.linkText}>
                Bạn đã có tài khoản? Đăng nhập
              </Text>
            </TouchableOpacity>
          )}
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
  button: {
    backgroundColor: "#56428F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
   errorText: {
      color: "red",
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },

    picker: {
      borderColor: "#ccc",
      padding: 8,
      marginVertical: 8,
      borderRadius: 5,
      backgroundColor: "#fff",
      elevation: 5,
    }
  })
  export default SignUp;