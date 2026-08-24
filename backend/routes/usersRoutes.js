const express = require(`express`);
const router = express.Router();
const userControllers = require(`../controllers/usersControllers`);
const {authMiddleware} = require(`../middleweres/auth`);
const {adminMiddleware} = require(`../middleweres/adminMiddleware`);

router.post(`/login`, userControllers.userLogin);
router.post(`/register`, userControllers.createUser)

router.get(`/`, authMiddleware, adminMiddleware, userControllers.getUsers);
router.put(`/:id`, authMiddleware, adminMiddleware, userControllers.updateUser);
router.delete(`/:id`, authMiddleware, adminMiddleware, userControllers.deleteUser);

router.get(`/:id`, authMiddleware, userControllers.getUserById);

router.post(`/logout`, authMiddleware, userControllers.userlogout)

module.exports = router;
