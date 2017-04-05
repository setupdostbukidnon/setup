angular.
module("setupProject").
controller("addProponentDialogController", function($scope, $firebaseArray, $firebaseAuth, $mdDialog, $mdToast, $timeout, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  var ref = firebase.database().ref();
  $scope.setupProjects = $firebaseArray(ref.child("setupProject"));
  $scope.history = $firebaseArray(ref.child("history"));

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

    $scope.getToastPosition = function() {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(" ");
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({}, current);
    }

    $scope.dialogTitle = "Add Proponent";

    $scope.submitProponent = function() {
      $scope.setupProjects.$add({
        proponent: ($scope.proponent == null ? "" : $scope.proponent),
        projectYear: ($scope.projectYear == null ? "" : $scope.projectYear),
        dateApproved: ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format("MM-DD-YYYY")),
        dateReleased: ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format("MM-DD-YYYY")),
        actualFundRelease: ($scope.actualFundRelease == null ? "" : $scope.actualFundRelease),
        projectDurationStart: ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format("MM-DD-YYYY")),
        projectDurationEnd: ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format("MM-DD-YYYY")),
        refundScheduleStart: ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format("MM-DD-YYYY")),
        refundScheduleEnd: ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format("MM-DD-YYYY")),
        latestProjectExtension: ($scope.latestProjectExtension == null ? "" : $scope.latestProjectExtension),
        refundMade: ($scope.refundMade == null ? "" : $scope.refundMade),
        balance: ($scope.balance == null ? "" : $scope.balance),
        status: ($scope.status == null ? "" : $scope.status),
        emailAddress: ($scope.emailAddress == null ? "" : $scope.emailAddress),
        contactNumber: ($scope.contactNumber == null ? "" : $scope.contactNumber),
        remindRefund: "false"
      });

      $scope.history.$add({
        action: "add",
        proponent: ($scope.proponent == null ? "" : $scope.proponent),
        date: new Date().getTime(),
        emailAddress: $scope.currentEmail
      });

      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple().
        textContent($scope.proponent + " project successfully added...").
        position(pinTo).
        hideDelay(5000)
      );
      $mdDialog.hide();
    };

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
  });
