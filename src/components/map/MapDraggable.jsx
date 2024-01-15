import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "../LocationMarker";
import PropTypes from "prop-types";

function MapDraggable({ position, setPosition }) {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;
  return (
    <div className="">
      <MapContainer
        center={[5.354669283327304, 100.3015388795525]}
        zoom={16}
        className="h-64 mx-auto"
      >
        <LocationMarker position={position} setPosition={setPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> '
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`}
          id="mapbox/streets-v12"
        />
        {/* <Marker position={[5.354669283327304, 100.3015388795525]}>
          <Popup>
            School of Computer Sciences, <br />
            Universiti Sains Malaysia
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  );
}

MapDraggable.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setPosition: PropTypes.func,
};

export default MapDraggable;
