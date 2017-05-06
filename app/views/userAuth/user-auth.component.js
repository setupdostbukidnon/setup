angular.
module('userAuth').
component('userAuth', {
  templateUrl: 'views/userAuth/user-auth.template.html'
}).
controller("userAuthController", function($location, $scope, $rootScope, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, $mdMedia, $mdToast, $timeout, $mdSidenav, $log, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  $scope.showLogin = true;
  $scope.passwordStatus = false;
  $scope.showCreateAccount = false;
  $scope.retrieveAccount = false;
  $scope.showPromise = false;
  $scope.hideMe = false;
  $scope.showProgress = false;
  $scope.optSignIn = false;
  $scope.optCreateAccount = true;
  $scope.optRetrieveAccount = true;

  var usersRef = firebase.database().ref("users");
  var settingsRef = firebase.database().ref("settings");

  settingsRef.on('value', function(snapshot) {
    $scope.masterPassword = snapshot.val().masterPassword;
  });

  // if(window.screen.availWidth == 1366 && window.screen.availHeight == 738) {
  //   document.getElementById('header').style.height = '20vh';
  //   document.getElementById('content').style.height = '75vh';
  //   document.getElementById('footer').style.height = '5vh';
  // } else if (window.screen.availWidth == 1920 && window.screen.availHeight == 1080) {
  //   document.getElementById('header').style.height = '15vh';
  //   document.getElementById('content').style.height = '82vh';
  //   document.getElementById('footer').style.height = '3vh';
  // }

  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $location.path("/setupProject").replace();
      console.log(`Signed in as ${firebaseUser.uid} - email: ${firebaseUser.email}`);

      firebaseUser.email
      usersRef.child(firebaseUser.uid)

    } else {
      $location.path("/userAuth").replace();
      console.log("Signed out");
    }
    $scope.$apply();
  });

  $scope.compareMasterPassword = function() {
    if($scope.masterPassword == $scope.inputMasterPassword) {
      $scope.passwordStatus = true;
    } else {
      $scope.toast(`Incorrect master password.`);
    }
  }

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

  $scope.submitCreateAccount = function() {
    $scope.showProgress = true;
    $scope.submitCreateAccountPromise = $scope.authObj.$createUserWithEmailAndPassword($scope.createEmailaddress, $scope.password1).
    then(function(firebaseUser) {
      console.log(`User ${firebaseUser.uid} created successfully`);
      firebaseUser.updateProfile({
        displayName: $scope.createDisplayName
      }).then(function() {
        console.log(`profile displayName success`);
        usersRef.child(firebaseUser.uid).set({
          displayName: $scope.createDisplayName,
          email: $scope.createEmailaddress,
          sendEmailStatus: false
        });
      }, function(error) {
        console.log(error.code);
      });
    }).catch(function(error) {
      console.error("Error: ", error);
      $scope.toast(`${error.message}`);
      $scope.showProgress = false;
    });
  }

  $scope.submitRetrieveAccount = function() {
    $scope.showProgress = true;
    $scope.authObj.$sendPasswordResetEmail($scope.retrieve.emailAddress).then(function() {
      $scope.toast(`Password reset email sent.`);
      $scope.showProgress = false;
      $scope.retrieve.emailAddress = '';
      $scope.showRetrieveAccount = false;
      $scope.showLogin = true;
      $scope.optSignIn=false;
      $scope.optCreateAccount=true;
      $scope.optRetrieveAccount=true;
    }).catch(function(error) {
      $scope.toast(`Error: ${error.message}`);
      $scope.showProgress = false;
    });
  }

  $scope.signIn = function() {
    $scope.showProgress = true;
    console.log(`triggered`);
    $scope.authObj.$signInWithEmailAndPassword($scope.user.emailAddress, $scope.user.password).
    then(function(firebaseUser) {
      $location.path("/setupProject").replace();
    }).
    catch(function(error) {
      $scope.toast(error);
      $scope.showProgress = false;
    });
  }
});
