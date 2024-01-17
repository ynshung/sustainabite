import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { getVendors } from "../../utils/get-vendors";

const MapList = ({ children }) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

  const [vendors, setVendors] = useState({});

  useEffect(() => {
    getVendors(setVendors, null);
  }, []);

  const LocationMarker = (id) => {
    id = id.id;

    return (
      <Marker position={[vendors[id].latitude, vendors[id].longitude]}>
        <Popup>
          <div className="flex flex-row gap-4 items-center w-max">
            <img src={vendors[id].avatar} className="w-16" width={64} />
            <d className="font-bold">{vendors[id].orgName}</d>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      <MapContainer
        center={[5.354669283327304, 100.3015388795525]}
        zoom={16}
        className="h-96 w-full mx-auto"
      >
        {children}
        {Object.keys(vendors).map((id) => (
          <LocationMarker key={id} id={id} />
        ))}
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> '
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`}
          id="mapbox/streets-v12"
        />
      </MapContainer>
    </>
  );
};

MapList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MapList;
