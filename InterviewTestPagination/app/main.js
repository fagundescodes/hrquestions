(function(angular) {
  "use strict";

  angular
    .module("todoApp")
    .directive("todoPaginatedList", [todoPaginatedList])
    .directive("pagination", [pagination]);

  /**
   * Directive definition function of 'todoPaginatedList'.
   * 
   * TODO: correctly parametrize scope (inherited? isolated? which properties?)
   * TODO: create appropriate functions (link? controller?) and scope bindings
   * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
   * 
   * @returns {} directive definition object
   */
  function todoPaginatedList() {
    var directive = {
      restrict: "E", // example setup as an element only
      templateUrl: "app/templates/todo.list.paginated.html",
      // scope: {}, // example empty isolate scope
      controller: ["$scope", "$http", controller],
      link: link
    };

    function controller($scope, $http) { // example controller creating the scope bindings
      $scope.todos = [];
      $scope.pageNumber = 1;
      $scope.pageSize = "20";
      $scope.totalPages = 0;
      $scope.totalItems = 0;

      $scope.sortBy = "createdDate";
      $scope.sortOrder = "desc";

      $scope.loadTodos = function() {
        $scope.loading = true;

        $http.get("api/Todo/Todos", {
          params: {
            pageNumber: $scope.pageNumber,
            pageSize: $scope.pageSize === "all" ? 1000 : $scope.pageSize,
            sortBy: $scope.sortBy,
            sortOrder: $scope.sortOrder
          }
        }).then(function(response) {
          $scope.todos = response.data;
          var paginationHeader = response.headers('X-Pagination');
          if (paginationHeader) {
            var metadata = JSON.parse(paginationHeader);
            $scope.totalPages = metadata.TotalPages;
            $scope.totalItems = metadata.TotalCount;
            $scope.pageNumber = metadata.CurrentPage;
          }
          $scope.loading = false;
        }).catch(function() {
          $scope.loading = false;
        });
      };

      $scope.sortColumn = function(column) {
        if ($scope.sortBy === column) {
          if ($scope.sortOrder === "asc") {
            $scope.sortOrder = "desc";
          } else {
            $scope.sortOrder = "asc";
          }
        } else {
          $scope.sortBy = column;
          $scope.sortOrder = "asc";
        }
        $scope.pageNumber = 1;
        $scope.loadTodos();
      };

      $scope.nextPage = function() {
        if ($scope.pageNumber < $scope.totalPages) {
          $scope.pageNumber++;
          $scope.loadTodos();
        }
      };

      $scope.prevPage = function() {
        if ($scope.pageNumber > 1) {
          $scope.pageNumber--;
          $scope.loadTodos();
        }
      };

      $scope.firstPage = function() {
        $scope.pageNumber = 1;
        $scope.loadTodos();
      };

      $scope.lastPage = function() {
        $scope.pageNumber = $scope.totalPages;
        $scope.loadTodos();
      };

      $scope.changePageSize = function() {
        $scope.pageNumber = 1;
        $scope.loadTodos();
      };

      $scope.goToPage = function() {
        if ($scope.pageNumber >= 1 && $scope.pageNumber <= $scope.totalPages) {
          $scope.loadTodos();
        }
      };

      $scope.loadTodos();
    }

    function link(scope, element, attrs) { }

    return directive;
  }

  /**
   * Directive definition function of 'pagination' directive.
   * 
   * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
   * TODO: correctly parametrize scope (inherited? isolated? which properties?)
   * TODO: create appropriate functions (link? controller?) and scope bindings
   * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
   * 
   * @returns {} directive definition object
   */
  function pagination() {
    var directive = {
      restrict: "E",
      templateUrl: "app/templates/pagination.html",
      scope: {
        pageNumber: '=',
        pageSize: '=',
        totalPages: '=',
        totalItems: '=',
        onPageChange: '&'
      },
      controller: ["$scope", "$timeout", controller],
      link: link
    };

    function controller($scope, $timeout) {
      var trigger = function() {
        $timeout(function() {
          $scope.onPageChange();
        });
      };

      $scope.nextPage = function() {
        if ($scope.pageNumber < $scope.totalPages) {
          $scope.pageNumber++;
          trigger();
        }
      };

      $scope.prevPage = function() {
        if ($scope.pageNumber > 1) {
          $scope.pageNumber--;
          trigger();
        }
      };

      $scope.firstPage = function() {
        $scope.pageNumber = 1;
        trigger();
      };

      $scope.lastPage = function() {
        $scope.pageNumber = $scope.totalPages;
        trigger();
      };

      $scope.changePageSize = function() {
        $scope.pageNumber = 1;
        trigger();
      };

      $scope.goToPage = function() {
        if ($scope.pageNumber >= 1 && $scope.pageNumber <= $scope.totalPages) {
          trigger();
        }
      };
    }

    function link(scope, element, attrs) { }

    return directive;
  }

})(angular);

