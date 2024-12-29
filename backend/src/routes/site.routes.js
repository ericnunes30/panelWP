const express = require('express');
const AuthService = require('../services/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const site = await AuthService.addSite(req.body);
    res.status(201).json(site);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sites = await AuthService.getSites();
    res.json(sites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await AuthService.removeSite(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
