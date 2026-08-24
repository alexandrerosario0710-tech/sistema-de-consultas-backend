const express = require(`express`)
const router = express.Router()
const proceduresControllers = require(`../controllers/proceduresControlleres`)
const {authMiddleware} = require(`../middleweres/auth`)
const {adminMiddleware} = require(`../middleweres/adminMiddleware`);

router.get(`/`, authMiddleware, proceduresControllers.getProcedures)
router.get(`/:id`, authMiddleware, proceduresControllers.getProcedureById)

router.post(`/`, authMiddleware, adminMiddleware, proceduresControllers.createProcedure)
router.put(`/:id`, authMiddleware, adminMiddleware, proceduresControllers.updateProcedure)
router.delete(`/:id`, authMiddleware, adminMiddleware, proceduresControllers.deleteProcedure)

module.exports = router;