import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  fulfillReservation,
  getReservations,
  reportReservation,
} from "../../utils/firestore-reservations";
import { getSpecificUser } from "../../utils/firestore-user";
import { getSpecificListing } from "../../utils/firestore-vendor-listing";
import { format, formatDistanceToNow } from "date-fns";
import {
  FaClock,
  FaMoneyBill,
  FaPhone,
  FaReceipt,
  FaStore,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import { getSpecificVendor } from "../../utils/firestore-vendors";
import _ from "underscore";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ReservationList = ({ userUID, userType, showFulfilled = false }) => {
  let [reservations, setReservations] = useState(null);

  const preConfirmPickup = (
    reservationID,
    userID,
    userSaved,
    vendorID,
    vendorEarned,
  ) => {
    Swal.fire({
      title: "Confirm Pickup?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fulfillReservation(
          reservationID,
          userID,
          userSaved,
          vendorID,
          vendorEarned,
        );
        toast.success("Reservation fulfilled!");
      }
    });
  };

  const preReportReservation = async (reservationID) => {
    let reasons;

    if (userType === "users") {
      reasons = [
        "Vendor is closed and did not respond",
        "Item is not as described",
        "Item is not available",
        "Other",
      ];
    } else if (userType === "vendors") {
      reasons = [
        "User did not show up (>15 minutes)",
        "User did not confirm pickup",
        "Other",
      ];
    }

    const { value: reason } = await Swal.fire({
      title: "Report Reservation",
      html: `<p>Please select a reason for reporting this reservation:</p>`,
      input: "select",
      inputOptions: reasons,
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Report",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a reason!";
        }
      },
    });

    if (!reason) return;

    const { value: comments } = Swal.fire({
      title: "Report Reservation",
      html: `<p>Please provide a clear description for your report:</p>`,
      input: "textarea",
      inputPlaceholder: "Enter your description here...",
      showCancelButton: true,
      confirmButtonText: "Report",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (reason === "Other" && !value) {
          return "You need to provide a description!";
        }
      },
    });

    if (comments) {
      reportReservation(
        reservationID,
        userUID,
        userType,
        reason,
        comments,
      ).then(() => {
        toast.success("Reservation reported!");
      });
    }
  };

  useEffect(() => {
    const unsubscribe = getReservations(
      reservations,
      setReservations,
      userUID,
      userType.slice(0, -1),
      showFulfilled,
    );

    return () => {
      unsubscribe();
    };
  }, [reservations, userUID, userType, showFulfilled]);

  const ReservationDetails = ({ reservation, id }) => {
    const [user, setUser] = useState(null);
    const [item, setItem] = useState(null);
    const [vendor, setVendor] = useState(null);

    const [reservationDate, setReservationDate] = useState(
      reservation.createdAt ? reservation.createdAt.toDate() ?? null : null,
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
      (user || vendor) && (
        <div>
          <div className="flex justify-between px-4">
            <div className="">
              Reservation ID:<code className="mx-2">{id.substring(0, 6)}</code>
            </div>
            <div>
              <div
                onClick={() => preReportReservation(id)}
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
            <div className="flex flex-row items-center gap-2 col-span-2">
              <FaMoneyBill />
              <span>RM{(item.price * reservation.qty).toFixed(2)}</span>
            </div>
            {userType === "users" ? (
              <div className="flex flex-row items-center gap-2 col-span-2">
                <FaStore />
                <span>{vendor.orgName}</span>
              </div>
            ) : (
              userType === "vendors" && (
                <div className="flex flex-row items-center gap-2">
                  <FaUser />
                  <span>{user.firstName}</span>
                </div>
              )
            )}
            <div className="flex flex-row items-center gap-2">
              <FaPhone />
              {userType === "users" ? (
                <a
                  href={`tel:${normalizedPhoneNumber(vendor.phoneNumber)}`}
                  className="hover:underline"
                >
                  {vendor.phoneNumber}
                </a>
              ) : (
                <a
                  href={`tel:${normalizedPhoneNumber(user.phoneNumber)}`}
                  className="hover:underline"
                >
                  {user.phoneNumber}
                </a>
              )}
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
                  onClick={() =>
                    preConfirmPickup(
                      id,
                      reservation.user,
                      (+item.oriPrice - +item.price) * +reservation.qty,
                      reservation.vendor,
                      +item.price * +reservation.qty,
                    )
                  }
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
      {reservations && _.isEmpty(reservations) !== 0 ? (
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
  confirmPickup: PropTypes.func,
  showFulfilled: PropTypes.bool,
};

export default ReservationList;
