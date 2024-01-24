import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  cancelReservation,
  fulfillReservation,
  getReservations,
  reportReservation,
} from "../../utils/firestore-reservations";
import { getSpecificUser } from "../../utils/firestore-user";
import { getSpecificListing } from "../../utils/firestore-vendor-listing";
import { format, formatDistanceToNow } from "date-fns";
import {
  FaArrowUpRightFromSquare,
  FaClock,
  FaMoneyBill,
  FaPhone,
  FaReceipt,
  FaStore,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import { getSpecificVendor } from "../../utils/firestore-vendors";
import { normalizePhoneNumber } from "../../utils/normalize-phone-no";
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
      text: "This confirms that you had successfully picked up your order. This action cannot be undone!",
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
      confirmButtonText: "Next",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a reason!";
        }
      },
    });

    if (!reason) return;

    const { value: comments } = await Swal.fire({
      title: "Report Reservation",
      html: `<p>Please provide a clear description for your report:</p>`,
      input: "textarea",
      inputPlaceholder: "Enter your description here...",
      showCancelButton: true,
      confirmButtonText: "Report",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a description!";
        }
      },
    });

    if (comments) {
      await reportReservation(
        reservationID,
        userUID,
        userType,
        reason,
        comments,
      );
      toast.success("Reservation reported!");
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

    return (
      reservation &&
      reservationDate &&
      item &&
      (user || vendor) && (
        <div>
          <div className="flex justify-between items-center px-4">
            <div className="flex-1">
              Reservation ID:
              <code className="mx-2">{id.substring(0, 6).toLowerCase()}</code>
            </div>
            <div className="flex-none text-xs">
              {!reservation.reported ? (
                <div
                  onClick={() => preReportReservation(id)}
                  className="flex flex-row items-center gap-2 text-theme1-500 cursor-pointer"
                >
                  <FaTriangleExclamation /> Report
                  <br />
                  Issue
                </div>
              ) : (
                <>
                  <div className="flex flex-row items-center gap-2 text-error">
                    <FaTriangleExclamation /> Reported by{" "}
                    {reservation.reportedByType.slice(0, -1)}
                  </div>
                </>
              )}
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
              <div className="col-span-2">
                <a
                  href={`http://maps.google.com/maps?q=${vendor.latitude},${vendor.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row items-center gap-2 hover:underline"
                >
                  <FaStore />
                  <div className="flex flex-row items-center gap-2 hover:underline">
                    <span>{vendor.orgName}</span>
                    <FaArrowUpRightFromSquare size={12} />
                  </div>
                </a>
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
                  href={`tel:${normalizePhoneNumber(vendor.phoneNumber)}`}
                  className="hover:underline"
                >
                  {vendor.phoneNumber}
                </a>
              ) : (
                <a
                  href={`tel:${normalizePhoneNumber(user.phoneNumber)}`}
                  className="hover:underline"
                >
                  {user.phoneNumber}
                </a>
              )}
            </div>
            <div className="flex flex-row items-center gap-2 col-span-2 xs:col-span-1">
              <FaClock />
              <span
                className="tooltip tooltip-bottom tooltip-secondary"
                data-tip={format(reservationDate, "dd/MM/yyyy h:mm:ssa")}
              >
                {formatDistanceToNow(reservationDate)} ago
              </span>
            </div>
            {userType === "users" && !reservation.userFulfilled && (
              <div className="flex gap-2 mt-3 col-span-2 mx-auto">
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
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Cancel Reservation?",
                      text: "This action cannot be undone!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Cancel Reservation",
                      cancelButtonText: "Cancel",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        cancelReservation(id, reservation.user, reservation.listing, reservation.qty).then(() =>
                          toast.success("Reservation cancelled!"),
                        );
                      }
                    })
                  }
                  className="btn btn-warning text-white btn-sm"
                >
                  Cancel
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
            <div className="my-4 bg-theme1-50 rounded px-2 py-4 shadow" key={key}>
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
