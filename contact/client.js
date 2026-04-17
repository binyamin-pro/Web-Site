const form = document.getElementById("contactForm");
const btn = document.querySelector(".submit-btn");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    btn.disabled = true;
    btn.innerText = "Sending...";

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    // validation
    if (data.name.length < 3) return fail("Name must be at least 3 characters");
    if (!data.email.includes("@")) return fail("Invalid email");
    if (data.phone.length < 10) return fail("Invalid phone");
    if (data.subject.length < 5) return fail("Subject too short");
    if (data.message.length < 10) return fail("Message too short");

    document.getElementById("errorText").textContent = "";
    try {
        const res = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        // success
        form.reset();
        //btn.innerText = "Send Message";

        btn.innerText = "Sent!";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "Send Message";
        }, 3000); // 3s

    } catch (err) {
        fail("Server error");
    }

    function fail(msg) {
        document.getElementById("errorText").textContent = msg;
        btn.disabled = false;
        btn.innerText = "Send Message";
    }
});