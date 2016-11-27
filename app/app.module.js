// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
        url: '/home',
        templateUrl: 'app/search/searchHeader.html'
    })

    // nested list with custom controller
    .state('home.search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: function($scope, $http) {
            $http.get("http://www.omdbapi.com/?s=Star+Wars&type=movie")
            .then(function(response) {
            $scope.results = response.data;
            console.log($scope.results);
            })
            //$scope.dogs = ['This is going', 'to be a', 'list of movies!'];
        }
    })

    // nested list with just some random string data
    .state('home.recentSearches', {
        url: '/recent',
        templateUrl: 'app/search/recentSearches.html'
    })

    // DETAILS PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('detail', {
        url: '/detail',
        views: {

            // the main template will be placed here (relatively named)
            '': { templateUrl: 'app/detail/detail.html' },

            // for column one, we'll define a separate controller 
            'columnOne@detail': {
                templateUrl: 'app/detail/detailDetails.html',
                controller: 'detailController'
            },

            // the child views will be defined here (absolutely named)
            'columnTwo@detail': { templateUrl: 'app/detail/detailPoster.html' }

        }

    });

}); // closes $routerApp.config()


// let's define the scotch controller that we call up in the about state


routerApp.controller('detailController', function($scope) {

    //detailController.$inject = ['$http'];

    $scope.message = 'test';

    $scope.scotches = [{
        name: 'Macallan 12',
        price: 50
    }, {
        name: 'Chivas Regal Royal Salute',
        price: 10000
    }, {
        name: 'Glenfiddich 1937',
        price: 20000
    }];

});
