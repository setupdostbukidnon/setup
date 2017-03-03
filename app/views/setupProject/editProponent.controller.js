angular.
module("setupProject").
controller("editProponentController", function($scope, $firebaseArray, $mdDialog, $window, $mdToast, setupProject) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.years = ['2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017',
  '2018', '2019', '2020', '2021',
  '2022', '2023', '2024', '2025',
  '2026', '2027', '2028', '2029',
  '2030', '2031', '2032', '2033'];

  $scope.remindRefundIcon = function(param) {
    var dueDateStart = 3;
    var dueDateEnd = 10;
    var nowDate = new Date().getTime();
    var currentDay = new Date().getDate();
    var startDate = (param.refundScheduleStart == "" ? null : new Date(param.refundScheduleStart).getTime());
    var endDate = (param.refundScheduleEnd == "" ? null : new Date(param.refundScheduleEnd).getTime());

    if (startDate <= nowDate && nowDate <= endDate && param.remindRefund == "false" && dueDateStart <= currentDay && currentDay <= dueDateEnd){
      var proponent = param.proponent;
      // console.log(param.remindRefund + " " + param.proponent);
      return param.remindRefund;
    } else {
      return "true";
    }
  };

  $scope.sendMe = function () {
    // parameters: service_id, template_id, template_parameters
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

  $scope.remindValues = ['true', 'false'];

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
    console.log("id --- " + setupProject.id);
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

    $mdDialog.hide();

  };

  $scope.closeDialog = function() {
    $mdDialog.hide();
  };
});
