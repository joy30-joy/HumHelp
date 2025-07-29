import api from './api';

export const createReview = async ({ requestId, comment }) => {
  const res = await api.post('/reviews', { requestId, comment });
  return res.data;
};

export const getReviewsOfDonor = async (donorId) => {
  const res = await api.get(`/reviews/${donorId}`);
  return res.data;
};
