//weather icons
const MOON = '<i class="fas fa-moon"></i>';
const CLOUD_MOON = '<i class="fas fa-cloud-moon"></i>';
const SNOWFLAKE = '<i class="fas fa-snowflake"></i>';
const CLOUD_MEATBALL = '<i class="fas fa-cloud-meatball"></i>';
const CLOUD_MOON_RAIN = '<i class="fas fa-cloud-moon-rain"></i>';
const CLOUD_RAIN = '<i class="fas fa-cloud-rain"></i>';
const CLOUD_SHOWERS_HEAVY = '<i class="fas fa-cloud-showers-heavy"></i>';
const CLOUD_SUN = '<i class="fas fa-cloud-sun"></i>';
const CLOUD_SUN_RAIN = '<i class="fas fa-cloud-sun-rain"></i>';
const POO_STORM = '<i class="fas fa-poo-storm"></i>';
const UMBRELLA = '<i class="fas fa-umbrella"></i>'; // something went wrong
const SUN = '<i class="fas fa-sun"></i>';
const CLOUD = '<i class="fas fa-cloud"></i>';
const MIST = '<i class="fas fa-smog"></i>';
const WIND = '<i class="fas fa-wind"></i>';
const BOLT = '<i class="fas fa-bolt"></i>';

function createWeatherIcon(responseIconCode,responseTime){
    let hour24 = dateFormat(new Date(responseTime),"HH"); // convertation time to locale hours
    let isDay = hour24 > "06";
    if (responseIconCode >= 800){
        switch (responseIconCode){
            case 800:   return ( isDay ? SUN : MOON);

            case 801:   return ( isDay ? CLOUD_SUN : CLOUD_MOON);
            case 802:   return ( CLOUD_MEATBALL);
            case 803:
            case 804:   return ( CLOUD );
            default:    return ( UMBRELLA );
        };
    }
    else if(responseIconCode > 700){
                        return ( MIST );
    }
    else if(responseIconCode >= 600){
                        return ( SNOWFLAKE );
    }
    else if(responseIconCode >= 500){
        switch(responseIconCode){
            case 500:
            case 501:   return ( isDay ? CLOUD_SUN_RAIN : CLOUD_MOON_RAIN);
            case 502:
            case 503:
            case 504:   return ( CLOUD_SHOWERS_HEAVY);
            case 511:   return ( UMBRELLA);
            case 520:
            case 521:
            case 522:
            case 531:   return ( CLOUD_RAIN );
            default:    return ( UMBRELLA);
        }
    }
    else if(responseIconCode >= 300){
        switch(responseIconCode){
            case 300:
            case 301:
            case 310:   return ( isDay? CLOUD_SUN_RAIN : CLOUD_MOON_RAIN);
            default:    return ( CLOUD_SHOWERS_HEAVY );
        }
    }
    else if(responseIconCode >= 200){
        switch(responseIconCode){
            case 210:
            case 211:
            case 212:
            case 221:   return ( BOLT );
            default:    return ( POO_STORM);          
            }
    }
    else{
        console.log('Create icon: fail');
                        return ( UMBRELLA );
    }

};

//thermometer
const T_EMPTY = '<i class="fas fa-thermometer-empty"></i>';
const T_LOW = '<i class="fas fa-temperature-low"></i>';
const T_QUARTER = '<i class="fas fa-thermometer-quarter"></i>';
const T_HALF = '<i class="fas fa-thermometer-half"></i>';
const T_3QUARTER = '<i class="fas fa-thermometer-three-quarters"></i>';
const T_FULL = '<i class="fas fa-thermometer-full"></i>';
function createTemperatureIcon(responseTemperature){
    if (responseTemperature > 30.0)
        return T_FULL;
    else if(responseTemperature > 20.0)
        return T_3QUARTER;
    else if(responseTemperature > 10.0)
        return T_HALF;
    else if(responseTemperature > 0.0)
        return T_QUARTER;
    else if(responseTemperature > -15.0)
        return T_LOW;
    else 
        return T_EMPTY;
}

//realfeel temp, windchill effect, comforttemp etc..
function windChill(responseTemperature,windSpeed){
    let temp = 1.8 * responseTemperature + 32;                  //Celsius to Fahrenheit
    // let temp = 1.8 * (responseTemperature - 273.15) + 32;   //Kelvin to Fahrenheit
    // let temp = 0.55556 * (wc - 32);                         //Fahrenheit to Celsius
    // let temp = ( 0.55556 * (wc - 32) ) + 273.15;            //Fahrenheit to Kelvin
    
    //let wind = 0.621371 * windSpeed;    //(km/h)
    let wind = 2.23694 * windSpeed;     //(m/s)
    // let wind = 0.681818 * windSpeed;    //(ft/s)
    // let wind = 1.15077945 * windSpeed;  //(kts)
    let wcEffect = 35.74 + 0.6215 * temp - 35.75 * Math.pow(wind,0.16) + 0.4275 * temp * Math.pow(wind,0.16);
    return 0.55556 * (wcEffect - 32);                         //Fahrenheit to Celsius 
}