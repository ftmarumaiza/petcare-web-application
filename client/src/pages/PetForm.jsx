import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";

const PetForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "Unknown",
    notes: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchPet = async () => {
      try {
        const { data } = await api.get(`/pets/${id}`);
        setFormData({
          name: data.name,
          breed: data.breed,
          age: data.age,
          gender: data.gender,
          notes: data.notes || "",
        });
        setPreview(data.image);
      } catch (err) {
        toast.error("Could not load pet details");
        navigate("/");
      } finally {
        setFetching(false);
      }
    };

    fetchPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.breed || formData.age === "") {
      toast.error("Name, breed and age are required");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("breed", formData.breed);
    payload.append("age", formData.age);
    payload.append("gender", formData.gender);
    payload.append("notes", formData.notes);
    if (imageFile) payload.append("image", imageFile);

    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/pets/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Pet updated");
      } else {
        await api.post("/pets", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Pet added");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <p className="p-8 text-center text-gray-400">Loading pet details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="mx-auto max-w-lg px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
          {isEditMode ? "Edit Pet" : "Add a New Pet"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 h-28 w-28 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              {preview ? (
                <img src={preview} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl">🐾</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Pet Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Breed</label>
            <input
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Age</label>
              <input
                type="number"
                min="0"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Unknown">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Allergies, favorite toys, etc."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-500 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : isEditMode ? "Update Pet" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
