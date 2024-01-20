import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import { yellowIcon } from "./MarkerIcons";

const CurrentLocation = ({
  position = null,
  setPosition = null,
  showPosition = true,
  jumpToCurrLoc = true,
}) => {
  const map = useMap();
  let locatedPosition = useRef(null);

  useEffect(() => {
    if (locatedPosition.current === null) {
      map.locate().on("locationfound", function (e) {
        if (setPosition !== null) setPosition(e.latlng);
        locatedPosition.current = e.latlng;
        if (jumpToCurrLoc) map.setView(e.latlng, map.getZoom());
        else map.setView(position, map.getZoom());
      });
    } else if (!jumpToCurrLoc && position !== null) {
      map.setView(position, map.getZoom());
    }
  }, [map, setPosition, position, jumpToCurrLoc]);

  return (
    <>
      {showPosition === true && locatedPosition.current !== null ? (
        <Marker position={locatedPosition.current} icon={yellowIcon}>
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
};

export default CurrentLocation;
