const ERR_MESSAGE = "Sorry something went wrong. Could not process request";
export const lookUpByPolicyId = (model) => async (req, res) => {
  try {
    // join on policy and customer collection
    const doc = model.aggregate([
      { $match: { policyId: req.params.policy_id } },
      {
        $lookup: {
          from: "customer",
          localField: "customer",
          foreignField: "customerId",
          as: "customerDetails",
        },
      },
    ]);
    //const doc = await model.findOne({ Policy_id: req.params.id }).lean().exec();

    if (!doc) {
      return res.boom.notFound(
        `No policy exists with this id ${req.params.policy_id}`
      );
    }
    res.status(200).json({ data: doc });
  } catch (err) {
    console.error(err);
    res.boom.badRequest(ERR_MESSAGE);
  }
};

export const lookUpByCustomerId = (model) => async (req, res) => {
  try {
    // join on customer and policy collection
    const doc = model.aggregate([
      { $match: { customerId: req.params.customer_id } },
      {
        $lookup: {
          from: "policy",
          localField: "customerId",
          foreignField: "customer",
          as: "policyDetails",
        },
      },
    ]);
    //const docs = await model.find({ Customer_id: req.params.id }).lean().exec();
    if (!docs) {
      return res.boom.notFound(
        `No policies exists for this customer ${req.params.customer_id}`
      );
    }
    res.status(200).json({ data: docs });
  } catch (e) {
    console.error(e);
    res.boom.badRequest(ERR_MESSAGE);
  }
};

export const updatePolicy = (model1, model2) => async (req, res) => {
  // phele policy ka pura update then customer ki id lo and waha update
  const [
    policyId,
    date,
    fuel,
    premium,
    vehicleSegment,
    bodilyInjuryLiability,
    personalInjuryProtection,
    propertyDamageLiability,
    collision,
    comprehensive,
    customerId,
    gender,
    region,
    martialStatus,
    income,
  ] = req.body;
  const policyUpdateData = {
    policyId,
    date,
    fuel,
    premium,
    vehicleSegment,
    bodilyInjuryLiability,
    personalInjuryProtection,
    propertyDamageLiability,
    collision,
    comprehensive,
    customer : customerId,
  };
  const userUpdateData = {
    customerId,
    gender,
    region,
    martialStatus,
    income
  }

  try {
    const oldDoc = await model1
      .findOneAndUpdate({ policyId}, policyUpdateData)
      .lean()
      .exec();
// agr customer id change kr di hai toh sb policy pe jake change kr do
    if (!updatedDoc) {
      return res.boom.badRequest(`Not able to update policy information`);
    }
    if (oldDoc.customer !== customerId) {
      // customer id has changed update other policies
      await model1.updateMany({customer: oldDoc.customer}, {customer: customerId})
    }
    // update in customer also
    model2.findOneAndUpdate({customerId : oldDoc.customer},userUpdateData)
    res.status(200).json('Changes sucessfully made');
  } catch (err) {
    console.error(err);
    res.boom.badRequest(ERR_MESSAGE);
  }
};
//! proper name policy and customer
export const insuranceControllers = (model1,model2) => ({
  lookUpByPolicyId : lookUpByPolicyId(model1),
  lookUpByCustomerId: lookUpByCustomerId(model2),
  updatePolicy: updatePolicy(model1, model2)
});
