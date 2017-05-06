angular.
module("setupProject").
controller("profileController", function($scope, $firebaseAuth, $firebaseArray, $mdDialog, $mdToast, $timeout, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  var firebaseUser = firebase.auth().currentUser;
  var usersRef = firebase.database().ref("users");

  $scope.showEditUsername = false;
  $scope.showEditEmailAddress = false;
  $scope.showEditPassword = false;
  $scope.hideSaveShowProgress = false;

  $scope.userUid = firebaseUser.uid;

  usersRef.child(firebaseUser.uid).on('value', function(snapshot) {
    $scope.userDisplayName = snapshot.val().displayName;
    $scope.userEmail = snapshot.val().email;
  });

  console.log(`${firebaseUser.email} -- ${firebaseUser.uid}`);

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

  $scope.submitChangeDisplayName = function(userDisplayName){
    $scope.hideSaveShowProgress = true;

    $timeout(function(){
      usersRef.child($scope.userUid).update({
        displayName: userDisplayName
      }).then(function() {
        $scope.showEditUsername = false;
        $scope.hideSaveShowProgress = false;
        firebaseUser.updateProfile({
          displayName: userDisplayName
        }).then(function() {
          console.log(`profile updated`);
          $scope.toast(`Username successfully updated.`);
        }, function(error) {
          // error handling
        });
      });
    });

  };

  $scope.submitChangeEmailAddress = function() {
    $scope.hideSaveShowProgress = true;

    $timeout(function(){
      firebaseUser.reauthenticate(firebase.auth.EmailAuthProvider.credential(firebaseUser.email, $scope.editEmailPassword)).then(function() {
        console.log(`same password`);
        $scope.authObj.$updateEmail($scope.editNewEmailAddress).then(function() {
          console.log("Email changed successfully!");
          usersRef.child($scope.userUid).update({
            email: $scope.editNewEmailAddress
          });
          $scope.showEditEmailAddress = false;
          $scope.hideSaveShowProgress = false;
          $scope.editNewEmailAddress = '';
          $scope.editEmailPassword = '';
          $scope.toast(`Email successfully updated.`);
        }).catch(function(error) {
          console.error("Error: ", error);
          $scope.toast(error.message);
          $scope.hideSaveShowProgress = false;
        });
      }, function(error) {
        console.log(error.code);
        $scope.toast(error.message);
        $scope.hideSaveShowProgress = false;
      });
    });
  }

  $scope.submitChangePassword = function() {
    $scope.hideSaveShowProgress = true;

    firebaseUser.reauthenticate(firebase.auth.EmailAuthProvider.credential(firebaseUser.email, $scope.currentPassword))
    .then(function() {
      console.log(`same password`);
      $scope.authObj.$updatePassword($scope.newPassword).then(function() {
        console.log("Password changed successfully!");
        $scope.toast(`Password changed successfully.`);
        $scope.showEditPassword = false;
        $scope.hideSaveShowProgress = false;
        $scope.currentPassword = '';
        $scope.newPassword = '';
      }).catch(function(error) {
        console.error("Error: ", error);
        $scope.hideSaveShowProgress = false;
      });
    }, function(error) {
      console.log(error.code);
      $scope.toast(`${error.message}`);
      $scope.hideSaveShowProgress = false;
    });
  };

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };

});
