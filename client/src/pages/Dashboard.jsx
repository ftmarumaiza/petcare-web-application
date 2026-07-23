import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiActivity, FiArrowRight } from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [breedFilter, setBreedFilter] = useState("");

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/pets", {
        params: { search, breed: breedFilter },
      });
      setPets(data);
    } catch (err) {
      toast.error("Could not load your pets");
    } finally {
      setLoading(false);
    }
  };

  // refetch whenever search/filter changes (basic debounce with a timeout)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPets();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, breedFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      await api.delete(`/pets/${id}`);
      toast.success("Pet removed");
      setPets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete pet");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              My Pets
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pets.length} pet{pets.length !== 1 && "s"} registered
            </p>
          </div>

          <Link
            to="/pets/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <FiPlus /> Add Pet
          </Link>
        </div>

        <Link
          to="/chat"
          className="mb-6 flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50 px-5 py-4 transition hover:bg-primary-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 dark:bg-gray-800 dark:text-primary-400">
              <FiActivity size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                PawDoc AI
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your 24/7 pet care companion — ask about nutrition, grooming, vaccinations & more
              </p>
            </div>
          </div>
          <FiArrowRight className="text-primary-500" />
        </Link>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pet name..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <input
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            placeholder="Filter by breed..."
            className="rounded-lg border border-gray-200 py-2 px-3 text-sm outline-none focus:border-primary-400 sm:w-56 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        {loading ? (
          <Loader />
        ) : pets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400 dark:border-gray-800">
            No pets yet. Click "Add Pet" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
