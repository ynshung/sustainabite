import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { getVendors } from "../../utils/get-vendors";
import { blueIcon, greyIcon } from "./MarkerIcons";
import CurrentLocation from "./CurrentLocation";

const MapList = ({ children, viewListing }) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

  const [vendors, setVendors] = useState({});

  useEffect(() => {
    getVendors(setVendors, null);
  }, []);

  const LocationMarker = (id) => {
    id = id.id;

    return (
      <Marker
        position={[vendors[id].latitude, vendors[id].longitude]}
        icon={
          vendors.activeItems && vendors.activeItems > 0 ? blueIcon : greyIcon
        }
      >
        <Popup>
          <div>
            <div className="flex flex-row gap-4 items-center mb-2">
              <img src={vendors[id].avatar} className="w-16" width={64} />
              <p className="font-bold">{vendors[id].orgName}</p>
            </div>
            {vendors[id].activeItems && vendors[id].activeItems ? (
              <>
                <span>Current Listing: {vendors[id].activeItems}</span>
                <br/>
                <span>Click <a onClick={() => viewListing(id)} className="link">here</a> to view listing</span>
              </>
            ) : (
              <span>No active listing</span>
            )}
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
        <CurrentLocation
          showPosition={true}
          jumpToCurrLoc={false} // TODO: change this to true for demo
          position={{ lat: 5.354669283327304, lng: 100.3015388795525 }}
        />
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
  children: PropTypes.node,
  viewListing: PropTypes.func,
};

export default MapList;
