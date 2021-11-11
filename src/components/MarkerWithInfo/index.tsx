import { Close, Edit, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { Marker, InfoWindow } from "@react-google-maps/api";
import React, { ChangeEvent, useState } from "react";
import { MarkerInfo } from "../../types";
import { updateMarker } from "../../services/markers";

const MainContainer = styled("div")({
  background: "white",
  padding: 15,
  width: 300,
  height: 200,
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const ContentContainer = styled("div")({
  overflowY: "scroll",
});

const FooterContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

type Props = {
  map?: google.maps.Map;
  panorama?: google.maps.StreetViewPanorama;
  markerIndex: number;
  markerInfo: MarkerInfo;
  handleMarkerUpdate: (markerIndex: number, markerInfo: MarkerInfo) => void;
};

const MarkerWithInfo = ({
  map,
  panorama,
  markerIndex,
  markerInfo,
  handleMarkerUpdate,
}: Props) => {
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
  const [markerLabel, setMarkerLabel] = useState(markerInfo.label);
  const [markerDescription, setMarkerDescription] = useState(
    markerInfo.description
  );
  const [canEdit, setCanEdit] = useState(false);

  const onInfoWindowLoad = (infoWindowInstance: google.maps.InfoWindow) => {
    setInfoWindow(infoWindowInstance);
  };

  const handleMarkerLabelChanged = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMarkerLabel(e.target.value);
  };

  const handleMarkerDescriptionChanged = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMarkerDescription(e.target.value);
  };

  const handleSaveMarkerInfo = async () => {
    const newMarkerInfo: MarkerInfo = {
      ...markerInfo,
      label: markerLabel,
      description: markerDescription,
    };
    await updateMarker(markerInfo.id, newMarkerInfo);
    handleMarkerUpdate(markerIndex, newMarkerInfo);
  };

  return (
    <>
      {
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
          <InfoWindow onLoad={onInfoWindowLoad} position={markerInfo.position}>
            <MainContainer>
              <TextField
                value={markerLabel}
                variant="standard"
                onChange={handleMarkerLabelChanged}
                disabled={!canEdit}
                fullWidth
              />
              <span>Description</span>
              <ContentContainer>
                <TextField
                  value={markerDescription}
                  multiline
                  onChange={handleMarkerDescriptionChanged}
                  rows={5}
                  variant="filled"
                  disabled={!canEdit}
                  fullWidth
                />
              </ContentContainer>
              <FooterContainer>
                <Button
                  onClick={() => {
                    setCanEdit(!canEdit);
                  }}
                >
                  {canEdit ? <Close /> : <Edit />}
                </Button>
                <Button
                  onClick={() => {
                    setCanEdit(false);
                    handleSaveMarkerInfo();
                  }}
                >
                  <Save />
                </Button>
              </FooterContainer>
            </MainContainer>
          </InfoWindow>
        </>
      }
    </>
  );
};

export default MarkerWithInfo;
