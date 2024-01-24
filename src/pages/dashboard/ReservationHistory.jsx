import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UseUserContext";
import { getReservations } from "../../utils/firestore-reservations";

const ReservationHistory = () => {
  let { authUser, accountType, loaded } = useUserContext();

  let [reservations, setReservations] = useState(null);

  useEffect(() => {
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
  }, [reservations, authUser.uid, accountType]);

  return <>ReservationHistory</>;
};

export default ReservationHistory;
