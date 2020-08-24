$('.nav-controls-today').click( ( event ) => {
    $('.main-section').scrollLeft(0);
    $('.nav-controls-selected').removeClass('nav-controls-selected');
    $('.nav-controls-today').addClass('nav-controls-selected');
});
$('.nav-controls-forecast').click( ( event ) => {
    $('.main-section').scrollLeft(1120);
    $('.nav-controls-selected').removeClass('nav-controls-selected');
    $('.nav-controls-forecast').addClass('nav-controls-selected');
});
$('.nav-search-button').click(e=>{
    let cityName = $('.nav-search-input').val();
    loadSelectedData(cityName);
});
$(".main-header").on('keyup', function (e) {
    if (e.keyCode === 13) {
        let cityName = $('.nav-search-input').val();
        loadSelectedData(cityName);
    }
});

function loadSelectedData(cityName){
    axios.get( FORECAST + cityName + METRIC + API_KEY )
        .then( function( response ){
            loadCurrentCityData(response.data);
            loadCurrentHourlyData(response.data.list);
            loadForecastData(response.data.list);
            loadNearbyCities(response.data.city.coord.lat,response.data.city.coord.lon);
            $('.main-section').scrollTop(0);
            if( $('.main-section').scrollLeft() ){
                $('.nav-controls-today').removeClass('nav-controls-selected').show();
                $('.nav-controls-forecast').addClass('nav-controls-selected').show();
            } else {
            $('.nav-controls-today').addClass('nav-controls-selected').show();
            $('.nav-controls-forecast').removeClass('nav-controls-selected').show();
            }
        })
        .catch( function( error ) {
            handlingErrors(error);
        })
}
function handlingErrors(error){
    if (error.response) {
        console.log(error.response.data);
        $('.nav-controls-today').hide();
        $('.nav-controls-forecast').hide();
        $('.main-section-error-message').html('').append(
                $(DIV).html( $('.nav-search-input').val() + " could not be found" ),
                $(DIV).html( 'Please enter another location' )
        )
        document.querySelector('.main-section-error').scrollIntoView();
    } else {
        $('.nav-controls-today').hide();
        $('.nav-controls-forecast').hide();
        $('.main-section-error-message').html('Unknown error');
        document.querySelector('.main-section-error').scrollIntoView();
    }
}
const API_KEY = '&appid=b9c2e6ae48b91eafc79b582a9919ec60';
const DEFAULT_CITY = 'Kharkiv';
const FORECAST = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const METRIC = '&units=metric';
const FORECAST_ = 'http://api.openweathermap.org/data/2.5/forecast?';
//http://api.openweathermap.org/data/2.5/find?lat=55.5&lon=37.5&cnt=10
const NEARBY = 'http://api.openweathermap.org/data/2.5/find?';

$(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(permissionGranted, permissionDenied);
      } else { 
        console.log("Geolocation is not supported by this browser.");
        loadDefaultCity();
      }
});

function permissionGranted(position){
    let lat = 'lat=' + (position.coords.latitude).toFixed(2);
    let lon = '&lon=' + (position.coords.longitude).toFixed(2);
    axios.get(FORECAST_ + lat + lon + METRIC + API_KEY)
        .then(function(response){
            console.log('User allowed the request for Geolocation');
            loadCurrentCityData(response.data);
            loadCurrentHourlyData(response.data.list);
            loadForecastData(response.data.list);
            loadNearbyCities(response.data.city.coord.lat,response.data.city.coord.lon);
        })
};
function permissionDenied(error){
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
    loadDefaultCity();
};
function loadDefaultCity(){
    axios.get( FORECAST + DEFAULT_CITY + METRIC + API_KEY )
    .then(function(response){
        console.log('Loading default city');
        loadCurrentCityData(response.data);
        loadCurrentHourlyData(response.data.list);
        loadForecastData(response.data.list);
    })
};
//
//  START today tab -> current weather, today duration
const _TODAY_CURRENT = '.today-current';
const TODAY_CURRENT_DATE = 'today-current-date';
const TODAY_CURRENT_ICON = 'today-current-icon'; 
const TODAY_CURRENT_DESCRIPTION = 'today-current-description';
const TODAY_CURRENT_TEMPERATURE = 'today-current-temperature';
const TODAY_CURRENT_WINDCHILL = 'today-current-feeling';
const TODAY_CURRENT_WIND = 'today-current-wind';
const CELSIUS = '&#8451;';
const DIV = '<div></div>';

const _TODAY_DURATION = '.today-duration';
const DURATION_SUNRISE = 'today-duration-sunrise';
const DURATION_SUNSET = 'today-duration-sunset';
const DURATION_TIME = 'today-duration-time';

function loadCurrentCityData(data){

    let newDate = $(DIV).addClass(TODAY_CURRENT_DATE)
        .html(dateFormat(new Date(),"dddd, mmmm dS"));
    let newIcon = $(DIV).addClass(TODAY_CURRENT_ICON)
        .html(createWeatherIcon(data.list[0].weather[0].id,data.list[0].dt_txt));
    let newDesc = $(DIV).addClass(TODAY_CURRENT_DESCRIPTION)
        .html(data.list[0].weather[0].main);
    let newTemp = $(DIV).addClass(TODAY_CURRENT_TEMPERATURE)
        .html(createTemperatureIcon(data.list[0].main.temp)+ ' ' + Math.round(data.list[0].main.temp) + CELSIUS);
    let newFeel = $(DIV).addClass(TODAY_CURRENT_WINDCHILL)
        .html('RealFeel ' + Math.floor(windChill(data.list[0].main.temp,data.list[0].wind.speed)) + CELSIUS);
    let newWind = $(DIV).addClass(TODAY_CURRENT_WIND)
        .html('Wind(m/s) ' + data.list[0].wind.speed + ' ' + degToCard(data.list[0].wind.deg));
    $(_TODAY_CURRENT).html('');
    $(_TODAY_CURRENT).append(newDate,newIcon,newDesc,newTemp,newFeel,newWind);


    let sunriseTime = new Date(data.city.sunrise*1e3);
    let sunsetTime = new Date(data.city.sunset*1e3);
    let durationMinutes = ( sunsetTime.getHours() * 60 + sunsetTime.getMinutes() ) - ( sunriseTime.getHours() * 60 + sunriseTime.getMinutes() );

    let sunrise = $(DIV).addClass(DURATION_SUNRISE)
        .html("Sunrise: "+dateFormat(sunriseTime,"HH:MM"));
    let sunset = $(DIV).addClass(DURATION_SUNSET)
        .html("Sunset: "+ dateFormat(sunsetTime,"HH:MM"));
    let duration = $(DIV).addClass(DURATION_TIME)
        .html('Duration: ' + Math.floor(durationMinutes/60) +':'+ durationMinutes%60 );

    $(_TODAY_DURATION).html('');
    $(_TODAY_DURATION).append(sunrise,sunset,duration);
}
//  END today tab -> current weather 
//
//  START today-tab hourly
const CURRENT_HOURLY_TIME = 'hourly-info-time';
const CURRENT_HOURLY_ICON = 'hourly-info-icon-whitespace';
const CURRENT_HOURLY_DESC = 'hourly-info-forecast';
const CURRENT_HOURLY_TEMP = 'hourly-info-temperature';
const CURRENT_HOURLY_WDCH = 'hourly-info-realfeel';
const CURRENT_HOURLY_WIND = 'hourly-info-wind';
const CURRENT_HOURLY_NODE = 'today-hourly-info';
const _TODAY_HOURLY = '.today-hourly';

function loadCurrentHourlyData( list ){
    $( _TODAY_HOURLY ).html('');
    for(let i = 0; i < 8; ++i){
        createHourlyNode( list[ i ], _TODAY_HOURLY );
    }
}
function createHourlyNode( node, appendClassName ){
    let newTime = $( DIV ).addClass( CURRENT_HOURLY_TIME )
        .html( dateFormat( new Date( node.dt_txt ), "HH:MM" ) );
    let  newIcon = $( DIV ).addClass( CURRENT_HOURLY_ICON )
        .html( createWeatherIcon( node.weather[0].id, node.dt_txt ) );
    let newDesc = $( DIV ).addClass( CURRENT_HOURLY_DESC )
        .html( node.weather[0].main ) ;
    let newTemp = $( DIV ).addClass( CURRENT_HOURLY_TEMP )
        .html( Math.round( node.main.temp ) + CELSIUS );
    let newWDCH = $( DIV ).addClass( CURRENT_HOURLY_WDCH )
        .html( Math.floor( windChill( node.main.temp, node.wind.speed ) ) + CELSIUS );
    let newWind = $( DIV ).addClass( CURRENT_HOURLY_WIND )
        .html( node.wind.speed + ' ' + degToCard( node.wind.deg ) );
       
    let newNode = $( DIV ).addClass( CURRENT_HOURLY_NODE)
        .prop('title', node.weather[0].description )
        .append( newTime, newIcon, newDesc, newTemp, newWDCH, newWind );
    $( appendClassName ).append( newNode );
}
//  END today-tab -> hourly

//
//  START forecast tab - > days
const _FORECAST_LIST = '.forecast-list';
const FORECAST_LIST_NODE = 'forecast-list-item';
const FORECAST_LIST_NODE_DAY = 'list-item-day';
const FORECAST_LIST_NODE_TIME = 'list-item-date';
const FORECAST_LIST_NODE_ICON = 'list-item-icon';
const FORECAST_LIST_NODE_TEMP = 'list-item-temperature';
const FORECAST_LIST_NODE_DESC = 'list-item-description';

function createForecastDailyListNode( node, appendClassName, scrollPos ){
    let newDay = $( DIV ).addClass( FORECAST_LIST_NODE_DAY )
        .html( dateFormat( new Date( node.dt_txt ), "ddd" ) );
    let newDate =  $(DIV).addClass( FORECAST_LIST_NODE_TIME )
        .html( dateFormat( new Date( node.dt_txt ), "mmm dS" ) );
    let newIcon = $( DIV ).addClass( FORECAST_LIST_NODE_ICON )
        .html( createWeatherIcon( node.weather[0].id, node.dt_txt ) );
    let newTemp = $( DIV ).addClass( FORECAST_LIST_NODE_TEMP )
        .html( createTemperatureIcon( node.main.temp ) + ' ' + Math.round( node.main.temp ) + CELSIUS );
    let newDesc = $( DIV ).addClass( FORECAST_LIST_NODE_DESC )
        .html( node.weather[0].main );
    let newNode = $( DIV ).addClass( FORECAST_LIST_NODE )
        .addClass( dateFormat( new Date( node.dt_txt ), "ddd" ) )
        .prop('title', node.weather[0].description )
        .append( newDay, newDate, newIcon, newTemp, newDesc )
        .click( (e) => {
                $( _FORECAST_HOURLY ).scrollLeft( scrollPos );
                $('.main-section-forecast div').removeClass('forecast-node-selected');
                $('.' + e.currentTarget.classList[1] + ' .' + FORECAST_HOURLY_LIST_NODE).addClass('forecast-node-selected');
                $(e.currentTarget).addClass('forecast-node-selected');
        });
    $( appendClassName ).append( newNode );
}
//  END forecast-tab -> days
//
//  START forecast tab -> hourly list
const _FORECAST_HOURLY ='.forecast-selected';
const FORECAST_HOURLY_LIST = "forecast-selected-list";
const FORECAST_HOURLY_LIST_NODE = 'selected-list-info';
const HOURLY_LIST_NODE_TIME = "list-info-time";
const HOURLY_LIST_NODE_ICON = "list-info-icon";
const HOURLY_LIST_NODE_DESC = "list-info-forecast";
const HOURLY_LIST_NODE_TEMP = "list-info-temperature";
const HOURLY_LIST_NODE_WDCH = "list-info-realfeel";
const HOURLY_LIST_NODE_WIND = "list-info-wind";

function createForecastHourlyListNode( node, appendClassName){
    let newTime = $( DIV ).addClass( HOURLY_LIST_NODE_TIME )
        .html( dateFormat( new Date( node.dt_txt ), "HH:MM" ) );
    let newIcon = $( DIV ).addClass( HOURLY_LIST_NODE_ICON )
        .html( createWeatherIcon( node.weather[0].id, node.dt_txt ) );
    let newDesc = $( DIV ).addClass( HOURLY_LIST_NODE_DESC )
        .html( node.weather[0].main ) ;
    let newTemp = $( DIV ).addClass( HOURLY_LIST_NODE_TEMP )
        .html( Math.round( node.main.temp) + CELSIUS );
    let newWDCH = $( DIV ).addClass( HOURLY_LIST_NODE_WDCH )
        .html( Math.floor( windChill( node.main.temp, node.wind.speed ) ) + CELSIUS );
    let newWind = $( DIV ).addClass( HOURLY_LIST_NODE_WIND )
        .html( node.wind.speed + ' ' + degToCard( node.wind.deg ) );
    let newNode = $( DIV ).addClass( FORECAST_HOURLY_LIST_NODE)
        .prop( 'title' , node.weather[0].description )
        .append( newTime, newIcon, newDesc, newTemp, newWDCH, newWind );
    $( appendClassName ).append( newNode );
};
//  END forecast -> hourly list
//
//  START forecast main function
function loadForecastData(list){
    $( _FORECAST_HOURLY ).html('');
    $( _FORECAST_LIST ).html('')
    let patt = /00:00:00/;
    let index = 0;
    let scrollPos = 0;
    //running through response
    while ( index < 40 )
    {
        //searching start of the day
        if ( patt.test( list[ index ].dt_txt ) ){
            // creating new hourly list
            let newClassName = dateFormat( new Date( list[ index ].dt_txt ), "ddd" );
            let newHourlyList = $( DIV ).addClass( FORECAST_HOURLY_LIST )
                                         .addClass( newClassName );
            $( _FORECAST_HOURLY ).append( newHourlyList );
            //create daily node
            let dayTime = ( (index + 4) < 40 ) ? index + 4 : index;
            createForecastDailyListNode( list[ dayTime ], _FORECAST_LIST, scrollPos );
            for ( let i = 0, __index = index; i <= 8; ++i ){
                __index = ( ( index + i ) < 40 ) ? ( index + i ) : __index ;
                createForecastHourlyListNode( list[ __index ], _FORECAST_HOURLY + " ." + newClassName );
            }
            index += 7;
            scrollPos += 1040;
        }
        index++;
    }
    $( _FORECAST_LIST + ' .' + FORECAST_LIST_NODE + ':first-child')
        .addClass('forecast-node-selected');
    $( _FORECAST_HOURLY ).scrollLeft( 0 );
    $( _FORECAST_HOURLY + " ." + FORECAST_HOURLY_LIST + ":first-child ." + FORECAST_HOURLY_LIST_NODE)
        .addClass('forecast-node-selected');
}
//  END forecast main function
//
//  START Nearby cities
function loadNearbyCities( latitude, longitude, count = 50){
    $( _NEARBY_CONTAINER ).html('');
    //http://api.openweathermap.org/data/2.5/find?lat=55.5&lon=37.5&cnt=10
    const LAT = 'lat=' + latitude.toFixed(2);
    const LON = '&lon=' + longitude.toFixed(2);
    const CNT = '&cnt=' + count;
    axios.get( NEARBY + LAT + LON + METRIC + CNT + API_KEY )
        .then( function( response ){
            let list = response.data.list;
            // add some magic with colors, i know that there is no colors
            list.sort( ( a, b ) => ( a.color > b.color ) ? 1 : -1 );
            for ( let i = 0 ; i < 4 ; ++i){
                createNearbyContainerNode( list[ i ] );
            }
        });

}
//  END Nearby cities
//
//  Start Nearby container
const _NEARBY_CONTAINER = ".today-nearby";
const NEARBY_CONTAINER_NODE = "today-nearby-container";
const NEARBY_CONTAINER_NODE_NAME = "nearby-container-cityname";
const NEARBY_CONTAINER_NODE_ICON = "nearby-container-cityicon";
const NEARBY_CONTAINER_NODE_TEMP = "nearby-container-citytemp";
function createNearbyContainerNode( node ){
    let cityName = $( DIV ).addClass( NEARBY_CONTAINER_NODE_NAME )
        .html( node.name );
    let cityIcon = $( DIV ).addClass( NEARBY_CONTAINER_NODE_ICON )
        .html( createWeatherIcon( node.weather[0].id, node.dt * 1e3 ) );
    let cityTemp = $( DIV ).addClass( NEARBY_CONTAINER_NODE_TEMP )
        .html( ( node.main.temp ).toFixed( 1 ) + '&#8451;' );
    let newNode = $( DIV ).addClass( NEARBY_CONTAINER_NODE ).append( cityName, cityIcon, cityTemp )
        .click( function(e){
            let target  = $(e.currentTarget).find('div')[0];
            let searchTerm = $(target).html();
            $('.nav-search-input').val( searchTerm );
            loadSelectedData( searchTerm );
        });

    $( _NEARBY_CONTAINER ).append( newNode ).prop( 'title' , node.weather[0].description );
};
//  END Nearby container


let searchinput = 'search-input';
$(document).ready( function() {
    let autocomplete;
    autocomplete = new google.maps.places.Autocomplete( ( document.getElementById(searchinput)),{
        types: ['(cities)']
    });
})