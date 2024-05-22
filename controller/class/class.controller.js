angular.module('myApp').controller('ClassroomListController', ['ClassService', '$scope', '$location', function(ClassService, $scope, $location) {
    $scope.classrooms = [];
    $scope.pagination = {
        page: 1,
        limit: 3,
        total: 0
    };
    

    $scope.fetchClassrooms = function() {
        ClassService.getListClassrooms({
            page: $scope.pagination.page,
            limit: $scope.pagination.limit
        }).then(function(response) {
            $scope.classrooms = response.data;
            $scope.pagination.total = response.total;
        }).catch(function(error) {
            console.error('Failed to fetch classrooms', error);
        });
    };

    $scope.onCreate = function() {
        $location.path('/classrooms/create');
    };

    $scope.onUpdate = function(id) {
        $location.path('/classrooms/update/' + id);
    };

    $scope.onDelete = function(id) {
        ClassService.deleteClassroom(id).then(function() {
            $scope.fetchClassrooms();  // Refresh the list
        }).catch(function(error) {
            console.error('Failed to delete classroom', error);
        });
    };

    $scope.onPageChange = function(Page) {
        $scope.pagination.page = Page;
        $scope.fetchClassrooms();
    };

    // Initial fetch
    $scope.fetchClassrooms();
}]);
