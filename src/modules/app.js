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
        'ngTable',
        'ui.bootstrap'
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
            // 广告位列表
            .state('app.adsBoard.adsPosition', {
                url: '/adsPosition?adsPosition',
                templateUrl: 'pages/adsPosition.html'
            })
            // 广告素材
            .state('app.adsMaterial', {
                url: '/adsMaterial',
                templateUrl: 'pages/adsMaterial.html'
            })
            // 广告素材列表
            .state('app.adsMaterial.materialList', {
                url: '/materialList?advTag',
                templateUrl: 'pages/materialList.html'
            })
    }])


    .constant('CONFIG', {
        serverUrl: 'http://openvod.cleartv.cn/backend_adv/v1/',
        uploadUrl: 'http://mres.cleartv.cn/upload',
        testUrl: 'test/',
        test: false
    })

})();