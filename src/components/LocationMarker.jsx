import { useEffect, useMemo, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";

const LocationMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition],
  );
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.setView(e.latlng, map.getZoom());
    });
  }, [map, setPosition]);

  return position === null ? null : (
    <Marker
      position={position}
      eventHandlers={eventHandlers}
      ref={markerRef}
      draggable
    >
      <Popup>Your vendor&apos;s location</Popup>
    </Marker>
  );
};

LocationMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setPosition: PropTypes.func,
};

export default LocationMarker;
