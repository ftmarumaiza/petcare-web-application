import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const PetProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await api.get(`/pets/${id}`);
        setPet(data);
      } catch (err) {
        toast.error("Pet not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <Loader />
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-64 w-full bg-gray-100 dark:bg-gray-800">
            {pet.image ? (
              <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🐶</div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {pet.name}
              </h1>
              <Link
                to={`/pets/${pet._id}/edit`}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FiEdit2 size={14} /> Edit
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-gray-400">Breed</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{pet.breed}</p>
              </div>
              <div>
                <p className="text-gray-400">Age</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{pet.age} yrs</p>
              </div>
              <div>
                <p className="text-gray-400">Gender</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{pet.gender}</p>
              </div>
            </div>

            {pet.notes && (
              <div className="mt-5">
                <p className="mb-1 text-sm text-gray-400">Additional Notes</p>
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {pet.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
