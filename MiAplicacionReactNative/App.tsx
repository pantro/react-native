/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, PermissionsAndroid, StyleSheet } from 'react-native';
//import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import RNFS from 'react-native-fs';

const App: React.FC = () => {
  //const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [cont, setCont] = useState(1);

  const getLocation = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Necesitamos acceso a tu ubicación para la aplicación.',
            buttonPositive: 'Aceptar',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permisos otorgados, puedes acceder a la ubicación.
          //Geolocation.getCurrentPosition(
          Geolocation.watchPosition(
            (position) => {
              console.log('** Ubicación actualizada:', position.coords);
              //setLocation(position.coords);
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
            },
            (error) => {
              console.error(error);
            },
            //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1 }
            { enableHighAccuracy: true }
          );
        } else {
          console.log('Permiso de ubicación denegado.');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // En iOS, no es necesario solicitar permisos específicos en tiempo de ejecución
      //Geolocation.getCurrentPosition(
      Geolocation.watchPosition(
        (position) => {
          console.log('** Ubicación actualizada:', position.coords);
          //setLocation(position.coords);
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error);
        },
        //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1 }
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const saveLocationToFile = async () => {
    setCont(cont+1);

    if (location) {
      try {
        const path = `${RNFS.ExternalDirectoryPath}/location.txt`;
        await RNFS.appendFile(path, 
        `{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [${location.longitude}, ${location.latitude}]
          },
          "properties": {
            "nombre": "Punto ${cont}"
          }
        }\n
        `, 'utf8'); // Agrega una nueva línea
        console.log(`Location saved to ${path}`);
      } catch (error) {
        console.error(error);
      }
      alert(`
      PUNTO ${cont} :
      Se guardo este punto GPS:
       - Latitud: ${location.latitude}, 
       - Longitud: ${location.longitude}`);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.locationTitle}>Ubicación actual (test66):</Text>
      {location && (
        <>
          <Text style={styles.locationText}>Latitud: {location.latitude}</Text>
          <Text style={styles.locationText}>Longitud: {location.longitude}</Text>
        </>
      )}
      <View style={styles.locationButton}>
        <Button title="Guardar Ubicación" onPress={saveLocationToFile}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 22,
  },
  locationText: {
    fontSize: 18,
  },
  locationButton: {
    margin: 10,
  },
});

export default App;
