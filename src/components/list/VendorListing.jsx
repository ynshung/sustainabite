import { useEffect, useState } from "react";
import { getVendorListing } from "../../utils/get-vendor-listing";
import PropTypes from "prop-types";
import { FaCircleInfo, FaList, FaPencil } from "react-icons/fa6";

const VendorListing = ({ vendor }) => {
  const [vendorListing, setVendorListing] = useState({});

  useEffect(() => {
    getVendorListing(setVendorListing, vendor, null);
  }, [vendor]);

  return (
    <>
      <div className="flex flex-col gap-4 m-8">
        {Object.keys(vendorListing).map((id) => {
          const { name, img, qty, description } = vendorListing[id];
          return (
            <div className="card lg:card-side bg-base-100 shadow-xl" key={id}>
              <figure>
                <img src={img} alt={name} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

VendorListing.propTypes = {
  vendor: PropTypes.string,
};

export default VendorListing;
