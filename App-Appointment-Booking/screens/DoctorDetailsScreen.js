import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { WebView } from "react-native-webview";
import axios from "axios";
const DoctorDetailsScreen = ({ route }) => {
  const { doctor } = route.params ?? {};
  const navigation = useNavigation(); // Initialize navigation
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleViewProfile = () => {
    // Navigate to the DoctorDetails screen with the selected doctor's data
    navigation.navigate("Doctor Lists", { doctor });
  };
// Hàm gọi API Geocoding để lấy tọa độ từ địa chỉ
  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=BM0ZJTIlBt7z06sbOduFcod29bJaIkhaHoHGtS2IrON80DgXKhaIJQQJ99AIACYeBjFmzkqIAAAgAZMPq6E2&query=${encodeURIComponent(address)}`
      );
      const coordinates = response.data.results[0].position;
      setLocation(coordinates); // Lưu tọa độ vào state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
      if (doctor && doctor.clinicAddress) {
        // Gọi hàm fetchCoordinates để lấy tọa độ khi có địa chỉ
        fetchCoordinates(doctor.clinicAddress);
      }
    }, [doctor]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {!doctor ? (
          <View style={styles.noDataContainer}>
            <Image
              source={require("../assets/dataNotFound.jpg")}
              style={styles.noDataImage}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Doctor Details Not Found
            </Text>
            <CustomButton title="Select a doctor" onPress={handleViewProfile} />
          </View>
        ) : (
          <>
            {/* Top Section */}
            <View style={styles.topContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${doctor.avatar}` }}
                style={styles.doctorImage}
              />
              <Text style={styles.doctorName}>
                {doctor ? doctor.name : "Doctor Name Not Found"}
              </Text>
            </View>

            {/* Middle Container with Icons */}
            <View style={styles.middleContainer}>


              {/* Reviews
              <View style={styles.box}>
                <View style={styles.reviewsContainer}>
                  <MaterialIcons name="star" size={30} color="#f9ca24" />
                  <Text style={styles.reviewsText}>
                    {doctor
                      ? `Reviews: ${doctor.reviews}`
                      : "Reviews Not Found"}
                  </Text>
                </View>
              </View>*/}

              {/* Experience*/}
              <View style={styles.box}>
                <View style={styles.experienceContainer}>
                  <Ionicons name="ios-briefcase" size={30} color="#636e72" />
                  <Text style={styles.experience}>
                    {doctor
                      ? `Email: ${doctor.email}`
                      : "Experience Not Found"}
                  </Text>
                </View>
              </View>

              {/* Education*/}
              <View style={styles.box}>
                <View style={styles.educationContainer}>
                  <Ionicons name="call" size={30} color="#130f40" />
                  <Text style={styles.education}>
                    {doctor
                      ? `Phone: ${doctor.phone}`
                      : "Education Not Found"}
                  </Text>
                </View>
              </View>

              {/* Languages */}
              <View style={styles.box}>
                <View style={styles.languagesContainer}>
                  <Ionicons name="ios-globe" size={30} color="#4834d4" />
                  <Text style={styles.languages}>
                    {doctor
                      ? `Specialization: ${doctor.specializationName}`
                      : "Languages Not Found"}
                  </Text>
                </View>
              </View>
              {/* Location */}
            <View style={styles.box}>
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={30} color="#00b894" />
                <Text style={styles.address}>
                  {doctor
                    ? `Location: ${doctor.address}`
                    : "Location Not Found"}
                </Text>
              </View>
            </View>
            </View>

            {/* Bio Section */}
            <View style={styles.bioSection}>
              <Text style={styles.bio}>
                {doctor ? `Bio: ${doctor.description}` : "Bio Not Found"}
              </Text>
            </View>
            {/* Bản đồ */}
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>Clinic Location</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                location && (
                  <WebView
                    style={styles.map}
                    source={{
                      uri: `https://atlas.microsoft.com/map/static/png?subscription-key=BM0ZJTIlBt7z06sbOduFcod29bJaIkhaHoHGtS2IrON80DgXKhaIJQQJ99AIACYeBjFmzkqIAAAgAZMPq6E2&api-version=1.0&center=${location.lon},${location.lat}&zoom=14&width=400&height=300`,
                    }}
                  />
                )
              )}
            </View>
            {/* Button to Book an Appointment */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.bookAppointmentButton}>
                <Text style={styles.bookAppointmentText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: "#fff",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  doctorImage: {
    width: "100%",
    height: 370,
    resizeMode: "cover",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  doctorName: {
    paddingTop: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  middleContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  box: {
    height: 100,
    width: 150,
    backgroundColor: "#fff",
    elevation: 3,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  locationContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#00b894",
    marginLeft: 5,
    fontWeight: "bold",
  },
  reviewsContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  reviewsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f9ca24",
    marginLeft: 5,
  },
  experienceContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  experience: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#636e72",
    marginLeft: 5,
  },
  educationContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  education: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#130f40",
    marginLeft: 5,
  },
  languagesContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  languages: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4834d4",
    marginLeft: 5,
  },
  bioSection: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bio: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "justify",
    fontWeight: "400",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 10,
  },
  bookAppointmentButton: {
    backgroundColor: "#00b894",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  bookAppointmentText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  noDataImage: {
    width: "100%",
    height: 370,
    resizeMode: "cover",
  },
});

export default DoctorDetailsScreen;
