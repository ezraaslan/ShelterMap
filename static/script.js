const map = L.map("map").setView([39.9526, -75.1652], 12);
const markerLayer = L.layerGroup().addTo(map);

let resources = [];
let userLocation = null;
let radiusCircle = null;

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

const radiusSlider =
document.getElementById("radius");

const radiusValue =
document.getElementById("radiusValue");

radiusSlider.oninput = function(){

    radiusValue.innerText = this.value;

    updateRadiusCircle();
    drawMarkers();

}

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(function(position){

const lat=position.coords.latitude;
const lon=position.coords.longitude;
userLocation = [lat, lon];

L.marker([lat,lon])

.addTo(map)
.bindPopup("You are here")
.openPopup();
map.setView([lat,lon],14);
updateRadiusCircle();
drawMarkers();
});

}

fetch("/api/resources")
    .then(response => response.json())
    .then(data => {

        resources = data;

        drawMarkers();

    });

function drawMarkers() {

    markerLayer.clearLayers();

    const enabledCategories = [];

    document.querySelectorAll(".category-filter").forEach(box => {

        if(box.checked)
            enabledCategories.push(box.value);

    });

    resources.forEach(resource => {
        

        if(!enabledCategories.includes(resource.category))
            return;

        if(userLocation){

            const distance = distanceMiles(
                userLocation[0],
                userLocation[1],
                resource.latitude,
                resource.longitude
            );

            if(distance > radiusSlider.value)
                return;

        }

        let color = "gray";

        switch(resource.category){

            case "Food Bank":
                color = "green";
                break;

            case "Soup Kitchen":
                color = "orange";
                break;

            case "Shelter":
                color = "blue";
                break;

        }

        L.circleMarker(
            [resource.latitude, resource.longitude],
            {
                radius:7,
                color:color,
                fillColor:color,
                fillOpacity:0.9
            }
        )
        .addTo(markerLayer)
        .bindPopup(`
            <b>${resource.name}</b><br>
            ${resource.category}<br>
            ${resource.address}<br>
            ${resource.phone}<br>
            ${resource.hours}
        `);

    });

}

document.querySelectorAll(".category-filter").forEach(box => {

    box.addEventListener("change", drawMarkers);

});

function distanceMiles(lat1, lon1, lat2, lon2){

    const R = 3958.8;

    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;

    const a =
        Math.sin(dLat/2) ** 2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;

}

function updateRadiusCircle() {

    if (!userLocation)
        return;

    const radiusMeters = radiusSlider.value * 1609.34;

    if (radiusCircle) {
        radiusCircle.setRadius(radiusMeters);
    } else {
        radiusCircle = L.circle(userLocation, {
            radius: radiusMeters,
            color: "#3388ff",
            weight: 2,
            fillColor: "#3388ff",
            fillOpacity: 0.2
        }).addTo(map);
    }

}