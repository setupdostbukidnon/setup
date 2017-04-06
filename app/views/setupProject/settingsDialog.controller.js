angular.
module("setupProject").
controller("settingsController", function($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var historyRef = firebase.database().ref().child("history");
  var settingsRef = firebase.database().ref().child("settings");

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

  firebase.database().ref("settings").on('value', function(snapshot) {
    $scope.isFirstDay = snapshot.val().isFirstDay;
    $scope.isReset = snapshot.val().isReset;
    $scope.dueDateStart = snapshot.val().dueDateStart;
    $scope.dueDateEnd = snapshot.val().dueDateEnd;
  });

  $scope.submitSetting = function() {
    firebase.database().ref("settings").update({
      dueDateStart: $scope.dueDateStart,
      dueDateEnd: $scope.dueDateEnd
    });

    var pinTo = $scope.getToastPosition();
    $mdToast.show(
      $mdToast.simple().
      textContent(`Settings successfully updated.`).
      position(pinTo).
      hideDelay(5000)
    );
  };

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };
});
