function asyncWrapper(fn) {
  return async (req, res, next) => {
    try {
      return await fn.apply(null, [req, res, next]);
    } catch (err) {
      next(err);
    }
  };
}

// function asyncWrapper(fn) {
//   return (req, res, next) => {
//     fn(req, res).catch(next);
//   };
// }

module.exports = {
  asyncWrapper
};
