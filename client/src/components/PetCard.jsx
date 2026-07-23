import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const PetCard = ({ pet, onDelete }) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <Link to={`/pets/${pet._id}`}>
        <div className="h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {pet.image ? (
            <img
              src={pet.image}
              alt={pet.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🐶</div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{pet.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pet.breed} • {pet.age} {pet.age === 1 ? "yr" : "yrs"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            to={`/pets/${pet._id}/edit`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FiEdit2 size={14} /> Edit
          </Link>
          <button
            onClick={() => onDelete(pet._id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-100 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
          >
            <FiTrash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
