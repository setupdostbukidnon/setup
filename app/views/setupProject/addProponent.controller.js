angular.
module("setupProject").
controller("addProponentDialogController", function($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.years = [
  '2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017',
  '2018', '2019', '2020', '2021',
  '2022', '2023', '2024', '2025',
  '2026', '2027', '2028', '2029',
  '2030', '2031', '2032', '2033'];

  $scope.remindValues = ["true", "false"];

  $scope.dialogTitle = "Add Proponent";

  $scope.submitProponent = function() {
    $scope.setupProjects.$add({
      proponent: ($scope.proponent == null ? "" : $scope.proponent),
      projectYear: ($scope.projectYear == null ? "" : $scope.projectYear),
      dateApproved: ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format("MM DD YYYY")),
      dateReleased: ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format("MM DD YYYY")),
      actualFundRelease: ($scope.actualFundRelease == null ? "" : $scope.actualFundRelease),
      projectDurationStart: ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format("MM DD YYYY")),
      projectDurationEnd: ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format("MM DD YYYY")),
      refundScheduleStart: ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format("MM DD YYYY")),
      refundScheduleEnd: ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format("MM DD YYYY")),
      latestProjectExtension: ($scope.latestProjectExtension == null ? "" : $scope.latestProjectExtension),
      refundMade: ($scope.refundMade == null ? "" : $scope.refundMade),
      balance: ($scope.balance == null ? "" : $scope.balance),
      status: ($scope.status == null ? "" : $scope.status),
      emailAddress: ($scope.emailAddress == null ? "" : $scope.emailAddress),
      contactNumber: ($scope.contactNumber == null ? "" : $scope.contactNumber),
      remindRefund: "false"
    });
    $mdDialog.hide();
  };

  $scope.closeDialog = function() {
    $mdDialog.hide();
  };
});