export const validateListing = (data) => {
    const err = {}

    if(!data.name) {
        err.name = "Please provide name for your listing"
    }else if(data.name.replace(/ /g, '').length > 25){
        err.name = "Listin name is up to 25 characters long."
    }

    if(!data.description) {
        err.description = "Please add description."
    }

    if(!data.category) {
        err.category = "Please choose category"
    }

    if(!data.subCategory) {
        err.subCategory = "Please choose subcategory"
    }

    if(!data.price) {
        err.price = "Please add price"
    }
    if(!data.city) {
        err.city = "Please add city"
    }
    if(!data.postalCode) {
        err.postalCode = "Please add postal code"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}