const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports = function validateRegisterInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.address = !isEmpty(data.address) ? data.address : "";
    data.photo = !isEmpty(data.photo) ? data.photo : "";
    data.appointmentTime = !isEmpty(data.appointmentTime) ? data.appointmentTime : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name is required";;
    }
    // Date of Birth checks
    if (Validator.isEmpty(data.dateOfBirth)) {
        errors.dateOfBirth = "Date of birth is required"
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Address checks
    if (Validator.isEmpty(data.address)) {
        errors.address = "Address is required";
    }
    // Photo checks
    if (Validator.isEmpty(data.photo)) {
        errors.photo = "Photo is required";
    }
    // Appointment Time checks
    if (Validator.isEmpty(data.appointmentTime)) {
        errors.appointmentTime = "Appointment time is required";
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};