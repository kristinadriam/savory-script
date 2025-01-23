import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface AppNameProps {
    name: string;
}

const AppName: React.FC<AppNameProps> = ({ name }) => (
    <Text style={styles.appName}>{name}</Text>
);

export default AppName;

const styles = StyleSheet.create({
    appName: {
        fontFamily: 'Montserrat',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#374375',
    },
})