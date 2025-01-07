import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import axios from 'axios';
import AuthTokenService from '../AuthTokenService';

const AccountScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenApi, setTokenApi] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const handleChangePassword = async () => {
      if (newPassword !== confirmPassword) {
        alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }

      // Kiểm tra mật khẩu mới có trùng mật khẩu cũ không
      if (newPassword === currentPassword) {
          alert("Mật khẩu mới không được trùng mật khẩu cũ!");
          return;
      }

      try {
          // Gọi API đổi mật khẩu
          const response = await axios.post('http://10.0.2.2:8080/api/change-password', {
              email: email, // Thêm email của người dùng
              currentPassword: currentPassword, // Mật khẩu cũ
              newPassword: newPassword // Mật khẩu mới
          }, {
              headers: {
                  'Authorization': `Bearer ${tokenApi}` // Thêm token vào header của yêu cầu
              }
          });
          console.log(response);
          // Nếu đổi mật khẩu thành công
          if (response.status === 200) {
              alert('Mật khẩu đã được thay đổi thành công!');
              setModalVisible(false); // Đóng popup sau khi đổi mật khẩu thành công
              navigation.replace("Signin");
          }
      } catch (error) {
          // Nếu có lỗi xảy ra khi gọi API
          //console.error("Đã xảy ra lỗi khi đổi mật khẩu: ", error);
          alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
  };

  const handleLogout = () => {
    console.log("Logged out");
    navigation.replace("Signin"); // Điều hướng về màn hình đăng nhập
  };


   useEffect(() => {
       const fetchAndParseToken = async () => {
         const token = await AuthTokenService.getToken();
         setTokenApi(token);
         if (token) {
           const userInfo = AuthTokenService.decodeTokenManually(token);
           console.log(userInfo);
           setEmail(userInfo.email);
           setName(userInfo.name);
           setAddress(userInfo.address);
           setPhone(userInfo.phone);
         } else {
           console.warn('No token found.');
         }
       };

       if (!tokenApi) {
         fetchAndParseToken();
       }

     }, [tokenApi]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Số điện thoại:</Text>
        <Text style={styles.value}>{phone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Địa chỉ:</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      {/* Nút Đổi mật khẩu */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      {/* Nút Đăng xuất */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Popup Đổi mật khẩu */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu hiện tại"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Lưu mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#FF3D00",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#888",
  },
});

export default AccountScreen;
