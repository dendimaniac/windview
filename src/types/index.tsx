export type MarkerType = "Delivery" | "Construction";
export type UserType = MarkerType | "Management";

export type PhotoInfo = { id: string; name: string };

export type MarkerPosition = {
  lat: number;
  lng: number;
};

export type ConfirmationProcess =
  | "awaiting_confirmation_request"
  | "sent_request"
  | "confirmed_request";

export type MarkerInfo = {
  id: string;
  position: MarkerPosition;
  label: string;
  description: string;
  type: MarkerType;
  confirmationProcess: ConfirmationProcess;
  photoPaths: PhotoInfo[];
};
