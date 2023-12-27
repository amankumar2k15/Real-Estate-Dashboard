const  success = (message, results, statusCode)=> {
    return {
        message,
        error: false,
        code: statusCode,
        count: results?.length,
        results
    }
}

const  error = (message, statusCode) => {
    return {
        message,
        code: statusCode,
        error: true
    }
}

const  validateRes=(errors) => {
    return {
        message: errors,
        errors: true,
        code: 422
    }
}

module.exports =  {
    success ,
    error , 
    validateRes
}