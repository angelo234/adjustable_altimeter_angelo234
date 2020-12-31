angular.module('beamng.apps')
.directive('adjustableAltimeterAngelo234', ['bngApi', 'StreamsManager', 'UiUnits', function (bngApi, StreamsManager, UiUnits) {
return {
templateUrl: 'modules/apps/adjustable_altimeter_angelo234/app.html',
replace: true,
restrict: 'EA',
require: '^bngApp',
link: function (scope, element, attrs, ctrl) {
	// The current overlay screen the user is on (default: null)
	scope.overlayScreen = null;	
	
	scope.infeet = false;
	scope.altitude = 0;

	//Altitude is subtracted from this value
	var offset_altitude = 0;

	var reset_flag = false;

	var app_settings = null;

	element.ready(function () {

	ctrl.getSettings()
	  .then(function (settings) {
	    app_settings = settings;

	    if(app_settings == null){
	    	app_settings = {};
	    	app_settings.infeet = false;
	    	app_settings.offset_altitude = 0;
	    }
	    else{
	    	scope.infeet = app_settings.infeet;
			
	    	//Check if on new map to reset altitude
			bngApi.engineLua('adjustable_altimeter_angelo234_new_map', function(data) {
				if(data){
					bngApi.engineLua('adjustable_altimeter_angelo234_new_map = false');
					offset_altitude = 0;
				}
				else{
					offset_altitude = app_settings.offset_altitude;
				}
			});	
	    }   
	  })
	});

	var streamsList = ['electrics'];
	StreamsManager.add(streamsList);

	function getAltitude(streams){
		return streams.electrics.altitude;
	}

	scope.zero = function () {
		reset_flag = true;		
	};

	scope.reset = function () {
		offset_altitude = 0;		
	};

	scope.$on('streamsUpdate', function (event, streams) {
		scope.$evalAsync(function () {
			if(reset_flag){
				offset_altitude = getAltitude(streams);
				reset_flag = false;
			}

			var relative_altitude = getAltitude(streams) - offset_altitude;

			//Convert to feet or meters
			scope.altitude = Math.round((relative_altitude * (scope.infeet ? 3.28084 : 1)) * 100) / 100;
			scope.altitude += " " + (scope.infeet ? "ft" : "m");
		})	
	});

	// Make sure we clean up after closing the app.
	scope.$on('$destroy', function () {
		StreamsManager.remove(streamsList);
		app_settings.infeet = scope.infeet;
		app_settings.offset_altitude = offset_altitude;
		
		ctrl.saveSettings(app_settings);
	});	
},
};
}]);