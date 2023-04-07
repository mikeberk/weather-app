const weatherKey = "cb831084799e4b06a6823836232803";
const baseURL = "https://api.weatherapi.com/v1/current.json";
const search = document.getElementById("search");
const submitBtn = document.querySelector("button");
const image = document.querySelector("img");
const cityP = document.getElementById("city");
const countryP = document.getElementById("country");
const tempP = document.getElementById("temp");
const descP = document.getElementById("desc");

let myLocation = "saint louis";
let unit = "f";

let currentWeather = {
  location: {},
  weather: {},
};

let defaultData = {
  location: {
    city: "Could Not Find Weather for City Entered",
    region: "",
    country: "Results not found",
  },
  weather: {
    temp_f: "--",
    temp_c: "--",
    description: "Try a new search",
    icon: "https://cdn.weatherapi.com/weather/64x64/night/296.png",
  },
};

async function getWeather(location) {
  let url = `${baseURL}?key=${weatherKey}&q=${location}`;
  let response = await fetch(url, { mode: "cors" });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.status);
  }
}

async function handleWeatherData(weatherReturn) {
  try {
    let returnLocation = await weatherReturn.location;
    let returnCurrent = await weatherReturn.current;

    currentWeather.location = {
      city: returnLocation.name + ",",
      region: returnLocation.region,
      country: returnLocation.country,
    };
    currentWeather.weather = {
      temp_f: Math.floor(returnCurrent.temp_f),
      temp_c: Math.floor(returnCurrent.temp_c),
      description: returnCurrent.condition.text,
      icon: "https:" + returnCurrent.condition.icon,
    };
    return currentWeather;
  } catch (err) {
    console.log(err.name);
  }
}

function displayWeatherDate(data) {
  image.src = data.weather.icon;
  cityP.textContent = `${data.location.city} ${data.location.region}`;
  countryP.textContent = data.location.country;
  tempP.textContent =
    unit === "f" ? data.weather.temp_f + "° F" : data.weather.temp_c + "° C";
  descP.textContent = data.weather.description;
}

async function searchCity(e) {
  if (search.validity.valid || e.target == document) {
    e.preventDefault();
    try {
      myLocation = search.value != "" ? search.value : myLocation;
      let weatherSearch = await getWeather(myLocation);
      let handledData = await handleWeatherData(weatherSearch);
      displayWeatherDate(handledData);
      search.value = "";
    } catch (err) {
      console.log(err);
      displayWeatherDate(defaultData);
    }
  }
}

function toggleUnit(e) {
  unit = unit === "f" ? "c" : "f";
  // access the stored weather object and swap the temp in DOM
  tempP.textContent =
    unit === "f"
      ? currentWeather.weather.temp_f + "° F"
      : currentWeather.weather.temp_c + "° C";
}

window.addEventListener("load", searchCity);
submitBtn.addEventListener("click", searchCity);
tempP.addEventListener("click", toggleUnit);
