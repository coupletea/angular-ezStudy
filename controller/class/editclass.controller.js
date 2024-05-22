angular.module('myApp').controller('EditClassroomController', ['$scope', 'ClassService', '$location', '$routeParams', function($scope, ClassService, $location, $routeParams) {
    $scope.classroom = {};  // This will hold the classroom data
    $scope.isLoading = true;  // Loading state for UI feedback
    $scope.error = null;  // Error state

    // Function to fetch classroom details
    $scope.fetchClassroom = function() {
        ClassService.getClassroomById($routeParams.id)
            .then(function(classroom) {
                $scope.classroom = classroom;  // Set the fetched classroom data
                $scope.isLoading = false;
            })
            .catch(function(error) {
                $scope.error = error;
                $scope.isLoading = false;
                console.error('Error fetching classroom:', error);
                // Optionally redirect back or show an error message
            });
    };

    // Call fetchClassroom on controller initialization
    $scope.fetchClassroom();

    // Function to handle form submission for updating classroom
    $scope.updateClassroom = function() {
        if ($scope.classroomForm.$valid) {  // Check if the form is valid
            ClassService.updateClassroom($scope.classroom)
                .then(function() {
                    $location.path('/classrooms');  // Redirect to the classroom listing page on successful update
                })
                .catch(function(error) {
                    $scope.error = error;
                    console.error('Failed to update classroom:', error);
                    // Show error message or handle the error accordingly
                });
        } else {
            $scope.error = 'Please correct the errors and try again.';
        }
    };
    $scope.cancel = function(){
        $location.path('/classrooms');
    }
}]);
