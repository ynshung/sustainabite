import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getReservations } from "../../utils/firestore-reservations";
import { getSpecificUser } from "../../utils/firestore-user";
import { getSpecificListing } from "../../utils/firestore-vendor-listing";
import { format, formatDistanceToNow } from "date-fns";
import {
  FaClock,
  FaPhone,
  FaReceipt,
  FaStore,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import { getSpecificVendor } from "../../utils/firestore-vendors";

const ReservationList = ({
  userUID,
  userType,
  reportReservation,
  confirmPickup,
}) => {
  let [reservations, setReservations] = useState(null);

  useEffect(() => {
    const unsubscribe = getReservations(
      reservations,
      setReservations,
      userUID,
      userType.slice(0, -1),
    );

    return () => {
      unsubscribe();
    };
  }, [reservations, userUID, userType]);

  const ReservationDetails = ({ reservation, id }) => {
    const [user, setUser] = useState(null);
    const [item, setItem] = useState(null);
    const [vendor, setVendor] = useState(null);

    const [reservationDate, setReservationDate] = useState(
      reservation.createdAt.toDate() ?? null,
    );

    useEffect(() => {
      getSpecificListing(reservation.listing).then((res) => {
        setItem(res);
      });
      if (userType !== "users")
        getSpecificUser(reservation.user).then((res) => {
          setUser(res);
        });
      if (userType !== "vendors")
        getSpecificVendor(reservation.vendor).then((res) => {
          setVendor(res);
        });
    }, [reservation]);

    useEffect(() => {
      const dateInterval = setInterval(() => {
        if (reservation) {
          setReservationDate(reservation.createdAt.toDate());
        }
      }, 5000);

      return () => {
        clearInterval(dateInterval);
      };
    }, [reservation]);

    const normalizedPhoneNumber = (phoneNumber) => {
      if (!phoneNumber) return;
      phoneNumber = phoneNumber.replace(/\s/g, "");
      if (phoneNumber.substring(0, 2) !== "+6") {
        return "+6" + phoneNumber;
      } else if (phoneNumber.charAt(0) !== "+") {
        return "+" + phoneNumber;
      } else {
        return phoneNumber;
      }
    };

    return (
      reservation &&
      reservationDate &&
      item &&
      user && (
        <div>
          <div className="flex justify-between px-4">
            <div className="">
              Reservation ID:<code className="mx-2">{id.substring(0, 6)}</code>
            </div>
            <div>
              <div
                onClick={() => reportReservation(id)}
                className="flex flex-row items-center gap-2 text-sm text-error cursor-pointer"
              >
                <FaTriangleExclamation /> Report
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <div className="px-4 grid grid-cols-2">
            <div className="flex flex-row items-center gap-2 col-span-2">
              <FaReceipt />
              <span>{item.name}</span>
              <span>(x{reservation.qty})</span>
            </div>
            {userType === "users" && (
              <div className="flex flex-row items-center gap-2 col-span-2">
                <FaStore />
                <span>{vendor.orgName}</span>
              </div>
            )}
            {userType === "vendors" && (
              <div className="flex flex-row items-center gap-2">
                <FaUser />
                <span>{user.firstName}</span>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <FaPhone />
              <a
                href={`tel:${normalizedPhoneNumber(user.phoneNumber)}`}
                className="hover:underline"
              >
                {user.phoneNumber}
              </a>
            </div>
            <div className="flex flex-row items-center gap-2">
              <FaClock />
              <span
                className="col-span-2 tooltip tooltip-bottom tooltip-secondary"
                data-tip={format(reservationDate, "dd/MM/yyyy h:mm:ssa")}
              >
                {formatDistanceToNow(reservationDate)} ago
              </span>
            </div>
            {userType === "users" && (
              <div className="mt-3 col-span-2 mx-auto">
                <button
                  onClick={() => confirmPickup(id)}
                  className="btn btn-primary text-white btn-sm"
                >
                  Confirm Pickup
                </button>
              </div>
            )}
          </div>
        </div>
      )
    );
  };

  ReservationDetails.propTypes = {
    reservation: PropTypes.object,
    id: PropTypes.string,
  };

  return (
    <>
      {reservations ? (
        Object.keys(reservations).map((key) => {
          const reservation = reservations[key];
          return (
            <div className="my-4 bg-theme1-50 rounded px-2 py-4" key={key}>
              <ReservationDetails reservation={reservation} id={key} />
            </div>
          );
        })
      ) : (
        <p className="py-2 text-center">No reservations... yet!</p>
      )}
    </>
  );
};

ReservationList.propTypes = {
  userUID: PropTypes.string,
  userType: PropTypes.string,
  reportReservation: PropTypes.func,
  confirmPickup: PropTypes.func,
};

export default ReservationList;
