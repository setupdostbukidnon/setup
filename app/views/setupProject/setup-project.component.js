angular.
module("setupProject").
component("setupProject", {
  templateUrl: "views/setupProject/setup-project.template.html"
}).
controller("setupProjectController", function($scope, $firebaseArray, $mdDialog, $mdMedia, $mdToast, $timeout, $mdSidenav, $log){

  // window.staticValue = "jan";
  // console.log(staticValue);

  var THIS = this;
  var ref = firebase.database().ref().child("setupProject");
  $scope.setupProjects = $firebaseArray(ref);

  $scope.setupProjects.$watch(function(e) {
    // displays total number of items from firebase database
    $scope.setupProjectsLength = $scope.setupProjects.length;
  });

  $scope.promise = $timeout(function () {
     // ...
   }, 5000);

  $scope.limitOptions = [5, 10, 15];

  $scope.filterOptions = ["All",
  "2010", "2011", "2012", "2013",
  "2014", "2015", "2016", "2017",
  "2018", "2019", "2020", "2021",
  "2022", "2023", "2024", "2025",
  "2026", "2027", "2028", "2029",
  "2030", "2031", "2032", "2033"];

  $scope.projectYear = "";

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
    filter: "",
    limit: "10",
    order: "-projectYear",
    page: 1
  };

  $scope.tooltip = {
    showTooltip: false,
    tipDirection: "bottom"
  };

  var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
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

  $scope.logPagination = function (page, limit) {
    console.log("page: ", page);
    console.log("limit: ", limit);
  };

  $scope.redirectToGmail = function() {
    var email = "janfrancistagadiad@gmail.com";
    var subject = "SETUP REFUND SCHEDULE";
    var body = setupProject.proponent;
    var url = "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + email + "&su=" + subject + "&body=" + body + "&tf=1";
    $window.open(url, "_blank");
  };

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
    return param == "" ? "" : moment(param).format("MMM DD YYYY");
  };


  // $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleLeft = buildToggler('left');
  $scope.isOpenLeft = function(){
    return $mdSidenav('left').isOpen();
  };

  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  /**
  * Build handler to open/close a SideNav; when animation finishes
  * report completion in console
  */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }
  }

  $scope.closeSideNav = function () {
    $mdSidenav('left').close()
    .then(function () {
      $log.debug("close RIGHT is done");
    });
  };









  $scope.delete = function(ev) {
    console.log(THIS.SETUPPROJECT.proponent);

    var confirm = $mdDialog.confirm()
    .title("Would you like to delete " + THIS.SETUPPROJECT.proponent + " SETUP project?")
    .ariaLabel("DELETE SETUP project")
    .targetEvent(ev)
    .ok("Delete")
    .cancel("Cancel");

    $mdDialog.show(confirm).then(function() {
      $scope.setupProjects.$remove(THIS.SETUPPROJECT);
      $scope.selected = [];
      $scope.showOption = true;
      var pinTo = $scope.getToastPosition();

      $mdToast.show(
        $mdToast.simple()
        .textContent(THIS.SETUPPROJECT.proponent + " project successfully deleted...")
        .position(pinTo)
        .hideDelay(5000)
      );
    }, function() {
      $mdDialog.hide();

    });
  };

  $scope.edit = function(ev) {
    $mdDialog.show({
      controller: "editProponentController",
      templateUrl: "views/dialog/proponentDialog.template.html",
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
          remindRefund: THIS.SETUPPROJECT.remindRefund,
          emailAddress: THIS.SETUPPROJECT.emailAddress,
          contactNumber: THIS.SETUPPROJECT.contactNumber
        }
      }
    });
  };

  $scope.create = function(ev, setupProject) {
    $mdDialog.show({
      controller: "addProponentDialogController",
      templateUrl: "views/dialog/proponentDialog.template.html",
      parent: angular.element(document.body),
      targetEvent: ev
    });

    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
  };

});
