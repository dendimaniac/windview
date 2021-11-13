import { styled } from "@mui/system";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import { MarkerInfo, UserType } from "../../types";
import ConstructionInfo from "./ConstructionInfo";
import DeliveryInfo from "./DeliveryInfo";
import ManagementInfo from "./ManagementInfo";

const MainContainer = styled("div")({
  background: "white",
  padding: 15,
  width: 300,
  height: 200,
});

type Props = {
  map?: google.maps.Map;
  panorama?: google.maps.StreetViewPanorama;
  currentUserType: UserType;
  markerInfo: MarkerInfo;
  markerIndex: number;
  handleUpdateMarker: (markerId: string, markerInfo: MarkerInfo) => void;
  handleDeleteMarker: (markerId: string, markerIndex: number) => Promise<void>;
};

const MarkerWithInfo = ({
  map,
  panorama,
  currentUserType,
  markerInfo,
  markerIndex,
  handleUpdateMarker,
  handleDeleteMarker,
}: Props) => {
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
  const [onInfoWindowClosedHandlers, setOnInfoWindowClosedHandlers] = useState<
    { [key in UserType]: Array<() => void> }
  >({
    Construction: [],
    Delivery: [],
    Management: [],
  });

  const onInfoWindowLoaded = (infoWindowInstance: google.maps.InfoWindow) => {
    setInfoWindow(infoWindowInstance);
  };

  const onInfoWindowClosed = () => {
    const handlers = onInfoWindowClosedHandlers[currentUserType];
    handlers.forEach((callback) => {
      callback();
    });
  };

  const addInfoWindowClosedHandler = (userType: UserType) => {
    return (handlers: Array<() => void>) => {
      setOnInfoWindowClosedHandlers({
        ...onInfoWindowClosedHandlers,
        [userType]: handlers,
      });
    };
  };

  const renderMarkerInfo = () => {
    switch (currentUserType) {
      default:
      case "Construction":
        return (
          <ConstructionInfo
            markerInfo={markerInfo}
            markerIndex={markerIndex}
            handleUpdateMarker={handleUpdateMarker}
            handleDeleteMarker={handleDeleteMarker}
          />
        );
      case "Delivery":
        if (markerInfo.type !== "Delivery") return null;

        return (
          <DeliveryInfo
            addInfoWindowClosedHandler={addInfoWindowClosedHandler("Delivery")}
            markerInfo={markerInfo}
            handleUpdateMarker={handleUpdateMarker}
          />
        );
      case "Management":
        return (
          <ManagementInfo
            markerInfo={markerInfo}
            handleUpdateMarker={handleUpdateMarker}
          />
        );
    }
  };

  return (
    <>
      <Marker
        options={{
          map: map,
          icon:
            "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00",
          label: markerInfo.label,
        }}
        position={markerInfo.position}
        onClick={() => {
          infoWindow?.open({
            map: panorama,
          });
        }}
      />
      <InfoWindow
        onCloseClick={onInfoWindowClosed}
        onLoad={onInfoWindowLoaded}
        position={markerInfo.position}
      >
        <MainContainer>{renderMarkerInfo()}</MainContainer>
      </InfoWindow>
    </>
  );
};

export default MarkerWithInfo;
