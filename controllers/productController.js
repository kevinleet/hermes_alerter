const { Product } = require("../models");

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.send(error);
  }
};

const updateUsersToAlert = async (req, res) => {
  try {
    if (req.body.action == "add") {
      let product = await Product.findOneAndUpdate(
        { _id: req.body.product },
        { $push: { usersToAlert: req.body.user } }
      );
      res.send(product);
    } else if (req.body.action == "remove") {
      let product = await Product.findOneAndUpdate(
        { _id: req.body.product },
        { $pull: { usersToAlert: req.body.user } }
      );
      res.send(product);
    }
  } catch (error) {
    console.log(error);
  }
};

const addProduct = async (req, res) => {
  try {
    let product = await Product.create({
      name: req.body.name,
    });
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

const removeProduct = async (req, res) => {
  try {
    let product = await Product.findOneAndDelete({
      name: req.body.name,
    });
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  updateUsersToAlert,
  addProduct,
  removeProduct,
};
