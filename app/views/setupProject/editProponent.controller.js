angular.
module("setupProject").
controller("editProponentController", function($scope, $rootScope, $firebaseArray, $mdDialog, $window, $mdToast, setupProject) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.years = years;

  $scope.remindRefundIcon = function() {
    var startDate = (setupProject.refundScheduleStart == "" ? null : new Date(setupProject.refundScheduleStart).getTime());
    var endDate = (setupProject.refundScheduleEnd == "" ? null : new Date(setupProject.refundScheduleEnd).getTime());

    console.clear();
    console.log(`Edit Proponent id --- ${setupProject.id}`);
    console.info(`dueDateStart: ${dueDateStart}, dueDateEnd: ${dueDateEnd}, currentDay: ${currentDay}, nowDate: ${nowDate}`);
    console.log(`${setupProject.proponent} - startDate: ${startDate}, endDate: ${endDate}`);

    // if (startDate <= nowDate && nowDate <= endDate && dueDateStart <= currentDay && currentDay <= dueDateEnd) {
    if (startDate <= nowDate <= endDate && dueDateStart <= currentDay <= dueDateStart) {
      console.info(`if-statement = true`);
      var proponent = setupProject.proponent;
      // return setupProject.remindRefund;
      return 'false';
    }
  };

  $scope.sendMe = function () {
    emailjs.send("gmail","template_4nILbpzO", {
      email_to: "janfrancistagadiad@gmail.com",
      from_name: "janfrancistagadiad",
      to_name: "Maam Leslie",
      message_html: "Due refund proponent: " + setupProject.proponent,
      notes: "Check this out!"
    }).
    then(function(response) {
      console.log("SUCCESS", response);
    },
    function(error) {
      console.log("FAILED", error);
    });
  };

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

    last = angular.extend({},current);
  }

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
    record.dateApproved = ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format('MM DD YYYY'));
    record.dateReleased = ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format('MM DD YYYY'));
    record.actualFundRelease = $scope.actualFundRelease;
    record.projectDurationStart = ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format('MM DD YYYY'));
    record.projectDurationEnd = ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format('MM DD YYYY'));
    record.refundScheduleStart = ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format('MM DD YYYY'));
    record.refundScheduleEnd = ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format('MM DD YYYY'));
    record.latestProjectExtension = $scope.latestProjectExtension;
    record.refundMade = $scope.refundMade;
    record.balance = $scope.balance;
    record.status = $scope.status;
    record.remindRefund = $scope.remindRefund;
    record.emailAddress = $scope.emailAddress;
    record.contactNumber = $scope.contactNumber;

    $scope.setupProjects.$save(record);

    var pinTo = $scope.getToastPosition();

    $mdToast.show(
      $mdToast.simple()
      .textContent(`${$scope.proponent} project successfully updated...`)
      .position(pinTo)
      .hideDelay(5000)
    );
    $mdDialog.hide();
  };

  $scope.closeDialog = function() {
    $rootScope.$emit("setupProjectMainController", selected = []);
    $mdDialog.hide();
  };
});
