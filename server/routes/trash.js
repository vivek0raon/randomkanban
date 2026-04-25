import express from 'express';
import Trash from '../models/Trash.js';
import Board from '../models/Board.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Get all trash items for the logged-in user
router.get('/', async (req, res) => {
  try {
    const trashItems = await Trash.find({ user: req.user._id }).sort({ deletedAt: -1 });
    res.json(trashItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore a trash item
router.post('/:id/restore', async (req, res) => {
  try {
    const trashItem = await Trash.findOne({ _id: req.params.id, user: req.user._id });
    if (!trashItem) return res.status(404).json({ message: 'Trash item not found' });

    if (trashItem.itemType === 'board') {
      const newBoard = new Board({
        ...trashItem.data,
        _id: trashItem.data._id || undefined, // keep original ID if possible, otherwise let mongoose generate
      });
      // Ensure the _id isn't causing duplicate key errors if somehow it wasn't hard deleted.
      // Wait, since we hard deleted it before, the ID should be free to use.
      // But just to be safe, we'll let Mongoose use the original ID if provided by doing `_id: trashItem.data._id`.
      await newBoard.save();
    } else if (trashItem.itemType === 'card') {
      const board = await Board.findOne({ _id: trashItem.boardId, user: req.user._id });
      if (!board) return res.status(404).json({ message: 'Original board not found. Restore the board first.' });

      const column = board.columns.id(trashItem.columnId);
      if (!column) return res.status(404).json({ message: 'Original column not found in the board.' });

      column.cards.push(trashItem.data);
      await board.save();
    }

    await Trash.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item restored successfully' });
  } catch (error) {
    // If there's a duplicate key error (e.g., trying to restore a board with an existing ID), handle it gracefully
    if (error.code === 11000) {
       return res.status(400).json({ message: 'Item already exists or ID conflict.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a trash item permanently
router.delete('/:id', async (req, res) => {
  try {
    const trashItem = await Trash.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trashItem) return res.status(404).json({ message: 'Trash item not found' });
    res.json({ message: 'Trash item permanently deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Empty trash completely
router.delete('/', async (req, res) => {
    try {
        await Trash.deleteMany({ user: req.user._id });
        res.json({ message: 'Trash emptied' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
