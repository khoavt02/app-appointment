import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ label, value, selectedValue, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={() => onPress(value)}>
      <View style={[styles.radioCircle, selectedValue === value ? styles.selectedCircle : null]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#32c8c4',
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: '#32c8c4',
  },
  radioLabel: {
    fontSize: 16,
  },
});
