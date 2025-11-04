class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.status = statusCode;  // Changed from statusCode to status to match error handler
        this.message = message;
    }
}
module.exports=ExpressError;