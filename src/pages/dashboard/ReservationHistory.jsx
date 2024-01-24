import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UseUserContext";
import { getReservations } from "../../utils/firestore-reservations";
import ReservationList from "../../components/list/ReservationList";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

const ReservationHistory = () => {
  let { authUser, accountType, loaded } = useUserContext();

  let [reservations, setReservations] = useState(null);

  useEffect(() => {
    if (!loaded) return;
    const unsubscribe = getReservations(
      reservations,
      setReservations,
      authUser.uid,
      accountType.slice(0, -1),
      true,
    );

    return () => {
      unsubscribe();
    };
  }, [reservations, authUser, accountType, loaded]);

  return (
    loaded && (
      <div className="m-8">
        <div className="flex flex-row gap-3 items-center">
          <Link to="/dashboard">
            <FaAngleLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-xl">Reservation History</h1>
            <p className="text-neutral-600">
              View your reservation history below.
            </p>
          </div>
        </div>
        <ReservationList
          userUID={authUser.uid}
          userType={accountType}
          showFulfilled={true}
        />
      </div>
    )
  );
};

export default ReservationHistory;
