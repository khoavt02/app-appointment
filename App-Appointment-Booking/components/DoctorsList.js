import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "react-native-vector-icons";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DoctorsList = () => {
  // Dummy data for our doctors
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    useEffect(() => {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get("http://10.0.2.2:8080/api/get-list-doctor");
          setDoctors(response.data.doctors);
        } catch (err) {
          console.log(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDoctors();
    }, []);
    const handleMoreInfo = (item) => {
        // Navigate to the DoctorDetailsScreen and pass doctor data
        navigation.navigate('DoctorDetails', { doctor: item });
        //navigation.navigate('Doctors', { screen: 'DoctorDetails' }, {doctor: item});
      };
  // Function to render an individual doctor card
  const renderDoctorCard = ({ item }) => (
    <View style={styles.doctorCard} key={item.id}>
        {item.avatar && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.avatar}` }}
            style={styles.doctorImage}
          />
        )}
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorSpecialty}>{item.specializationName}</Text>
      <TouchableOpacity style={styles.learnMoreButton} onPress={() => handleMoreInfo(item)}>
        <Text style={styles.learnMoreButtonText}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
     <View style={styles.doctorsContainer}>
        <Text style={styles.doctorsTitle}>Bác sĩ</Text>
        {loading ? (
          <Text>Loading...</Text> // Có thể hiển thị một spinner hoặc thông báo đang tải
        ) : error ? (
          <Text>Error: {error}</Text> // Hiển thị lỗi nếu có
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row" }}>
              {doctors.map((item, index) => renderDoctorCard({ item }))}
              <TouchableOpacity style={styles.showMoreButton} onPress={() => navigation.navigate('DoctorLists')}>
                <Text style={styles.showMoreButtonText}>Xem tất cả </Text>
                <FontAwesome name="arrow-right" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
  );
};

export default DoctorsList;

const styles = StyleSheet.create({
  doctorsContainer: {
    // paddingHorizontal: 10,
    marginTop: 20,
  },
  doctorsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  doctorCard: {
    width: 220,
    height: 290,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  doctorImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666",
  },
  showMoreButtonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  learnMoreButton:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00b894",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  learnMoreButtonText:{
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  showMoreButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
    // padding: 6,
    marginLeft: 10,
    marginTop: 10,
    justifyContent: "center",
  },

  showMoreButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  arrowIcon: {
    marginLeft: 5, // Add some spacing between text and arrow
  },
});
