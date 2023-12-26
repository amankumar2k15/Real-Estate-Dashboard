exports.success = (message, results, statusCode) => {
    return {
        message,
        error: false,
        code: statusCode,
        count: results?.length,
        results
    }
};

exports.error = (message, statusCode) => {
    return {
        message,
        code: statusCode,
        error: true
    }
};

exports.validateRes = (errors) => {
    return {
        message: errors,
        errors: true,
        code: 422
    }
}