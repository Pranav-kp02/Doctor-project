const express = require('express')
const { docRegister, docLogin, docProfile, docUpdate, docDelete, updatePendingAppoiment, approvedAppoiment, docPendingAppoiment, doctorAllAppoiment } = require('../controller/doctorCntrol')
const { authentication } = require('../middleWare/auth')
const { bookAppoiment } = require('../controller/userControl')
const docRouter = express.Router()


docRouter.route('/docReg').post(docRegister)
docRouter.route('/docLog').post(docLogin)
docRouter.route('/docProf/:docId')
.get(authentication,docProfile)
.put(authentication,docUpdate)
.delete(authentication,docDelete)
.post(authentication,bookAppoiment) //user booking appoiment
docRouter.route('/docAppoiment').get(authentication,docPendingAppoiment)
docRouter.route('/docPendingAppoiment/:appId').post(authentication,updatePendingAppoiment)
docRouter.route('/docApprovedAppoiment').get(authentication,approvedAppoiment)
docRouter.route('/docAllAppoiment').get(authentication,doctorAllAppoiment)
module.exports = docRouter