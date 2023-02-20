"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
  // Private instance properties
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    // the submit event gets triggered also when we hit ENTER
    // the 'this' keyword inside the _newWorkout will point to form, this is fixed by using bind()
    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    // check if it exist because of old browsers
    if (navigator.geolocation)
      // arguments are 2 callback functions:
      // 1st gets called on success, the argument is called the Position Parameter
      // 2nd gets called on failure

      //!! getCurrentPosition will call the loadMap as a regular function call and thus the this keyword will be undefined!
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position!");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    // the "map" in parenthessis corresponds to an id tag in our html, that's where the map will be displayed
    // 2nd argument of setView is the zoom level
    this.#map = L.map("map").setView(coords, 13);

    //we can set different styles of openstreetmap
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // this is basically an event listener for the map
    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    // copying to a global variable because we need it at form submit event
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    // good for user experience, we can immediately start typing
    inputDistance.focus();
  }

  _toggleElevationField() {
    // closest() selects parents
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    // to stop it from appearing and reloading
    e.preventDefault();

    // Clear input fields
    inputDistance.value = inputDuration.value = inputElevation.value = "";

    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("workout")
      .openPopup();

    // changing form options for different workout types (running vs cycling)
    inputType.addEventListener("change", function () {});
  }
}

// main
const app = new App();
