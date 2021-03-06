angular.
module("setupProject").
controller("editProponentController", function($scope, $rootScope, $firebaseArray, $firebaseAuth, $mdDialog, $window, $mdToast, setupProject, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  var ref = firebase.database().ref();
  $scope.setupProjects = $firebaseArray(ref.child("setupProject"));
  $scope.history = $firebaseArray(ref.child("history"));

  $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.currentEmail = firebaseUser.email;
    }
  });

  $scope.years = ["2010", "2011", "2012", "2013",
  "2014", "2015", "2016", "2017",
  "2018", "2019", "2020", "2021",
  "2022", "2023", "2024", "2025",
  "2026", "2027", "2028", "2029",
  "2030", "2031", "2032", "2033"];

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
  $scope.email = setupProject.email;
  $scope.contactNumber = setupProject.contactNumber;

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

  $scope.remindRefundIcon = function() {
    // var startDate = (setupProject.refundScheduleStart == "" ? null : new Date(setupProject.refundScheduleStart).getTime());
    // var endDate = (setupProject.refundScheduleEnd == "" ? null : new Date(setupProject.refundScheduleEnd).getTime());
    var startDate = (setupProject.refundScheduleStart == "" ? null : new Date(moment(setupProject.refundScheduleStart, "MM DD YYYY").subtract(14, 'day').format("MMM DD YYYY")).getTime());
    var endDate = (setupProject.refundScheduleEnd == "" ? null : new Date(moment(setupProject.refundScheduleEnd, "MM DD YYYY").add(14, 'day').format("MMM DD YYYY")).getTime());
    // if (startDate <= currentDate && currentDate <= endDate && dueDateStart <= currentDay && currentDay <= dueDateEnd) {
    if (startDate <= currentDate && currentDate <= endDate && dueDateStart <= currentDay) {
      // console.log(`${startDate} ${endDate} ${dueDateStart} <= ${currentDay} false`);
      return false;
    }
  };

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
    record.email = $scope.email;
    record.contactNumber = $scope.contactNumber;
    $scope.setupProjects.$save(record);
    $scope.history.$add({
      action: "update",
      proponent: ($scope.proponent == null ? "" : $scope.proponent),
      date: new Date().getTime(),
      email: $scope.currentEmail
    });
    $scope.toast(`${$scope.proponent} project successfully updated.`);
    $mdDialog.hide();
  };

  $scope.closeDialog = function() {
    $mdDialog.hide();
  };
});
