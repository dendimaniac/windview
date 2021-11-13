import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { updateMarker } from "../../../services/markers";
import { MarkerInfo } from "../../../types";

const MainContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const ContentContainer = styled("div")({
  flex: 1,
  overflowY: "scroll",
});

type Props = {
  // markerIndex: number;
  markerInfo: MarkerInfo;
  handleUpdateMarker: (markerId: string, markerInfo: MarkerInfo) => void;
};

const ManagementInfo = ({
  // markerIndex,
  markerInfo,
  handleUpdateMarker,
}: Props) => {
  const getConfirmationText = () => {
    switch (markerInfo.confirmationProcess) {
      default:
      case "awaiting_confirmation_request":
        return "Awaiting Request";
      case "confirmed_request":
        return "Confirmed";
      case "sent_request":
        return "Send Confirmation";
    }
  };

  const handleSendConfirmation = async () => {
    const markerInfoCopy = { ...markerInfo };
    markerInfoCopy.confirmationProcess = "confirmed_request";
    await updateMarker(markerInfo.id, markerInfoCopy);
    handleUpdateMarker(markerInfo.id, markerInfoCopy);
  };

  return (
    <>
      <MainContainer>
        <Typography>Please confirm the delivery:</Typography>
        <ContentContainer>
          <Typography>Added photos:</Typography>
          <List>
            {markerInfo.photoPaths.map((photo) => {
              return (
                <ListItem key={photo.id}>
                  <ListItemText>{photo.name}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </ContentContainer>
        <Button
          disabled={markerInfo.confirmationProcess !== "sent_request"}
          onClick={handleSendConfirmation}
        >
          {getConfirmationText()}
        </Button>
      </MainContainer>
    </>
  );
};

export default ManagementInfo;
