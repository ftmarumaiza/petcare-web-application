const Pet = require("../models/Pet");
const cloudinary = require("../config/cloudinary");

// @desc   Get all pets belonging to logged in user
// @route  GET /api/pets
const getPets = async (req, res, next) => {
  try {
    const { search, breed } = req.query;

    let filter = { userId: req.user._id };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (breed) {
      filter.breed = { $regex: breed, $options: "i" };
    }

    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

// @desc   Get single pet
// @route  GET /api/pets/:id
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // make sure the pet actually belongs to the logged in user
    if (pet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this pet" });
    }

    res.json(pet);
  } catch (err) {
    next(err);
  }
};

// @desc   Add new pet
// @route  POST /api/pets
const createPet = async (req, res, next) => {
  try {
    const { name, breed, age, gender, notes } = req.body;

    if (!name || !breed || age === undefined) {
      return res.status(400).json({ message: "Name, breed and age are required" });
    }

    const pet = await Pet.create({
      userId: req.user._id,
      name,
      breed,
      age,
      gender: gender || "Unknown",
      notes: notes || "",
      image: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
    });

    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
};

// @desc   Update pet
// @route  PUT /api/pets/:id
const updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this pet" });
    }

    const { name, breed, age, gender, notes } = req.body;

    pet.name = name ?? pet.name;
    pet.breed = breed ?? pet.breed;
    pet.age = age ?? pet.age;
    pet.gender = gender ?? pet.gender;
    pet.notes = notes ?? pet.notes;

    // if a new image was uploaded, replace the old one
    if (req.file) {
      if (pet.imagePublicId) {
        await cloudinary.uploader.destroy(pet.imagePublicId).catch(() => {});
      }
      pet.image = req.file.path;
      pet.imagePublicId = req.file.filename;
    }

    await pet.save();
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete pet
// @route  DELETE /api/pets/:id
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this pet" });
    }

    if (pet.imagePublicId) {
      await cloudinary.uploader.destroy(pet.imagePublicId).catch(() => {});
    }

    await pet.deleteOne();
    res.json({ message: "Pet removed" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPets, getPetById, createPet, updatePet, deletePet };
