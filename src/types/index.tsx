export type MarkerType = "Delivery" | "Construction" | "Management";
export type UserType = MarkerType;

export type MarkerPosition = {
  lat: number;
  lng: number;
};

export type MarkerInfo = {
  id: string;
  position: MarkerPosition;
  label: string;
  description: string;
  type: MarkerType;
};
