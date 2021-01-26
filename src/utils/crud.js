const ERR_MESSAGE = "Sorry something went wrong. Could not process request";
export const lookUpByPolicyId = (model) => async (req, res) => {
  try {
    // join on policy and customer collection
    const doc = await model.aggregate([
      { $match: { policyId: Number(req.params["policyId"]) } },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "customerId",
          as: "customerDetails",
        },
      },
    ]);
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
    const docs = await model.aggregate([
      { $match: { customerId: Number(req.params["customerId"]) } },
      {
        $lookup: {
          from: "policies",
          localField: "customerId",
          foreignField: "customer",
          as: "policyDetails",
        },
      },
      {$unwind : {
        path: '$policyDetails'
      }}
    ]);

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
  try {
    //  "nModified": 1,
    const updatedPolicy = await model1
      .updateOne({ policyId: Number(req.body.policyId) }, req.body)
      .lean()
      .exec();
    const updatedUser = await model2.updateOne(
      { customerId: String(req.body.customerId) },
      req.body
    );
    if (!updatedPolicy && !updatedUser) {
      return res.boom.badRequest(`Not able to update policy information`);
    }
    res.status(200).send("Details sucessfully updated");
  } catch (err) {
    console.error(err);
    res.boom.badRequest(ERR_MESSAGE);
  }
};
export const getPolicyDetails = (model) => async (req, res) => {
  try {
    const policyDocs = await model.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "customerId",
          as: "customerDetails",
        },
      },
    ]);
    if (!policyDocs) {
      return res.boom.badRequest(`Not able to get policies information`);
    }
    res.status(200).json({ data: policyDocs });
  } catch (err) {
    console.error(err);
    res.boom.badRequest(ERR_MESSAGE);
  }
};

export const getChartRegionData = (model) => async (req, res) => {
  try {
    // join on customer and policy collection and group on date and count
    const docs = await model.aggregate([
      { $match: { region: String(req.params["region"]) } },
      {
        $lookup: {
          from: "policies",
          localField: "customerId",
          foreignField: "customer",
          as: "policyDetails",
        },
      },
      {
        $unwind: {
          path: "$policyDetails",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$policyDetails.date"  },
          },
          policyCount: { $sum: 1 },
        },
      },
    ]);

    if (!docs) {
      return res.boom.notFound(`Not able to generate chart data`);
    }
    res.status(200).json({ data: docs });
  } catch (e) {
    console.error(e);
    res.boom.badRequest(ERR_MESSAGE);
  }
};
export const insuranceControllers = (model1, model2) => ({
  lookUpByPolicyId: lookUpByPolicyId(model1),
  lookUpByCustomerId: lookUpByCustomerId(model2),
  updatePolicy: updatePolicy(model1, model2),
  getPolicies: getPolicyDetails(model1),
  getChartData: getChartRegionData(model2),
});
