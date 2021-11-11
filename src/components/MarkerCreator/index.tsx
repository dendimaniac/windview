import { Button, ClickAwayListener, Fab, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { ChangeEvent, useState } from "react";
import { Box, styled } from "@mui/system";
import { NewMarkerInfo } from "../Overlay";

const Container = styled("div")({
  position: "relative",
});

const CreatorModal = styled(Box)({
  position: "absolute",
  left: 50,
  bottom: 50,
  backgroundColor: "white",
  width: "500px",
  height: "400px",
});

const Wrapper = styled("div")({
  position: "absolute",
  left: 24,
  bottom: 24,
  zIndex: 1,
});

type Props = {
  newMarkerInfo: NewMarkerInfo;
  setNewMarkerInfo: React.Dispatch<React.SetStateAction<NewMarkerInfo>>;
  setNewMarkerAtCurrentPosition: () => void;
  handleCreateNewMarker: () => Promise<void>;
};

const MarkerCreator = ({
  newMarkerInfo,
  setNewMarkerInfo,
  setNewMarkerAtCurrentPosition,
  handleCreateNewMarker,
}: Props) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleFabClicked = () => {
    setIsModalOpened(true);
  };

  const handleModelClosed = () => {
    setNewMarkerInfo({
      ...newMarkerInfo,
      position: { lat: undefined, lng: undefined },
    });
    setIsModalOpened(false);
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

  return (
    <Wrapper>
      <Container>
        <Fab
          size="medium"
          color="primary"
          onClick={handleFabClicked}
        >
          <Add />
        </Fab>
        {isModalOpened && (
          <ClickAwayListener onClickAway={handleModelClosed}>
            <CreatorModal>
              <p>Creator</p>
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
              <Button
                onClick={() => {
                  handleCreateNewMarker();
                  setIsModalOpened(false);
                }}
              >
                Add POI
              </Button>
            </CreatorModal>
          </ClickAwayListener>
        )}
      </Container>
    </Wrapper>
  );
};

export default MarkerCreator;
