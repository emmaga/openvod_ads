'use strict';

(function () {
    var app = angular.module('openvodAds', [
        'ui.router',
        'app.controllers',
        'app.filters',
        'app.directives',
        'app.services',
        'angular-md5',
        'ngCookies',
        'ngTable'
    ])
    

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html'
            })
            .state('app', {
                url: '/app',
                templateUrl: 'pages/app.html'
            })
            .state('app.adsBoard', {
                url: '/adsBoard',
                templateUrl: 'pages/adsBoard.html'
            })
            .state('app.adsMaterial', {
                url: '/adsMaterial',
                templateUrl: 'pages/adsMaterial.html'
            })
            .state('app.editedList', {
                url: '/editedList',
                templateUrl: 'pages/editedList.html'
            })
    }])


    .constant('CONFIG', {
        serverUrl: 'http://openvod.cleartv.cn/backend_adv/v1/',
        uploadImgUrl: 'http://mres.cleartv.cn/upload',
        testUrl: 'test/',
        test: false
    })

})();