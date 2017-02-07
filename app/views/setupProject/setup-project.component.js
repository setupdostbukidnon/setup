angular.
module("setupProject").
component("setupProject", {
  templateUrl: "views/setupProject/setup-project.template.html"
}).
controller("setupProjectController", function($scope, $firebaseArray, $mdDialog, $mdMedia, $mdToast){
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.selected = [];

  $scope.options = {
    rowSelection: true,
    multiSelect: false,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: false,
    pageSelect: false
  };

  $scope.query = {
    order: 'proponent',
    limit: 10,
    page: 1
  };

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
  $scope.delete = function(ev, setupProject){
    var proponent = setupProject.proponent;

    var confirm = $mdDialog.confirm()
    .title('Would you like to delete ' + proponent + ' SETUP project?')
    .ariaLabel('DELETE SETUP project')
    .targetEvent(ev)
    .ok('Delete')
    .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      $scope.setupProjects.$remove(setupProject);
    }, function() {
      $mdDialog.hide();
    });
  }
  $scope.edit = function(ev, setupProject){
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: editProponentController,
      templateUrl: 'views/dialog/proponentDialog.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        setupProject: {
          id: setupProject.$id,
          projectYear: setupProject.projectYear,
          proponent: setupProject.proponent,
          dateReleased: setupProject.dateReleased,
          dateApproved: setupProject.dateApproved,
          actualFundRelease: setupProject.actualFundRelease,
          projectDurationStart: setupProject.projectDurationStart,
          projectDurationEnd: setupProject.projectDurationEnd,
          refundScheduleStart: setupProject.refundScheduleStart,
          refundScheduleEnd: setupProject.refundScheduleEnd,
          latestProjectExtension: setupProject.latestProjectExtension,
          refundMade: setupProject.refundMade,
          balance: setupProject.balance,
          status: setupProject.status
        }
      }
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

  console.log(setupProject.dateApproved);

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
