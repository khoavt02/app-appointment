import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Linking
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { WebView } from "react-native-webview";
import axios from "axios";
import MapView, { Marker } from 'react-native-maps';
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
      console.log("Coordinates fetched:", coordinates);
      setLocation(coordinates); // Lưu tọa độ vào state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor && doctor.clinicAddress) {
      const fetchInterval = setInterval(() => {
        if (!location) {
          //console.log("Retrying fetch coordinates...");
          //fetchCoordinates(doctor.clinicAddress);
        } else {
          clearInterval(fetchInterval);
        }
      }, 5000);

      return () => clearInterval(fetchInterval);
    }
  }, [doctor]);


    const handleBooking = () => {
      // Navigate to the DoctorDetails screen with the selected doctor's data
      navigation.navigate('Appointment Booking', { doctor });
    };

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

              {/* Bio Section */}
              <View style={styles.bioSection}>
                <Text style={styles.bio}>
                  {doctor ? `${doctor.description}` : "Bio Not Found"}
                </Text>
              </View>
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
                  <MaterialIcons name="email" size={30} color="#636e72" />
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
                      ? `Điến thoại: ${doctor.phone}`
                      : "Education Not Found"}
                  </Text>
                </View>
              </View>

              {/* Languages */}
              <View style={styles.box}>
                <View style={styles.languagesContainer}>
                  <MaterialIcons name="school" size={30} color="#4834d4" />
                  <Text style={styles.languages}>
                    {doctor
                      ? `Chuyên khoa: ${doctor.specializationName}`
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
                    ? `Phòng khám: ${doctor.clinicName}`
                    : "Location Not Found"}
                </Text>
              </View>
            </View>
            </View>


            {/* Bản đồ */}
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>Địa chỉ phòng khám: {doctor.clinicAddress}</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : location ? (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.lat,
                    longitude: location.lon,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.lat,
                      longitude: location.lon,
                    }}
                  />
                </MapView>
                  <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => {
                        Linking.canOpenURL('comgooglemaps://').then((supported) => {
                          if (supported) {
                            const url = `comgooglemaps://?daddr=${location.lat},${location.lon}`;
                            Linking.openURL(url);
                          } else {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`;
                            Linking.openURL(url);
                          }
                        }).catch((err) => {
                          // Thông báo lỗi nếu có vấn đề
                          Alert.alert("Error", "Unable to open map: " + err.message);
                        });
                      }}
                  >
                    <Text style={styles.buttonText}>Chỉ đường</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text>Unable to load map. Location not available.</Text>
              )}
            </View>
            {/* Button to Book an Appointment */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.bookAppointmentButton} onPress={handleBooking}>
                <Text style={styles.bookAppointmentText}>Đặt lịch</Text>
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
    marginTop: 10,
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
   mapContainer: {
      marginVertical: 20,
      height: 300,
      width: '100%',
      alignItems: 'center',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    directionsButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
      },
});

export default DoctorDetailsScreen;
