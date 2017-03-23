angular.
module("setupProject").
controller("historyController", function($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var setupProjects = firebase.database().ref().child("setupProject");
  var historyRef = firebase.database().ref().child("history");
  $scope.setupProjects = $firebaseArray(setupProjects);
  $scope.history = $firebaseArray(historyRef);

  $scope.formatDate = function(param) {
    return param == "" ? "" : moment(param).format("MMM DD YYYY");
  };

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };
});
