import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface ButtonProps {
  names: string[];
}

export const CustomSingleSelectExample = ({ names: names }: ButtonProps) => {
  const values = names.map(value => ({
    value: value,
    label: value,
  }));

  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <View>
      <select
        style={styles.pressedButton}
        value={selectedValue}
        onChange={handleSelectChange}
      >
        <option value="" disabled style={styles.pressedButtonText}>
          Select a cuisine
        </option>
        {values.map(user => (
          <option key={user.value} value={user.value}>
            {user.label}
          </option>
        ))}
      </select>
    </View>
  );
}

const styles = StyleSheet.create({
  pressedButton: {
    backgroundColor: '#BABDE2',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    borderColor: '#BABDE2',
  },
  pressedButtonText: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFCF5',
  },
})