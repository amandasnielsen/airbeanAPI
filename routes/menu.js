import { Router } from 'express';
import MenuItem from '../models/menuItem.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kunde inte hämta menydata',
      error: error.message
    });
  }
});

export default router;