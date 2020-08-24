
//today-current-dataset 
$('.today-current-date').html(dateFormat(new Date(),"dddd, mmmm dS")); // set the current date //https://www.npmjs.com/package/dateformat
$('.today-current-icon').html('<i class="fas fa-umbrella"></i>');// set the icon
$('.today-current-description').html('Rain');// set the description
$('.today-current-temperature').html('<i class="fas fa-temperature-high"></i>'+'30.5&#8451;'); // set the t(icon) + temp + celsius(sign)
$('.today-current-feeling').html('real feel 30.5&#8451;'); // set the windchill effect // https://goodcalculators.com/wind-chill-calculator/
$('.today-current-wind').html('<i class="fas fa-wind"></i>'+'100m/s');

//today-current-dayduration
$('.today-duration-sunrise').html("Sunrise: "+(dateFormat(new Date(),"HH:MM")));
$('.today-duration-time').html("Duration: "+(dateFormat(new Date(),"HH:MM")));
$('.today-duration-sunset').html("Sunset: "+(dateFormat(new Date(),"HH:MM")));


//hourly-fill
function createHourlyColumn(){
    let time = $("<div></div>").addClass("hourly-info-time").html(dateFormat(new Date(),"shortTime"));
    let icon = $("<div></div>").addClass("hourly-info-icon-whitespace").html('<i class="fas fa-cloud-meatball"></i>');
    let forecast = $("<div></div>").addClass("hourly-info-forecast").html('wind');
    let temperature = $("<div></div>").addClass("hourly-info-temperature").html('22.5&#8451;');
    let realfeel = $("<div></div>").addClass("hourly-info-realfeel").html('12.5&#8451;');
    let wind = $("<div></div>").addClass("hourly-info-wind").html('wind');
    let newCol = $("<div></div>").addClass("today-hourly-info").append(time,icon,forecast,temperature,realfeel,wind);
    $(".today-hourly").append(newCol);
};

createHourlyColumn();
createHourlyColumn();
createHourlyColumn();
createHourlyColumn();

createHourlyColumn();
createHourlyColumn();
createHourlyColumn();
createHourlyColumn();


function createNearbyContainer(name){
    let cityName = $("<div></div>").addClass("nearby-container-cityname").html(name);
    let cityIcon = $("<div></div>").addClass("nearby-container-cityicon").html('<i class="fas fa-cloud-meatball"></i>');
    let cityTemp = $("<div></div>").addClass("nearby-container-citytemp").html('12.5&#8451;');
    let newContainer = $("<div></div>").addClass("today-nearby-container").append(cityName, cityIcon, cityTemp);
    $(".today-nearby").append(newContainer);
};


createNearbyContainer("Krakow");
createNearbyContainer("Zaporozhie");
createNearbyContainer("Bachchisaray");
createNearbyContainer("Kiev");



function createForecastListItem(index){
    let day = $('<div></div>').addClass('list-item-day').html(dateFormat(new Date(),"ddd"));
    let date =  $('<div></div>').addClass('list-item-date').html(dateFormat(new Date(),"mmm dS"));
    let icon = $('<div></div>').addClass('list-item-icon').html('<i class="fas fa-poo-storm"></i>');
    let temperature = $('<div></div>').addClass('list-item-temperature').html('<i class="fas fa-temperature-high"></i>'+'30.5&#8451;');
    let description = $('<div></div>').addClass('list-item-description').html('Warm ooze');
    let newListItem = $('<div></div>').addClass('forecast-list-item').addClass(index).append(day,date,icon,temperature,description);
    $(".forecast-list").append(newListItem);
}

createForecastListItem('index1');
createForecastListItem('index2');
createForecastListItem('index3');
createForecastListItem('index4');
createForecastListItem('index5');

function createSelectedListInfo(index){
    let time = $("<div></div>").addClass("list-info-time").html(dateFormat(new Date(),"hh TT"));
    let icon = $("<div></div>").addClass("list-info-icon").html('<i class="fas fa-cloud-sun"></i>');
    let forecast = $("<div></div>").addClass("list-info-forecast").html('sandstorm');
    let temperature = $("<div></div>").addClass("list-info-temperature").html('22.5&#8451;');
    let realfeel = $("<div></div>").addClass("list-info-realfeel").html('12.5&#8451;');
    let wind = $("<div></div>").addClass("list-info-wind").html('wind');
    let newListInfo = $("<div></div>").addClass("selected-list-info").append(time,icon,forecast,temperature,realfeel,wind);
    $(index).append(newListInfo);
};

for(let i = 1; i <= 5; ++i){
    $(".forecast-selected").append($("<div></div>").addClass("forecast-selected-list").addClass("indexS"+i));
    for(let j = 1; j <= 8; ++j){
        createSelectedListInfo(".indexS"+i);
}
}
