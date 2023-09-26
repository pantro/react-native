import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    map: {
        flex: 1,
        width: '100%',
    },
    locationTitle: {
        fontSize: 22,
    },
    locationText: {
        fontSize: 18,
    },
    locationButton: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#6ED4C8',
    },
});