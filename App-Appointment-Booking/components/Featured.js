import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useEffect, useState} from "react";
import { FontAwesome5 } from "react-native-vector-icons";
import axios from 'axios';
const Featured = () => {
  // Sample data for the card slider
  const [clinics, setClinics] = useState([]);
  useEffect(() => {
      const fetchLists = async () => {
        try {
          const response = await axios.get("http://10.0.2.2:8080/api/clinic/get-list-clinics");
          setClinics(response.data.clinics);
        } catch (err) {
          console.log(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchLists();
    }, []);
  const featureData = [
    {
      id: "1",
      image:
        "https://images.pexels.com/photos/8413299/pexels-photo-8413299.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Cardiologist",
      description: "Expert care for your heart health",
      icon: "heartbeat",
      color: "blue",
    },
    {
      id: "2",
      image:
        "https://images.pexels.com/photos/5355897/pexels-photo-5355897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Dermatologist",
      description: "Skin care and treatments",
      icon: "spa",
      color: "green",
    },
    {
      id: "3",
      image:
        "https://images.pexels.com/photos/5355897/pexels-photo-5355897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Emergency Care",
      description: "Available 24/7 for urgent cases",
      icon: "ambulance",
      color: "red",
    },
    // Add more feature data as needed
  ];

  // Render individual card item
  const renderCardItem = ({ item }) => (
    <View style={styles.card} key = {item.id}>
      <Image
      source={{ uri: `data:image/jpeg;base64,${item.image}` }}
      style={styles.cardImage} />
      <View style={styles.cardTextField}>
        <View style={styles.cardTextFields}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSpecialty}>{item.phone}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.cardSlider}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {clinics.map((item) => renderCardItem({ item }))}
      </ScrollView>
    </View>
  );
};

export default Featured;

const styles = StyleSheet.create({
  cardSlider: {
    marginTop: 10,
  },
  card: {
    width: 300,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  cardTextField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconStyle: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardSpecialty: {
    fontSize: 14,
    color: "#666",
  },
  cardButton: {
    alignItems: "center",
  },
});
