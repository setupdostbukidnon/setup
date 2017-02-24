angular.
module("setupProject").
component("setupProject", {
  templateUrl: "views/setupProject/setup-project.template.html"
}).
controller("setupProjectController", function($scope, $firebaseArray, $mdDialog, $mdMedia, $mdToast){
  var THIS = this;
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.setupProjects.$watch(function(e) {
    console.log($scope.setupProjects.length);
    $scope.setupProjectsLength = $scope.setupProjects.length;
  });

  $scope.selected = [];

  $scope.limitOptions = [5, 10, 15];

  $scope.filterOptions = ['All', '2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017',
  '2018', '2019', '2020', '2021',
  '2022', '2023', '2024', '2025',
  '2026', '2027', '2028', '2029',
  '2030', '2031', '2032', '2033'];

  $scope.projectYear = '';

  $scope.options = {
    rowSelection: true,
    multiSelect: false,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: false,
    pageSelect: true
  };

  $scope.query = {
    filter: '',
    limit: '10',
    order: '-projectYear',
    page: 1
  };

  $scope.tooltip = {
    showTooltip: false,
    tipDirection: 'bottom'
  };

  $scope.logPagination = function (page, limit) {
    console.log('page: ', page);
    console.log('limit: ', limit);
  };

  $scope.redirectToGmail = function() {
    var email = "janfrancistagadiad@gmail.com";
    var subject = "SETUP REFUND SCHEDULE";
    var body = setupProject.proponent;
    var url = "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + email + "&su=" + subject + "&body=" + body + "&tf=1";
    $window.open(url, '_blank');
  };

  $scope.remindRefundIcon = function(param) {
    var nowDate = new Date().getTime();
    var currentDay = new Date().getDate();
    var startDate = (param.refundScheduleStart == "" ? null : new Date(param.refundScheduleStart).getTime());
    var endDate = (param.refundScheduleEnd == "" ? null : new Date(param.refundScheduleEnd).getTime());

    if (startDate <= nowDate && nowDate <= endDate && param.remindRefund == "false" && 10 <= currentDay && currentDay <= 25){
      var proponent = param.proponent;
      console.log(param.remindRefund + " " + param.proponent);
      return param.remindRefund;
    } else {
      return "true";
    }
  };

  $scope.rightClick = function(param) {
    console.log(param.proponent);
  };

  $scope.selectRow = function(param) {
    THIS.SETUPPROJECT = param;
    console.log(THIS.SETUPPROJECT.proponent);
  };

  $scope.formatThousand = function(param) {
    return param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  $scope.formatDate = function(param) {
    return param == "" ? "" : moment(param).format('MMM DD YYYY');
  };

  $scope.janCallMe = function(param) {
    console.log(param.proponent);
    // console.log(THIS.SETUPPROJECT.proponent);
    // return "binahon";
  }

  $scope.delete = function(ev) {
    console.log(THIS.SETUPPROJECT.proponent);

    var confirm = $mdDialog.confirm()
    .title('Would you like to delete ' + THIS.SETUPPROJECT.proponent + ' SETUP project?')
    .ariaLabel('DELETE SETUP project')
    .targetEvent(ev)
    .ok('Delete')
    .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      $scope.setupProjects.$remove(THIS.SETUPPROJECT);
      $scope.selected = [];
      $scope.hideOption = false;
    }, function() {
      $mdDialog.hide();
    });
  };

  $scope.edit = function(ev) {
    $mdDialog.show({
      controller: editProponentController,
      templateUrl: 'views/dialog/proponentDialog.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        setupProject: {
          id: THIS.SETUPPROJECT.$id,
          projectYear: THIS.SETUPPROJECT.projectYear,
          proponent: THIS.SETUPPROJECT.proponent,
          dateReleased: THIS.SETUPPROJECT.dateReleased,
          dateApproved: THIS.SETUPPROJECT.dateApproved,
          actualFundRelease: THIS.SETUPPROJECT.actualFundRelease,
          projectDurationStart: THIS.SETUPPROJECT.projectDurationStart,
          projectDurationEnd: THIS.SETUPPROJECT.projectDurationEnd,
          refundScheduleStart: THIS.SETUPPROJECT.refundScheduleStart,
          refundScheduleEnd: THIS.SETUPPROJECT.refundScheduleEnd,
          latestProjectExtension: THIS.SETUPPROJECT.latestProjectExtension,
          refundMade: THIS.SETUPPROJECT.refundMade,
          balance: THIS.SETUPPROJECT.balance,
          status: THIS.SETUPPROJECT.status,
          remindRefund: THIS.SETUPPROJECT.remindRefund
        }
      }
    });

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
  };

  $scope.create = function(ev, setupProject) {
    $mdDialog.show({
      controller: addProponentDialogController,
      templateUrl: 'views/dialog/proponentDialog.template.html',
      parent: angular.element(document.body),
      targetEvent: ev
    });

    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
  };

});

function addProponentDialogController($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.years = ['2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017',
  '2018', '2019', '2020', '2021',
  '2022', '2023', '2024', '2025',
  '2026', '2027', '2028', '2029',
  '2030', '2031', '2032', '2033'];

  // $scope.remindValues = [true, false];
  $scope.remindValues = ['true', 'false'];

  $scope.dialogTitle = "Add Proponent";

  $scope.submitProponent = function() {
    $scope.setupProjects.$add({
      proponent: ($scope.proponent == null ? "" : $scope.proponent),
      projectYear: ($scope.projectYear == null ? "" : $scope.projectYear),
      dateApproved: ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format('MM DD YYYY')),
      dateReleased: ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format('MM DD YYYY')),
      actualFundRelease: ($scope.actualFundRelease == null ? "" : $scope.actualFundRelease),
      projectDurationStart: ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format('MM DD YYYY')),
      projectDurationEnd: ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format('MM DD YYYY')),
      refundScheduleStart: ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format('MM DD YYYY')),
      refundScheduleEnd: ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format('MM DD YYYY')),
      latestProjectExtension: ($scope.latestProjectExtension == null ? "" : $scope.latestProjectExtension),
      refundMade: ($scope.refundMade == null ? "" : $scope.refundMade),
      balance: ($scope.balance == null ? "" : $scope.balance),
      status: ($scope.status == null ? "" : $scope.status),
      remindRefund: 'false'
    });
    $mdDialog.hide();
  };

  $scope.closeDialog = function() {
    $mdDialog.hide();
  };

}

function editProponentController($scope, $firebaseArray, $mdDialog, $window, setupProject) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);
  var email = "janfrancistagadiad@gmail.com";
  var subject = "SETUP REFUND SCHEDULE";
  var body = setupProject.proponent;
  var url = "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + email + "&su=" + subject + "&body=" + body + "&tf=1";

  $scope.redirectToGmail = function() {
    $window.open(url, '_blank');
  };

  $scope.remindRefundIcon = function() {
    var nowDate = new Date().getTime();
    var currentDay = new Date().getDate();
    var startDate = (setupProject.refundScheduleStart == "" ? null : new Date(setupProject.refundScheduleStart).getTime());
    var endDate = (setupProject.refundScheduleEnd == "" ? null : new Date(setupProject.refundScheduleEnd).getTime());

    console.log(startDate + " startDate  " + endDate + " endDate");

    if (startDate <= nowDate && nowDate <= endDate && setupProject.remindRefund == "false" && 10 <= currentDay && currentDay <= 25) {
      console.log(setupProject.remindRefund + " " + setupProject.proponent);
      return setupProject.remindRefund;
    } else {
      return "true";
    }
  };

  $scope.changeMe = function () {
    console.log($scope.checkBoxValue);

    if ($scope.checkBoxValue == true) {
      console.log("'true'");
    } else if ($scope.checkBoxValue == false) {
      console.log("'false'");
    }
  }

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

  $scope.years = ['2010', '2011', '2012', '2013',
  '2014', '2015', '2016', '2017',
  '2018', '2019', '2020', '2021',
  '2022', '2023', '2024', '2025',
  '2026', '2027', '2028', '2029',
  '2030', '2031', '2032', '2033'];

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

    $scope.setupProjects.$save(record);
    $mdDialog.hide();
  };

  $scope.closeDialog = function() {
    $mdDialog.hide();
    $scope.selected = [];
  };
}
