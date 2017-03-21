"use strict";

angular.module("dost-pstc-x").
run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {

    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/userAuth");
      console.log("auth error...")
    }
  });

}]).
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

  $routeProvider.when("/setupProject", {
    template: "<setup-project></setup-project>",

  
  }).when("/userAuth", {
    template: "<user-auth></user-auth>",

  })
  .otherwise({
    redirectTo: "/userAuth"
  });


}]);
