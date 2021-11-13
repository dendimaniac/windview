import { Close, Delete, Edit, Save } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { ChangeEvent, useState } from "react";
import { MarkerInfo } from "../../../types";
import { updateMarker } from "../../../services/markers";

const MainContainer = styled("div")({
  height: "100%",
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
  justifyContent: "space-between",
});

type Props = {
  infoWindow?: google.maps.InfoWindow;
  markerIndex: number;
  markerInfo: MarkerInfo;
  handleUpdateMarker: (markerId: string, markerInfo: MarkerInfo) => void;
  handleDeleteMarker: (markerId: string, markerIndex: number) => Promise<void>;
};

const ConstructionInfo = ({
  infoWindow,
  markerIndex,
  markerInfo,
  handleUpdateMarker,
  handleDeleteMarker,
}: Props) => {
  const [markerLabel, setMarkerLabel] = useState(markerInfo.label);
  const [markerDescription, setMarkerDescription] = useState(
    markerInfo.description
  );
  const [canEdit, setCanEdit] = useState(false);

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
    handleUpdateMarker(markerInfo.id, newMarkerInfo);
  };

  const handleDeleteClicked = async () => {
    setCanEdit(false);
    infoWindow?.close();
    handleDeleteMarker(markerInfo.id, markerIndex);
  };

  return (
    <>
      <MainContainer>
        <TextField
          value={markerLabel}
          variant="standard"
          onChange={handleMarkerLabelChanged}
          disabled={!canEdit}
          fullWidth
        />
        <ContentContainer>
          <Typography>Type: {markerInfo.type}</Typography>
          <Typography>Description</Typography>
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
          {markerInfo.confirmationProcess !== "confirmed_request" ? (
            <>
              <div>
                <Button color="error" onClick={handleDeleteClicked}>
                  <Delete />
                </Button>
              </div>
              <div>
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
              </div>
            </>
          ) : (
            <Typography>Done</Typography>
          )}
        </FooterContainer>
      </MainContainer>
    </>
  );
};

export default ConstructionInfo;
