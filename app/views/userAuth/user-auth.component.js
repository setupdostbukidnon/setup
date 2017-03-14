angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller('userAuthController', function($scope, $firebaseAuth, $mdToast, $location, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  

});
