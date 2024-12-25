import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioButton from '../components/RadioButton';
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import AuthTokenService from '../AuthTokenService';
import jwtDecode from 'jwt-decode';
const AppointmentBookingScreen = ({route}) => {
     const { doctor } = route.params ?? {};
     const [selectedDay, setSelectedDay] = useState(new Date());
     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
     const [selectedSlot, setSelectedSlot] = useState(null);
     const [gender, setGender] = useState('male');
     const [timeSlots, setTimeSlots] = useState([]);
     const [open, setOpen] = useState();
     //Thông tin bệnh nhân
     const [patientName, setPatientName] = useState('');
     const [phoneNumber, setPhoneNumber] = useState('');
     const [email, setEmail] = useState('');
     const [birthYear, setBirthYear] = useState('');
     const [address, setAddress] = useState('');
     const [reason, setReason] = useState('');
     const PHONE_REG = /^[0-9]{10}$/; // Example phone number regex for 10 digits
     const EMAIL_REG = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
     const getDoctorSchedule = async (date) => {
       setDatePickerVisibility(false);
       setSelectedSlot(null);
       setSelectedDay(date);
       setTimeSlots([]);
       try {
         const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
         console.log(formattedDate);
         const params = new URLSearchParams({
               date: formattedDate,
               doctorId: doctor.id
             });
         console.log(params.toString());
         const response = await axios.post(
           'http://10.0.2.2:8080/doctor/get-schedule-doctor-by-date',
           params,
           {
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
             },
           }
         );

         console.log(response.data.message);
         const data = response.data.message;
         if(data.length > 0 ){
            const dataFilter = data.filter(item => !item.isDisable).map(item => ({ id: item.id, time: item.time }));
            setTimeSlots(dataFilter);
         }
       } catch (error) {
         console.error('Error fetching doctor schedule:', error);
       }
     };
       const showDatePicker = () => {
         setDatePickerVisibility(true);
       };
    useEffect(() => {
         const fetchAndParseToken = async () => {
              const token = await AuthTokenService.getToken();
              console.log('Token:', token);

              if (token) {
                   const userInfo = AuthTokenService.decodeTokenManually(token);
                   console.log(userInfo);
                   setPatientName(userInfo.name);
                   setPhoneNumber(userInfo.phone);
                   setGender(userInfo.gender);
                   setAddress(userInfo.address);
                   setEmail(userInfo.email)
              } else {
                console.warn('No token found.');
              }
            };

            fetchAndParseToken();
        getDoctorSchedule(new Date());
      }, [doctor]);
  function base64UrlDecode(base64Url) {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return atob(base64);
  }
  const validateInput = () => {
          console.log(selectedSlot);
          if(selectedSlot === null){
              Alert.alert("Lỗi", "Vui lòng chọn lịch.");
              return false;
          }
          if(!gender){
            Alert.alert("Lỗi", "Vui lòng chọn giới tính");
            return false;
          }
          if (!patientName) {
              Alert.alert("Lỗi", "Tên không được để trống.");
              return false;
          }

          if (!phoneNumber) {
              Alert.alert("Lỗi", "Số điện thoại không được để trống.");
              return false;
          } else if (!phoneNumber.match(PHONE_REG)) {
              Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
              return false;
          }

          if (!email) {
              Alert.alert("Lỗi", "Email không được để trống.");
              return false;
          } else if (!email.match(EMAIL_REG)) {
              Alert.alert("Lỗi", "Email không hợp lệ.");
              return false;
          }

          return true;
      };
    const handleSaveBooking = async () => {
            if (!validateInput()) {
               return;
            }
            const formattedDate = `${String(selectedDay.getDate()).padStart(2, '0')}/${String(selectedDay.getMonth() + 1).padStart(2, '0')}/${selectedDay.getFullYear()}`
            const bookingData = {
                doctorId: doctor.id,
                dateBooking: formattedDate,
                timeBooking: selectedSlot,
                name: patientName,
                gender: gender,
                phone: phoneNumber,
                email: email,
                birthYear: birthYear,
                address: address,
                description: reason,
            };
            console.log(bookingData);
            try {
                const response = await axios.post(
                    "http://10.0.2.2:8080/booking-doctor-without-files/create",
                    bookingData
                );
                console.log(response.data.message);
                console.log(response.data.patient);
                if (response.data.patient) {
                    alert("Đặt lịch thành công!");
                    // Thực hiện hành động sau khi đặt lịch thành công, ví dụ chuyển hướng hoặc cập nhật trạng thái.
                } else {
                    alert("Rất tiếc, không còn lịch hẹn nào có sẵn. Vui lòng chọn thời gian khác.");
                }
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
                alert('Có lỗi xảy ra, vui lòng thử lại sau!');
            }
        };
     return (
     <SafeAreaView style={{ flex: 1 }}>
       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
           <View style={styles.container}>
             <Text style={styles.title}>Lịch khám bệnh</Text>
              <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                     <Text style={styles.dateText}>
                       {selectedDay.toLocaleDateString()}
                     </Text>
              </TouchableOpacity>
             <DateTimePickerModal
                     isVisible={isDatePickerVisible}
                     mode="date"
                     date={selectedDay}
                     onConfirm={getDoctorSchedule}
                     onCancel={() => setDatePickerVisibility(false)}
                     minimumDate={new Date()}
                   />

             <View style={styles.timeSlotContainer}>
                   {timeSlots.length === 0 ? (
                     <Text style={styles.noSlotsText}>Không có lịch phù hợp</Text>
                   ) : (
                     timeSlots.map((slot, index) => (
                       <TouchableOpacity
                         key={slot.id}
                         style={[
                           styles.timeSlotButton,
                           selectedSlot === slot.time ? styles.selectedButton : null
                         ]}
                         onPress={() => setSelectedSlot(slot.time)}
                       >
                         <Text style={styles.timeSlotText}>{slot.time}</Text>
                       </TouchableOpacity>
                     ))
                   )}
             </View>
             <Text style={styles.label}>Họ và tên</Text>
               <TextInput placeholder="Nhập họ và tên" style={styles.input}
               value={patientName}
               onChangeText={setPatientName}/>

               <Text style={styles.label}>Giới tính</Text>
               <View style={styles.genderContainer}>
                 <RadioButton
                   label="Nam"
                   value="male"
                   selectedValue={gender}
                   onPress={(value) => setGender(value)}
                 />
                 <RadioButton
                   label="Nữ"
                   value="female"
                   selectedValue={gender}
                   onPress={(value) => setGender(value)}
                 />
               </View>

               <Text style={styles.label}>Số điện thoại</Text>
               <TextInput
                   placeholder="Nhập số điện thoại"
                   style={styles.input}
                   value={phoneNumber}
                   onChangeText={setPhoneNumber}
                   keyboardType="phone-pad"
               />

               <Text style={styles.label}>Email</Text>
               <TextInput
                   placeholder="Nhập email"
                   style={styles.input}
                   value={email}
                   onChangeText={setEmail}
                   keyboardType="email-address"
               />



               <Text style={styles.label}>Địa chỉ</Text>
               <TextInput
                   placeholder="Nhập địa chỉ"
                   style={styles.input}
                   value={address}
                   onChangeText={setAddress}
               />

               <Text style={styles.label}>Năm sinh</Text>
               <TextInput
                   placeholder="Nhập năm sinh"
                   style={styles.input}
                   value={birthYear}
                   onChangeText={setBirthYear}
                   keyboardType="numeric"
               />

               <Text style={styles.label}>Lý do khám</Text>
               <TextInput
                   placeholder="Nhập lý do khám bệnh"
                   style={styles.textArea}
                   multiline={true}
                   value={reason}
                   onChangeText={setReason}
               />
               {/* Button để lưu đặt lịch */}
               <TouchableOpacity onPress={handleSaveBooking} style={styles.saveButton}>
                   <Text style={styles.saveButtonText}>Đặt lịch</Text>
               </TouchableOpacity>
           </View>
        </ScrollView>
       </SafeAreaView>
     );
}

export default AppointmentBookingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#32c8c4',
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    marginBottom: 20,
    height: 50,
    zIndex: 1000, // Important to avoid dropdown being covered
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlotButton: {
    width: '48%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#32c8c4',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#fff',
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      height: 100,
      backgroundColor: '#fff',
    },
    genderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 10,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
      },
      dateText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
      },
     noSlotsText: {
         textAlign: 'center',
         marginBottom: 20,
         fontSize: 16,
         color: 'red',
       },
      saveButton: {
          backgroundColor: '#32c8c4',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 10
      },
      saveButtonText: {
        color: '#fff',
        fontWeight: 'bold'
      },
});