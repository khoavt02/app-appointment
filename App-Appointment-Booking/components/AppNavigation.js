import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DoctorListsScreen from "../screens/DoctorListsScreen";
import AccountScreen from "../screens/AccountScreen";
import DoctorDetailsScreen from "../screens/DoctorDetailsScreen";
import AppointmentBookingScreen from "../screens/AppointmentBookingScreen";
import ViewAppointmentsScreen from "../screens/ViewAppointmentsScreen";
import DoctorStack from "./DoctorStack";

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
          name="Bác sĩ"
          component={DoctorStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="local-hospital" size={size} color={color} />
            ),
            headerShown: false,
          }}
          lazy={false}
        />
      <Tab.Screen
        name="Lịch khám"
        component={ViewAppointmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
          name="Tài khoản"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
    </Tab.Navigator>
  );
};

export default AppNavigation;
