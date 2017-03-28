angular.
module("setupProject").
controller("editProponentController", function($scope, $rootScope, $firebaseArray, $firebaseAuth, $mdDialog, $window, $mdToast, setupProject, Auth, Toast) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  var setupProjects = firebase.database().ref().child("setupProject");
  var historyRef = firebase.database().ref().child("history");
  $scope.setupProjects = $firebaseArray(setupProjects);
  $scope.history = $firebaseArray(historyRef);

  $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      console.log(`${firebaseUser.email}`);
      $scope.currentEmail = firebaseUser.email;
    }
  });

  $scope.years = [
  "2010", "2011", "2012", "2013",
  "2014", "2015", "2016", "2017",
  "2018", "2019", "2020", "2021",
  "2022", "2023", "2024", "2025",
  "2026", "2027", "2028", "2029",
  "2030", "2031", "2032", "2033"];

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

    $scope.remindRefundIcon = function() {
      var startDate = (setupProject.refundScheduleStart == "" ? null : new Date(setupProject.refundScheduleStart).getTime());
      var endDate = (setupProject.refundScheduleEnd == "" ? null : new Date(setupProject.refundScheduleEnd).getTime());

      if (startDate <= nowDate && nowDate <= endDate && dueDateStart <= currentDay && currentDay <= dueDateEnd) {
        return false;
      }
    };

    $scope.dialogTitle = "Edit Proponent";

    $scope.proponent = setupProject.proponent;
    $scope.projectYear = setupProject.projectYear;
    $scope.dateApproved = (setupProject.dateApproved == "" ? null : new Date(setupProject.dateApproved));
    $scope.dateReleased = (setupProject.dateReleased == "" ? null : new Date(setupProject.dateReleased));
    $scope.actualFundRelease = setupProject.actualFundRelease;
    $scope.projectDurationStart = (setupProject.projectDurationStart == "" ? null : new Date(setupProject.projectDurationStart));
    $scope.projectDurationEnd = (setupProject.projectDurationEnd == "" ? null : new Date(setupProject.projectDurationEnd));
    $scope.refundScheduleStart = (setupProject.refundScheduleStart == "" ? null : new Date(setupProject.refundScheduleStart));
    $scope.refundScheduleEnd = (setupProject.refundScheduleEnd == "" ? null : new Date(setupProject.refundScheduleEnd));
    $scope.latestProjectExtension = setupProject.latestProjectExtension;
    $scope.refundMade = setupProject.refundMade;
    $scope.balance = setupProject.balance;
    $scope.status = setupProject.status;
    $scope.remindRefund = setupProject.remindRefund;
    $scope.emailAddress = setupProject.emailAddress;
    $scope.contactNumber = setupProject.contactNumber;

    $scope.submitProponent = function() {
      var record = $scope.setupProjects.$getRecord(setupProject.id);
      record.proponent = $scope.proponent;
      record.projectYear = $scope.projectYear;
      record.dateApproved = ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format('MM-DD-YYYY'));
      record.dateReleased = ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format('MM-DD-YYYY'));
      record.actualFundRelease = $scope.actualFundRelease;
      record.projectDurationStart = ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format('MM-DD-YYYY'));
      record.projectDurationEnd = ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format('MM-DD-YYYY'));
      record.refundScheduleStart = ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format('MM-DD-YYYY'));
      record.refundScheduleEnd = ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format('MM-DD-YYYY'));
      record.latestProjectExtension = $scope.latestProjectExtension;
      record.refundMade = $scope.refundMade;
      record.balance = $scope.balance;
      record.status = $scope.status;
      record.remindRefund = $scope.remindRefund;
      record.emailAddress = $scope.emailAddress;
      record.contactNumber = $scope.contactNumber;
      $scope.setupProjects.$save(record);

      $scope.history.$add({
        action: "update",
        proponent: ($scope.proponent == null ? "" : $scope.proponent),
        date: new Date().getTime(),
        emailAddress: $scope.currentEmail
      });

      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple().
        textContent($scope.proponent + " project successfully updated...").
        position(pinTo).
        hideDelay(5000)
      );

      $mdDialog.hide();
    };

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
  });
