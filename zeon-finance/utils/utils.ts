// create a function called validator.
// it takes in a schema, data and return value or error.

export const validator = (schema: any, data: any) => {
    const { error, value } = schema.validate(data);
    if (error) {
        throw error.message;
    }
    return value;
}