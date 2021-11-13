import axios from "axios";
import { MarkerInfo } from "../types";

export const getAllMarkerInfos: () => Promise<MarkerInfo[]> = async () => {
  const response = await axios.get("http://localhost:3001/markers");
  return response.data;
};

export const postNewMarkerInfo = async (newMarkerInfo: MarkerInfo) => {
  await axios.post("http://localhost:3001/markers", newMarkerInfo);
};

export const updateMarker = async (
  markerId: string,
  markerInfo: MarkerInfo
) => {
  await axios.put(`http://localhost:3001/markers/${markerId}`, markerInfo);
};

export const deleteMarker = async (markerId: string) => {
  await axios.delete(`http://localhost:3001/markers/${markerId}`);
};
