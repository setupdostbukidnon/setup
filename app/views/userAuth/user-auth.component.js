
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
    if ($scope.masterPassword == "DostBukidnon") {
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
      if (error.code == "auth/user-not-found") {
        console.log(`${error.code}  Authentication failed: ", "User not found.`);
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
