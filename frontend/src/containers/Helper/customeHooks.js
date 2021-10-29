import { useEffect } from "react";

export const useFetchCentre = ({ setCentreList, setMessage }) => {
  useEffect(() => {
    const fetchAllCentre = async () => {
      const res = await fetch("/api/centre/", {
        mode: "cors",
      });
      const { allCentre } = await res.json();
      if (res.ok) setCentreList(allCentre);
    };
    fetchAllCentre();
  }, []);
};

export const fetchCentreBooking = async (centre, setBookingList) => {
  console.log("hit");
  const res = await fetch(`/api/bookingTable/centre-booking/${centre._id}`, {
    mode: "cors",
  });
  const { allCentreBooking } = await res.json();
  console.log("allCentreBooking", allCentreBooking);
  if (res.ok) setBookingList(allCentreBooking);
};

export const useUserInfo = ({ bookingId, setUserInfo, setMessage }) => {
  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(`/api/bookingTable/user-booking/${bookingId}`, {
        mode: "cors",
      });
      const data = await res.json();
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
        `/api/bookingTable/availability/${centerId}/${date}`,
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
  const res = await fetch(`/api/bookingTable/new`, {
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

export const submitEditNew = async ({
  userPackage,
  setBookingList,
  setMessage,
  history,
}) => {
  //* Submit Post Request
  const res = await fetch(`/api/bookingTable/edit-booking/${userPackage._id}`, {
    mode: "cors",
    method: "PUT",
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

export const handleDelete = async (
  userPackageId,
  setBookingList,
  setMessage,
  index
) => {
  //* Submit Post Request
  const res = await fetch(`/api/bookingTable/${userPackageId}`, {
    mode: "cors",
    method: "DELETE",
  });
  if (res.ok) {
    const { deletedUser } = await res.json();
    console.log(index);
    setBookingList((list) => {
      list.splice(index, 1);
    });
  } else setMessage("Oops, something went wrong. Try again later");
};
