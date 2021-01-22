import {Router} from 'express';
import controllers from './insurance.controller'

const router = Router();


router.get('/:policyId',controllers.lookUpByPolicyId)
router.get('/:customerId',controllers.lookUpByCustomerId)
router.get('/update', controllers.updatePolicy)
router.get('/data' , function(){})


export default router
