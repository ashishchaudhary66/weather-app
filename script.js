
const API_KEY="1e42d0e597bb5049af84e18e3bd6e232";
const weatherInfo=document.querySelector(".weather-info");
const searchCity=document.querySelector(".search-bar");
const searchButton=document.querySelector(".search-button");
const grantAccessContainer=document.querySelector(".grant-location");
const loadingScreen=document.querySelector(".loading");
let searchWeather=document.querySelector("[search-weather]");
let yourWeather=document.querySelector("[your-weather]");

yourWeather.style.backgroundColor="skyblue";
weatherInfo.classList.add("active-flex");
let currentTab=yourWeather;
getfromSessionStorage();


searchWeather.addEventListener('click',()=>{
    searchWeather.style.backgroundColor="skyblue";
    yourWeather.style.backgroundColor="transparent";
    
    if(currentTab!=searchWeather){
        weatherInfo.classList.remove("active");
        searchCity.classList.add("active");
        currentTab=searchWeather;
    }
    
})
yourWeather.addEventListener('click',()=>{
    yourWeather.style.backgroundColor="skyblue";
    searchWeather.style.backgroundColor="transparent";
    if(currentTab!=yourWeather){
        searchCity.classList.remove("active");
        currentTab=yourWeather;
        getfromSessionStorage();
    }
})
searchButton.addEventListener('click',()=>{
    let city=document.querySelector(".search-text").value;
    fetchWeatherByCity(city);
    
})

async function fetchWeatherByCity(city){

    try{
        loadingScreen.classList.add("active");
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();

        renderWeatherInfo(data);
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        
    }
    catch(e){
        console.log("ERROR CAUGHT : ",e);
    }
}

function renderWeatherInfo(data){
    let city=document.querySelector(".city");
    let flag=document.querySelector(".flag");
    let desc=document.querySelector(".weather-description");
    let weatherImg=document.querySelector(".weather-image");
    let temperature=document.querySelector(".temperature");
    let wind=document.querySelector(".wind");
    let humidity=document.querySelector(".humidity");
    let clouds=document.querySelector(".clouds");

    city.innerText=data?.name;
    flag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText=data?.weather?.[0]?.description;
    weatherImg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temperature.innerText=`${data?.main?.temp} °C`;
    wind.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    clouds.innerText=`${data?.clouds?.all}%`;
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make invisible search bar
    searchCity.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
