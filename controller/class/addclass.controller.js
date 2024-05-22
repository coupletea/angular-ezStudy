angular.module('myApp').controller('AddClassroomController', ['$scope', 'ClassService', 'ValidationService', '$location', function($scope, ClassService, ValidationService, $location) {
    $scope.form = {
        name: {
            value: '',
            rules: [ValidationService.validRequired, [ValidationService.validMaxlength, 150], [ValidationService.validMinlength, 4], ValidationService.validUnique]
        },
        group: {
            value: null,
            rules: []
        },
        showError: false
    };

    $scope.classrooms = [];

    ClassService.getAllClassrooms().then(function(classrooms) {
        $scope.classrooms = classrooms;
    });

    $scope.submitForm = function() {
        const existingNames = $scope.classrooms.map(c => c.name.trim());
        const errors = ValidationService.validCheck($scope.form, existingNames);
        if (errors.length > 0) {
            $scope.form.showError = true;
            return; // Stop submission if there are errors
        }

        let payload = {
            name: $scope.form.name.value,
            group: $scope.form.group.value
        };
        ClassService.createClassroom(payload).then(function() {
            $location.path('/classrooms'); // Redirect to the list of classrooms
        });
    };
}]);