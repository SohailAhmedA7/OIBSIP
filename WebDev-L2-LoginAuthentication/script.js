/* =========================
   SecureAuth
   Authentication Logic
========================= */

const USERS_KEY = "secureAuthUsers";
const SESSION_KEY = "secureAuthSession";


/* =========================
   Helper Functions
========================= */

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

function saveSession(user) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
            name: user.name,
            email: user.email
        })
    );
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function showMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `form-message ${type}`;
}


/* =========================
   Password Validation
========================= */

function isStrongPassword(password) {
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    return passwordPattern.test(password);
}


/* =========================
   Password Visibility
========================= */

function setupPasswordToggle(inputId, buttonId) {

    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) {
        return;
    }

    button.addEventListener("click", () => {

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
            button.setAttribute(
                "aria-label",
                "Hide password"
            );
        } else {
            input.type = "password";
            button.textContent = "👁";
            button.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });
}


/* =========================
   Registration
========================= */

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    setupPasswordToggle(
        "register-password",
        "register-password-toggle"
    );

    setupPasswordToggle(
        "confirm-password",
        "confirm-password-toggle"
    );


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("register-name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("register-password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirm-password")
                    .value;

            const message =
                document.getElementById(
                    "register-message"
                );


            /* Empty field validation */

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {
                showMessage(
                    message,
                    "Please fill in all fields.",
                    "error"
                );

                return;
            }


            /* Name validation */

            if (name.length < 2) {
                showMessage(
                    message,
                    "Please enter a valid name.",
                    "error"
                );

                return;
            }


            /* Email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* Password strength */

            if (!isStrongPassword(password)) {

                showMessage(
                    message,
                    "Password must contain at least 8 characters, including uppercase, lowercase, number and special character.",
                    "error"
                );

                return;
            }


            /* Confirm password */

            if (password !== confirmPassword) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            /* Duplicate account check */

            const users = getUsers();

            const existingUser =
                users.find(
                    user => user.email === email
                );

            if (existingUser) {

                showMessage(
                    message,
                    "An account with this email already exists.",
                    "error"
                );

                return;
            }


            /*
                Demo-only password representation.

                For a real production application,
                passwords must be hashed server-side.
            */

            const user = {
                id: Date.now(),
                name: name,
                email: email,

                passwordHash:
                    btoa(
                        unescape(
                            encodeURIComponent(password)
                        )
                    ),

                createdAt:
                    new Date().toISOString()
            };


            users.push(user);

            saveUsers(users);


            showMessage(
                message,
                "Account created successfully! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);

        }
    );
}


/* =========================
   Login
========================= */

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    setupPasswordToggle(
        "login-password",
        "login-password-toggle"
    );


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("login-email")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("login-password")
                    .value;

            const message =
                document.getElementById(
                    "login-message"
                );


            if (email === "" || password === "") {

                showMessage(
                    message,
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            const users = getUsers();


            const passwordHash =
                btoa(
                    unescape(
                        encodeURIComponent(password)
                    )
                );


            const user =
                users.find(
                    storedUser =>
                        storedUser.email === email &&
                        storedUser.passwordHash === passwordHash
                );


            if (!user) {

                showMessage(
                    message,
                    "Invalid email or password.",
                    "error"
                );

                return;
            }


            saveSession(user);


            showMessage(
                message,
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(() => {
                window.location.href =
                    "dashboard.html";
            }, 700);

        }
    );
}


/* =========================
   Protected Dashboard
========================= */

const userName =
    document.getElementById("user-name");

const dashboardName =
    document.getElementById("dashboard-name");

const dashboardEmail =
    document.getElementById("dashboard-email");

const logoutButton =
    document.getElementById("logout-button");


if (
    userName ||
    dashboardName ||
    dashboardEmail
) {

    const session = getSession();


    if (!session) {

        window.location.href = "index.html";

    } else {

        if (userName) {
            userName.textContent =
                session.name;
        }

        if (dashboardName) {
            dashboardName.textContent =
                session.name;
        }

        if (dashboardEmail) {
            dashboardEmail.textContent =
                session.email;
        }

    }
}


/* =========================
   Logout
========================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            clearSession();

            window.location.href =
                "index.html";

        }
    );
}