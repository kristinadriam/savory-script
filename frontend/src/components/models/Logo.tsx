import React from 'react';
import { Image } from 'react-native';
import styles from './Styles';

interface LogoProps {
    uri: string;
}

const Logo: React.FC<LogoProps> = ({ uri }) => (
    <Image
        source={{ uri }}
        style={styles.logo}
    />
);

export default Logo;