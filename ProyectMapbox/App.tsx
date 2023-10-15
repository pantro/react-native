import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import RNFS from 'react-native-fs';

const tokenmapbox = "pk.eyJ1IjoianVhbmFoYWJhbmEiLCJhIjoiY2xua3JiejZwMXQ1MzJsbWtoc25zOWpndSJ9._b4h5Wl662KXj9ZEbHnTtw"
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(tokenmapbox);

const App = () => {
  
  const [location, setLocation] = useState<any>(null);
  const [cont, setCont] = useState(1);

  // Ejemplo de escritura de un archivo en el directorio de documentos
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

  useEffect(() => {
    // Configurar la obtención de la ubicación
    const watchId = Geolocation.watchPosition(
      (position) => {
        console.log('Nueva ubicación', position.coords);
        setLocation(position.coords);
      },
      (error) => {
        console.error('Error al obtener la ubicación', error);
      },
      {
        //interval: 1000,
        enableHighAccuracy: true,
        timeout: 5000, // 5 segundos de tiempo de espera maximo para la respuesta,
        maximumAge: 0, // antigüedad máxima en milisegundos de una posible posición en caché que se puede devolver. si se establece en 0, significa que el dispositivo no puede usar una posición almacenada en caché y debe intentar recuperar la posición actual real.
        distanceFilter: 1, // Distancia en metro minima para detectar un movimiento
      }
    );

    return () => {
      // Detener la obtención de la ubicación al desmontar el componente
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <View style={styles.container}>
      { location && 
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={18}
          centerCoordinate={[location.longitude, location.latitude]}
        />
        <MapboxGL.PointAnnotation
          key="pointAnnotation"
          id="pointAnnotation"
          coordinate={[location.longitude, location.latitude]}
        >
          <View style={{
            height: 30, 
            width: 30, 
            backgroundColor: '#00cccc', 
            borderRadius: 50, 
            borderColor: '#fff', 
            borderWidth: 3
          }} />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
      }
      <View style={styles.locationButton}>
        <Button title="Guardar Ubicación"  onPress={saveLocationToFile}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
export default App;
