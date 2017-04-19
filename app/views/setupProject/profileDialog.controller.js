angular.
module("setupProject").
controller("profileController", function($scope, $firebaseAuth, $firebaseArray, $mdDialog, $mdToast, $timeout, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;

  var firebaseUser = firebase.auth().currentUser;

  console.log(`${firebaseUser.uid} - ${firebaseUser.displayName} - ${firebaseUser.email}`);

  $scope.displayName = firebaseUser.displayName;
  $scope.email = firebaseUser.email;

  firebaseUser.updateProfile({
    displayName: $scope.displayName
  }).then(function() {
    console.log(`displayName successfully updated`);
  }, function(error) {
    console.log(error);
  });

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };
});
