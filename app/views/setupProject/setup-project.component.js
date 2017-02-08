angular.
module("setupProject").
component("setupProject", {
  templateUrl: "views/setupProject/setup-project.template.html"
}).
controller("setupProjectController", function($scope, $firebaseArray, $mdDialog, $mdMedia, $mdToast){
  var THIS = this;
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.setupProjects.$loaded().then(function (setupProjects){
    console.log(setupProjects.length);
    $scope.setupProjectsLength = setupProjects.length;
  });

  $scope.selected = [];

  $scope.limitOptions = [5, 10, 15];

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
    limit: '7',
    order: 'proponent',
    page: 1
  };

  $scope.logPagination = function (page, limit) {
    console.log('page: ', page);
    console.log('limit: ', limit);
  }

  $scope.demo = {
    showTooltip: false,
    tipDirection: 'bottom'
  };

  $scope.formatThousand = function(param){
    return param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $scope.dbClick = function(setupProject){
    console.log(setupProject.proponent);
  }

  $scope.selectRow = function(param){
    THIS.SETUPPROJECT = param;
  }

  $scope.delete = function(ev){
    console.log(THIS.SETUPPROJECT.proponent);

    var confirm = $mdDialog.confirm()
    .title('Would you like to delete ' + THIS.SETUPPROJECT.proponent + ' SETUP project?')
    .ariaLabel('DELETE SETUP project')
    .targetEvent(ev)
    .ok('Delete')
    .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      $scope.setupProjects.$remove(THIS.SETUPPROJECT);
    }, function() {
      $mdDialog.hide();
    });
  }

  $scope.edit = function(ev){
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
          status: THIS.SETUPPROJECT.status
        }
      }
    });

    $scope.closeDialog = function() {
      $mdDialog.hide();
      THIS.$scope.selected = [];
    }
  }

  $scope.create = function(ev, setupProject){
    $mdDialog.show({
      controller: addProponentDialogController,
      templateUrl: 'views/dialog/proponentDialog.template.html',
      parent: angular.element(document.body),
      targetEvent: ev
    });

    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
  }

});

function addProponentDialogController($scope, $firebaseArray, $mdDialog, $mdToast, $timeout) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProject = $firebaseArray(ref);

  $scope.dialogTitle = "Add Proponent"

  $scope.submitProponent = function() {
    $scope.setupProject.$add({
      proponent: ($scope.proponent == null ? "" : $scope.proponent),
      projectYear: ($scope.projectYear == null ? "" : $scope.projectYear),
      dateApproved: ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format('MMM DD, YYYY')),
      dateReleased: ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format('MMM DD, YYYY')),
      actualFundRelease: ($scope.actualFundRelease == null ? "" : $scope.actualFundRelease),
      projectDurationStart: ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format('MMM DD, YYYY')),
      projectDurationEnd: ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format('MMM DD, YYYY')),
      refundScheduleStart: ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format('MMM DD, YYYY')),
      refundScheduleEnd: ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format('MMM DD, YYYY')),
      latestProjectExtension: ($scope.latestProjectExtension == null ? "" : $scope.latestProjectExtension),
      refundMade: ($scope.refundMade == null ? "" : $scope.refundMade),
      balance: ($scope.balance == null ? "" : $scope.balance),
      status: ($scope.status == null ? "" : $scope.status)
    });
    $mdDialog.hide();
  }
  $scope.closeDialog = function() {
    $mdDialog.hide();
  }
}

function editProponentController($scope, $firebaseArray, $mdDialog, setupProject) {
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProject = $firebaseArray(ref);

  $scope.dialogTitle = "Edit Proponent"

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

  $scope.submitProponent = function() {
    var record = $scope.setupProject.$getRecord(setupProject.id);
    record.proponent = $scope.proponent;
    record.projectYear = $scope.projectYear;
    record.dateApproved = ($scope.dateApproved == null ? "" : moment($scope.dateApproved).format('MMM DD, YYYY'));
    record.dateReleased = ($scope.dateReleased == null ? "" : moment($scope.dateReleased).format('MMM DD, YYYY'));
    record.actualFundRelease = $scope.actualFundRelease;
    record.projectDurationStart = ($scope.projectDurationStart == null ? "" : moment($scope.projectDurationStart).format('MMM DD, YYYY'));
    record.projectDurationEnd = ($scope.projectDurationEnd == null ? "" : moment($scope.projectDurationEnd).format('MMM DD, YYYY'));
    record.refundScheduleStart = ($scope.refundScheduleStart == null ? "" : moment($scope.refundScheduleStart).format('MMM DD, YYYY'));
    record.refundScheduleEnd = ($scope.refundScheduleEnd == null ? "" : moment($scope.refundScheduleEnd).format('MMM DD, YYYY'));
    record.latestProjectExtension = $scope.latestProjectExtension;
    record.refundMade = $scope.refundMade;
    record.balance = $scope.balance;
    record.status = $scope.status;

    $scope.setupProject.$save(record);
    $mdDialog.hide();
  }

  $scope.closeDialog = function() {
    $mdDialog.hide();
  }
}
