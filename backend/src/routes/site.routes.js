import express from 'express';
import SiteService from '../services/site-service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const site = await SiteService.createSite(req.body);
    res.status(201).json(site);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sites = await SiteService.getAllSites();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const site = await SiteService.updateSite(req.params.id, req.body);
    res.json(site);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await SiteService.deleteSite(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
