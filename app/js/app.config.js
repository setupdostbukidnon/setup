"use strict";

angular.
module("dost-pstc-x").
factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]).
config(["$locationProvider", "$routeProvider",  "$mdThemingProvider",
function config($locationProvider, $routeProvider, $mdThemingProvider){
  // $mdDateLocaleProvider.formatDate = function(date) {
  //   return moment(date).format("MMM, DD, YYYY");
  // };

  $locationProvider.hashPrefix("");

  $mdThemingProvider.theme("default")
  .primaryPalette("blue", {
    "default": "300"
  })
  .accentPalette("blue-grey");

  $routeProvider
  .when("/setupProject", {
    template: "<setup-project></setup-project>"
  })
  .when("/userAuth", {
    template: "<user-auth></user-auth>"
  })
  .otherwise({
    redirectTo: "/userAuth"
  });
}]);
