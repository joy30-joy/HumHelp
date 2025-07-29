import User from '../models/User.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const donors = await User.find({ role: 'donor' })
      .sort({ points: -1, name: 1 })
      .select('-password');
    res.json(donors);
  } catch (err) {
    next(err);
  }
};
