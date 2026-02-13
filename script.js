const pricing = {
  studio: 70,
  "1br": 95,
  "2br": 135,
  "3br": 175,
};

const serviceMultiplier = {
  standard: 1,
  deep: 1.45,
  move: 1.65,
  office: 1.8,
};

const form = document.getElementById("bookingForm");
const result = document.getElementById("result");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const size = document.getElementById("size").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!size || !service || !date || !time) {
    result.textContent = "Please complete all booking details.";
    return;
  }

  const total = Math.round(pricing[size] * serviceMultiplier[service]);
  result.textContent = `Estimated fare: $${total}. A cleaner can arrive around ${time} on ${date}.`;
});
