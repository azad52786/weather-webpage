const userTab = document.querySelector("[data-Userweather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector(".data-not-found")


let oldTab = userTab;

const API_key = "40ab61d76891ac87b58634022999e62c";

oldTab.classList.add("current-tab");

//sessionStorage pea agar value pahele se hi pada hea
getFormSessionStorage();

function switchTab(newTab){
    if(oldTab != newTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
//screen mea yea to searchForm visible hoga nehi to user informmation visible hoga
        if(!searchForm.classList.contains("active")){
            //if search wala container is invisible if yes then make it visible.. 
            notFound.classList.remove("active");
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // agar pahele search wala tab mea tha to ab user weather wala tab mea a jao
            notFound.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFormSessionStorage();
        }
    }
}

userTab.addEventListener("click" , () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
})


searchTab.addEventListener("click" , () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

//check if coordinates are already present in session storage
function getFormSessionStorage(){
    const localCoordinate = sessionStorage.getItem("user-coordinate");
    if(!localCoordinate){
        grantAccess.classList.add("active");
    }
    //if not present in local storage
    else{
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;
    //make grand container invisible
    notFound.classList.remove("active");
    grantAccess.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //api call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch all the required element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const decs = document.querySelector("[data-weatherDis]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values form weatehr info object and put in ui
    console.log(weatherInfo);

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    decs.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}


function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show for alert for no geolocation

        alert("you haven't access of geolocation");
    }
}

function showPosition(position){
    const usercoordinate = {
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    };


    //stringify the pickup latitude and longitude. 
    //because we access those data in a object
    sessionStorage.setItem("user-coordinate", JSON.stringify(usercoordinate));
    fetchUserWeatherInfo(usercoordinate);
}
//grant access button ke upar ek listener laga do for getting access your current location

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getlocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    

    if(cityName === "") return ;

    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    notFound.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data =  await response.json();
        // console.log(data);
        if(data.cod == "404"){
            loadingScreen.classList.remove("active");
            notFound.classList.add("active");
        }
        else{
            notFound.classList.remove("active");
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    }
    catch(e){
        console.log(e);
    }
}
