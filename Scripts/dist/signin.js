"use strict";
class SignInValidator {
    emailInput;
    passwordInput;
    form;
    messageDiv;
    constructor() {
        this.emailInput = document.getElementById("emailInput");
        this.passwordInput = document.getElementById("passwordInput");
        this.form = document.getElementById("signInForm");
        this.messageDiv = document.getElementById("signInMessage");
        this.attachListeners();
    }
    attachListeners() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
    handleSubmit(event) {
        event.preventDefault();
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        let isValid = true;
        if (!email) {
            this.setInvalid(this.emailInput, "Please enter your email.");
            isValid = false;
        }
        else {
            this.setValid(this.emailInput);
        }
        if (!password) {
            this.setInvalid(this.passwordInput, "Please enter your password.");
            isValid = false;
        }
        else {
            this.setValid(this.passwordInput);
        }
        if (isValid) {
            const storedUser = localStorage.getItem("registeredUser");
            if (!storedUser) {
                this.displayMessage("No registered user found. Please sign up first.", "danger");
                return;
            }
            const user = JSON.parse(storedUser);
            if (user.email === email && user.password === password) {
                this.displayMessage(`Welcome back, ${user.firstName}!`, "success");
                window.location.replace("home.html");
            }
            else {
                this.displayMessage("Invalid email or password.", "danger");
            }
        }
    }
    setValid(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }
    setInvalid(input, message) {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = message;
        }
    }
    displayMessage(message, type) {
        this.messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new SignInValidator();
});
