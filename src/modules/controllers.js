'use strict';

(function() {
    var app = angular.module('app.controllers', [])

    .controller('loginController', ['$scope', '$http', '$state', '$filter', 'md5', 'util',
        function($scope, $http, $state, $filter, md5, util) {
            console.log('loginController')
            var self = this;
            self.init = function() {

            }

            self.login = function() {
                self.loading = true;

                var data = JSON.stringify({
                    username: self.userName,
                    password: md5.createHash(self.password)
                })
                $http({
                    method: 'POST',
                    url: util.getApiUrl('logon'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        console.log(msg.token)
                        util.setParams('token', msg.token);
                        $state.go('app')
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login')
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.loading = false;
                });
            }


        }
    ])


    .controller('appController', ['$http', '$scope', '$state', '$stateParams', 'util', 'CONFIG',
        function($http, $scope, $state, $stateParams, util, CONFIG) {
            console.log('appController')
            var self = this;
            self.init = function() {

            }

            self.goToState = function(stateName) {
                $state.go(stateName)
            }

            self.logout = function(event) {
                util.setParams('token', '');
                $state.go('login');
            }
        }
    ])

    .controller('adsBoardController', ['$http', '$scope', '$state', '$stateParams', 'util',
        function($http, $scope, $state, $stateParams, util) {
            console.log('adsBoardController')
            console.log($state.current.name)
            var self = this;
            self.init = function() {
                self.getPositionTags();
            }

            //  获取广告标签列表
            self.getPositionTags = function() {
                self.loading = true;

                $http({
                    method: 'POST',
                    url: util.getApiUrl('positiontag', '', 'server')
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data.length == 0) {
                            self.noData = true;
                            return;
                        }
                        self.positionTags = msg.data;
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.loading = false;
                });
            }

        }
    ])

    .controller('adsMaterialController', ['$http', '$scope', '$state', '$stateParams', 'util',
        function($http, $scope, $state, $stateParams, util) {
            console.log('adsMaterialController')
            var self = this;
            self.init = function() {
                
                self.getAdvTagList();
            }

            // 获取广告素材标签列表
            self.getAdvTagList = function() {
                self.loading = true;
                var data = JSON.stringify({
                    "token": util.getParams('token'),
                    "action": "getAdvTagList"
                })
                $http({
                    method: 'POST',
                    url: util.getApiUrl('material', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data.length == 0) {
                            self.noData = true;
                            return;
                        }
                        self.advTagList = msg.data;
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.loading = false;
                });
            }
        }
    ])

    .controller('adsAddController', ['$http', '$scope', '$state', '$filter', '$stateParams', 'NgTableParams', 'util',
        function($http, $scope, $state, $filter, $stateParams, NgTableParams, util) {
            console.log('adsAddController')
            var self = this;
            self.init = function() {

            }

            self.edit = function(movieID) {

            }

            // 获取 电影的 分类 产地
            self.getTags = function() {
                var data = JSON.stringify({
                    "token": util.getParams('token'),
                    "action": "getTags"
                })

                $http({
                    method: 'POST',
                    url: util.getApiUrl('movie', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.CategoryList.length == 0) {
                            self.noCategotyData = true;
                        } else {
                            self.categoryList = msg.CategoryList;
                            console.log(self.categoryList)
                        }
                        if (msg.LocationList.length == 0) {
                            self.noLocationData = true;
                        } else {
                            self.locationList = msg.LocationList;
                            console.log(self.locationList)
                        }
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.loading = false;
                });
            }



        }
    ])


})();
