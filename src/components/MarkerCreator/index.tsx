import {
  Button,
  ClickAwayListener,
  Fab,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import React, { ChangeEvent, useState } from "react";
import { Box, styled } from "@mui/system";
import { NewMarkerInfo } from "../Overlay";
import { MarkerType } from "../../types";

const Container = styled("div")({
  position: "relative",
});

const CreatorModal = styled(Box)({
  position: "absolute",
  left: 50,
  bottom: 50,
  backgroundColor: "white",
  width: 500,
  height: 400,
  display: "flex",
  gap: 8,
  flexDirection: "column",
  padding: 16,
  boxSizing: "border-box",
});

const Wrapper = styled("div")({
  position: "absolute",
  left: 24,
  bottom: 24,
  zIndex: 1,
});

const ContentContainer = styled("div")({
  overflowY: "scroll",
  display: "flex",
  gap: 8,
  flexDirection: "column",
});

type Props = {
  newMarkerInfo: NewMarkerInfo;
  setNewMarkerInfo: React.Dispatch<React.SetStateAction<NewMarkerInfo>>;
  setNewMarkerAtCurrentPosition: () => void;
  handleCreateNewMarker: (
    label: string,
    description: string,
    markerType: MarkerType
  ) => Promise<void>;
};

const MarkerCreator = ({
  newMarkerInfo,
  setNewMarkerInfo,
  setNewMarkerAtCurrentPosition,
  handleCreateNewMarker,
}: Props) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [label, setMarkerLabel] = useState<string>(newMarkerInfo.label);
  const [description, setMarkerDescription] = useState<string>(
    newMarkerInfo.description
  );
  const [markerType, setMarkerType] = useState<MarkerType>("Construction");

  const handleFabClicked = () => {
    if (isModalOpened) {
      setIsModalOpened(false);
      setNewMarkerInfo({
        ...newMarkerInfo,
        position: { lat: undefined, lng: undefined },
      });
      return;
    }

    setIsModalOpened(true);
  };

  const handleLatInputChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!newMarkerInfo.position) return;

    setNewMarkerInfo({
      ...newMarkerInfo,
      position: { ...newMarkerInfo.position, lat: parseFloat(e.target.value) },
    });
  };

  const handleLongInputChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!newMarkerInfo.position) return;

    setNewMarkerInfo({
      ...newMarkerInfo,
      position: { ...newMarkerInfo.position, lng: parseFloat(e.target.value) },
    });
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

  const handleMarkerTypeChange = (event: SelectChangeEvent) => {
    setMarkerType(event.target.value as MarkerType);
  };

  const handleCreateClicked = () => {
    setMarkerLabel("");
    setMarkerDescription("");
    setMarkerType("Construction");
    setIsModalOpened(false);
    handleCreateNewMarker(label, description, markerType);
  };

  return (
    <Wrapper>
      <Container>
        <Fab size="medium" color="primary" onClick={handleFabClicked}>
          {isModalOpened ? <Close /> : <Add />}
        </Fab>
        {isModalOpened && (
          <CreatorModal>
            <p>Add new POI</p>
            <ContentContainer>
              <TextField
                variant="filled"
                label="Latitude"
                type="number"
                value={newMarkerInfo.position.lat ?? ""}
                onChange={handleLatInputChanged}
              />
              <TextField
                variant="filled"
                label="Longtitude"
                type="number"
                value={newMarkerInfo.position.lng ?? ""}
                onChange={handleLongInputChanged}
              />
              <Button onClick={setNewMarkerAtCurrentPosition}>
                Set marker at current position
              </Button>
              <TextField
                value={label}
                variant="standard"
                onChange={handleMarkerLabelChanged}
                fullWidth
              />
              <span>Description</span>
              <TextField
                value={description}
                multiline
                onChange={handleMarkerDescriptionChanged}
                rows={5}
                variant="filled"
                fullWidth
              />
              <Select
                value={markerType}
                label="Marker type"
                onChange={handleMarkerTypeChange}
              >
                <MenuItem value={"Construction"}>Construction</MenuItem>
                <MenuItem value={"Delivery"}>Delivery</MenuItem>
              </Select>
            </ContentContainer>
            <Button onClick={handleCreateClicked}>Add</Button>
          </CreatorModal>
        )}
      </Container>
    </Wrapper>
  );
};

export default MarkerCreator;
