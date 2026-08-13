import { useEffect, useState } from "react";
import {
  Bus,
  CalendarDays,
  Clock,
  Edit,
  Plus,
  Trash2,
  X,
  Armchair,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Route,
  Search,
  Ticket,
  Users,
  IndianRupee,
  Repeat,
  MapPin,
} from "lucide-react";

import api from "../services/api";



// INITIAL FORMS


const initialBusForm = {
  busNumber: "",
  operator: "GSRTC",
  source: "",
  destination: "",
  arrivalTime: "",
  departureTime: "",
  price: "",
  totalSeats: "",
};

const initialTripForm = {
  busId: "",
  travelDate: "",
  arrivalTime: "",
  departureTime: "",
};

const initialScheduleForm = {
  busId: "",
  startDate: "",
  endDate: "",
  recurrence: "once",
  daysOfWeek: [],
  departureTime: "",
  arrivalTime: "",
};


// ADMIN DASHBOARD


const AdminDashboard = () => {


  const [buses, setBuses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Forms

  const [busForm, setBusForm] =
    useState(initialBusForm);

  const [tripForm, setTripForm] =
    useState(initialTripForm);

  const [scheduleForm, setScheduleForm] =
    useState(initialScheduleForm);




  const [editingId, setEditingId] =
    useState(null);


  // Loading

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [savingBus, setSavingBus] =
    useState(false);

  const [savingTrip, setSavingTrip] =
    useState(false);

  const [savingSchedule, setSavingSchedule] =
    useState(false);


  // Delete 

  const [deletingBusId, setDeletingBusId] =
    useState(null);

  const [deletingTripId, setDeletingTripId] =
    useState(null);


  // Booking Filter

  const [bookingSearch, setBookingSearch] =
    useState("");

  const [bookingFilter, setBookingFilter] =
    useState("all");




  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  //for expanding grouped recurring schedules
  const [expandedSchedule, setExpandedSchedule] =
    useState(null);


  const today = new Date()
    .toISOString()
    .split("T")[0];

  //Fetch  Buses

  const getBuses = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/buses/get");

      setBuses(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load buses"
      );
    } finally {
      setLoading(false);
    }
  };



  // FETCH TRIPS


  const getTrips = async () => {
    try {
      const response =
        await api.get("/trips/all");

      setTrips(response.data.trips || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load trips"
      );
    }
  };



  // FETCH BOOKINGS

  const getBookings = async () => {
    try {
      setBookingLoading(true);

      const response =
        await api.get("/bookings/all");

      setBookings(
        response.data.bookings || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load bookings"
      );
    } finally {
      setBookingLoading(false);
    }
  };



  useEffect(() => {
    getBuses();
    getTrips();
    getBookings();
  }, []);


  // BUS FORM HANDLER


  const handleBusChange = (e) => {
    setBusForm({
      ...busForm,
      [e.target.name]: e.target.value,
    });

    setError("");
  };



  // TRIP FORM HANDLER

  const handleTripChange = (e) => {
    setTripForm({
      ...tripForm,
      [e.target.name]: e.target.value,
    });

    setError("");
  };



  // SCHEDULE FORM HANDLER


  const handleScheduleChange = (e) => {
    const { name, value } = e.target;

    setScheduleForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // One-time schedule:
      // start date = end date
      if (
        name === "startDate" &&
        prev.recurrence === "once"
      ) {
        updated.endDate = value;
      }

      return updated;
    });

    setError("");
  };



  // TOGGLE WEEKLY DAY


  const toggleScheduleDay = (day) => {
    setScheduleForm((prev) => {
      const alreadySelected =
        prev.daysOfWeek.includes(day);

      return {
        ...prev,

        daysOfWeek: alreadySelected
          ? prev.daysOfWeek.filter(
            (item) => item !== day
          )
          : [...prev.daysOfWeek, day],
      };
    });

    setError("");
  };



  // CREATE / UPDATE BUS


  const handleBusSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingBus(true);
      setError("");
      setMessage("");

      const data = {
        ...busForm,
        price: Number(busForm.price),
        totalSeats: Number(
          busForm.totalSeats
        ),
      };

      if (editingId) {
        await api.put(
          `/buses/${editingId}`,
          data
        );

        setMessage(
          "Bus updated successfully"
        );
      } else {
        await api.post(
          "/buses/create",
          data
        );

        setMessage(
          "Bus created successfully"
        );
      }

      setBusForm(initialBusForm);
      setEditingId(null);

      await getBuses();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Bus operation failed"
      );
    } finally {
      setSavingBus(false);
    }
  };



  // EDIT BUS


  const handleEdit = (bus) => {
    setEditingId(bus._id);

    setBusForm({
      busNumber: bus.busNumber || "",
      operator: bus.operator || "",
      source: bus.source || "",
      destination:
        bus.destination || "",
      arrivalTime:
        bus.arrivalTime || "",
      departureTime:
        bus.departureTime || "",
      price: bus.price || "",
      totalSeats:
        bus.totalSeats || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // CANCEL BUS EDIT


  const cancelEdit = () => {
    setEditingId(null);
    setBusForm(initialBusForm);
    setError("");
  };



  // DELETE BUS


  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this bus?"
      );

    if (!confirmDelete) return;

    try {
      setDeletingBusId(id);
      setError("");
      setMessage("");

      await api.delete(
        `/buses/${id}`
      );

      setMessage(
        "Bus deleted successfully"
      );

      if (editingId === id) {
        cancelEdit();
      }

      await getBuses();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete bus"
      );
    } finally {
      setDeletingBusId(null);
    }
  };



  // CREATE ONE-TIME TRIP


  const handleCreateTrip = async (e) => {
    e.preventDefault();

    try {
      setSavingTrip(true);
      setError("");
      setMessage("");

      await api.post(
        "/trips/create",
        tripForm
      );

      setMessage(
        "Trip created successfully"
      );

      setTripForm(initialTripForm);

      await getTrips();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create trip"
      );
    } finally {
      setSavingTrip(false);
    }
  };



  // CREATE RECURRING SCHEDULE


  const handleCreateSchedule = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Weekly validation
    if (
      scheduleForm.recurrence ===
      "weekly" &&
      scheduleForm.daysOfWeek.length === 0
    ) {
      setError(
        "Please select at least one day for the weekly schedule"
      );

      return;
    }

    // One-time validation
    if (
      scheduleForm.recurrence === "once" &&
      scheduleForm.startDate !==
      scheduleForm.endDate
    ) {
      setError(
        "For a one-time schedule, start and end date must be the same"
      );

      return;
    }

    try {
      setSavingSchedule(true);

      const response =
        await api.post(
          "/schedules/create",
          scheduleForm
        );

      setMessage(
        `${response.data.message}. ${response.data.tripsCreated} trip(s) created.`
      );

      setScheduleForm(
        initialScheduleForm
      );

      await getTrips();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create schedule"
      );
    } finally {
      setSavingSchedule(false);
    }
  };



  // DELETE INDIVIDUAL TRIP


  const handleDeleteTrip = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this trip?"
      );

    if (!confirmDelete) return;

    try {
      setDeletingTripId(id);
      setError("");
      setMessage("");

      await api.delete(
        `/trips/${id}`
      );

      setMessage(
        "Trip deleted successfully"
      );

      await getTrips();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete trip"
      );
    } finally {
      setDeletingTripId(null);
    }
  };



  // HELPERS


  const getAvailableSeats = (
    trip
  ) => {
    return (
      trip.seats?.filter(
        (seat) =>
          seat.status === "available"
      ).length || 0
    );
  };


  const getTripStatus = (
    trip
  ) => {
    const availableSeats =
      getAvailableSeats(trip);

    const tripDate = new Date(
      trip.travelDate
    )
      .toISOString()
      .split("T")[0];

    const departureDateTime =
      new Date(
        `${tripDate}T${trip.departureTime}`
      );

    if (
      new Date() >=
      departureDateTime
    ) {
      return "Departed";
    }

    if (availableSeats === 0) {
      return "Sold Out";
    }

    return "Upcoming";
  };


  const getStatusClasses = (
    status
  ) => {
    if (status === "Departed") {
      return "bg-gray-100 text-gray-600";
    }

    if (status === "Sold Out") {
      return "bg-red-100 text-red-600";
    }

    return "bg-green-100 text-green-700";
  };


  const formatDate = (
    date
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };




  const allIndividualTrips =
    trips.flatMap(
      (group) =>
        group.trips || []
    );



  // BOOKING STATS


  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "confirmed"
    ).length;


  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "cancelled"
    ).length;


  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status ===
          "confirmed"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(
            booking.totalAmount || 0
          ),
        0
      );


  const totalPassengers =
    bookings
      .filter(
        (booking) =>
          booking.status ===
          "confirmed"
      )
      .reduce(
        (total, booking) =>
          total +
          (booking.passengers
            ?.length || 0),
        0
      );



  // OTHER STATS


  const totalAvailableSeats =
    allIndividualTrips.reduce(
      (total, trip) =>
        total +
        getAvailableSeats(trip),
      0
    );


  const upcomingTrips =
    allIndividualTrips.filter(
      (trip) =>
        getTripStatus(trip) ===
        "Upcoming"
    ).length;



  // BOOKING FILTER


  const filteredBookings =
    bookings.filter(
      (booking) => {
        const search =
          bookingSearch
            .trim()
            .toLowerCase();

        const matchesStatus =
          bookingFilter === "all" ||
          booking.status ===
          bookingFilter;

        const bookingId =
          booking._id?.toLowerCase() ||
          "";

        const userName =
          booking.userId?.name?.toLowerCase() ||
          "";

        const userEmail =
          booking.userId?.email?.toLowerCase() ||
          "";

        const passengerNames =
          booking.passengers
            ?.map(
              (passenger) =>
                passenger.name?.toLowerCase()
            )
            .join(" ") || "";

        const matchesSearch =
          !search ||
          bookingId.includes(
            search
          ) ||
          userName.includes(
            search
          ) ||
          userEmail.includes(
            search
          ) ||
          passengerNames.includes(
            search
          );

        return (
          matchesStatus &&
          matchesSearch
        );
      }
    );



  // LOADING


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 font-medium mt-5">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }



  // UI


  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">



        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>

              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">

                <TrendingUp size={15} />

                Administration

              </div>


              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>


              <p className="text-gray-500 mt-2">
                Manage buses, schedules,
                trips and bookings.
              </p>

            </div>


            <div className="text-sm text-gray-400">
              BusBook Management
            </div>

          </div>

        </div>


        {/* 
            MESSAGES */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>

          </div>
        )}


        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {message}
            </p>

          </div>
        )}


        {/*
            DASHBOARD STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <StatCard
            title="Total Buses"
            value={buses.length}
            icon={<Bus size={22} />}
            iconClass="bg-indigo-100 text-indigo-600"
          />


          <StatCard
            title="Schedules"
            value={trips.length}
            icon={
              <CalendarDays size={22} />
            }
            iconClass="bg-purple-100 text-purple-600"
          />


          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<Ticket size={22} />}
            iconClass="bg-blue-100 text-blue-600"
          />


          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            icon={
              <IndianRupee size={22} />
            }
            iconClass="bg-green-100 text-green-600"
          />

        </div>


        {/* 
            BOOKING OVERVIEW
         */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <MiniStat
            title="Confirmed Bookings"
            value={confirmedBookings}
            icon={
              <CheckCircle2 size={19} />
            }
            className="text-green-600 bg-green-50"
          />


          <MiniStat
            title="Cancelled Bookings"
            value={cancelledBookings}
            icon={<X size={19} />}
            className="text-red-600 bg-red-50"
          />


          <MiniStat
            title="Passengers"
            value={totalPassengers}
            icon={<Users size={19} />}
            className="text-purple-600 bg-purple-50"
          />

        </div>


        {/* 
            CREATE BUS
         */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 mb-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">

              <Bus
                size={23}
                className="text-indigo-600"
              />

            </div>


            <div>

              <h2 className="text-xl font-bold text-gray-900">

                {editingId
                  ? "Update Bus"
                  : "Create Bus"}

              </h2>


              <p className="text-sm text-gray-500 mt-1">

                {editingId
                  ? "Update the selected bus information."
                  : "Add a new bus to your booking system."}

              </p>

            </div>

          </div>


          <form
            onSubmit={handleBusSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >

            <FormField
              label="Bus Number"
              name="busNumber"
              placeholder="GJ-01-AB-1234"
              value={busForm.busNumber}
              onChange={handleBusChange}
            />


            <FormField
              label="Operator"
              name="operator"
              placeholder="GSRTC"
              value={busForm.operator}
              onChange={handleBusChange}
            />


            <FormField
              label="Source"
              name="source"
              placeholder="Ahmedabad"
              value={busForm.source}
              onChange={handleBusChange}
            />


            <FormField
              label="Destination"
              name="destination"
              placeholder="Rajkot"
              value={
                busForm.destination
              }
              onChange={handleBusChange}
            />


            <FormField
              label="Departure Time"
              name="departureTime"
              type="time"
              value={
                busForm.departureTime
              }
              onChange={handleBusChange}
            />


            <FormField
              label="Arrival Time"
              name="arrivalTime"
              type="time"
              value={
                busForm.arrivalTime
              }
              onChange={handleBusChange}
            />


            <FormField
              label="Price per Seat"
              name="price"
              type="number"
              placeholder="500"
              value={busForm.price}
              onChange={handleBusChange}
              min="1"
            />


            <FormField
              label="Total Seats"
              name="totalSeats"
              type="number"
              placeholder="40"
              value={
                busForm.totalSeats
              }
              onChange={handleBusChange}
              min="2"
            />


            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                disabled={savingBus}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >

                {savingBus ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Edit size={18} />
                    Update Bus
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Bus
                  </>
                )}

              </button>


              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>


        {/* 
            CREATE ONE-TIME TRIP
         */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 mb-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">

              <CalendarDays
                size={23}
                className="text-purple-600"
              />

            </div>


            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Create Trip
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Schedule a bus for a specific travel date.
              </p>

            </div>

          </div>


          <form
            onSubmit={handleCreateTrip}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >

            <div>

              <label className="label">
                Select Bus
              </label>


              <select
                name="busId"
                value={tripForm.busId}
                onChange={
                  handleTripChange
                }
                required
                className="input"
              >

                <option value="">
                  Select Bus
                </option>


                {buses.map((bus) => (
                  <option
                    key={bus._id}
                    value={bus._id}
                  >
                    {bus.busNumber} -{" "}
                    {bus.source} →{" "}
                    {bus.destination}
                  </option>
                ))}

              </select>

            </div>


            <FormField
              label="Travel Date"
              name="travelDate"
              type="date"
              value={
                tripForm.travelDate
              }
              onChange={
                handleTripChange
              }
              min={today}
            />


            <FormField
              label="Departure Time"
              name="departureTime"
              type="time"
              value={
                tripForm.departureTime
              }
              onChange={
                handleTripChange
              }
            />


            <FormField
              label="Arrival Time"
              name="arrivalTime"
              type="time"
              value={
                tripForm.arrivalTime
              }
              onChange={
                handleTripChange
              }
            />


            <button
              type="submit"
              disabled={savingTrip}
              className="sm:col-span-2 lg:col-span-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >

              {savingTrip ? (
                <>
                  <Spinner />
                  Creating Trip...
                </>
              ) : (
                <>
                  <CalendarDays size={18} />
                  Create Trip
                </>
              )}

            </button>

          </form>

        </div>


        {/* 
            CREATE RECURRING SCHEDULE
         */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 mb-10">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">

              <Repeat
                size={23}
                className="text-indigo-600"
              />

            </div>


            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Create Recurring Schedule
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Automatically generate trips for a date range.
              </p>

            </div>

          </div>


          <form
            onSubmit={
              handleCreateSchedule
            }
            className="space-y-6"
          >

            {/* BUS */}

            <div>

              <label className="label">
                Select Bus
              </label>


              <select
                name="busId"
                value={
                  scheduleForm.busId
                }
                onChange={
                  handleScheduleChange
                }
                required
                className="input"
              >

                <option value="">
                  Select Bus
                </option>


                {buses.map((bus) => (
                  <option
                    key={bus._id}
                    value={bus._id}
                  >
                    {bus.busNumber} -{" "}
                    {bus.source} →{" "}
                    {bus.destination}
                  </option>
                ))}

              </select>

            </div>


            {/* SCHEDULE TYPE */}

            <div>

              <label className="label">
                Schedule Type
              </label>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <ScheduleOption
                  active={
                    scheduleForm.recurrence ===
                    "once"
                  }
                  title="One Time"
                  description="Create one trip"
                  onClick={() =>
                    setScheduleForm(
                      (prev) => ({
                        ...prev,
                        recurrence:
                          "once",
                        daysOfWeek: [],
                        endDate:
                          prev.startDate,
                      })
                    )
                  }
                />


                <ScheduleOption
                  active={
                    scheduleForm.recurrence ===
                    "daily"
                  }
                  title="Daily"
                  description="Every day"
                  onClick={() =>
                    setScheduleForm(
                      (prev) => ({
                        ...prev,
                        recurrence:
                          "daily",
                        daysOfWeek: [],
                      })
                    )
                  }
                />


                <ScheduleOption
                  active={
                    scheduleForm.recurrence ===
                    "weekly"
                  }
                  title="Weekly"
                  description="Selected days"
                  onClick={() =>
                    setScheduleForm(
                      (prev) => ({
                        ...prev,
                        recurrence:
                          "weekly",
                      })
                    )
                  }
                />

              </div>

            </div>


            {/* DATES */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={
                  scheduleForm.startDate
                }
                onChange={
                  handleScheduleChange
                }
                min={today}
              />


              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={
                  scheduleForm.endDate
                }
                onChange={
                  handleScheduleChange
                }
                min={
                  scheduleForm.startDate ||
                  today
                }
              />

            </div>


            {/* WEEKLY DAYS */}

            {scheduleForm.recurrence ===
              "weekly" && (
                <div>

                  <label className="label">
                    Repeat On
                  </label>


                  <div className="flex flex-wrap gap-2">

                    {[
                      {
                        value: 1,
                        label: "Mon",
                      },
                      {
                        value: 2,
                        label: "Tue",
                      },
                      {
                        value: 3,
                        label: "Wed",
                      },
                      {
                        value: 4,
                        label: "Thu",
                      },
                      {
                        value: 5,
                        label: "Fri",
                      },
                      {
                        value: 6,
                        label: "Sat",
                      },
                      {
                        value: 0,
                        label: "Sun",
                      },
                    ].map((day) => {

                      const selected =
                        scheduleForm.daysOfWeek.includes(
                          day.value
                        );


                      return (
                        <button
                          key={
                            day.value
                          }
                          type="button"
                          onClick={() =>
                            toggleScheduleDay(
                              day.value
                            )
                          }
                          className={`px-4 py-2 rounded-lg border font-medium transition ${selected
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                            }`}
                        >
                          {day.label}
                        </button>
                      );

                    })}

                  </div>

                </div>
              )}


            {/* TIMES */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormField
                label="Departure Time"
                name="departureTime"
                type="time"
                value={
                  scheduleForm.departureTime
                }
                onChange={
                  handleScheduleChange
                }
              />


              <FormField
                label="Arrival Time"
                name="arrivalTime"
                type="time"
                value={
                  scheduleForm.arrivalTime
                }
                onChange={
                  handleScheduleChange
                }
              />

            </div>


       

            <button
              type="submit"
              disabled={
                savingSchedule
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >

              {savingSchedule ? (
                <>
                  <Spinner />
                  Creating Schedule...
                </>
              ) : (
                <>
                  <Repeat size={18} />
                  Create Schedule
                </>
              )}

            </button>

          </form>

        </div>


        {/* 
            ALL BUSES
         */}

        <SectionHeading
          title="All Buses"
          description="Manage buses available in the system."
        />


        {buses.length === 0 ? (
          <EmptyState
            icon={<Bus size={27} />}
            title="No buses yet"
            description="Create your first bus using the form above."
          />
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {buses.map((bus) => (

              <div
                key={bus._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 sm:p-6"
              >

         

                <div className="flex items-start justify-between gap-4 mb-5">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">

                      <Bus
                        size={23}
                        className="text-indigo-600"
                      />

                    </div>


                    <div>

                      <h3 className="font-bold text-lg text-gray-900">
                        {bus.busNumber}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {bus.operator}
                      </p>

                    </div>

                  </div>


                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-bold">
                    ₹{bus.price}
                  </div>

                </div>


                {/* ROUTE */}

                <div className="bg-slate-50 rounded-xl p-4 mb-5">

                  <div className="flex items-center gap-3">

                    <div className="flex-1">

                      <p className="text-xs text-gray-500">
                        From
                      </p>

                      <p className="font-semibold mt-1">
                        {bus.source}
                      </p>

                    </div>


                    <Route
                      size={20}
                      className="text-indigo-500"
                    />


                    <div className="flex-1 text-right">

                      <p className="text-xs text-gray-500">
                        To
                      </p>

                      <p className="font-semibold mt-1">
                        {bus.destination}
                      </p>

                    </div>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="grid grid-cols-3 gap-3 border-b border-gray-100 pb-5 mb-5">

                  <Detail
                    label="Departure"
                    value={
                      bus.departureTime
                    }
                    icon={
                      <Clock size={15} />
                    }
                  />


                  <Detail
                    label="Arrival"
                    value={
                      bus.arrivalTime
                    }
                    icon={
                      <Clock size={15} />
                    }
                  />


                  <Detail
                    label="Seats"
                    value={
                      bus.totalSeats
                    }
                    icon={
                      <Armchair size={15} />
                    }
                  />

                </div>


                {/* ACTIONS */}

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleEdit(bus)
                    }
                    className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={17} />
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(
                        bus._id
                      )
                    }
                    disabled={
                      deletingBusId ===
                      bus._id
                    }
                    className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >

                    {deletingBusId ===
                      bus._id ? (
                      <>
                        <Spinner red />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={17} />
                        Delete
                      </>
                    )}

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* 
            ALL SCHEDULES
         */}

        <div className="mt-12">

          <SectionHeading
            title="All Schedules"
            description="View recurring schedules and their generated trips."
          />

        </div>


        {trips.length === 0 ? (

          <EmptyState
            icon={
              <CalendarDays size={27} />
            }
            title="No schedules yet"
            description="Create a trip or recurring schedule using the forms above."
          />

        ) : (

          <div className="space-y-5">

            {trips.map((group) => {

              const groupTrips =
                group.trips || [];


              if (
                groupTrips.length ===
                0
              ) {
                return null;
              }


              const firstTrip =
                groupTrips[0];


              const lastTrip =
                groupTrips[
                groupTrips.length - 1
                ];


             

              const bus =
                group.bus ||
                firstTrip.busId ||
                {};


              const groupKey =
                group.scheduleId ||
                firstTrip._id;


              const isExpanded =
                expandedSchedule ===
                groupKey;


              const upcomingCount =
                groupTrips.filter(
                  (trip) =>
                    getTripStatus(
                      trip
                    ) === "Upcoming"
                ).length;


              const availableSeats =
                groupTrips.reduce(
                  (
                    total,
                    trip
                  ) =>
                    total +
                    getAvailableSeats(
                      trip
                    ),
                  0
                );


              return (

                <div
                  key={groupKey}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >

                  {/* 
                      SCHEDULE SUMMARY
                   */}

                  <div className="p-5 sm:p-6">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* BUS */}

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">

                          <Bus
                            size={23}
                            className="text-purple-600"
                          />

                        </div>


                        <div>

                          <h3 className="font-bold text-lg text-gray-900">
                            {bus.busNumber ||
                              "Unknown Bus"}
                          </h3>


                          <p className="text-sm text-gray-500">
                            {bus.operator ||
                              "Unknown Operator"}
                          </p>

                        </div>

                      </div>


                      {/* ROUTE */}

                      <div>

                        <p className="text-xs text-gray-500 mb-1">
                          Route
                        </p>


                        <div className="flex items-center gap-2 font-semibold text-gray-900">

                          <span>
                            {bus.source ||
                              "N/A"}
                          </span>


                          <Route
                            size={17}
                            className="text-purple-500"
                          />


                          <span>
                            {bus.destination ||
                              "N/A"}
                          </span>

                        </div>

                      </div>


                      {/* TIMING */}

                      <div>

                        <p className="text-xs text-gray-500 mb-1">
                          Timing
                        </p>


                        <div className="flex items-center gap-2 font-semibold text-gray-900">

                          <Clock
                            size={16}
                            className="text-gray-400"
                          />

                          {group.departureTime ||
                            firstTrip.departureTime ||
                            "N/A"}

                          {" → "}

                          {group.arrivalTime ||
                            firstTrip.arrivalTime ||
                            "N/A"}

                        </div>

                      </div>


                      {/* SCHEDULE PERIOD */}

                      <div>

                        <p className="text-xs text-gray-500 mb-1">
                          Schedule Period
                        </p>


                        <p className="font-semibold text-gray-900">

                          {formatDate(
                            firstTrip.travelDate
                          )}

                          {" → "}

                          {formatDate(
                            lastTrip.travelDate
                          )}

                        </p>


                        <p className="text-xs text-gray-500 mt-1">

                          {groupTrips.length}{" "}
                          generated trip
                          {groupTrips.length !==
                            1
                            ? "s"
                            : ""}

                        </p>

                      </div>

                    </div>


                    {/* SUMMARY CARDS */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-gray-500">
                          Total Trips
                        </p>


                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {groupTrips.length}
                        </p>

                      </div>


                      <div className="bg-green-50 rounded-xl p-3">

                        <p className="text-xs text-green-600">
                          Upcoming
                        </p>


                        <p className="text-lg font-bold text-green-700 mt-1">
                          {upcomingCount}
                        </p>

                      </div>


                      <div className="bg-indigo-50 rounded-xl p-3">

                        <p className="text-xs text-indigo-600">
                          Available Seats
                        </p>


                        <p className="text-lg font-bold text-indigo-700 mt-1">
                          {availableSeats}
                        </p>

                      </div>


                      <div className="bg-purple-50 rounded-xl p-3">

                        <p className="text-xs text-purple-600">
                          Price / Seat
                        </p>


                        <p className="text-lg font-bold text-purple-700 mt-1">
                          ₹
                          {bus.price ||
                            0}
                        </p>

                      </div>

                    </div>


                    {/* VIEW TRIPS */}

                    <button
                      onClick={() =>
                        setExpandedSchedule(
                          isExpanded
                            ? null
                            : groupKey
                        )
                      }
                      className="w-full mt-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >

                      <CalendarDays
                        size={18}
                      />


                      {isExpanded
                        ? "Hide Individual Dates"
                        : `View ${groupTrips.length} Trip${groupTrips.length !==
                          1
                          ? "s"
                          : ""
                        }`}

                    </button>

                  </div>


                  {/* 
                      INDIVIDUAL TRIPS
                   */}

                  {isExpanded && (

                    <div className="border-t border-gray-100 bg-slate-50 p-5 sm:p-6">

                      <div className="flex items-center justify-between mb-4">

                        <div>

                          <h4 className="font-bold text-gray-900">
                            Generated Trips
                          </h4>


                          <p className="text-sm text-gray-500 mt-1">
                            Each date has independent seat availability.
                          </p>

                        </div>

                      </div>


                      <div className="space-y-3">

                        {groupTrips.map(
                          (trip) => {

                            const available =
                              getAvailableSeats(
                                trip
                              );


                            const status =
                              getTripStatus(
                                trip
                              );


                            return (

                              <div
                                key={
                                  trip._id
                                }
                                className="bg-white border border-gray-200 rounded-xl p-4"
                              >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                  {/* DATE */}

                                  <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">

                                      <CalendarDays
                                        size={
                                          19
                                        }
                                        className="text-purple-600"
                                      />

                                    </div>


                                    <div>

                                      <p className="font-bold text-gray-900">
                                        {formatDate(
                                          trip.travelDate
                                        )}
                                      </p>


                                      <p className="text-sm text-gray-500">

                                        {
                                          trip.departureTime
                                        }

                                        {" → "}

                                        {
                                          trip.arrivalTime
                                        }

                                      </p>

                                    </div>

                                  </div>


                                  {/* SEATS */}

                                  <div>

                                    <p className="text-xs text-gray-500">
                                      Seats
                                    </p>


                                    <p className="font-semibold text-gray-900">

                                      {
                                        available
                                      }

                                      <span className="text-gray-400 font-normal">

                                        {" / "}

                                        {
                                          trip
                                            .seats
                                            ?.length ||
                                          0
                                        }

                                      </span>

                                    </p>

                                  </div>


                                  {/* STATUS */}

                                  <span
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClasses(
                                      status
                                    )}`}
                                  >
                                    {
                                      status
                                    }
                                  </span>


                                  {/* DELETE */}

                                  <button
                                    onClick={() =>
                                      handleDeleteTrip(
                                        trip._id
                                      )
                                    }
                                    disabled={
                                      deletingTripId ===
                                      trip._id
                                    }
                                    className="border border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                                  >

                                    {deletingTripId ===
                                      trip._id ? (
                                      <>
                                        <Spinner
                                          red
                                        />
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2
                                          size={
                                            16
                                          }
                                        />
                                        Delete
                                      </>
                                    )}

                                  </button>

                                </div>


                                {/* SEAT PROGRESS */}

                                <div className="mt-4">

                                  <div className="flex justify-between text-xs text-gray-500 mb-1">

                                    <span>
                                      Available seats
                                    </span>


                                    <span>
                                      {
                                        available
                                      }
                                      /
                                      {
                                        trip
                                          .seats
                                          ?.length ||
                                        0
                                      }
                                    </span>

                                  </div>


                                  <div className="w-full bg-gray-100 rounded-full h-2">

                                    <div
                                      className="h-full rounded-full bg-indigo-500"
                                      style={{
                                        width: `${trip
                                            .seats
                                            ?.length
                                            ? (available /
                                              trip
                                                .seats
                                                .length) *
                                            100
                                            : 0
                                          }%`,
                                      }}
                                    />

                                  </div>

                                </div>

                              </div>

                            );

                          }
                        )}

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}


        {/* 
            ALL BOOKINGS
         */}

        <div className="mt-14">

          <SectionHeading
            title="All Bookings"
            description="View bookings made by passengers across the system."
          />


          {/* BOOKING CONTROLS */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-5">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">

              <div className="relative">

                <Search
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />


                <input
                  type="text"
                  placeholder="Search booking ID, passenger or email..."
                  value={
                    bookingSearch
                  }
                  onChange={(e) =>
                    setBookingSearch(
                      e.target.value
                    )
                  }
                  className="input pl-11"
                />

              </div>


              <select
                value={
                  bookingFilter
                }
                onChange={(e) =>
                  setBookingFilter(
                    e.target.value
                  )
                }
                className="input md:w-48"
              >

                <option value="all">
                  All Bookings
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>


          {/* BOOKING LOADING */}

          {bookingLoading ? (

            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">

              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Loading bookings...
              </p>

            </div>

          ) : filteredBookings.length ===
            0 ? (

            <EmptyState
              icon={
                <Ticket size={27} />
              }
              title="No bookings found"
              description={
                bookingSearch
                  ? "Try changing your search."
                  : "No bookings have been made yet."
              }
            />

          ) : (

            <div className="space-y-4">

              {filteredBookings.map(
                (booking) => {

                  const trip =
                    booking.tripId;

                  const bus =
                    trip?.busId;


                  return (

                    <div
                      key={
                        booking._id
                      }
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
                    >

                      {/* BOOKING  */}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">

                            <Ticket
                              size={22}
                              className="text-blue-600"
                            />

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Booking ID
                            </p>


                            <p className="font-bold text-gray-900">

                              {booking._id
                                ?.slice(
                                  -8
                                )
                                .toUpperCase()}

                            </p>

                          </div>

                        </div>


                        <div className="flex items-center gap-3">

                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${booking.status ===
                                "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                              }`}
                          >
                            {
                              booking.status
                            }
                          </span>


                          <p className="text-xl font-bold text-indigo-600">
                            ₹
                            {
                              booking.totalAmount
                            }
                          </p>

                        </div>

                      </div>


                      {/* BOOKING DETAILS */}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">

                        {/* ACCOUNT */}

                        <div>

                          <p className="text-xs text-gray-500 mb-2">
                            Booked By
                          </p>


                          <p className="font-semibold text-gray-900">

                            {booking.userId
                              ?.name ||
                              "Unknown"}

                          </p>


                          <p className="text-sm text-gray-500 mt-1 break-all">

                            {booking.userId
                              ?.email ||
                              "No email"}

                          </p>

                        </div>


                        {/* ROUTE */}

                        <div>

                          <p className="text-xs text-gray-500 mb-2">
                            Journey
                          </p>


                          <div className="flex items-center gap-2">

                            <MapPinSmall
                              text={
                                bus?.source ||
                                "N/A"
                              }
                            />


                            <Route
                              size={15}
                              className="text-indigo-400"
                            />


                            <MapPinSmall
                              text={
                                bus?.destination ||
                                "N/A"
                              }
                            />

                          </div>


                          <p className="text-sm text-gray-500 mt-2">

                            {bus?.operator ||
                              "N/A"}

                            {" • "}

                            {bus?.busNumber ||
                              "N/A"}

                          </p>

                        </div>


                        {/* TRAVEL */}

                        <div>

                          <p className="text-xs text-gray-500 mb-2">
                            Travel
                          </p>


                          <p className="font-semibold">

                            {trip?.travelDate
                              ? formatDate(
                                trip.travelDate
                              )
                              : "N/A"}

                          </p>


                          <p className="text-sm text-gray-500 mt-1">

                            {
                              trip?.departureTime
                            }

                            {" → "}

                            {
                              trip?.arrivalTime
                            }

                          </p>

                        </div>


                        {/* SEATS */}

                        <div>

                          <p className="text-xs text-gray-500 mb-2">
                            Seats
                          </p>


                          <div className="flex flex-wrap gap-2">

                            {booking.seats?.map(
                              (seat) => (

                                <span
                                  key={
                                    seat
                                  }
                                  className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                                >
                                  {seat}
                                </span>

                              )
                            )}

                          </div>

                        </div>

                      </div>


                      {/* PASSENGERS */}

                      {booking.passengers
                        ?.length >
                        0 && (

                          <div className="border-t border-gray-100 mt-5 pt-5">

                            <p className="text-sm font-semibold text-gray-700 mb-3">
                              Passenger Details
                            </p>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                              {booking.passengers.map(
                                (
                                  passenger,
                                  index
                                ) => (

                                  <div
                                    key={`${passenger.seat}-${index}`}
                                    className="bg-slate-50 rounded-xl p-3"
                                  >

                                    <div className="flex items-center justify-between">

                                      <p className="font-semibold text-gray-900">
                                        {
                                          passenger.name
                                        }
                                      </p>


                                      <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-indigo-600">

                                        Seat{" "}
                                        {
                                          passenger.seat
                                        }

                                      </span>

                                    </div>


                                    <p className="text-sm text-gray-500 mt-1">

                                      Age{" "}
                                      {
                                        passenger.age
                                      }

                                      {" • "}

                                      <span className="capitalize">

                                        {
                                          passenger.gender
                                        }

                                      </span>

                                    </p>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* ======================================================
          STYLES
      ====================================================== */}

      <style>{`

        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          outline: none;
          background: white;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

      `}</style>

    </div>
  );
};


// STAT CARD


const StatCard = ({
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>

        </div>


        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};



// MINI STAT


const MiniStat = ({
  title,
  value,
  icon,
  className,
}) => {
  return (
    <div
      className={`rounded-2xl p-5 flex items-center justify-between ${className}`}
    >

      <div>

        <p className="text-sm opacity-80">
          {title}
        </p>

        <p className="text-2xl font-bold mt-1">
          {value}
        </p>

      </div>


      <div>
        {icon}
      </div>

    </div>
  );
};



// FORM FIELD


const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  min,
}) => {
  return (
    <div>

      <label className="label">
        {label}
      </label>


      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        required
        className="input"
      />

    </div>
  );
};



// SCHEDULE OPTION

const ScheduleOption = ({
  active,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border rounded-xl p-4 transition ${active
          ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
          : "border-gray-200 bg-white hover:border-indigo-400"
        }`}
    >

      <p
        className={`font-semibold ${active
            ? "text-indigo-700"
            : "text-gray-800"
          }`}
      >
        {title}
      </p>


      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </button>
  );
};


// SECTION HEADING


const SectionHeading = ({
  title,
  description,
}) => {
  return (
    <div className="mb-5">

      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="text-gray-500 mt-1">
        {description}
      </p>

    </div>
  );
};


// EMPTY STATE


const EmptyState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">

      <div className="w-14 h-14 bg-slate-100 text-gray-500 rounded-2xl flex items-center justify-center mx-auto">

        {icon}

      </div>


      <h3 className="font-bold text-gray-900 mt-4">
        {title}
      </h3>


      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </div>
  );
};


// DETAIL


const Detail = ({
  label,
  value,
  icon,
}) => {
  return (
    <div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500">

        {icon}

        <span>
          {label}
        </span>

      </div>


      <p className="font-semibold mt-1 text-sm text-gray-900">
        {value || "N/A"}
      </p>

    </div>
  );
};



// MAP PIN


const MapPinSmall = ({
  text,
}) => {
  return (
    <div className="flex items-center gap-1 min-w-0">

      <MapPin
        size={13}
        className="text-gray-400 shrink-0"
      />

      <span className="font-medium truncate">
        {text || "N/A"}
      </span>

    </div>
  );
};




const Spinner = ({
  red = false,
}) => {
  return (
    <span
      className={`w-4 h-4 border-2 rounded-full animate-spin ${red
          ? "border-red-200 border-t-red-500"
          : "border-white/40 border-t-white"
        }`}
    />
  );
};


export default AdminDashboard;