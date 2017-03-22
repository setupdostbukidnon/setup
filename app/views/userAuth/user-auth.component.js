
angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller('userAuthController', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $mdToast, $mdDialog, $location, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  var ref = firebase.database().ref().child("users");
  $scope.users = $firebaseArray(ref);

  $scope.showSignIn = true;
  $scope.showSignUp = false;

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
      $scope.users.$add({
        name: $scope.user.name,
        emailAddress: $scope.user.emailAddress,
        password: $scope.user.password
      });
    }).
    catch(function(error) {
      console.error("Error: ", error);
    });
  }

});
