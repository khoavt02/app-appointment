import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorListsScreen from '../screens/DoctorListsScreen';
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen';
import AppointmentBookingScreen from '../screens/AppointmentBookingScreen';

const Stack = createStackNavigator();

const DoctorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorLists"
        component={DoctorListsScreen}
        options={{ headerShown: false }} // Tùy chọn ẩn header cho màn hình DoctorLists
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
        options={{ headerShown: false }} // Tùy chọn ẩn header cho màn hình DoctorDetails
      />
      <Stack.Screen
        name="Appointment Booking"
        component={AppointmentBookingScreen}
        options={{ headerShown: false }} // Tùy chọn ẩn header cho màn hình AppointmentBooking
      />
    </Stack.Navigator>
  );
};

export default DoctorStack;
