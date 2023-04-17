// This just adds a catch to the passed async function fn
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(e => next(e));
    }
}

module.exports = catchAsync;