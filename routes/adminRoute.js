const express = require("express");
const { authentication, authorization } = require("../middleWare/auth");
const { veiwAllUsers } = require("../controller/userControl");
const {
  viewAllAppoiment,
  pendingAppoiment,
  alldoctorsApply,
  docApplyUpdate,
  bannUser,
  adminDashbord,
  veiwAllDoctorsAdmin,
  docAvailableToggle,
  adminCancelAppoiment,
} = require("../controller/admincntrol");
const adminRoute = express.Router();

adminRoute
  .route("/adminDashBoard")
  .get(authentication, authorization("admin"), adminDashbord);

adminRoute
  .route("/allusers")
  .get(authentication, authorization("admin"), veiwAllUsers);

adminRoute
  .route("/alldoctors")
  .get(authentication, authorization("admin"), veiwAllDoctorsAdmin);

adminRoute
  .route("/toggleAvailability/:docId")
  .put(authentication, authorization("admin"), docAvailableToggle);

adminRoute
  .route("/allAppoiment")
  .get(authentication, authorization("admin"), viewAllAppoiment);

adminRoute
  .route("/pendingAppoiment")
  .get(authentication, authorization("admin"), pendingAppoiment);

adminRoute
  .route("/allDoctorsApply")
  .get(authentication, authorization("admin"), alldoctorsApply);

adminRoute
  .route("/docApplyUpdate/:appId")
  .post(authentication, authorization("admin"), docApplyUpdate);

adminRoute
  .route("/banUser/:uId")
  .post(authentication, authorization("admin"), bannUser);

adminRoute
  .route("/appoimentCancel/:AppoimentId")
  .put(authentication, authorization("admin"), adminCancelAppoiment);

module.exports = adminRoute;
