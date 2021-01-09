function executeDrowning() {
    const longitude = parseFloat(document.getElementById("longitude").value).toFixed(5);
    const latitude = parseFloat(document.getElementById("latitude").value).toFixed(5);

    isDrowned = isOnWater(latitude, longitude);
    console.log(isDrowned)
    displayResult(isDrowned);
    displayMap(latitude, longitude);
    displayAddress(latitude, longitude);
}

function isOnWater(latitude, longitude) {
    const Http = new XMLHttpRequest();
    const url=`https://api.onwater.io/api/v1/results/${latitude},${longitude}?access_token=GY-kZ1a_fKoME8juAJcZ`;
    Http.open("GET", url);
    Http.send();

    return Http.onreadystatechange = (e) => {
        onWater = JSON.parse(Http.response).water;
        console.log('In Water')
        console.log(onWater)
        return onWater;
    }
}

function displayResult(isDrowned) {
    console.log(`You are ${isDrowned ? 'Drowned' : 'Alive'}`);
    if (isDrowned) {
        document.getElementById('main').innerHTML = "YOU ARE DEAD!";
    } else {
        document.getElementById('main').innerHTML = "You survived!";
    }
}

function displayMap(latitude, longitude) {
    document.getElementById('locationImg').src = 
        `https://maps.googleapis.com/maps/api/staticmap?markers=size:small%7C${latitude},${longitude}&zoom=11&size=400x400&key=AIzaSyBoyAr-jdEmaxd9jSVHBwCkeohtXOZdN2g`;
}

function displayAddress(latitude, longitude) {
    const Http = new XMLHttpRequest();
    const url= `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA9umthbEuph3aHr6-fWsEiPKtWAVGssfA`;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        address = JSON.parse(Http.responseText);
        console.log(address)
        document.getElementById('main').innerHTML += 'You are at: ' + address.results[0].formatted_address;
    }
}