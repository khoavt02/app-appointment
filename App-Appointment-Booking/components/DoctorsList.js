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

const DoctorsList = () => {
  // Dummy data for our doctors
  const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get("http://10.0.2.2:8080/api/get-list-doctor");

          console.log("[List Doctor Data]",response.data.doctors);
          //console.log(response.data);
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

  // Function to render an individual doctor card
  const renderDoctorCard = ({ item }) => (
    <View style={styles.doctorCard} key={item.id}>
      //<Image source={{ uri: item.avatar }} style={styles.doctorImage} />
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorSpecialty}>{item.specializationName}</Text>
      <TouchableOpacity style={styles.learnMoreButton}>
        <Text style={styles.learnMoreButtonText}>More Info</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.doctorsContainer}>
      <Text style={styles.doctorsTitle}>Our Top Doctors</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {doctors.map((item) => renderDoctorCard({ item}))}
          <TouchableOpacity style={styles.showMoreButton}>
            <Text style={styles.showMoreButtonText}>Show all Doctors </Text>
            <FontAwesome name="arrow-right" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: "#56428F",
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
