const api_key = 'at_11kV6dMp6bPELk29kqgnz7iSSD6nE';
const api_url = 'https://geo.ipify.org/api/v1?';
const form = document.querySelector('#searchBar');
const input = document.querySelector('#searchInput');
const ipAddress = document.querySelector('#ipAddress .detailTrack');
const ipLocation = document.querySelector('#ipLocation .detailTrack');
const ipTimezone = document.querySelector('#ipTimezone .detailTrack');
const ipISP = document.querySelector('#ipISP .detailTrack');

const myMap = L.map('map');

let latitude;
let longitude;

const showMap = () => {
  let myIcon = L.icon( {
    iconUrl:    'images/icon-location.svg',
    iconSize:   [46, 56],
    iconAnchor: [23, 55]
  });
  myMap.setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  L.marker([latitude, longitude], {
    icon: myIcon
  }).addTo(myMap);
}

const writeIpDetails = (data) => {
  ipAddress.innerText = data.ip;
  ipLocation.innerText = data.location.city + ', ' + data.location.country + ' ' + data.location.postalCode;
  ipTimezone.innerText = 'UTC ' + data.location.timezone;
  ipISP.innerText = data.isp;
}

const writeNoDetails = () => {
  ipAddress.innerText = 'No data';
  ipLocation.innerText = '';
  ipTimezone.innerText = '';
  ipISP.innerText = '';
}

const getIpDetails = (ip = '') => {
  let ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
  let ipv6 = /^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$/.test(ip);
  let typeIp = (ipv4 || ipv6) ? '&ipAddress=' : '&domain=';
  const URL = api_url + 'apiKey=' + api_key + typeIp + ip;
  fetch(URL)
  .then(res => res.json())
  .then(data => {
    latitude = data.location.lat;
    longitude = data.location.lng;
    writeIpDetails(data);
    showMap();
  })
  .catch(error => {
    console.log(error);
    writeNoDetails();
  })
}

getIpDetails();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  getIpDetails(input.value);
});