import React, { useState, useEffect, useRef } from 'react';
import { styles } from './styles';
import { View, Text, Button  } from 'react-native';
import { 
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';

export default function App() {

  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [cont, setCont] = useState(1);
  // Obtener el directorio de documentos de la aplicación
  const documentsDirectory = FileSystem.documentDirectory;

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    
    if (granted) {
      alert("Se tiene permisos de ubicación");
      const currentPosition = await getCurrentPositionAsync({});
      setLocation(currentPosition);
      console.log("LOCALIZATION: ", currentPosition);
      watchPositionAsync({
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1
      }, (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch:100,
          center: response.coords
        })
      });
    } else {
      alert("Se nego el permiso de ubicación");
    }
  }

  // Ejemplo de escritura de un archivo en el directorio de documentos
  const saveLocationToFile = async () => {
    if (location) {
      const content = `{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [${location.coords.longitude}, ${location.coords.latitude}]
        },
        "properties": {
          "nombre": "Punto ${cont}"
        }
      }\n
      `;
      const filePath = documentsDirectory + 'locationGPS.txt';

      try {
        await FileSystem.writeAsStringAsync(filePath, content);
        console.log('LOG: Archivo escrito con éxito.');
        alert(`
          PUNTO ${cont} :
          Se guardo este punto GPS:
          - Latitud: ${location.coords.latitude}, 
          - Longitud: ${location.coords.longitude}`
        );
      } catch (error) {
        console.error('LOG: Error al escribir el archivo:', error);
      }
    }
  };

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  return (
    <View style={styles.container}>
      {
        location && 
        <MapView
          ref = {mapRef}
          style={styles.map}
          initialRegion = {{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker 
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      }
      <View style={styles.locationButton}>
        <Button title="Guardar Ubicación"  onPress={saveLocationToFile}/>
      </View>
    </View>
  );
}
