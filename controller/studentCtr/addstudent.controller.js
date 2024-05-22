angular.module("myApp").controller("CreateStudentController", [
  "$scope", "StudentData", "$location", "ValidationService",
  function ($scope, StudentData, $location, ValidationService) {
    $scope.student = {
      name: "",
      dateOfBirth: "",
      classroom: "",
      rules: {  // Include validation rules directly here
        name: [ValidationService.validRequired, [ValidationService.validMaxlength, 50]],
        dateOfBirth: [ValidationService.validRequired],
      }
    };

    $scope.error = [];

    // Load classrooms for dropdown
    $scope.classrooms = [];
    StudentData.getAllClassrooms().then(function (classrooms) {
      $scope.classrooms = classrooms;
    });

    $scope.addStudent = function () {
      if (validateStudent()) {
        $scope.student.age = calculateAge($scope.student.dateOfBirth);
        StudentData.createStudent($scope.student)
          .then(() => {
            $scope.$apply(() => {
              $location.path("/students");
            });
          })
          .catch(error => alert("Failed to add student: " + error.message));
      }
    };

    function validateStudent() {
      $scope.student.rules = {
        name: [ValidationService.validRequired, [ValidationService.validMaxlength, 50]],
        dateOfBirth: [ValidationService.validRequired],
      };
      const errors = ValidationService.validCheck($scope.student);
      if (errors.length > 0) {
        alert("Validation errors: " + errors.map(e => e.error).join(", "));
        return false;
      }
      return true;
    }

    function calculateAge(dateOfBirth) {
      const birthday = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthday.getFullYear();
      const m = today.getMonth() - birthday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      return age;
    }
  }
]);
