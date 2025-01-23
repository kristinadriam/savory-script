import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    app: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        marginLeft: 10,
    },
    appName: {
        fontFamily: 'Montserrat',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        textAlign: 'center',
    },
    accountButton: {
        marginRight: 103,
        marginLeft: 10,
    },
    main: {
        flex: 1,
        marginTop: 30,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    texts: {
        textAlign: 'center',
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        flex: 1,
    },
    textInput: {
        fontFamily: 'Montserrat',
        marginBottom: 10,
        padding: 10,
        width: 300,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        backgroundColor: '#00FF00',
    },
    inputFields: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    findButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    button: {
        backgroundColor: '#841584',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginRight: 10,
    },
    buttonText: {
        fontFamily: 'Montserrat',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;