import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text } from 'react-native';
import styles from '../styles/Styles';

interface PickerSectionProps {
  label: string;
  value: string;
  onValueChange: (itemValue: string) => void;
  items: string[];
}

const PickerSection: React.FC<PickerSectionProps> = ({ label, value, onValueChange, items }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};

export default PickerSection;
