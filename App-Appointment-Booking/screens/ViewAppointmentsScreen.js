import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ViewAppointmentsScreen = () => {
  const [patientBookings, setPatientBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null); // Để lưu kết quả chi tiết khám
  const [modalVisible, setModalVisible] = useState(false); // Quản lý trạng thái modal

  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // Quản lý trạng thái của modal đánh giá
  const [feedbackName, setFeedbackName] = useState(''); // Tên người đánh giá
  const [feedbackPhone, setFeedbackPhone] = useState(''); // Số điện thoại người đánh giá
  const [feedbackContent, setFeedbackContent] = useState(''); // Nội dung đánh giá
  const [selectedBooking, setSelectedBooking] = useState(null);
  // Lấy danh sách các lần đặt lịch
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

  // Hàm lấy chi tiết kết quả khám từ API
  const fetchExamDetails = async (patientId, dateBooking, timeBooking) => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/get-detail-patient-exam`, {
        params: {
          patientId,
          dateBooking,
          timeBooking,
        },
      });
      if (response.status === 200) {
        setSelectedExam(response.data); // Lưu kết quả khám vào state
        setModalVisible(true); // Hiển thị modal
      } else {
        alert('Không tìm thấy chi tiết kết quả khám.');
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi lấy chi tiết kết quả khám.');
    }
  };
  const submitFeedback = async () => {
    if (!feedbackPhone || !feedbackContent) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const payload = {
        data: {
          doctorId: selectedBooking.User.id, // Lấy doctorId từ booking hiện tại
          dateBooking: selectedBooking.dateBooking,
          timeBooking: selectedBooking.timeBooking,
          feedbackContent: feedbackContent,
          name: selectedBooking.name,
          feedbackPhone: feedbackPhone,
        },
      };

      const response = await axios.post('http://10.0.2.2:8080/feedback/create', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Đánh giá của bạn đã được gửi.');
        setFeedbackModalVisible(false); // Đóng modal sau khi gửi đánh giá
        // Reset input
        //setFeedbackName('');
        setFeedbackPhone('');
        setFeedbackContent('');
      } else {
        alert('Đã xảy ra lỗi khi gửi đánh giá.');
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi trong quá trình gửi đánh giá.');
    }
  };
  // Hàm render cho mỗi mục trong danh sách
  const renderItem = ({ item }) => {
    let statusColor, statusText;

    if (item.statusId === 1) {
      statusColor = '#27ae60';
      statusText = 'Đã xác nhận';
    } else if (item.statusId === 2) {
      statusColor = '#e74c3c';
      statusText = 'Đã hủy';
    } else {
      statusColor = '#e67e22';
      statusText = 'Chờ xác nhận';
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.patientName}>Họ và tên: {item.name}</Text>
        <Text style={styles.dateBooking}>Ngày hẹn: {item.dateBooking}</Text>
        <Text style={styles.timeBooking}>Thời gian: {item.timeBooking}</Text>
        <Text style={styles.doctorName}>Bác sĩ: {item.User.name}</Text>
        <Text style={styles.address}>Địa chỉ: {item.User.address}</Text>
        <Text style={[styles.status, { color: statusColor }]}>Trạng thái: {statusText}</Text>

        {/* Nút "Xem kết quả" */}
         {item.statusId === 1 && (
            <>
            <TouchableOpacity
                          style={styles.resultButton}
                          onPress={() => fetchExamDetails(item.patientId, item.dateBooking, item.timeBooking)}
                        >
                          <Text style={styles.resultButtonText}>Xem kết quả</Text>
                        </TouchableOpacity>
                        {/* Nút "Đánh giá" */}
                        <TouchableOpacity
                          style={[styles.resultButton, { backgroundColor: '#e67e22', marginTop: 10 }]}
                          onPress={() => {
                            setSelectedBooking(item);
                            setFeedbackModalVisible(true);
                          }}
                        >
                          <Text style={styles.resultButtonText}>Đánh giá</Text>
                        </TouchableOpacity>
           </>
           )}

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
      <Button color="#00b894" title="Tìm kiếm" onPress={fetchPatientBookings} />

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

      {/* Modal hiển thị chi tiết kết quả khám */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExam ? (
              <>
                <Text style={styles.modalTitle}>Chi tiết kết quả khám</Text>
                <Text style={styles.modalText}>Ngày hẹn: {selectedExam.dateBooking}</Text>
                <Text style={styles.modalText}>Thời gian: {selectedExam.timeBooking}</Text>
                <Text style={styles.modalText}>Kết quả khám: {selectedExam.exam}</Text>
                <Text style={styles.modalText}>Đơn thuốc: {selectedExam.prescription}</Text>
                <Text style={styles.modalText}>Ghi chú: {selectedExam.content || 'Không có ghi chú'}</Text>
                <Button title="Đóng" onPress={() => setModalVisible(false)} />
              </>
            ) : (
              <Text>Không có dữ liệu.</Text>
            )}
          </View>
        </View>
      </Modal>
      {/* Modal hiển thị form đánh giá */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đánh giá</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Số điện thoại"
              value={feedbackPhone}
              onChangeText={(text) => setFeedbackPhone(text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Nội dung đánh giá"
              value={feedbackContent}
              onChangeText={(text) => setFeedbackContent(text)}
              multiline={true}
            />
            <Button title="Gửi đánh giá" color="#27ae60" onPress={submitFeedback} />
            <Button title="Hủy" color="#c0392b" onPress={() => setFeedbackModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  resultButton: {
    backgroundColor: '#3498db',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  resultButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
});

export default ViewAppointmentsScreen;
