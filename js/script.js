document.querySelector('.contact-form').addEventListener('submit', function (e) {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    e.preventDefault();
    alert('Please fill in all fields before submitting.');
    return;
  }

  // Optional: email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    e.preventDefault();
    alert('Please enter a valid email address.');
    return;
  }
});
