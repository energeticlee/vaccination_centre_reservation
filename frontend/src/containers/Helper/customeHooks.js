import { useEffect } from "react";

export const useFetchCentre = ({ setCentreList, setMessage }) => {
  useEffect(() => {
    const fetchAllCentre = async () => {
      const res = await fetch("http://localhost:3333/api/centre/", {
        mode: "cors",
      });
      const { allCentre } = await res.json();
      if (res.ok) setCentreList(allCentre);
      else setMessage("Website Temporary Unavilable");
    };
    fetchAllCentre();
  }, []);
};

export const useUserInfo = ({ bookingId, setUserInfo, setMessage }) => {
  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(
        `http://localhost:3333/api/bookingTable/user-booking/${bookingId}`,
        {
          mode: "cors",
        }
      );
      const data = await res.json();
      console.log("Data", data);
      if (res.ok) setUserInfo(data);
      else setMessage("Website Temporary Unavilable");
    };
    fetchUserInfo();
  }, []);
};

export const useFetchAvailability = (
  { selectedDate, selectedCentre, setAvailability, setMessage },
  setBookingData
) => {
  useEffect(() => {
    const fetchAvailability = async () => {
      const centerId = selectedCentre._id;
      const d = new Date(selectedDate);
      const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

      const res = await fetch(
        `http://localhost:3333/api/bookingTable/availability/${centerId}/${date}`,
        {
          mode: "cors",
        }
      );
      const { availability, tableId } = await res.json();
      if (res.ok) {
        setAvailability(availability);
        if (tableId)
          setBookingData((data) => ({
            ...data,
            bookingTable: tableId,
          }));
      } else setMessage("Sorry, This Date Is Fully Book");
    };
    if (selectedCentre && selectedDate) fetchAvailability();
  }, [selectedDate, selectedCentre]);
};

export const submitRegistration = async ({
  userPackage,
  setBookingList,
  setMessage,
  history,
}) => {
  //* Submit Post Request
  const res = await fetch(`http://localhost:3333/api/bookingTable/new`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userPackage),
  });
  if (res.ok) {
    const { userBooking } = await res.json();
    history.push("/bookings");
    setBookingList([userBooking]);
  } else setMessage("Oops, something went wrong. Try again later");
};
