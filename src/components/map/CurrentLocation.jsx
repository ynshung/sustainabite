import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import { yellowIcon } from "./MarkerIcons";

const CurrentLocation = ({
  position = null,
  setPosition = null,
  showPosition = true,
  jumpToCurrLoc = true,
  initalSetCurrLoc = false,
}) => {
  const map = useMap();
  const [locatedPosition, setLocatedPosition] = useState(null);

  useEffect(() => {
    if (!locatedPosition) {
      map.locate().on("locationfound", function (e) {
        if (setPosition !== null && initalSetCurrLoc) setPosition(e.latlng);
        setLocatedPosition(e.latlng)
        if (jumpToCurrLoc) map.setView(e.latlng, map.getZoom());
        else if (position) map.setView(position, map.getZoom());
      });
    } else if (!jumpToCurrLoc && position !== null) {
      map.setView(position, map.getZoom());
    }
  }, [
    map,
    setPosition,
    position,
    jumpToCurrLoc,
    locatedPosition,
    initalSetCurrLoc,
  ]);

  return (
    <>
      {locatedPosition && showPosition === true ? (
        <Marker position={locatedPosition} icon={yellowIcon}>
          <Popup>
            <span>You are here!</span>
          </Popup>
        </Marker>
      ) : (
        <></>
      )}
    </>
  );
};

CurrentLocation.propTypes = {
  showPosition: PropTypes.bool,
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setPosition: PropTypes.func,
  jumpToCurrLoc: PropTypes.bool,
  initalSetCurrLoc: PropTypes.bool,
};

export default CurrentLocation;
