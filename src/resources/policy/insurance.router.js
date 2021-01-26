import {Router} from 'express';
import controllers from './insurance.controller'

const router = Router();
router.get('/data',controllers.getPolicies)
router.put('/update', controllers.updatePolicy)
router.get('/:policyId',controllers.lookUpByPolicyId)
router.get('/cust/:customerId',controllers.lookUpByCustomerId)
router.get('/chart/:region', controllers.getChartData)




export default router
