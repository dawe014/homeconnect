import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationMap({
  address,
  latitude,
  longitude,
}: LocationMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center h-96 w-full rounded-lg bg-gray-100 text-gray-500">
        Map data is not available for this property.
      </div>
    );
  }

  const position: LatLngExpression = [latitude, longitude];

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg border">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
