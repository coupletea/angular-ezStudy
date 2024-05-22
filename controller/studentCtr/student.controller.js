angular.module('myApp').controller('StudentListController', ['StudentData', '$scope', '$location',"$routeParams",'$rootScope', function (StudentData, $scope, $location, $routeParams,$rootScope) {
  // Initialize scope variables
  $scope.students = [];
  $scope.classrooms = [];
  $scope.searchForm = {
      name: '',
      age: '',
      classroom: ''
  };
  $scope.pagination = {
      page: 1,
      limit: 3,
      total: 0
  };
  $scope.columns = [
      { text: 'Tên', value: 'name' },
      { text: 'Tuổi', value: 'age' },
      { text: 'Lớp', value: 'classroomName' }
  ];
  // Function to fetch students based on filters and pagination
  $scope.fetchStudents = function() {
      StudentData.getListStudents({
          name: $scope.searchForm.name,
          age: $scope.searchForm.age,
          classroom: $scope.searchForm.classroom,
          page: $scope.pagination.page,
          limit: $scope.pagination.limit
      }).then(function(response) {
          $scope.students = response.data;
          $scope.pagination.total = response.total;
          $scope.$apply(); // Update scope since this might be an async update
      });
  };

  // Function to load classrooms for the dropdown
  $scope.getClassrooms = function() {
    StudentData.getAllClassrooms().then(function(classrooms) {
        $scope.$apply(function() {  // Ensure changes are within AngularJS's context
            $scope.classrooms = classrooms;
        });
    });    
  };

  // Function to handle search form changes
  $scope.onSearch = function() {
      $scope.pagination.page = 1; // Reset to the first page for new searches
      $scope.fetchStudents();
  };

  // Function to handle navigation to add a new student
  $scope.onCreate = function() {
      $location.path('/student/create');
  };

  // Function to handle navigation to update a student
  $scope.onUpdate = function(id) {
      $location.path('/student/update/' + id);
  };

  // Function to handle the deletion of a student
  $scope.onDelete = function(id) {
      StudentData.deleteStudent(id).then(function() {
          $scope.fetchStudents(); // Refresh the list after deleting
      });
  };

  // Function to handle page changes in pagination
  $scope.onPageChange = function(page) {
      $scope.pagination.page = page;
      $scope.fetchStudents();
  };

  $rootScope.$on('classroomUpdated', function() {
    $scope.fetchStudents();
});

  // Initial data fetches
  $scope.getClassrooms();
  $scope.fetchStudents();
}]);
