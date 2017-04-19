angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller("userAuthController", function($location, $scope, $rootScope, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, $mdMedia, $mdToast, $timeout, $mdSidenav, $log, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  var userRef = firebase.database().ref("users");
  var settingsRef = firebase.database().ref("settings");

  settingsRef.on('value', function(snapshot) {
    $scope.masterPassword = snapshot.val().masterPassword;
  });

  $scope.compareMasterPassword = function() {
    console.log(`${$scope.masterPassword} -- masterPassword        ${$scope.inputMasterPassword} -- inputMasterPassword ${$scope.masterPassword == $scope.inputMasterPassword}`);
    return ($scope.masterPassword == $scope.inputMasterPassword);
  }

  $scope.showCreateAccount = false;
  $scope.showHome = true;
  $scope.retrieveAccount = false;

  $scope.toast = function(param) {
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

    var pinTo = $scope.getToastPosition();
    $mdToast.show(
      $mdToast.simple()
      .textContent(param)
      .position(pinTo)
      .hideDelay(3000)
    );
  }

  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $location.path("/setupProject").replace();
      console.log(`Signed in as ${firebaseUser.uid} - email: ${firebaseUser.email}`);

      firebaseUser.email
      userRef.child(firebaseUser.uid)

    } else {
      $location.path("/userAuth").replace();
      console.log("Signed out");
    }
  });

  $scope.submitCreateAccount = function() {
    $scope.authObj.$createUserWithEmailAndPassword($scope.createEmailaddress, $scope.password1).
    then(function(firebaseUser) {
      console.log(`User ${firebaseUser.uid} created successfully`);
      $scope.toast(`User ${firebaseUser.uid} created successfully`);
      firebaseUser.updateProfile({
        displayName: $scope.createName
      }).then(function() {
        console.log(`Profile updated successfully`);
        console.log(firebaseUser.displayName);
      }, function(error) {
        $scope.toast(`Error: ${error}`);
      });
    }).
    catch(function(error) {
      console.error("Error: ", error);
      $scope.toast(`Error: ${error}`);
    });
  }

  $scope.submitRetrieveAccount = function() {
    $scope.authObj.$sendPasswordResetEmail($scope.retrieve.emailAddress).then(function() {
      $scope.toast(`Password reset email sent successfully!`);
      console.log(``)
    }).catch(function(error) {
      $scope.toast(`Error: ${error}`);
    });
  }

  $scope.signIn = function() {
    console.log(`triggered`);
    $scope.authObj.$signInWithEmailAndPassword($scope.user.emailAddress, $scope.user.password).
    then(function(firebaseUser) {
      $location.path("/setupProject").replace();
    }).
    catch(function(error) {
      $scope.toast(error);
    });
  }
});
