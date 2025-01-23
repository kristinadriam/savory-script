import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import AppName from './AppName';
interface HeaderProps {
    name: string;
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ name, title, subtitle }) => (
    <View style={styles.header}>
        <AppName name={name} />
        <Text style={styles.title}>
            {title}
        </Text>
        <Text style={styles.subtitle}>
            {subtitle}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        width: '100%',
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 17,
        marginTop: 10,
        fontStyle: 'italic',
        color: '#374375',
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 22,
        marginTop: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#374375',
    },
})

export default Header;