;(function (window, document, $, _, undefined) {

var app = this;
// -----------------------------------------------------------------------------

/*
 * Default Variables
 */


/*
 * Helper Functions
 */


/*
 * Constructor
 */
var NetworkResults = function NetworkResults(el) {
    var self = this instanceof NetworkResults
             ? this
             : Object.create(NetworkResults.prototype);
    self.el = el;
    self.$el = $(el);
    self.initialize();
    return self;
};

NetworkResults.prototype.initialize = function initialize() {
    console.log('~~~ Module: NetworkResults');
    var self = this;

    self.$networkLocationHeader = self.$el.children(".network-results-header");

    // Get zip code center point from query string in URL
    self.searchedLocationAddress = document.location.search;
    self.searchedLocationAddress = self.searchedLocationAddress.substring(1).split("=");
    self.searchedLocationAddress = self.searchedLocationAddress[1].replace(/%20/g, " ");

    // Update Network Address in Network Location Header
    self.$networkLocationText = self.$networkLocationHeader.find(".network-location-zip");
    self.$networkLocationText.html(self.searchedLocationAddress);

    // Custom Marker Image
    self.$customIcon = '../img/fieldprint/marker.png';
    self.centerMapLocation = true;

    var initNetworkMap = self.initNetworkMap();

    google.maps.event.addDomListener(window, 'load', initNetworkMap);
};

NetworkResults.prototype.initNetworkMap = function initNetworkMap() {
  var self = this;
  var image = '../img/fieldprint/marker.png';

  self.geocoder = new google.maps.Geocoder();

  var styles = [
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      { hue: '#dadada' },
      { saturation: -100 },
      { lightness: -4 },
      { visibility: 'on' }
    ]
  },{
    featureType: 'water',
    elementType: 'all',
    stylers: [
      { hue: '#888888' },
      { saturation: -100 },
      { lightness: -30 },
      { visibility: 'on' }
    ]
  },{
    featureType: 'road',
    elementType: 'all',
    stylers: [
      { hue: '#c8c8c8' },
      { saturation: -100 },
      { lightness: 40 },
      { visibility: 'on' }
    ]
  },{
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      { hue: '#dadada' },
      { saturation: -100 },
      { lightness: 34 },
      { visibility: 'on' }
    ]
  },{
    featureType: 'water',
    elementType: 'all',
    stylers: [

    ]
  }
];

  var mapOptions = {
    mapTypeControlOptions: {
      mapTypeIds: [ 'Styled']
    },
    center: self.geoCodeAddress(self.searchedLocationAddress), // Center map based on search address
    zoom: 9,
    mapTypeId: 'Styled'
  };

  var map = new google.maps.Map(document.getElementById("network-results-canvas"), mapOptions);
  var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
  self.map = map;
  map.mapTypes.set('Styled', styledMapType);

  // Loop through the location results and build network markers on to map
  self.buildNetworkMap();
};

NetworkResults.prototype.buildNetworkMap = function buildNetworkMap() {
  var self = this;
  var $networkListings = $("#network-results-listings");
  var $networkListingItem = $networkListings.children(".network-results-listing");

  $networkListingItem.each(function(i) {
    var $this = $(this);
    var address = $this.children("[data-network-address]").html();
    var city = $this.find("[data-network-city]").html();
    var networkListingAddress = address + ", " + city;

    i = i + 1

    // Geocode address from network result listing table
    self.geoCodeAddress(networkListingAddress, $this, i);
  });

}

NetworkResults.prototype.geoCodeAddress = function geoCodeAddress(address, networkListingItem, i) {
  var self = this;
  var marker;

  self.geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      if (self.centerMapLocation) {

        // Set Center of Map on Page Load
        self.map.setCenter(results[0].geometry.location);

        self.centerMapLocation = false;

      } else {

        // Add network location markers for addresses
        marker = new MarkerWithLabel({
          position: results[0].geometry.location,
          map: self.map,
          icon : self.$customIcon,
          labelContent: i,
          labelAnchor: new google.maps.Point(3, 44),
          labelClass: "network-label", // the CSS class for the label
          labelInBackground: false
        });

        // Build content info Window
        var $networkListingItem = $(networkListingItem);
        var networkAddress = $(networkListingItem).children("[data-network-address]").html();
        var networkCity = $(networkListingItem).find("[data-network-city]").html();
        var networkDistance = $(networkListingItem).find("[data-network-distance]").html();
        var networkHours = $(networkListingItem).find("[data-network-hours]").html();
        var networkInfo = $(networkListingItem).find("[data-network-info]").html();

        var contentString = '<div class="network-info-window">' +
          '<h4>' + networkAddress + '</h4>' +
          '<p>' + networkCity + '<br/>' + networkDistance +
          '<p>' + networkHours + '<br/>' + networkInfo +
          '</div>';

        //An InfoBox behaves like a google.maps.InfoWindow, 
        //but it supports several additional properties for advanced styling
        //https://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
        infoBox = new InfoBox({
          content: contentString,
          pixelOffset: new google.maps.Size(-130, -203),
          closeBoxMargin: "0 2px 2px 2px",
          maxWidth: "265",
          closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infoBox.setContent(contentString);
            infoBox.open(self.map, marker);
          }
        })(marker, i));

      }
      
    } else {
      console.log('Geocode was not successful for the following reason:' + status);
    }
  });
};

return app.NetworkResults = NetworkResults;

// -----------------------------------------------------------------------------
}).call(window.ELF = window.ELF || {}, window, document, jQuery, _);
