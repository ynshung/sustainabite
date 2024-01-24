import PropTypes from "prop-types";
import { haversineDistanceFormatted } from "../../utils/haversine-distance";
import { useEffect, useState } from "react";
import { RiPinDistanceFill } from "react-icons/ri";

const VendorList = ({ vendors, viewListing, doGetCurrLoc = true }) => {
  const [currLoc, setCurrLoc] = useState({});

  useEffect(() => {
    if (doGetCurrLoc) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrLoc([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, [doGetCurrLoc]);

  return Object.keys(vendors)
    .map((vendorID) => {
      const { avatar, orgName, activeItems, latitude, longitude } =
        vendors[vendorID];
      const distance =
        currLoc &&
        latitude &&
        longitude &&
        haversineDistanceFormatted(currLoc[0], currLoc[1], latitude, longitude);

      return {
        vendorID,
        avatar,
        orgName,
        activeItems,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .map(({ vendorID, avatar, orgName, activeItems, distance }) => {
      return (
        <div
          className="card card-compact card-side bg-base-100 shadow-xl mb-6"
          key={vendorID}
        >
          <div className="card-body">
            <div className="flex flex-row gap-4 items-center justify-between">
              <div className="flex flex-row gap-4 items-center">
                <img src={avatar} alt={orgName} className="object-cover w-16" />
                <div>
                  <h2 className="card-title">{orgName}</h2>
                  <p>
                    {activeItems ? activeItems : "No"} active listing
                    {activeItems > 1 && "s"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 font-bold justify-center items-center">
                {distance !== "" && (
                  <p className="text-center text-nowrap">
                    <RiPinDistanceFill className="inline mr-1" />
                    {distance}
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
    });
};

VendorList.propTypes = {
  doGetCurrLoc: PropTypes.bool,
  viewListing: PropTypes.func,
  vendors: PropTypes.object,
};

export default VendorList;
