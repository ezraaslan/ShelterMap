const map = L.map("map").setView([39.9526, -75.1652], 12);
const markerLayer = L.layerGroup().addTo(map);

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
fetch("/api/resources")
    .then(response => response.json())
    .then(resources => {

        markerLayer.clearLayers();

        resources.forEach(resource => {

            if (!resource.latitude || !resource.longitude)
                return;

            let color = "gray";

            switch (resource.category) {

                case "Food Bank":
                    color = "green";
                    break;

                case "Soup Kitchen":
                    color = "orange";
                    break;

                case "Shelter":
                    color = "blue";
                    break;

                default:
                    color = "gray";
            }

            L.circleMarker(
                [resource.latitude, resource.longitude],
                {
                    radius: 7,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.85
                }
            )
            .addTo(markerLayer)
            .bindPopup(`
                <b>${resource.name || "Unnamed"}</b><br>
                <b>${resource.category}</b><br>
                ${resource.address || ""}<br>
                ${resource.phone || ""}
            `);

        });

    });