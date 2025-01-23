import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface DynamicButtonProps {
    name: string;
    isPressedOnStart: boolean;
    onClick: () => void;
}

const DynamicButton: React.FC<DynamicButtonProps> = ({ name, isPressedOnStart, onClick }) => {
    const [isPressed, setIsPressed] = useState(isPressedOnStart);

    const onButtonPress = () => {
        if (!isPressed) {
            setIsPressed(!isPressed);
            onClick();
        }
    };

    return (
        <TouchableOpacity
            style={isPressed ? styles.pressedButton : styles.unpressedButton}
            onPress={onButtonPress}
        >
            <Text
                style={isPressed ? styles.pressedButtonText : styles.unpressedButtonText}>
                {name}
            </Text>
        </TouchableOpacity>
    );
};

// todo: add dynamic colors

const styles = StyleSheet.create({
    unpressedButton: {
        backgroundColor: '#FFFCF5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#BABDE2',
        borderStyle: 'dashed',
    },
    pressedButton: {
        backgroundColor: '#BABDE2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#BABDE2',
    },
    unpressedButtonText: {
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#BABDE2',
    },
    pressedButtonText: {
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFCF5',
    },
})

export default DynamicButton;
