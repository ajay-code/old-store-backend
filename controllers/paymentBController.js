import braintree from "braintree";
import {
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PRIVATE_KEY,
  BRAINTREE_PUBLIC_KEY,
} from "../config/env.js";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: BRAINTREE_MERCHANT_ID,
  publicKey: BRAINTREE_PUBLIC_KEY,
  privateKey: BRAINTREE_PRIVATE_KEY,
});

export const getToken = (req, res, next) => {
  gateway.clientToken
    .generate({})
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      //  new BadRequestError(err.message || "Failed to create Client Token");
      next(err);
    });
};

export const processPayment = (req, res, next) => {
  const { paymentMethodNonce, amount } = req.body;
  gateway.transaction
    .sale({
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      next(err);
      // throw new BadRequestError(err.message || "Failed to create Transaction");
    });
};
