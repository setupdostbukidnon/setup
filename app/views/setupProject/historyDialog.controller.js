angular.
module("setupProject").
controller("historyController", function($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var setupProjects = firebase.database().ref().child("setupProject");
  var historyRef = firebase.database().ref().child("history");
  $scope.setupProjects = $firebaseArray(setupProjects);
  $scope.history = $firebaseArray(historyRef);

  $scope.formatDate = function(param) {
    var date = moment(param).format("MMM DD YYYY");
    var time = moment(param).format("h:mm a");
    return {
      date: date,
      time: time
    };
  };

  $scope.closeDialog = function() {
    window.selected = [];
    $mdDialog.hide();
  };
});
