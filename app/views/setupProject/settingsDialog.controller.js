angular.
module("setupProject").
controller("settingsController", function($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var historyRef = firebase.database().ref().child("history");
  var settingsRef = firebase.database().ref("settings");

  $scope.toast = function(param) {
    $scope.toastPosition = angular.extend({},last);
    function sanitizePosition() {
      var current = $scope.toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
    }

    $scope.getToastPosition = function() {
      sanitizePosition();
      return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(" ");
    };

    var pinTo = $scope.getToastPosition();
    $mdToast.show(
      $mdToast.simple().
      textContent(param).
      position(pinTo).
      hideDelay(5000)
    );
  }

  settingsRef.on('value', function(snapshot) {
    $scope.isFirstDay = snapshot.val().isFirstDay;
    $scope.isReset = snapshot.val().isReset;
    $scope.dueDateStart = snapshot.val().dueDateStart;
    $scope.dueDateEnd = snapshot.val().dueDateEnd;
    $scope.masterPassword = snapshot.val().masterPassword;
  });

  $scope.submitSetting = function() {
    settingsRef.update({
      dueDateStart: $scope.dueDateStart,
      dueDateEnd: $scope.dueDateEnd,
      masterPassword: $scope.masterPassword
    });
    $scope.toast(`Settings successfully updated.`);
  };

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };
});
