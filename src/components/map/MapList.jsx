import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { getVendors } from "../../utils/get-vendors";
import { blueIcon, greyIcon } from "./MarkerIcons";
import CurrentLocation from "./CurrentLocation";

const MapList = ({ children, viewListing }) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

  const [vendors, setVendors] = useState({});

  const popupElement = useRef(null);

  useEffect(() => {
    getVendors(setVendors, null);
  }, []);

  const selectVendor = (vendorID) => {
    viewListing(vendorID);
    popupElement.current._closeButton.click();
  }

  const LocationMarker = ({ vendorID, vendorData }) => {
    return (
      <Marker
        position={[vendorData.latitude, vendorData.longitude]}
        icon={
          vendors.activeItems && vendors.activeItems > 0 ? blueIcon : greyIcon
        }
      >
        <Popup ref={popupElement}>
          <div>
            <div className="flex flex-row gap-4 items-center mb-2">
              <img src={vendorData.avatar} className="w-16" width={64} />
              <p className="font-bold">{vendorData.orgName}</p>
            </div>
            {vendorData.activeItems && vendorData.activeItems ? (
              <>
                <span>Current Listing: {vendorData.activeItems}</span>
                <br />
                <span>
                  Click{" "}
                  <a onClick={() => selectVendor(vendorID)} className="link">
                    here
                  </a>{" "}
                  to view listing
                </span>
              </>
            ) : (
              <span>No active listing</span>
            )}
          </div>
        </Popup>
      </Marker>
    );
  };

  LocationMarker.propTypes = {
    vendorID: PropTypes.string,
    vendorData: PropTypes.object,
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
          <LocationMarker key={id} vendorID={id} vendorData={vendors[id]} />
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
