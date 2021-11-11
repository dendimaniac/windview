import { useState } from "react";
import {
  GoogleMap,
  Marker,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import Overlay from "./components/Overlay";
import { MarkerPosition } from "./types";

const apiKey = "AIzaSyCqkrEl0NzrPQvBkzOpvEvNj2rhzBz8m2w";

const center = {
  lat: 62.946093681826596,
  lng: 23.040325321650705,
};

const App = () => {
  const [isStreetViewVisible, setIsStreetViewVisible] = useState(false);
  const [map, setMap] = useState<google.maps.Map>();
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama>();
  const [mapCenter, setMapCenter] = useState<MarkerPosition>(center);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const mainMapContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  const miniMapContainerStyle: React.CSSProperties = {
    position: "absolute",
    width: "300px",
    height: "200px",
    right: 0,
    bottom: 0,
    zIndex: 1,
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

    const handlePanoramaPositionChanged = () => {
      const panoramaPosition = panorama?.getPosition();
      if (!panoramaPosition) return;

      const lat = panoramaPosition.lat();
      const lng = panoramaPosition.lng();

      if (lat === mapCenter.lat && lng === mapCenter.lng) return;

      setMapCenter({
        lat,
        lng,
      });
    };

    return (
      <>
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={mainMapContainerStyle}
          zoom={14}
          center={mapCenter}
          streetView={panorama}
        >
          <StreetViewPanorama
            options={{
              visible: isStreetViewVisible,
              position: mapCenter,
              enableCloseButton: true,
              disableDefaultUI: true,
            }}
            onPositionChanged={handlePanoramaPositionChanged}
            onLoad={onPanoramaLoad}
            onVisibleChanged={() => {
              const visibility = panorama?.getVisible();
              if (visibility === undefined) return;

              setIsStreetViewVisible(visibility);
            }}
          />
          <Marker
            options={{
              map: map,
              icon:
                "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00",
              visible: !isStreetViewVisible,
            }}
            position={mapCenter}
            onClick={() => {
              setIsStreetViewVisible(true);
            }}
          />
          {isStreetViewVisible && <Overlay map={map} panorama={panorama} />}
        </GoogleMap>

        {isStreetViewVisible && (
          <GoogleMap
            mapContainerStyle={miniMapContainerStyle}
            zoom={15}
            center={mapCenter}
            streetView={panorama}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              panControl: false,
              rotateControl: false,
              scaleControl: false,
              zoomControl: false,
              clickableIcons: false,
              streetViewControl: true,
              keyboardShortcuts: false,
            }}
          />
        )}
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};

export default App;
