import {
  Button,
  ClickAwayListener,
  Fab,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import React, { ChangeEvent, useState } from 'react';
import { Box, styled } from '@mui/system';

const POIFab = styled(Fab)({});

const Container = styled('div')({
  position: 'relative',
});

const CreatorModal = styled(Box)({
  position: 'absolute',
  right: 50,
  bottom: 50,
  backgroundColor: 'white',
  width: '500px',
  height: '400px',
});

const Wrapper = styled('div')({
  position: 'absolute',
  bottom: 24,
  right: 24,
  zIndex: 1,
});

type Props = {
  newPOILat: number;
  newPOILong: number;
  setNewPOILat: React.Dispatch<React.SetStateAction<number>>;
  setNewPOILong: React.Dispatch<React.SetStateAction<number>>;
};

const POICreator = ({
  newPOILat,
  newPOILong,
  setNewPOILat,
  setNewPOILong,
}: Props) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleFabClicked = () => {
    setIsModalOpened(true);
  };

  const handleModelClosed = () => {
    setIsModalOpened(false);
  };

  const handleLatInputChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewPOILat(parseFloat(e.target.value));
  };

  const handleLongInputChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewPOILong(parseFloat(e.target.value));
  };

  return (
    <Wrapper>
      <Container>
        <POIFab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleFabClicked}
        >
          <Add />
        </POIFab>
        {isModalOpened && (
          <ClickAwayListener onClickAway={handleModelClosed}>
            <CreatorModal>
              <p>Creator</p>
              <TextField
                variant="filled"
                label="Latitude"
                type="number"
                defaultValue={newPOILat}
                onChange={handleLatInputChanged}
              />
              <TextField
                variant="filled"
                label="Longtitude"
                type="number"
                defaultValue={newPOILong}
                onChange={handleLongInputChanged}
              />
              <Button>Add POI</Button>
            </CreatorModal>
          </ClickAwayListener>
        )}
      </Container>
    </Wrapper>
  );
};

export default POICreator;
