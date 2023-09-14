/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, PermissionsAndroid } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';

const App: React.FC = () => {
  const [location, setLocation] = useState<GeoCoordinates | null>(null);

  useEffect(() => {
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
            Geolocation.getCurrentPosition(
              (position) => {
                setLocation(position.coords);
              },
              (error) => {
                console.error(error);
              },
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
          } else {
            console.log('Permiso de ubicación denegado.');
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        // En iOS, no es necesario solicitar permisos específicos en tiempo de ejecución
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation(position.coords);
          },
          (error) => {
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    };

    getLocation();

    const interval = setInterval(() => {
      getLocation();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ubicación actual:</Text>
      {location && (
        <>
          <Text>Latitud: {location.latitude}</Text>
          <Text>Longitud: {location.longitude}</Text>
        </>
      )}
    </View>
  );
};

export default App;
