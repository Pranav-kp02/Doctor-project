const express = require("express");
const {
  userRegister,
  userLogin,
  userProfile,
  userUpdate,
  userDelete,
  userAppoimentCancel,
  userAllAppoiment,
} = require("../controller/userControl");
const { authentication } = require("../middleWare/auth");
const { veiwAllDoctors } = require("../controller/doctorCntrol");
const userRouter = express.Router();

userRouter.route("/reg").post(userRegister);
userRouter.route("/log").post(userLogin);
userRouter
  .route("/prof/:userId")
  .get(authentication, userProfile)
  .put(authentication, userUpdate)
  .delete(authentication, userDelete);
userRouter.route("/userAllDoctors").get(authentication, veiwAllDoctors);
userRouter.route("/userAllAppoiment").get(authentication, userAllAppoiment);
userRouter
  .route("/cancelAppoiment/:AppoimentId")
  .put(authentication, userAppoimentCancel);

module.exports = userRouter;
