"use strict";
class RegisterFormValidator {
    firstNameInput;
    lastNameInput;
    emailInput;
    birthdayInput;
    passwordInput;
    confirmPasswordInput;
    form;
    constructor() {
        this.firstNameInput = document.getElementById("FirstNameValidating");
        this.lastNameInput = document.getElementById("LastNameValidating");
        this.emailInput = document.getElementById("EmailValidating");
        this.birthdayInput = document.getElementById("BirthDayValidating");
        this.passwordInput = document.getElementById("PasswordValidating");
        this.confirmPasswordInput = document.getElementById("ConfirmPasswordValidating");
        this.form = document.querySelector("form");
        this.attachListeners();
    }
    attachListeners() {
        this.form.addEventListener("submit", (e) => this.validateForm(e));
    }
    calculateAge(birthDateStr) {
        const birthDate = new Date(birthDateStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    saveToLocalStorage() {
        const userData = {
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            birthday: this.birthdayInput.value,
            password: this.passwordInput.value
        };
        localStorage.setItem("registeredUser", JSON.stringify(userData));
    }
    validateForm(event) {
        event.preventDefault(); // prevent actual form submission
        let isValid = true;
        const namePattern = /^\p{L}+$/u;
        // Validate First Name
        if (!this.firstNameInput.value.trim()) {
            this.setInvalid(this.firstNameInput, "First name is required.");
            isValid = false;
        }
        else if (!namePattern.test(this.firstNameInput.value.trim())) {
            this.setInvalid(this.firstNameInput, "First name must contain letters only.");
            isValid = false;
        }
        else {
            this.setValid(this.firstNameInput);
        }
        // Validate Last Name
        if (!this.lastNameInput.value.trim()) {
            this.setInvalid(this.lastNameInput, "Last name is required.");
            isValid = false;
        }
        else if (!namePattern.test(this.lastNameInput.value.trim())) {
            this.setInvalid(this.lastNameInput, "Last name must contain letters only.");
            isValid = false;
        }
        else {
            this.setValid(this.lastNameInput);
        }
        // Validate Email
        const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailPattern.test(this.emailInput.value.trim())) {
            this.setInvalid(this.emailInput, "Invalid email format.");
            isValid = false;
        }
        else {
            this.setValid(this.emailInput);
        }
        if (!this.birthdayInput.value) {
            this.setInvalid(this.birthdayInput, "Date of birth is required.");
            isValid = false;
        }
        else {
            const age = this.calculateAge(this.birthdayInput.value);
            if (isNaN(age) || age < 18) {
                this.setInvalid(this.birthdayInput, "You must be at least 18 years old.");
                isValid = false;
            }
            else {
                this.setValid(this.birthdayInput);
            }
        }
        // Validate Password
        if (this.passwordInput.value.length < 6) {
            this.setInvalid(this.passwordInput, "Password must be at least 6 characters.");
            isValid = false;
        }
        else {
            this.setValid(this.passwordInput);
        }
        // Validate Confirm Password
        if (this.passwordInput.value !== this.confirmPasswordInput.value) {
            this.setInvalid(this.confirmPasswordInput, "Passwords do not match.");
            isValid = false;
        }
        else {
            this.setValid(this.confirmPasswordInput);
        }
        if (isValid) {
            this.saveToLocalStorage();
            alert("Form submitted and data saved!");
            this.form.reset(); // optional: reset form
            // this.form.submit(); // optional: submit to server
        }
    }
    setValid(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }
    setInvalid(input, message) {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        let feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = message;
        }
        else {
            const div = document.createElement("div");
            div.className = "invalid-feedback";
            div.textContent = message;
            input.insertAdjacentElement("afterend", div);
        }
    }
}
// Wait for DOM to load before initializing
document.addEventListener("DOMContentLoaded", () => {
    new RegisterFormValidator();
});
