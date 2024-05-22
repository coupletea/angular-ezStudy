angular.module('myApp').directive('paginationDirective', function() {
    return {
        restrict: 'E', // Use 'E' to restrict the directive to element instances
        template: `
            <div class="pagination" ng-if="totalPages > 0">
                <a href="" ng-click="onPrev()" ng-class="{ disabled: page <= 1 }">&laquo;</a>
                <a href="" ng-repeat="num in range(totalPages) track by $index" ng-class="{ active: num === page }" ng-click="onClickPage(num)">
                    {{ num }}
                </a>
                <a href="" ng-click="onNext()" ng-class="{ disabled: page >= totalPages }">&raquo;</a>
            </div>
        `,
        scope: {
            page: '=',
            total: '=',
            limit: '=',
            onPageChange: '&'
        },
        link: function(scope, element, attrs) {
            // Function to calculate the total pages
            scope.getTotalPages = function() {
                scope.totalPages = Math.ceil(scope.total / scope.limit);
            };

            // Function to create an array from number
            scope.range = function(n) {
                return Array.apply(null, Array(n)).map(function (_, i) { return i + 1; });
            };

            // Method to handle "next page" action
            scope.onNext = function() {
                if (scope.page < scope.totalPages) {
                    scope.page++;
                    scope.onPageChange({page: scope.page});
                }
            };

            // Method to handle "previous page" action
            scope.onPrev = function() {
                if (scope.page > 1) {
                    scope.page--;
                    scope.onPageChange({page: scope.page});
                }
            };

            // Method to handle clicking on a specific page number
            scope.onClickPage = function(num) {
                scope.page = num;
                scope.onPageChange({page: num});
            };

            // Watchers to update the totalPages when 'total' or 'limit' changes
            scope.$watch('total', scope.getTotalPages);
            scope.$watch('limit', scope.getTotalPages);
        }
    };
});
