import { useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  StreetViewPanorama,
  useLoadScript,
} from '@react-google-maps/api';
import POICreator from './components/POICreator';

const apiKey = 'AIzaSyCqkrEl0NzrPQvBkzOpvEvNj2rhzBz8m2w';

const App = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama>();
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
  const [newPOILat, setNewPOILat] = useState(62.946093681826596);
  const [newPOILong, setNewPOILong] = useState(23.040325321650705);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const divStyle = {
    background: 'white',
    border: '1px solid #ccc',
    padding: 15,
  };

  const center = {
    lat: 62.946093681826596,
    lng: 23.040325321650705,
  };

  const renderMap = () => {
    const onMapLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
    };

    const onPanoramaLoad = (
      panoramaInstance: google.maps.StreetViewPanorama
    ) => {
      setPanorama(panoramaInstance);
    };

    const onInfoWindowLoad = (infoWindowInstance: google.maps.InfoWindow) => {
      setInfoWindow(infoWindowInstance);
    };

    return (
      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={containerStyle}
        onRightClick={(e) => console.log(e)}
        zoom={10}
        center={center}
      >
        <StreetViewPanorama
          options={{
            visible: true,
            position: center,
            enableCloseButton: true,
            disableDefaultUI: true,
          }}
          onLoad={onPanoramaLoad}
        />
        <Marker
          options={{
            map: map,
            icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00',
            title: 'Bus Stop',
            label: 'Bus Stop',
          }}
          position={center}
          onClick={() => {
            infoWindow?.open({
              map: panorama,
            });
          }}
        />
        <Marker
          options={{
            map: map,
            icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00',
            title: 'Bus Stop',
            label: 'Bus Stop',
          }}
          position={{ lat: newPOILat, lng: newPOILong }}
          onClick={() => {
            infoWindow?.open({
              map: panorama,
            });
          }}
        />
        <InfoWindow onLoad={onInfoWindowLoad} position={center}>
          <div style={divStyle}>
            <h1>InfoWindow</h1>
          </div>
        </InfoWindow>
        <POICreator
          newPOILat={newPOILat}
          newPOILong={newPOILong}
          setNewPOILat={setNewPOILat}
          setNewPOILong={setNewPOILong}
        />
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};

export default App;
