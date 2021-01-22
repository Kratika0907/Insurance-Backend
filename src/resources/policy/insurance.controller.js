import {insuranceControllers} from '../../utils/crud';
import {Customer} from '../customer/customer.model'
import {Policy} from './policy.model'

export default insuranceControllers(Policy, Customer)