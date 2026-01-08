import { useContext } from "react";
import { RideContext } from "./rideContext";

export const useRide = () => useContext(RideContext);