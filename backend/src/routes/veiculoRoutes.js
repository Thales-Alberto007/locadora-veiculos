
const express = require('express');
const autenticar = require('../middlewares/autenticar');
const veiculoController = require('../controllers/veiculoController');

const router = express.Router();

router.use(autenticar);

router.post('/', veiculoController.cadastrar);
router.get('/', veiculoController.listar);

module.exports = router;
