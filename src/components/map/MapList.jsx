import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useRef } from "react";
import { blueIcon, greyIcon, redIcon } from "./MarkerIcons";
import CurrentLocation from "./CurrentLocation";

const MapList = ({ viewListing, selectedVendorID, vendors }) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

  const popupElement = useRef(null);

  const selectVendor = (vendorID) => {
    viewListing(vendorID);
    popupElement.current._closeButton.click();
  };

  const LocationMarker = ({ vendorID, vendorData }) => {
    return (
      <Marker
        position={[vendorData.latitude, vendorData.longitude]}
        icon={
          selectedVendorID === vendorID
            ? redIcon
            : vendorData.activeItems && vendorData.activeItems > 0
              ? blueIcon
              : greyIcon
        }
      >
        <Popup ref={popupElement}>
          <div>
            <div className="flex flex-row gap-4 items-center mb-2">
              <img src={vendorData.avatar} className="w-16" width={64} />
              <p className="font-bold">{vendorData.orgName}</p>
            </div>
            {vendorData.activeItems && vendorData.activeItems ? (
              <div className="mx-auto text-center">
                <div>
                  {vendorData.activeItems} active listing
                  {vendorData.activeItems > 1 && "s"}
                </div>
                <button
                  className="btn btn-primary btn-sm text-white mx-auto text-center mt-2"
                  onClick={() => selectVendor(vendorID)}
                >
                  View Listing
                </button>
              </div>
            ) : (
              <div className="text-center">No active listing</div>
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
        center={[5.356205, 100.296206]}
        zoom={16}
        className="h-96 w-full mx-auto"
      >
        <CurrentLocation
          showPosition={true}
          jumpToCurrLoc={false} // TODO: change this to true for demo
        />
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
  selectedVendorID: PropTypes.string,
  vendors: PropTypes.object,
};

export default MapList;
