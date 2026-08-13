import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Ticket,
  UserRound,
  CheckCircle2,
  Users,
} from "lucide-react";
import api from "../services/api";

const PassengerDetails = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedSeats = location.state?.selectedSeats || [];
  const price = location.state?.price || 0;

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedSeats.length === 0) {
      navigate(`/trip/${tripId}`);
      return;
    }

    setPassengers(
      selectedSeats.map((seat) => ({
        seat,
        name: "",
        age: "",
        gender: "",
      }))
    );
  }, [selectedSeats, tripId, navigate]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;

    setError("");

    setPassengers((prev) =>
      prev.map((passenger, i) =>
        i === index
          ? {
            ...passenger,
            [name]: value,
          }
          : passenger
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const passenger of passengers) {
      if (!passenger.name.trim()) {
        setError(
          `Please enter name for seat ${passenger.seat}`
        );
        return;
      }

      if (!passenger.age) {
        setError(
          `Please enter age for seat ${passenger.seat}`
        );
        return;
      }

      if (
        Number(passenger.age) < 1 ||
        Number(passenger.age) > 120
      ) {
        setError(
          `Please enter a valid age for seat ${passenger.seat}`
        );
        return;
      }

      if (!passenger.gender) {
        setError(
          `Please select gender for seat ${passenger.seat}`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const response = await api.post("/bookings/create", {
        tripId,
        seats: selectedSeats,
        passengers: passengers.map((passenger) => ({
          seat: passenger.seat,
          name: passenger.name.trim(),
          age: Number(passenger.age),
          gender: passenger.gender,
        })),
      });

      navigate(`/booking/${response.data.booking._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount =
    selectedSeats.length * price;

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">



        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Seats
        </button>



        <div className="mb-7">
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users
                size={22}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Passenger Details
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Enter the details for each passenger
              </p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {passengers.map((passenger, index) => (
                <div
                  key={passenger.seat}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >



                  <div className="bg-gray-50 border-b border-gray-100 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <UserRound
                          size={19}
                          className="text-indigo-600"
                        />
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          Passenger {index + 1}
                        </h2>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Passenger information
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg shrink-0">

                      <Ticket size={15} />

                      <span className="text-sm font-semibold">
                        Seat {passenger.seat}
                      </span>

                    </div>

                  </div>



                  <div className="p-5 sm:p-6">


                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter passenger name"
                        value={passenger.name}
                        onChange={(e) =>
                          handleChange(index, e)
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />

                    </div>



                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>

                        <input
                          type="number"
                          name="age"
                          placeholder="Enter age"
                          value={passenger.age}
                          onChange={(e) =>
                            handleChange(index, e)
                          }
                          min="1"
                          max="120"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>

                        <select
                          name="gender"
                          value={passenger.gender}
                          onChange={(e) =>
                            handleChange(index, e)
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                        >
                          <option value="">
                            Select Gender
                          </option>

                          <option value="male">
                            Male
                          </option>

                          <option value="female">
                            Female
                          </option>

                          <option value="other">
                            Other
                          </option>
                        </select>

                      </div>

                    </div>

                  </div>

                </div>
              ))}


              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Confirming Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={19} />
                    Confirm Booking
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Booking Summary */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-24">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Ticket
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Summary
                </h2>

                <p className="text-xs text-gray-500">
                  Review your booking
                </p>
              </div>

            </div>

            {/* Seats */}

            <div className="mb-6">

              <p className="text-sm text-gray-500 mb-3">
                Selected Seats
              </p>

              <div className="flex flex-wrap gap-2">

                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  >
                    {seat}
                  </span>
                ))}

              </div>

            </div>

            {/* Passenger count */}

            <div className="border-t border-gray-100 pt-4 mb-4">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Passengers
                </span>

                <span className="font-semibold">
                  {selectedSeats.length}
                </span>

              </div>

            </div>

            {/* Price */}

            <div className="border-t border-gray-100 pt-4">

              <div className="flex justify-between mb-3">

                <span className="text-gray-500">
                  Price / Seat
                </span>

                <span className="font-semibold">
                  ₹{price}
                </span>

              </div>

              <div className="flex justify-between mb-5">

                <span className="text-gray-500">
                  Seats
                </span>

                <span className="font-semibold">
                  {selectedSeats.length}
                </span>

              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">

                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-indigo-600">
                  ₹{totalAmount}
                </span>

              </div>

            </div>

            {/* Info */}

            <div className="bg-indigo-50 rounded-xl p-4 mt-6">

              <p className="text-sm text-indigo-700 leading-relaxed">
                Make sure all passenger details are
                correct before confirming your booking.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PassengerDetails;