import { useEffect, useRef, useState } from "react";
import { getVendorListing } from "../../utils/firestore-vendor-listing";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { createReservation } from "../../utils/firestore-reservations";
import { toast } from "react-toastify";

const VendorItemsList = ({ vendor, selectItem, userType, userUID }) => {
  const [vendorListing, setVendorListing] = useState({});
  const [loading, setLoading] = useState(true);

  const preSelectItem = async (id, maxQty, itemPrice) => {
    const { value: qty } = await Swal.fire({
      title: "Reserve Quantity",
      html: `How much you would like to reserve?<br/><b>Maximum: ${maxQty}</b>`,
      input: "number",
      inputPlaceholder: "Enter quantity",
      showCancelButton: true,
      inputAttributes: {
        min: 1,
        max: maxQty,
        range: 1,
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a quantity!";
        } else if (value > maxQty) {
          return "You cannot reserve more than the maximum quantity!";
        }
      },
    });

    if (!qty) return;

    const { value: confirm } = await Swal.fire({
      title: "Confirm reservation?",
      html: `You are reserving <b>${qty} item${
        qty > 1 ? "s" : ""
      }</b>.<br/>Total price: <b>RM${(qty * itemPrice).toFixed(
        2,
      )}</b> (COD)<br/><br/>Please make sure to click "Confirm Pickup" after you have picked up your items.`,
      showCancelButton: true,
    });

    if (confirm) {
      // Item ID, Quantity, Vendor ID
      createReservation(userUID, id, qty, vendor);
      toast.success("Reservation created!");
    }
  };

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
            onClick={() => preSelectItem(id, qty, price)}
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
      return <p>Not implemented yet</p>;
    }
  };

  Actions.propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    price: PropTypes.number,
    qty: PropTypes.number,
  };

  const ItemCard = ({ vendor, id }) => {
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
        <div className="card card-compact bg-base-100 shadow-lg mb-8">
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
  userUID: PropTypes.string,
};

export default VendorItemsList;
