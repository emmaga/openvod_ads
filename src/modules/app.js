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
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker'
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
            // 广告位对应的广告列表
            .state('app.adsBoard.adsPosition.adsList', {
                url: '/adsList?PostionID',
                templateUrl: 'pages/adsList.html'
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

    // 每次页面开始跳转时触发
    .run(['$rootScope', '$state', 'util', function ($rootScope, $state, util) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, options) {
            // 判断用户是否登录
            if (!util.getParams('token') && toState.name != "login") {
                $state.go('login');
                // 告诉子作用域无需处理这个事件
                event.preventDefault();
                alert('访问超时，请重新登录');
                
            }
        })
    }])


    .constant('CONFIG', {
        serverUrl: 'http://openvoddev.cleartv.cn/backend_adv/v1/',
        uploadUrl: 'http://mres.cleartv.cn/upload',
        testUrl: 'test/',
        test: false
    })

})();