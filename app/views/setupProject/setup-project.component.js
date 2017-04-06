angular.
module("setupProject").
component("setupProject", {
  templateUrl: "views/setupProject/setup-project.template.html"
}).
controller("setupProjectController", function($location, $scope, $rootScope, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, $mdMedia, $mdToast, $timeout, $mdSidenav, $log, Auth) {
  $scope.authObj = $firebaseAuth();
  $scope.auth = Auth;
  $scope.selected = [];
  $scope.proponentWithDue = new Array();
  $scope.filteredItems = new Array();
  $scope.projectYear = "";
  var THIS = this;

  var ref = firebase.database().ref();
  $scope.setupProjects = $firebaseArray(ref.child("setupProject"));
  $scope.history = $firebaseArray(ref.child("history"));

  // firebase.database().ref("flag").once('value').then(function(snapshot) {
  //   var isFirstDay = snapshot.val().isFirstDay;
  //   var isReset = snapshot.val().isReset;
  //   var dueDateStart = snapshot.val().dueDateStart;
  //   var dueDateEnd = snapshot.val().dueDateEnd;
  //   console.log(` isFirstDay -- ${isFirstDay} \n isReset -- ${isReset} \n dueDateStart -- ${dueDateStart} \n dueDateEnd -- ${dueDateEnd}`);
  // });

  $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $location.path("/setupProject");
      console.log(`Signed in as ${firebaseUser.uid} --- ${firebaseUser.email}`);
      $scope.currentEmail = firebaseUser.email;
    } else {
      console.log("Signed out");
      $location.path("/userAuth");
    }
  });

  // $scope.setupProjects.$watch(function(e) {
  //   $scope.setupProjectsLength = $scope.setupProjects.length;
  // });

  $scope.promise = $scope.setupProjects.$loaded(function(item) {
    item === $scope.setupProjects; // true
    angular.forEach($scope.setupProjects, function(value, key) {
      // console.log(`${value.$id} - ${value.proponent}: ${key}`);
      // if (false) {
      //   var record = $scope.setupProjects.$getRecord(value.$id);
      //   record.remindRefund = "false";
      //   $scope.setupProjects.$save(record);
      // }
    });
  });

  $scope.limitOptions = limitOptions;

  $scope.filterOptions = years;

  $scope.options = options;

  $scope.query = query;

  $scope.tooltip = tooltip;

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

  $scope.remindRefundIcon = function(param) {
    var startDate = (param.refundScheduleStart == "" ? null : new Date(param.refundScheduleStart).getTime());
    var endDate = (param.refundScheduleEnd == "" ? null : new Date(param.refundScheduleEnd).getTime());

    if (startDate <= nowDate && nowDate <= endDate && dueDateStart <= currentDay && currentDay <= dueDateEnd) {
      var proponent = param.proponent;
      return param.remindRefund;
    }
  };

  $scope.clearFilter = function() {
    $scope.filterProponent = "";
  }

  $scope.filterRemindRefund = function(param) {
    var startDate = (param.refundScheduleStart == "" ? null : new Date(param.refundScheduleStart).getTime());
    var endDate = (param.refundScheduleEnd == "" ? null : new Date(param.refundScheduleEnd).getTime());

    if (startDate <= nowDate && nowDate <= endDate && dueDateStart <= currentDay && currentDay <= dueDateEnd) {
      $scope.proponentWithDue.push(param.proponent);
      return param;
    }

  };

  $scope.sendEmail = function() {
    $scope.filteredItems = $scope.proponentWithDue.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    console.log(`${$scope.filteredItems.length}`);

    var temp = "";
    for(var i = 0; i < $scope.filteredItems.length; i++) {
      temp += i+1 + ". " + $scope.filteredItems[i] + '<br>';
    }

    console.log(`sendEmail - ${$scope.filteredItems.length}  -  ${temp}`);

    emailjs.send("gmail","template_4nILbpzO", {
      email_to: $scope.currentEmail,
      from_name: "jan weak",
      to_name: "jan weak 2",
      message_body: "Proponents :<br><br>" + temp
    }).
    then(function(response) {
      console.log("SUCCESS", response);
      var pinTo = $scope.getToastPosition();
      console.log(`${temp}`);

      $mdToast.show(
        $mdToast.simple()
        .textContent("Email sent...")
        .position(pinTo)
        .hideDelay(3000)
      );
    },
    function(error) {
      console.log("FAILED", error);
    });
  }

  $scope.selectRow = function(param) {
    THIS.SETUPPROJECT = param;
    console.log(THIS.SETUPPROJECT.proponent);
  };

  $scope.formatThousand = function(param) {
    return param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  $scope.formatDate = function(param) {
    return param == "" ? "" : moment(param, "MM-DD-YYYY").format("MMM DD YYYY");
  };

  $scope.toggleSideNav = function() {
    $mdSidenav('left').
    toggle();
  }

  $scope.closeSideNav = function() {
    $mdSidenav('left').
    close();
  };

  $scope.showHistory = function(ev) {
    $mdDialog.show({
      controller: "historyController",
      templateUrl: "views/dialog/historyDialog.template.html",
      parent: angular.element(document.body),
      targetEvent: ev,
      escapeToClose: false
    });
  };

  $scope.showSettings = function(ev) {
    $mdDialog.show({
      controller: "settingsController",
      templateUrl: "views/dialog/settingsDialog.template.html",
      parent: angular.element(document.body),
      targetEvent: ev,
      escapeToClose: false
    });
  }

  $scope.signOut = function(ev) {
    var confirm = $mdDialog.confirm()
    .title('Are you sure to Sign Out?')
    .ariaLabel('Lucky day')
    .targetEvent(ev)
    .ok('Sign Out')
    .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      // $scope.flag = firebase.database().ref("flag").update({
      //   dueDateStart: 10,
      //   dueDateEnd: 15
      // });
      $scope.auth.$signOut();
    });
  }

  $scope.delete = function(ev) {
    console.log(THIS.SETUPPROJECT.proponent);

    var confirm = $mdDialog.confirm()
    .title("Would you like to delete " + THIS.SETUPPROJECT.proponent + " SETUP project?")
    .ariaLabel("DELETE SETUP project")
    .targetEvent(ev)
    .ok("Delete")
    .cancel("Cancel");

    $mdDialog.show(confirm).then(function() {
      $scope.history.$add({
        action: "delete",
        proponent: THIS.SETUPPROJECT.proponent,
        date: new Date().getTime(),
        emailAddress: $scope.currentEmail
      });

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
      escapeToClose: false,
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
      targetEvent: ev,
      escapeToClose: false
    });
  };

});
