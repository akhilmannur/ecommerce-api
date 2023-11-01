const DealerDetails = require("../models/dealerDetails");
const User = require("../models/users");
const { customAlphabet } = require("nanoid");
const crypto = require("crypto");
const mongoose = require("mongoose");

const verifyWebhookSignature = require("../services/verifyWbHookSignature");

module.exports = {
  registerDealer: async (req, res) => {
    const { name, password, email, adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid Password",
      });
    }

    const checkDealer = await DealerDetails.findOne({ email });

    if (checkDealer) {
      return res.status(409).json({
        status: "failure",
        message: "User Already Exist",
      });
    }

    const nanoid = customAlphabet("1234567890abcdef", 20);
    const accessKey = nanoid();

    const createDealer = await DealerDetails.create({
      name,
      email,
      password,
      accessKey,
    });

    const dealerApiKey = createDealer?.accessKey;

    res.status(201).json({
      status: "success",
      message: "Successfully Created a Dealer",
      data: {
        accessKey: dealerApiKey,
      },
    });
  },

  test: (req, res) => {
    res.json({
      status: "Success",
      message: "API tested Successfully!",
    });
  },

  githubWebhook: (req, res) => {
    const webhookSecret = process.env.webhookSecret; // Replace with your actual secret.

    const signature = req.get("X-Hub-Signature");
    const body = JSON.stringify(req.body);

    if (verifyWebhookSignature(webhookSecret, body, signature)) {
      // The payload is authentic.
      console.log("Webhook signature is valid");
    } else {
      // The payload is not authentic.
      console.error("Webhook signature is not valid");
      return res.sendStatus(403);
    }

    // Handle the webhook payload.
    // Your code to process the webhook data goes here.

    res.sendStatus(200);
  },
};
