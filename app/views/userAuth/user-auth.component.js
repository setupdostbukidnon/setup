
angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller('userAuthController', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $mdToast, $mdDialog, $location, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  $scope.showSignIn = true;
  $scope.showSignUp = false;
  $scope.isMasterPassword = false;

  $scope.toastPosition = angular.extend({}, last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
    .filter(function(pos) {
      return $scope.toastPosition[pos];
    })
    .join(" ");
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
      console.log(`Signed in as ${firebaseUser.uid} - email: ${firebaseUser.email}`);
    } else {
      $location.path("/userAuth").replace();
      console.log("Signed out");
    }
  });

  $scope.proceed = function() {
    if ($scope.masterPassword == masterPassword) {
      $scope.isMasterPassword = true;
    } else {
      console.log(`incorrect`);
    }
  }

  $scope.createNewAccount = function() {
    $scope.showSignUp = true;
    $scope.showSignIn = false;
    $scope.masterPassword = "";
  }

  $scope.back = function() {
    $scope.showSignUp = false;
    $scope.showSignIn = true;
    $scope.isMasterPassword = false;
  }

  $scope.signIn = function() {
    $scope.authObj.$signInWithEmailAndPassword($scope.user.emailAddress, $scope.user.password).
    then(function(firebaseUser) {
      $location.path("/setupProject").replace();
    }).
    catch(function(error) {
      var pinTo = $scope.getToastPosition();

      if (error.code == "auth/user-not-found") {
        console.log(`${error.code}  Authentication failed: ", "User not found.`);

        $mdToast.show(
          $mdToast.simple()
          .textContent(`Authentication failed: User not found.`)
          .position(pinTo)
          .hideDelay(3000)
        );
      } else {
        $mdToast.show(
          $mdToast.simple()
          .textContent(`Authentication failed: User not found.`)
          .position(pinTo)
          .hideDelay(3000)
        );
      }
    });
  }

  $scope.signUp = function() {
    $scope.authObj.$createUserWithEmailAndPassword($scope.user.emailAddress, $scope.user.password).
    then(function(firebaseUser) {
      console.log(`User ${firebaseUser.uid} created successfully`);
    }).
    catch(function(error) {
      console.error("Error: ", error);
    });
  }

});
