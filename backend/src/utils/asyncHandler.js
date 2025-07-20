// <---- creating a wrappr fuction ---->

// <---- using promises ---->

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// <---- using async-await ---->

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     req.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
 