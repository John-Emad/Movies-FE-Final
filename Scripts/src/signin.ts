class SignInValidator {
    private emailInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private form: HTMLFormElement;
    private messageDiv: HTMLElement;
  
    constructor() {
      this.emailInput = document.getElementById("emailInput") as HTMLInputElement;
      this.passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
      this.form = document.getElementById("signInForm") as HTMLFormElement;
      this.messageDiv = document.getElementById("signInMessage") as HTMLElement;
  
      this.attachListeners();
    }
  
    private attachListeners(): void {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  
    private handleSubmit(event: Event): void {
      event.preventDefault();
  
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value;
  
      let isValid = true;
  
      if (!email) {
        this.setInvalid(this.emailInput, "Please enter your email.");
        isValid = false;
      } else {
        this.setValid(this.emailInput);
      }
  
      if (!password) {
        this.setInvalid(this.passwordInput, "Please enter your password.");
        isValid = false;
      } else {
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
          this.form.reset();
        } else {
          this.displayMessage("Invalid email or password.", "danger");
        }
      }
    }
  
    private setValid(input: HTMLInputElement): void {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  
    private setInvalid(input: HTMLInputElement, message: string): void {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = message;
      }
    }
  
    private displayMessage(message: string, type: "success" | "danger"): void {
      this.messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new SignInValidator();
  });
  