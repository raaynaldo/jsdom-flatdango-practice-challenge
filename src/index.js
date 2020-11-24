const url = "http://localhost:3000/films";
const filmsDiv = () => document.querySelector("#films");
const posterDiv = () => document.querySelector("#poster");
const showingDiv = () => document.querySelector("#showing");

document.addEventListener("DOMContentLoaded", function () {
  fetchMovies();
  fetchMovieDetails(1);
});

function fetchMovies() {
  fetch(url)
    .then((res) => res.json())
    .then((movies) => movies.forEach((movie) => renderMovie(movie)));
}

function renderMovie(movie) {
  let filmsDiv = document.getElementById("films");

  let div = document.createElement("div");
  div.id = `movie-${movie.id}`;
  div.addEventListener("click", () => fetchMovieDetails(movie.id));
  if (+movie.capacity - movie.tickets_sold <= 0) {
    div.className = "sold-out film item";
  } else {
    div.className = "film item";
  }

  div.innerText = movie.title.toUpperCase();

  filmsDiv.appendChild(div);
}

function fetchMovieDetails(id) {
  fetch(`${url}/${id}`)
    .then((res) => res.json())
    .then((movie) => renderMovieDetails(movie));
}

function renderMovieDetails(movie) {
  console.log(movie);

  let idInput = document.getElementById("movie-id");
  idInput.value = movie.id;

  let posterImg = document.getElementById("poster");
  posterImg.src = movie.poster;

  let titleDiv = document.getElementById("title");
  titleDiv.innerText = movie.title;

  let runtimeDiv = document.getElementById("runtime");
  runtimeDiv.innerText = movie.runtime;

  let filmInfoDiv = document.getElementById("film-info");
  filmInfoDiv.innerText = movie.description;

  let showTimeDiv = document.getElementById("showtime");
  showTimeDiv.innerText = movie.showtime;

  let movieCapInput = document.getElementById("movie-cap");
  movieCapInput.innerText = movie.capacity;

  const remTicket = +movie.capacity - movie.tickets_sold;
  let ticketNumSpan = document.getElementById("ticket-num");
  ticketNumSpan.innerText = remTicket;

  buyButtonTicketEvent();
}

function buyButtonTicketEvent() {
  const remTicket = +document.getElementById("ticket-num").innerText;

  let buyButton = document.getElementById("showing").querySelector(".button");
  if (remTicket <= 0) {
    buyButton.removeEventListener("click", handleClickBuyTicket);
    buyButton.className = "ui sold-out button";
    buyButton.innerText = "Sold Out";
  } else {
    buyButton.addEventListener("click", handleClickBuyTicket);
    buyButton.className = "ui orange button";
    buyButton.innerText = "Buy Ticket";
  }
}

function handleClickBuyTicket() {
  let movieId = document.getElementById("showing").querySelector("#movie-id")
    .value;

  const movieCap = +document.getElementById("movie-cap").innerText;

  const remTicket = +document.getElementById("ticket-num").innerText;

  const data = {
    tickets_sold: movieCap - remTicket + 1,
  };

  const obj = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  fetch(`${url}/${movieId}`, obj)
    .then((res) => res.json())
    .then((movie) => {
      document.getElementById("ticket-num").innerText =
        movieCap - movie.tickets_sold;
      buyButtonTicketEvent();

      if (movieCap - movie.tickets_sold <= 0) {
        let movieDiv = document.getElementById(`movie-${movie.id}`);
        movieDiv.className = "sold-out film item";
      }
    });
}
