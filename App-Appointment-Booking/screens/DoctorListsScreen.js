import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const DoctorListsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [clinicId, setClinic] = useState("");
  const [specializationId, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // Fetch clinics and specializations options when component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const clinicsResponse = await axios.get("http://10.0.2.2:8080/api/clinic/get-list-clinics");
        setClinics(clinicsResponse.data.clinics);

        const specializationsResponse = await axios.get("http://10.0.2.2:8080/api/specialization/get-list-specialization");
        setSpecializations(specializationsResponse.data.specializations);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilters();
    handleSearch();
  }, []);

  // Fetch doctors based on filter when search button is clicked
  const handleSearch = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8080/api/get-list-doctor-filter", {
        params: {
          searchText,
          clinicId,
          specializationId,
        },
      });
      setDoctors(response.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color="#00b894"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>

        {/* Clinic Picker */}
        <Picker
          selectedValue={clinicId}
          onValueChange={(value) => {
            console.log("Selected Clinic:", value);
            setClinic(value); // Cập nhật trực tiếp giá trị của clinicId
          }}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Chọn phòng khám" value="" />
          {clinics.map((clinic) => (
            <Picker.Item key={clinic.id} label={clinic.name} value={clinic.id} />
          ))}
        </Picker>

        {/* Specialization Picker */}
        <Picker
          selectedValue={specializationId}
          onValueChange={(value) => {
            console.log("Selected Specialization:", value);
            setSpecialization(value); // Cập nhật trực tiếp giá trị của specializationId
          }}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Chọn chuyên khoa" value="" />
          {specializations.map((spec) => (
            <Picker.Item key={spec.id} label={spec.name} value={spec.id} />
          ))}
        </Picker>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setClinic(""); // Reset clinicId
            setSpecialization(""); // Reset specializationId
            setSearchText(""); // Reset search text nếu cần
          }}>
          <Text style={styles.resetButtonText}>Bỏ chọn</Text>
        </TouchableOpacity>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Tất cả bác sĩ</Text>
        <ScrollView
          contentContainerStyle={styles.doctorList}
          showsVerticalScrollIndicator={false}
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DoctorListsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  doctorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5,
  },
  searchInput: {
    flex: 1,
  },
  picker: {
    marginVertical: 10,
    height: 50,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#00b894",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#ff4757",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
