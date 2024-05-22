angular.module("myApp", ["ngRoute", 'ui.bootstrap']).config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/students", {
        templateUrl: "/view/student/StudentView.html",
        controller: "StudentListController",
        title: "Học Sinh",
        resolve: {
          classrooms: function(StudentData) {
              return StudentData.getAllClassrooms();
          },
      }
      })
      .when("/student/create", {
        templateUrl: "/view/student/CreateStudent.html",
        controller: "CreateStudentController",
        title: "Thêm học sinh",
      })
      .when("/student/update/:id", {
        templateUrl: "/view/student/EditStudent.html",
        controller: "UpdateStudentController",
        title: "Sửa Học Sinh",
      })
      .when("/classrooms", {
        templateUrl: "/view/classroom/ClassView.html",
        controller: "ClassroomListController",
      })
      .when("/classrooms/create", {
        templateUrl: "/view/classroom/CreateClass.html",
        controller: "AddClassroomController",
      })
      .when("/classrooms/update/:id", {
        templateUrl: "/view/classroom/EditClass.html",
        controller: "EditClassroomController",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);
