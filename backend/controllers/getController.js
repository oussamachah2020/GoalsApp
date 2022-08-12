const asyncHandler = require("express-async-handler");
const Goal = require('../model/goalModel');
const User = require('../model/userModel');

const setGoal = asyncHandler (async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field');
    }

    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id
    })

    res.status(200).json({ goal });
});

const getGoals = asyncHandler (async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json({goals});
});

const updateGoal = asyncHandler (async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if(!goal) {
    req.status(400)
    throw new Error("goal not found");
  }

  const user = await User.findById(req.user.id)

  //check for user
  if(!user) {
    res.status(401)
    throw new Error("user not found");
  }

  //make sure the logged in user matches the goal user
  if(goal.user.toString() !== user.id) {
    res.status(401)
    throw new Error("user not authorize")
  }

  const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true});

  res.status(200).json({updateGoal});
});

const deleteGoal = asyncHandler (async (req, res) => {
  const deletGoal = await Goal.findByIdAndRemove(req.params.id, req.body);

  const goal = await Goal.findById(req.params.id)

  if(!goal) {
    req.status(400)
    throw new Error("goal not found");
  }

  const user = await User.findById(req.user.id)

  //check for user
  if(!user) {
    res.status(401)
    throw new Error("user not found");
  }

  //make sure the logged in user matches the goal user
  if(goal.user.toString() !== user.id) {
    res.status(401)
    throw new Error("user not authorize")
  }

  res.status(200).json({deletGoal});
});

module.exports = { getGoals, setGoal, updateGoal, deleteGoal };
