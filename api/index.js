import app from '../dist/index.js';

export default async (req, res) => {
  await app(req, res);
};
