import { useEffect, useRef, useState } from "react";
import { getVendorListing } from "../../utils/firestore-vendor-listing";
import PropTypes from "prop-types";

const VendorItemsList = ({ vendor, selectItem, userType }) => {
  const [vendorListing, setVendorListing] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getVendorListing(
      vendorListing,
      setVendorListing,
      vendor,
      userType === "vendors",
    );

    return () => {
      setLoading(false);
      unsubscribe();
    };
  }, [userType, vendor, vendorListing]);

  const Actions = ({ id, active, price, qty }) => {
    if (userType === "users") {
      return (
        <>
          <p>RM{Number(price).toFixed(2)}</p>
          <button
            onClick={() => selectItem(id)}
            className="btn btn-primary btn-sm text-white shadow"
          >
            Reserve
          </button>
        </>
      );
    } else if (userType === "vendors") {
      return (
        <div className="leading-normal text-center">
          <div
            className={`badge ${
              active ? "badge-success" : "badge-error"
            } badge-sm text-white`}
          >
            {active || qty === 0 ? "Active" : "Inactive"}
          </div>
          <p>Qty: {qty}</p>
          <p>RM{Number(price).toFixed(2)}</p>
          <button
            onClick={() => selectItem(id)}
            className="btn btn-primary btn-sm text-white shadow"
          >
            Edit
          </button>
        </div>
      );
    } else if (userType === "charities") {
      return (
        <>
          <button
            onClick={() => selectItem(id)}
            className="btn btn-primary btn-sm text-white shadow"
          >
            Reserve
          </button>
        </>
      );
    }
  };

  Actions.propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    price: PropTypes.number,
    qty: PropTypes.number,
  };

  const ItemCard = ({vendor, id}) => {
    const { name, price, img, desc, qty, active } = vendor;
    const modalRef = useRef(null);
    return (
      <>
        <dialog id={id} className="modal" ref={modalRef}>
          <div className="modal-box p-0 w-[80vw] max-w-screen-sm">
            <img src={img} alt={name} className="w-screen" />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <div className="card card-compact bg-base-100 shadow-xl mb-8">
          <figure className="w-full h-48">
            <div
              onClick={() => modalRef.current.showModal()}
              className="cursor-zoom-in"
            >
              <img src={img} alt={name} className="object-cover" />
            </div>
          </figure>
          <div className="card-body !pe-2">
            <div className="flex flex-row gap-4 items-center">
              <div>
                <h2 className="card-title">{name}</h2>
                <p>{desc}</p>
              </div>
              <div className="flex flex-col gap-1 min-w-20 font-bold items-center">
                <Actions id={id} price={price} qty={qty} active={active} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  ItemCard.propTypes = {
    vendor: PropTypes.object,
    id: PropTypes.string,
  };

  return !loading ? (
    Object.keys(vendorListing).map((id) => {
      return <ItemCard vendor={vendorListing[id]} id={id} key={id} />;
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
  userType: PropTypes.string,
};

export default VendorItemsList;
