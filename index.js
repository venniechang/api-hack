const STORE = {
 data: null,
 multiplier: null
};

const currencyURL= "https://api.fixer.io/latest";
//google maps api key AIzaSyCikYUxmjYBHfC73yZgYi8HueHD8YmjqJ0
//https://api.fixer.io/latest?base= <---input baseCurrency

function getCurrencyData(baseCurrency, targetCurrencies, callback){
    const params = {
        base: baseCurrency,
        symbols: targetCurrencies //"GBP,AUD,CNY,CAD,CZK"
    }
$.getJSON(currencyURL, params, callback)

}
/*getCurrencyData("USD", function(data){
    storeCurrencyData(data);
    showCurrencyData(STORE.data);
})*/

function generateCurrencyCard(data, symbol) {
    const currentRoundedRate = data.rates[symbol].toFixed(2);
    return `<div class = "card">${symbol}: ${currentRoundedRate}</div>`;
}

function showCurrencyData(data) { // want to display results to DOM
    let output = "";
    //console.log(data.rates);
    for (let symbol in data.rates) {
    output += generateCurrencyCard(data, symbol);
    }
    $(".display-results").html(output);
}

function storeCurrencyData(data) {
     STORE.data = data;
}

function convertCurrencyAmount(data, multiplier) { //multiply each number in rates and store it in data in place of starting rate
    for (let symbol in data.rates) {
        data.rates[symbol] = data.rates[symbol] * multiplier;
        //console.log(symbol);
    }
    
    console.log(STORE.data);
    console.log(STORE.multiplier);
}

function handleFormSubmit() {
    $(".form").on("submit", function(event){
        event.preventDefault();
        const userAmount = $("#input-amount").val();
        const baseCurrency = $("#starting-currency").val();
        const targetCurrencies = $("input[name=symbols]:checked"); //buildSymbolString(symbols); 
        const symbolString = buildSymbolString(targetCurrencies);
        console.log(symbolString);
        getCurrencyData(baseCurrency, symbolString, function(data){
            storeCurrencyData(data);
            convertCurrencyAmount(STORE.data, STORE.multiplier);
            showCurrencyData(STORE.data);
        
        })
    })
}

function handleAmountChange() {
    $(".form").on("input", "#input-amount", function(event){
        STORE.multiplier = $(event.currentTarget).val();
    })

}

function buildSymbolString(symbols){

    let symbolString = "";
    symbols.each(function(index, element) {
        symbolString += element.value;

        if (!(index == symbols.length - 1)) {
            symbolString += ",";
        }
    })
    return symbolString;
}

function searchBanks(){
    $(".find-banks").on("submit", function(event){
        initMap();
        var placesService = google.maps.places.PlacesService(map);
    })
    
}

//$(document).on('submit','form.remember',function(){ // code });

handleAmountChange();
handleFormSubmit();

var map;
var infowindow;

function initMap() {
    var uluru = {lat: 34.0522, lng: -118.2437};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: uluru,
          mapTypeId: 'roadmap'
        });

        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
        infowindow = new google.maps.InfoWindow();

        console.log(marker);

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: uluru,
        radius: 500,
        type: ['bank']
    }, callback);


    // Create the Search box and link it to the UI element    
    var input = document.getElementById("bank-input");
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport
    map.addListener("bounds_changed", function(){
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    //Listen for the event fired when the user selects a prediction and retrieve more details for that place
    
        searchBox.addListener("places_changed", function(){
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        //Clear out old markers
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
    
        //For each place, get the icon, name and location
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

        //Create a marker for each place
        markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            tile: place.name,
            position: place.geometry.location
        }));

        if (place.geometry.viewport) {
            //Only geocodes have viewport
            bounds.union(place.geometry.viewport);
        } 
        
        else {
            bounds.extend(place.geometry.location);
        }
        });
        map.fitBounds(bounds);
   });
}

function callback(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i< results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
