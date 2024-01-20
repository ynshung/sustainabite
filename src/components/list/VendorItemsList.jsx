import { useEffect, useState } from "react";
import { getVendorListing } from "../../utils/get-vendor-listing";
import PropTypes from "prop-types";

const VendorItemsList = ({ vendor, selectItem }) => {
  const [vendorListing, setVendorListing] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getVendorListing(
      vendorListing,
      setVendorListing,
      vendor,
    );
    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, [vendorListing, vendor]);

  return !loading ? (
    Object.keys(vendorListing).map((id) => {
      const { name, price, img, description } = vendorListing[id];
      return (
        <div className="card card-compact bg-base-100 shadow-xl mb-8" key={id}>
          <figure className="w-full h-48">
            <a href={img} target="_blank" rel="noreferrer">
              <img src={img} alt={name} className="object-cover" />
            </a>
          </figure>
          <div className="card-body">
            <div className="flex flex-row gap-4 items-center">
              <div>
                <h2 className="card-title">{name}</h2>
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-1 font-bold items-center">
                <p>RM{Number(price).toFixed(2)}</p>
                <button
                  onClick={() => selectItem(id)}
                  className="btn btn-primary btn-sm text-white"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div className="flex justify-center my-8">
      <progress className="progress w-56 mx-auto progress-primary" />
    </div>
  );
};

VendorItemsList.propTypes = {
  vendor: PropTypes.string,
  selectItem: PropTypes.func,
};

export default VendorItemsList;
