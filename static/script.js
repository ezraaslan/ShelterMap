const map = L.map("map").setView([39.9526, -75.1652], 12);

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

radiusValue.innerText=this.value;

};


if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(function(position){

const lat=position.coords.latitude;

const lon=position.coords.longitude;

L.marker([lat,lon])

.addTo(map)

.bindPopup("You are here")

.openPopup();

map.setView([lat,lon],14);

});

}