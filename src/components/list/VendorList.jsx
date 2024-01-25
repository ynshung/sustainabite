import PropTypes from "prop-types";
import {
  haversineDistance,
  haversineDistanceFormatted,
} from "../../utils/haversine-distance";
import { useEffect, useState } from "react";
import { RiPinDistanceFill } from "react-icons/ri";
import { LuMapPinOff } from "react-icons/lu";

const VendorList = ({ vendors, viewListing, doGetCurrLoc = true }) => {
  const [currLoc, setCurrLoc] = useState({});
  const [locError, setLocError] = useState(null);

  useEffect(() => {
    if (doGetCurrLoc) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrLoc([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log(error.message);
          setLocError(error);
        },
      );
    }
  }, [doGetCurrLoc]);

  return (
    <>
      <h2 className="mb-2 flex items-center gap-2 justify-between">
        <span className="text-xl font-bold">Vendors Near You</span>
        {locError && (
          <div
            className="badge badge-accent font-normal flex gap-1 py-3 tooltip tooltip-bottom tooltip-secondary"
            data-tip={`Error: ${locError.message}`}
          >
            <LuMapPinOff /> Could not locate user!
          </div>
        )}
      </h2>

      {Object.keys(vendors)
        .map((vendorID) => {
          const { avatar, orgName, activeItems, latitude, longitude } =
            vendors[vendorID];
          const distance =
            currLoc &&
            latitude &&
            longitude &&
            haversineDistance(currLoc[0], currLoc[1], latitude, longitude);
          const distanceFormatted =
            currLoc &&
            latitude &&
            longitude &&
            haversineDistanceFormatted(
              currLoc[0],
              currLoc[1],
              latitude,
              longitude,
            );

          return {
            vendorID,
            avatar,
            orgName,
            activeItems,
            distance,
            distanceFormatted,
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .map(
          ({ vendorID, avatar, orgName, activeItems, distanceFormatted }) => {
            return (
              <div
                className="card card-compact card-side bg-base-100 shadow-md mb-6"
                key={vendorID}
              >
                <div className="card-body">
                  <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="flex flex-row gap-4 items-center">
                      <img
                        src={avatar}
                        alt={orgName}
                        className="object-cover w-16"
                      />
                      <div>
                        <h2 className="card-title">{orgName}</h2>
                        <p>
                          {activeItems ? activeItems : "No"} active listing
                          {activeItems > 1 && "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 font-bold justify-center items-center">
                      {distanceFormatted !== "" && (
                        <p className="text-center text-nowrap">
                          <RiPinDistanceFill
                            className={`inline mr-1${
                              !distanceFormatted ? " hidden" : ""
                            }`}
                          />
                          {distanceFormatted}
                        </p>
                      )}
                      <button
                        onClick={() => viewListing(vendorID)}
                        className="btn btn-primary btn-sm text-white text-nowrap"
                        disabled={!activeItems}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        )}
    </>
  );
};

VendorList.propTypes = {
  doGetCurrLoc: PropTypes.bool,
  viewListing: PropTypes.func,
  vendors: PropTypes.object,
};

export default VendorList;
