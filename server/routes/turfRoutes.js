const express = require('express');
const { addTurf, getAllTurfs, getTurfById, updateTurf, deleteTurf } = require('../controllers/turfController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllTurfs);
router.get('/:id', getTurfById);

router.post('/', protect, authorize('owner', 'admin'), addTurf);
router.put('/:id', protect, authorize('owner', 'admin'), updateTurf);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteTurf);

module.exports = router;
