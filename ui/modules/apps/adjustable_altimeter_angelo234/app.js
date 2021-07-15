angular.module('beamng.apps')
.directive('adjustableAltimeterAngelo234', ['Settings', function (Settings) {
return {
templateUrl: '/ui/modules/apps/adjustable_altimeter_angelo234/app.html',
replace: true,
restrict: 'EA',
require: '^bngApp',
link: function (scope, element, attrs) {
	var settings_file_path = "settings/adjustable_altimeter_angelo234/settings.json";
	
	// The current overlay screen the user is on (default: null)
	scope.overlayScreen = null;	

	scope.altitude = 0;

	//Altitude is subtracted from this value
	var offset_altitude = 0;

	var zeroed_flag = false;

	element.ready(function () {	
	
		bngApi.engineLua("jsonReadFile('" + settings_file_path + "')", function(data) {
			if(data !== undefined){
				//Check if on new map to reset altitude
				bngApi.engineLua('adjustable_altimeter_angelo234_new_map', function(new_map) {
					if(new_map){
						bngApi.engineLua('adjustable_altimeter_angelo234_new_map = false');
						offset_altitude = 0;
					}
					else{
						offset_altitude = data.offset_altitude;
					}
				});	
			}
		});		
	});

	var streamsList = ['electrics'];
	StreamsManager.add(streamsList);

	function getAltitude(streams){
		return streams.electrics.altitude;
	}

	scope.zero = function () {
		zeroed_flag = true;		
	};

	scope.reset = function () {
		offset_altitude = 0;		
	};

	scope.$on('streamsUpdate', function (event, streams) {
		scope.$evalAsync(function () {
			if(zeroed_flag){
				offset_altitude = getAltitude(streams);
				zeroed_flag = false;
			}

			var relative_altitude = getAltitude(streams) - offset_altitude;

			var altitude_in_units = relative_altitude;
			var units = "m"

			if (Settings.values.uiUnitLength === "imperial") {
				altitude_in_units = relative_altitude * 3.28084;
				units = "ft"
			}

			scope.altitude = (Math.round(altitude_in_units * 100) / 100).toFixed(2);
			scope.altitude += " " + units;
		})	
	});

	// Make sure we clean up after closing the app.
	scope.$on('$destroy', function () {
		StreamsManager.remove(streamsList);
		
		var data = {}
		data.offset_altitude = offset_altitude;	
		
		data = JSON.stringify(data);
		
		bngApi.engineLua("writeFile('" + settings_file_path + "'," + "'" + data + "', true)");
	});	
},
};
}]);