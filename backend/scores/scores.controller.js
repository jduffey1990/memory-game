const service = require("./scores.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// checks if body contains data
function hasBodyData(req, _res, next) {
  const { data } = req.body;
  if (!data)
    next({
      status: 400,
    });
  next();
}

// Validate name exists and is not empty
function nameIsValid(req, _res, next) {
  const { first_name, last_name } = req.body.data;
  const error = { status: 400 };
  if (!first_name || !first_name.length) {
    error.message = `first_name`;
    return next(error);
  }
  if (!last_name || !last_name.length) {
    error.message = `last_name`;
    return next(error);
  }

  next();
}

function validateInput(req, res, next) {
  const { first_name, last_name } = req.body.data;
  if (containsBlacklistedWord(first_name) || containsBlacklistedWord(last_name)) {
      return next({
          status: 400,
          message: "Please avoid using inappropriate words.",
      });
  }
  next();
}


async function create(req, res, next) {
  try {
    const score = await service.create(req.body.data);  // Use the service to store the score
    res.status(201).json({ data: score });
  } catch (error) {
    next({
      status: 500,
      message: "Failed to create score",
    });
  }
}

async function list(req, res, next) {
  try {
    const scores = await service.read();  // Use the service to fetch the scores
    res.json({ data: scores });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create: [
    hasBodyData,
    nameIsValid,
    validateInput,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),  // renamed from read to list for clarity
};
