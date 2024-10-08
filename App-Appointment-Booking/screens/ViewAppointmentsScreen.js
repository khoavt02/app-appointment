import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
const ViewAppointmentsScreen = () => {
  const [patientBookings, setPatientBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  // Dữ liệu giả từ JSON của bạn
  const fetchPatientBookings = async () => {
    setLoading(true);
    try {
      let response = await axios.get(`http://10.0.2.2:8080/api/patient/get-list-booking/${searchText}`);

      if (response.data.status === 1) {
        setPatientBookings(response.data.patientBookings);
      } else {
        alert('Không tìm thấy kết quả.');
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi trong quá trình lấy dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm render cho mỗi mục trong danh sách
  const renderItem = ({ item }) => {
    // Xác định trạng thái dựa trên statusId
    let statusColor, statusText;

    if (item.statusId === 1) {
      statusColor = '#27ae60';  // Màu cho 'Đã xác nhận'
      statusText = 'Đã xác nhận';
    } else if (item.statusId === 2) {
      statusColor = '#e74c3c';  // Màu cho 'Đã hủy'
      statusText = 'Đã hủy';
    } else {
      statusColor = '#e67e22';  // Màu cho 'Chờ xác nhận'
      statusText = 'Chờ xác nhận';
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.patientName}>Họ và tên: {item.name}</Text>
        <Text style={styles.dateBooking}>Ngày hẹn: {item.dateBooking}</Text>
        <Text style={styles.timeBooking}>Thời gian: {item.timeBooking}</Text>
        <Text style={styles.doctorName}>Bác sĩ: {item.User.name}</Text>
        <Text style={styles.address}>Địa chỉ: {item.User.address}</Text>
        <Text style={[styles.status, { color: statusColor }]}>
          Trạng thái: {statusText}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập email hoặc số điện thoại"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button color="#00b894" style={styles.searchButton} title="Tìm kiếm" onPress={fetchPatientBookings} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={patientBookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

// Các style cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateBooking: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  timeBooking: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2c3e50',
  },
  address: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ViewAppointmentsScreen;

