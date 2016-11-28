// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
        url: '/home',
        templateUrl: 'app/search/searchHeader.html',
        controller: 'SearchController'
    })

    // nested list with custom controller
    .state('home.search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchController'
    })

    // nested list with just some random string data
    .state('home.recentSearches', {
        url: '/recent',
        templateUrl: 'app/search/recentSearches.html',
        controller: 'SearchController'
    })

    // DETAILS PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('detail', {
        url: '/detail',
        views: {

            // the main template will be placed here (relatively named)
            '': {
                templateUrl: 'app/detail/detail.html',
                controller: 'DetailController'
            },

            // for column one, we'll define a separate controller 
            'columnOne@detail': {
                templateUrl: 'app/detail/detailDetails.html',
                controller: 'DetailController'
            },

            // the child views will be defined here (absolutely named)
            'columnTwo@detail': {
                templateUrl: 'app/detail/detailPoster.html',
                controller: 'DetailController'
            }

        }

    });

}); // closes $routerApp.config()


// let's define the scotch controller that we call up in the about state

routerApp.service('sharedProperties', function() {
    var detailString = '';
    var searchString = '';

    return {
        getSearchString: function() {
            return searchString;
        },
        setSearchString: function(value) {
            searchString = value;
        },
        getDetailString: function() {
            return detailString;
        },
        setDetailString: function(value) {
            detailString = value;
        }
    }


});

routerApp.controller('SearchController', function($scope, $http, sharedProperties, $state) {

    $scope.searchString = sharedProperties.getSearchString();

    $scope.setSearchString = function(newValue) {
        sharedProperties.setSearchString(newValue);
    };

    $scope.setDetailString = function(newValue) {
        sharedProperties.setDetailString(newValue);
    };

    var sortArray = ['Title', '-Title', '-Year', 'Year'];
    $scope.alphaSortButton = 'Order Alphabetically';
    $scope.yearSortButton = 'Order by Year';
    $scope.sortCategory = '';

    $scope.sortMovies = function(order) {
        if (order == 0 && $scope.alphaSortButton == 'Order Alphabetically' || $scope.alphaSortButton == 'Order Alphabetically \u2193') {
            $scope.alphaSortButton = 'Order Alphabetically \u2191';
            $scope.yearSortButton = 'Order by Year';
            $scope.sortCategory = sortArray[0];
        } else if (order == 0 && $scope.alphaSortButton == 'Order Alphabetically \u2191') {
            $scope.alphaSortButton = 'Order Alphabetically \u2193';
            $scope.yearSortButton = 'Order by Year';
            $scope.sortCategory = sortArray[1];
        } else if (order == 1 && $scope.yearSortButton == 'Order by Year' || $scope.yearSortButton == 'Order by Year \u2193') {
            $scope.yearSortButton = 'Order by Year \u2191';
            $scope.alphaSortButton = 'Order Alphabetically';
            $scope.sortCategory = sortArray[2];
        } else if (order == 1 && $scope.yearSortButton == 'Order by Year \u2191') {
            $scope.yearSortButton = 'Order by Year \u2193';
            $scope.alphaSortButton = 'Order Alphabetically';
            $scope.sortCategory = sortArray[3];
        } else {
            $scope.alphaSortButton = 'Order Alphabetically';
            $scope.yearSortButton = 'Order by Year';
            $scope.sortCategory = '';
        }
    }

    $scope.recentSearches = [];

    $scope.getSearchResults = function(input) {
        $http.get("http://www.omdbapi.com/?s=" + input + "&type=movie")
            .then(function(response) {
                $scope.results = response.data;
                $scope.recentSearches.push(input);
                $scope.searchString = input;
                //$state.reload('home');
                //console.log($scope.recentSearches);
                console.log($scope.searchString);
        })
    }
});


routerApp.controller('DetailController', function($scope, $http, sharedProperties) {

    $scope.detailString = sharedProperties.getDetailString();
    $scope.searchString = sharedProperties.getSearchString();

    $http.get("http://www.omdbapi.com/?t=" + $scope.detailString + "&type=movie")
        .then(function(response) {
            $scope.detail = response.data;
        })

});
