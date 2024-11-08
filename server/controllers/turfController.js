const Turf = require('../models/Turf');

exports.addTurf = async (req, res, next) => {
  const { name, location, pricePerHour } = req.body;
  const ownerId = req.user.id; // Extract the owner ID from the authenticated user

  try {
    const turfId = await Turf.create(name, location, pricePerHour, ownerId);
    res.status(201).json({ message: 'Turf created successfully', turfId });
  } catch (error) {
    next(error);
  }
};

exports.getAllTurfs = async (req, res, next) => {
  const { location } = req.query;

  try {
    const turfs = await Turf.getAll(location);
    res.status(200).json(turfs);
  } catch (error) {
    next(error);
  }
};

exports.getTurfById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const turf = await Turf.getById(id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json(turf);
  } catch (error) {
    next(error);
  }
};

exports.updateTurf = async (req, res, next) => {
  const { id } = req.params;
  const { name, location, pricePerHour } = req.body;
  const userId = req.user.id;

  try {
    const turf = await Turf.getById(id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (turf.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedRows = await Turf.update(id, name, location, pricePerHour);
    res.status(200).json({ message: 'Turf updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteTurf = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const turf = await Turf.getById(id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (turf.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Turf.delete(id);
    res.status(200).json({ message: 'Turf deleted successfully' });
  } catch (error) {
    next(error);
  }
};
