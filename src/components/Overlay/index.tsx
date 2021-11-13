import { Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { MarkerInfo, MarkerPosition, MarkerType, UserType } from "../../types";
import {
  deleteMarker,
  getAllMarkerInfos,
  postNewMarkerInfo,
} from "../../services/markers";
import MarkerCreator from "../MarkerCreator";
import ConstructionInfo from "../MarkerWithInfo/ConstructionInfo";
import UserTypeSwitcher from "../UserTypeSwitcher";
import DeliveryInfo from "../MarkerWithInfo/DeliveryInfo";
import ManagementInfo from "../MarkerWithInfo/ManagementInfo";
import MarkerWithInfo from "../MarkerWithInfo";

export type NewMarkerInfo = {
  position: Partial<MarkerPosition>;
  label: string;
  description: string;
  type: MarkerType;
};

type Props = {
  map?: google.maps.Map;
  panorama?: google.maps.StreetViewPanorama;
};

let hasAddedListener = false;

const Overlay = ({ map, panorama }: Props) => {
  const [currentUserType, setCurrentUserType] = useState<UserType>(
    "Construction"
  );
  const [markerList, setMarkerList] = useState<MarkerInfo[]>([]);
  const [newMarkerInfo, setNewMarkerInfo] = useState<NewMarkerInfo>({
    position: {
      lat: undefined,
      lng: undefined,
    },
    label: "New POI",
    description: "",
    type: "Construction",
  });

  const setNewMarkerAtCurrentPosition = () => {
    const lat = panorama?.getPosition()?.toJSON().lat;
    const lng = panorama?.getPosition()?.toJSON().lng;
    if (!lat || !lng) return;

    setNewMarkerInfo({ ...newMarkerInfo, position: { lat, lng } });
  };

  const handleCreateNewMarker = async (
    label: string,
    description: string,
    markerType: MarkerType
  ) => {
    if (!newMarkerInfo.position.lat || !newMarkerInfo.position.lng) return;

    const newMarker: MarkerInfo = {
      id: uuid(),
      position: {
        lat: newMarkerInfo.position.lat,
        lng: newMarkerInfo.position.lng,
      },
      description,
      label,
      type: markerType,
      confirmationProcess: "awaiting_confirmation_request",
      photoPaths: [],
    };
    setMarkerList([...markerList, { ...newMarker }]);
    await postNewMarkerInfo(newMarker);

    setNewMarkerInfo({
      ...newMarkerInfo,
      position: { lat: undefined, lng: undefined },
    });
  };

  const handleUpdateMarker = (markerId: string, markerInfo: MarkerInfo) => {
    const markerListCopy = [...markerList];
    const targetMarkerIndex = markerListCopy.findIndex(
      (marker) => marker.id === markerId
    );
    if (targetMarkerIndex < 0) return;

    markerListCopy[targetMarkerIndex] = markerInfo;
    setMarkerList(markerListCopy);
  };

  const handleDeleteMarker = async (markerId: string, markerIndex: number) => {
    await deleteMarker(markerId);
    const markerListCopy = [...markerList];
    markerListCopy.splice(markerIndex, 1);
    setMarkerList(markerListCopy);
  };

  useEffect(() => {
    if (!map || hasAddedListener) return;

    hasAddedListener = true;
    google.maps.event.addDomListener(map.getDiv(), "contextmenu", () => {
      const streetView = map.getStreetView();
      if (!streetView.getVisible()) return;

      console.log(streetView.getPov());
    });
  }, [map]);

  useEffect(() => {
    const getMarkerInfos = async () => {
      const data = await getAllMarkerInfos();
      setMarkerList(data);
    };

    getMarkerInfos();
  }, []);

  return (
    <>
      {markerList.map((markerInfo, index) => (
        <MarkerWithInfo
          key={markerInfo.id}
          map={map}
          panorama={panorama}
          markerInfo={markerInfo}
          markerIndex={index}
          currentUserType={currentUserType}
          handleUpdateMarker={handleUpdateMarker}
          handleDeleteMarker={handleDeleteMarker}
        />
      ))}
      {newMarkerInfo.position.lat && newMarkerInfo.position.lng && (
        <Marker
          options={{
            map: map,
            icon:
              "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00",
            label: "New POI",
          }}
          position={newMarkerInfo.position as MarkerPosition}
        />
      )}
      <MarkerCreator
        newMarkerInfo={newMarkerInfo}
        setNewMarkerInfo={setNewMarkerInfo}
        setNewMarkerAtCurrentPosition={setNewMarkerAtCurrentPosition}
        handleCreateNewMarker={handleCreateNewMarker}
      />
      <UserTypeSwitcher
        currentUserType={currentUserType}
        setCurrentUserType={setCurrentUserType}
      />
    </>
  );
};

export default Overlay;
