import { Close } from "@mui/icons-material";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import Dropzone, { DropEvent } from "react-dropzone";
import { v4 as uuid } from "uuid";
import { updateMarker } from "../../../services/markers";
import { MarkerInfo, PhotoInfo } from "../../../types";

const MainContainer = styled("div")({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const ContentContainer = styled("div")({
  flex: 1,
  overflowY: "scroll",
});

const FooterContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const DropzoneContainer = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: 8,
});

type Props = {
  // markerIndex: number;
  markerInfo: MarkerInfo;
  addInfoWindowClosedHandler: (handlers: Array<() => void>) => void;
  handleUpdateMarker: (markerId: string, markerInfo: MarkerInfo) => void;
};

const DeliveryInfo = ({
  // markerIndex,
  markerInfo,
  addInfoWindowClosedHandler,
  handleUpdateMarker,
}: Props) => {
  const getDefaultStep = () => {
    switch (markerInfo.confirmationProcess) {
      default:
      case "awaiting_confirmation_request":
        return 0;
      case "confirmed_request":
      case "sent_request":
        return 2;
    }
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(getDefaultStep());
  const [photoPaths, setPhotoPaths] = useState<PhotoInfo[]>(markerInfo.photoPaths);

  useEffect(() => {
    addInfoWindowClosedHandler([
      () => {
        setCurrentStepIndex(0);
      },
    ]);
  }, []);

  const handleFileAccepted = (files: File[], event: DropEvent) => {
    const newFilesPaths: PhotoInfo[] = [];
    files.forEach((file) => {
      newFilesPaths.push({ id: uuid(), name: file.name });
    });
    setPhotoPaths([...photoPaths, ...newFilesPaths]);
  };

  const handleRemoveFile = (fileId: string) => {
    const photoPathsCopy = [...photoPaths];
    const targetFileIndex = photoPathsCopy.findIndex(
      (photo) => photo.id === fileId
    );
    if (targetFileIndex < 0) return;

    photoPathsCopy.splice(targetFileIndex, 1);
    setPhotoPaths(photoPathsCopy);
  };

  const getConfirmationText = () => {
    switch (markerInfo.confirmationProcess) {
      default:
      case "awaiting_confirmation_request":
        return "Request Confirmation";
      case "confirmed_request":
        return "Confirmed";
      case "sent_request":
        return "Awaiting Confirmation";
    }
  };

  const handleRequestConfirmation = async () => {
    const markerInfoCopy = { ...markerInfo };
    markerInfoCopy.confirmationProcess = "sent_request";
    markerInfoCopy.photoPaths = photoPaths;
    await updateMarker(markerInfo.id, markerInfoCopy);
    handleUpdateMarker(markerInfo.id, markerInfoCopy);
  };

  return (
    <>
      <MainContainer>
        {currentStepIndex === 0 && (
          <>
            <Typography variant="h6">{markerInfo.label}</Typography>
            <Typography>Delivery information:</Typography>
            <ContentContainer>
              <Typography>{markerInfo.description}</Typography>
            </ContentContainer>
            <FooterContainer>
              <Button onClick={() => setCurrentStepIndex(1)}>
                Confirm Delivery
              </Button>
            </FooterContainer>
          </>
        )}
        {currentStepIndex === 1 && (
          <>
            <Typography>Please add photos to confirm delivery:</Typography>
            <ContentContainer>
              <Dropzone onDropAccepted={handleFileAccepted} accept={"image/*"}>
                {({ getRootProps, getInputProps }) => (
                  <DropzoneContainer {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </DropzoneContainer>
                )}
              </Dropzone>
              <List>
                {photoPaths.map((photo) => {
                  return (
                    <ListItem key={photo.id}>
                      <ListItemIcon>
                        <Button onClick={() => handleRemoveFile(photo.id)}>
                          <Close />
                        </Button>
                      </ListItemIcon>
                      <ListItemText>{photo.name}</ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </ContentContainer>
            <Button
              disabled={photoPaths.length === 0}
              onClick={() => setCurrentStepIndex(2)}
            >
              Continue
            </Button>
          </>
        )}
        {currentStepIndex === 2 && (
          <>
            <Typography>Please confirm the delivery:</Typography>
            <ContentContainer>
              <Typography>Added photos:</Typography>
              <List>
                {photoPaths.map((photo) => {
                  return (
                    <ListItem key={photo.id}>
                      <ListItemText>{photo.name}</ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </ContentContainer>
            <Button
              disabled={
                markerInfo.confirmationProcess !==
                "awaiting_confirmation_request"
              }
              onClick={handleRequestConfirmation}
            >
              {getConfirmationText()}
            </Button>
          </>
        )}
      </MainContainer>
    </>
  );
};

export default DeliveryInfo;
