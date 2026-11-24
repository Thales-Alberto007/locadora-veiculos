const express = require('express');
const autenticar = require('../middlewares/autenticar');
const locacaoController = require('../controllers/locacaoController');

const router = express.Router();

router.use(autenticar);

router.post('/', locacaoController.registrar);
router.get('/', locacaoController.listar);
router.patch('/:id/finalizar', locacaoController.finalizar);

module.exports = router;
