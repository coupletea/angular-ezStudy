angular
  .module('myApp')
  .controller("UpdateStudentController", [
    "StudentData",
    "$scope",
    "$routeParams",
    "$location",
    function ( StudentData, $scope, $routeParams, $location) {
      $scope.student = {};
      $scope.classrooms = [];

      $scope.getStudent = function () {
        StudentData.getStudentById($routeParams.id).then(function (student) {
          $scope.student = student;
          $scope.$apply();
        });
      };

      $scope.getClassrooms = function () {
        StudentData.getAllClassrooms().then(function (classrooms) {
          $scope.classrooms = classrooms;
          $scope.getStudent();
        });
      };

      $scope.updateStudent = function () {
        $scope.getClassrooms();
        StudentData.updateStudent($scope.student).then(function () {
          $location.path("/students");
          alert("Thông tin sinh viên đã được cập nhật!");
          // Redirect or handle next steps
        });
      };

      $scope.getStudent();
      $scope.getClassrooms();
    },
  ]);
