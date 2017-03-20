
angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller('userAuthController', function($scope, $firebaseAuth, $mdToast, $location, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  if ($scope.firebaseUser != null) {
    $location.path("/setupProject").replace();
  }

  var last = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  // any time auth state changes, add the user data to scope
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $location.path("/setupProject").replace();
      console.log("Signed in as:", firebaseUser.uid);
    } else {
      $location.path("/userAuth").replace();
      console.log("Signed out");
    }
  });

  $scope.signIn = function() {
    $scope.authObj.$signInWithEmailAndPassword($scope.user.emailAddress, $scope.user.password).
    then(function(firebaseUser) {
      console.log("Signed in as: ", firebaseUser.email + " uid: " + firebaseUser.uid);
      $location.path("/setupProject").replace();
    }).catch(function(error) {
      if (error.code == "auth/user-not-found") {
        console.log("Authentication failed: ", "User not found.");
      }
    })
  }

});
