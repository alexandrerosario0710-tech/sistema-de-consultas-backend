const express = require(`express`)
const router = express.Router();
const consultasController = require(`../controllers/consultasControllers`)
const {authMiddleware} = require(`../middleweres/auth`)
const {adminMiddleware} = require(`../middleweres/adminMiddleware`);

router.post(`/`, authMiddleware, consultasController.createConsulta)
router.get(`/`, authMiddleware, adminMiddleware, consultasController.getConsultas)
router.get(`/minhas`, authMiddleware, consultasController.getConsultasByUser)
router.get(`/:id`, authMiddleware, adminMiddleware, consultasController.getConsultaById)
router.get(`/status/:status`, authMiddleware, adminMiddleware, consultasController.getConsultasByStatus)
router.get(`/user/:userId`, authMiddleware, adminMiddleware, consultasController.getConsultasByUser)

router.put(`/:id`, authMiddleware, adminMiddleware, consultasController.updateConsulta)
router.patch(`/:id/concluir`, authMiddleware, adminMiddleware, consultasController.concluirConsulta)
router.patch(`/:id/cancelar`, authMiddleware, consultasController.cancelarConsulta)
router.delete(`/:id/delete`, authMiddleware, adminMiddleware, consultasController.deleteConsulta)


module.exports = router;