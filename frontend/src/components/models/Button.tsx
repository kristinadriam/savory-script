import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    name: string;
    onClick: () => Promise<void>;
    height?: number;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, height }) => {
    const buttonStyle = [styles.pressedButton, height !== undefined ? { height } : null];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onClick}
        >
            <Text
                style={styles.pressedButtonText}>
                {name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pressedButton: {
        marginLeft: 'auto',
        backgroundColor: '#BABDE2',
        paddingVertical: 10,
        paddingHorizontal: 20,
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

export default Button;
