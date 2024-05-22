angular.module('myApp').directive('studentTable', function() {
    return {
        restrict: 'E',  // Use 'E' to restrict the directive to element instances.
        scope: {
            data: '=',        // Two-way binding for student data.
            columns: '=',     // Two-way binding for table columns.
            onUpdate: '&',    // Delegate method for updating an item.
            onDelete: '&',    // Delegate method for deleting an item.
        },
        templateUrl: '/view/student/StudentView.html',  // Path to the template.
        link: function(scope, element, attrs) {
            scope.handleUpdate = function(id) {
                scope.onUpdate({id: id});
            };

            scope.handleDelete = function(id) {
                scope.onDelete({id: id});
            };
        }
    };
});
