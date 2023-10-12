import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View } from 'react-native';

const tokenmapbox = "pk.eyJ1IjoianVhbmFoYWJhbmEiLCJhIjoiY2xua3JiejZwMXQ1MzJsbWtoc25zOWpndSJ9._b4h5Wl662KXj9ZEbHnTtw"
MapboxGL.setAccessToken(tokenmapbox);
MapboxGL.setWellKnownTileServer('Mapbox');

const App = () => {
  
  const coordinateexample = [78.9629, 20.5937];

  return (
    <MapboxGL.MapView style={{
      flex: 1,
    }}>
      <MapboxGL.Camera
        zoomLevel={10}
        centerCoordinate={coordinateexample}
      />
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={coordinateexample}
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
  );
}

export default App;
