'use strict';

(function() {
    var app = angular.module('app.controllers', [])
    
    //登陆
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

    // 控制面板
    .controller('appController', ['$http', '$scope', '$state', '$stateParams', 'util', 'CONFIG',
        function($http, $scope, $state, $stateParams, util, CONFIG) {
            console.log('appController')
            var self = this;
            self.init = function() {
                self.goToState();
            }

            self.goToState = function(stateName) {
                //默认加载路由
                stateName = stateName || 'app.adsBoard';
                $state.go(stateName)
            }

            self.logout = function(event) {
                util.setParams('token', '');
                $state.go('login');
            }
        }
    ])
    // 广告位标签列表
    .controller('adsBoardController', ['$http', '$scope', '$state', '$stateParams', 'util',
        function($http, $scope, $state, $stateParams, util) {
            console.log('adsBoardController')
            console.log($state.current.name)
            var self = this;
            self.init = function() {
                self.getPositionTags();
                //默认加载全部
                $state.go('app.adsBoard.adsPosition',{adsPosition:'all'})
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
            
            self.addPositionTag = function(){
                $scope.app.maskUrl = 'pages/addPositionTag.html';
            }
            
            self.editPositionTag = function(tag,$event){
                $scope.app.maskUrl = 'pages/editPositionTag.html';
                $scope.app.params = tag;
            }

        }
    ])

    // .controller('adsAddController', ['$http', '$scope', '$state', '$filter', '$stateParams', 'NgTableParams', 'util',
    //     function($http, $scope, $state, $filter, $stateParams, NgTableParams, util) {
    //         console.log('adsAddController')
    //         var self = this;
    //         self.init = function() {

    //         }

    //         self.edit = function(movieID) {

    //         }

    //         // 获取 电影的 分类 产地
    //         self.getTags = function() {
    //             var data = JSON.stringify({
    //                 "token": util.getParams('token'),
    //                 "action": "getTags"
    //             })

    //             $http({
    //                 method: 'POST',
    //                 url: util.getApiUrl('movie', '', 'server'),
    //                 data: data
    //             }).then(function successCallback(response) {
    //                 var msg = response.data;
    //                 if (msg.rescode == '200') {
    //                     if (msg.CategoryList.length == 0) {
    //                         self.noCategotyData = true;
    //                     } else {
    //                         self.categoryList = msg.CategoryList;
    //                         console.log(self.categoryList)
    //                     }
    //                     if (msg.LocationList.length == 0) {
    //                         self.noLocationData = true;
    //                     } else {
    //                         self.locationList = msg.LocationList;
    //                         console.log(self.locationList)
    //                     }
    //                 } else if (msg.rescode == "401") {
    //                     alert('访问超时，请重新登录');
    //                     $state.go('login');
    //                 } else {
    //                     alert(msg.rescode + ' ' + msg.errInfo);
    //                 }
    //             }, function errorCallback(response) {
    //                 alert(response.status + ' 服务器出错');
    //             }).finally(function(value) {
    //                 self.loading = false;
    //             });
    //         }



    //     }
    // ])

    // 广告位列表
    .controller('adsPositionController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, util) {
            console.log('adsPositionController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.getAdvPositionList();
            }
            // 根据广告位标签来搜索，空数组查询所有 , 来获取广告位列表
            self.getAdvPositionList = function() {
                self.loading = true;
                var data = {
                    "action": "getAdvPositionList",
                    "token": util.getParams("token"),
                    "data":{}
                };
                if (self.stateParams.adsPosition == 'all') {
                    // 空数组查询所有
                    data.data.AdvPositionTags = [];
                } else {
                    data.data.AdvPositionTags = [self.stateParams.adsPosition - 0];
                }
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data.materialList == 0) {
                            self.noData = true;
                            return;
                        }
                        self.advPositionList = msg.data;
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
                })
            }

            self.addPosition = function(){
                $scope.app.maskUrl = 'pages/addPosition.html';
            }



            self.editPosition = function(position){
                $scope.app.maskUrl = 'pages/editPosition.html';
                $scope.app.params = {position:position}
            }

            self.addAdvPositionTagMatrix = function(position){
                $scope.app.maskUrl = 'pages/addAdvPositionTagMatrix.html';
                $scope.app.params = {position:position}
            }

        }
    ])

    // 广告位 添加/编辑 广告位标签(全添加)
    .controller('addAdvPositionTagMatrixController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addAdvPositionTagMatrixController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.params = $scope.app.params;
                // 表单需要提交的东西
                self.form = {};
                self.getAdvPositionTagList();
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 广告位 添加/编辑 广告位标签
            self.addAdvPositionTagMatrix = function() {
                var TagID = self.getArray(self.advPositionTagList, 'ID')
                self.saving = true;
                var data = {
                    "action": "addAdvPositionTagMatrix",
                    "token": util.getParams("token"),
                    "data": {
                        "PositionID": self.params.position.ID - 0,
                        "TagID": TagID
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("标签编辑成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, { reload: true });
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }


            // 获取广告位标签列表
            self.getAdvPositionTagList = function() {
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
                        self.advPositionTagList = msg.data;
                        // 
                        for (var i = 0; i < self.advPositionTagList.length; i++) {
                            for (var j = 0; j < self.params.position.AdvPositionTags.length; j++) {
                                if (self.params.position.AdvPositionTags[j].TagID == self.advPositionTagList[i]['ID']) {
                                    self.advPositionTagList[i]['checked'] = true;
                                    break;
                                }
                            }
                        }
                        console.log(self.advPositionTagList)
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

            // 提取出数组
            self.getArray = function(arr, key) {
                var flag = [];
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].checked == true){
                        flag.push(arr[i][key])
                    }
                }
                return flag;
            }

        }
    ])

    // 添加广告位标签
    .controller('addPositionTagController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addPositionTagController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                
                // 表单需要提交的东西
                self.form = {};
              

            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 添加广告位标签
            self.addPositionTag = function() {

                self.saving = true;
                var data = {
                    "action": "addAdvPositionTag",
                    "token": util.getParams("token"),
                    "data": {
                        "TagName": self.form.TagName,
                        "Description": self.form.Description
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告位标签添加成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, {reload: true});
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

        }
    ])

    // 编辑广告位标签
    .controller('editPositionTagController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('editPositionTagController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.params = $scope.app.params;
                self.form = self.params;
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 编辑广告位标签
            self.editPositionTag = function() {
                self.saving = true;
                var data = {
                    "action": "editAdvPositionTag",
                    "token": util.getParams("token"),
                    "data": {
                        "TagName": self.form.TagName,
                        "Description": self.form.Description,
                        "ID": self.form.ID
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告位标签修改成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, { reload: true });
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

        }
    ])


    
    // 添加广告位
    .controller('addPositionController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addPositionController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                // 日期选择器 初始化 隐藏
                self.startDatePicker = false;
                self.endDatePicker = false;
                // 表单需要提交的东西
                self.form = {};
                self.getAdvPositionTemplateList();

            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 添加广告位
            self.addAdvPosition = function() {
                if (!self.form.LifeStartTime) {
                    alert("请选择开始时间");
                    return;
                }
                if (!self.form.LifeEndTime) {
                    alert("请选择结束时间");
                    return;
                }
                self.saving = true;
                var data = {
                    "action": "addAdvPosition",
                    "token": util.getParams("token"),
                    "data": {
                        "LifeEndTime": $filter('date')(self.form.LifeEndTime, 'yyyy-MM-dd HH:mm:ss'),
                        "LifeStartTime": $filter('date')(self.form.LifeStartTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Description": self.form.Description,
                        "ScheduleTypeParam": self.form.ScheduleTypeParam,
                        "ScheduleType": self.form.ScheduleType,
                        "Name": self.form.Name,
                        "AdvPositionTemplateName": self.form.AdvPositionTemplate.AdvPositionTemplateName
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告位添加成功");
                        $state.reload('app.adsBoard.adsPosition')
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

            // 获取广告位模版列表
            self.getAdvPositionTemplateList = function() {
                self.loading = true;
                var data = {
                    "action": "getAdvPositionTemplateList",
                    "token": util.getParams("token"),
                    "data": {}
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data == 0) {
                            self.noData = true;
                            return;
                        }
                        self.templateList = msg.data;
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
                })
            }

            //=====日历选择器=============================
            // 弹出体力选择器


            self.showDatePicker = function(start) {
                if (start == 'start') {
                    self.startDatePicker = true;
                    self.endDatePicker = false;
                } else {
                    self.startDatePicker = false;
                    self.endDatePicker = true;
                }

            }
            self.onTimeSet = function(start) {
                if (start == 'start') {
                    self.startDatePicker = false;
                } else {
                    self.endDatePicker = false;
                }
            }

            //=====日历选择器=============================







        }
    ])

    // 编辑广告位
    .controller('editPositionController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('editPositionController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.params = $scope.app.params;
                // 参数传递
                self.form = self.params.position;
                // 日期选择器 初始化 隐藏
                self.startDatePicker = false;
                self.endDatePicker = false;
                
                self.getAdvPositionTemplateList();

            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 编辑广告位
            self.editAdvPosition = function() {
                if (!self.form.LifeStartTime) {
                    alert("请选择开始时间");
                    return;
                }
                if (!self.form.LifeEndTime) {
                    alert("请选择结束时间");
                    return;
                }
                self.saving = true;
                var data = {
                    "action": "editAdvPosition",
                    "token": util.getParams("token"),
                    "data": {
                        "LifeEndTime": $filter('date')(self.form.LifeEndTime, 'yyyy-MM-dd HH:mm:ss'),
                        "LifeStartTime": $filter('date')(self.form.LifeStartTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Description": self.form.Description,
                        "ScheduleTypeParam": self.form.ScheduleTypeParam,
                        "ScheduleType": self.form.ScheduleType,
                        "Name": self.form.Name,
                        "AdvPositionTemplateName": self.form.AdvPositionTemplate.AdvPositionTemplateName,
                        "ID":self.form.ID
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告位编辑成功");
                        $state.reload('app.adsBoard.adsPosition',{adsPosition:self.stateParams.adsPosition})
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

            // 获取广告位模版列表
            self.getAdvPositionTemplateList = function() {
                self.loading = true;
                var data = {
                    "action": "getAdvPositionTemplateList",
                    "token": util.getParams("token"),
                    "data": {}
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data == 0) {
                            self.noData = true;
                            return;
                        }
                        self.form.templateList = msg.data;
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
                })
            }

            //=====日历选择器=============================
            // 弹出体力选择器


            self.showDatePicker = function(start) {
                if (start == 'start') {
                    self.startDatePicker = true;
                    self.endDatePicker = false;
                } else {
                    self.startDatePicker = false;
                    self.endDatePicker = true;
                }

            }
            self.onTimeSet = function(start) {
                if (start == 'start') {
                    self.startDatePicker = false;
                } else {
                    self.endDatePicker = false;
                }
            }

            //=====日历选择器=============================







        }
    ])


    .controller('adsListController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, util) {
            console.log('adsListController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.getAdvPositionAdvMatrix();
            }

            // 获取广告位广告列表
            self.getAdvPositionAdvMatrix = function() {
                self.loading = true;
                var data = {
                    "action": "getAdvPositionAdvMatrix",
                    "token": util.getParams("token"),
                    "data": {
                        "PositionID": self.stateParams.PostionID - 0
                    }
                };

                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        if (msg.data.length == 0) {
                            self.noData = true;
                            return;
                        }
                        self.adsList = msg.data;
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
                })
            }

            // 广告位添加广告
            self.positionAddAdv = function() {
                $scope.app.maskUrl = 'pages/positionAddAdv.html';
            }


        }
    ])

    // 广告位添加广告
    .controller('positionAddAdvController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG',  'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('positionAddAdvController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                // 广告位 选中的 广告
                self.form = {};
                self.getMaterialList();
                self.getAdvPositionAdvMatrix();
            }

            self.cancel = function(){
                $scope.app.maskUrl = '';
            }


     
            
            // 获取广告列表 根据广告标签来搜索，空数组查询所有 , 来获取广告素材列表
            self.getMaterialList = function(){
                self.loading = true;
                self.tableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    url: ''
                }, {
                    counts: [10,20],
                    getData: function (params) {
                        var data = {
                            "action": "getMaterialList",
                            "token": util.getParams("token"),
                            "AdvTags":[]
                            
                        }
                        var paramsUrl = params.url();
                        data.count = paramsUrl.count + '';
                        data.page = paramsUrl.page  + '';
                        // if (self.stateParams.advTag == 'all') {
                        //     // 空数组查询所有
                        //     data.AdvTags = [];
                        // } else {
                        //     data.AdvTags = [self.stateParams.advTag - 0];
                        // }
                        data = JSON.stringify(data);
                        return $http({
                            method: $filter('ajaxMethod')(),
                            url: util.getApiUrl('material', 'shopList', 'server'),
                            data: data
                        }).then(function successCallback(response) {
                            var msg = response.data;
                            if (msg.rescode == '200') {
                                // if (msg.data.materialList == 0) {
                                //     self.noData = true;
                                //     return;
                                // }
                                params.total(msg.data.materialList);
                                return msg.data.materialList;
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
                        })
                    }
                });
            }

            // 获取广告位广告列表
            self.getAdvPositionAdvMatrix = function() {
                self.loading = true;
                var data = {
                    "action": "getAdvPositionAdvMatrix",
                    "token": util.getParams("token"),
                    "data": {
                        "PositionID": self.stateParams.PostionID - 0
                    }
                };

                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        self.adsList = msg.data;
                        self.adsListArr = self.getArray(self.adsList,'AdvID')
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
                })
            }

            
            // 广告位检测某广告是否已经选中
            self.checkStatus = function(id,list){
                 for (var i = 0; i < list.length; i++) {
                     if (list[i].AdvID == id) {
                        return true;
                     }
                 }
            }

            // 广告位 更改 某广告 是否选中
            self.changeStatus = function(bool,id){
                 var index = self.adsListArr.indexOf(id)
                 if (bool) {
                    self.adsListArr.push(id)
                 } else {
                    self.adsListArr.splice(index,1)
                 }
            }

            // 广告位 添加 广告
            self.addAdvPositionAdvMatrix = function() {
                self.saving = true;
                var data = {
                    "action": "addAdvPositionAdvMatrix",
                    "token": util.getParams("token"),
                    "data": {
                        "PositionID":self.stateParams.PostionID - 0,
                        "AdvID":self.adsListArr,
                        // todo 参数意思
                        "ScheduleParam":""
                    }
                };

                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('position', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert('保存成功');
                        self.cancel();
                        // 选中的广告位广告列表
                        $state.reload('app.adsBoard.adsPosition.adsList',{PostionID:self.stateParams.PostionID})
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }
            // 提取出数组
            self.getArray = function(arr, key) {
                var flag = [];
                for (var i = 0; i < arr.length; i++) {
                    flag.push(arr[i][key])
                }
                return flag;
            }




           
        }
    ])

    // datetimepicker作用域问题，没有独立作用域，暂时这样处理：增加了两个控制器
    .controller('lifeStartTimeController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG',  'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('lifeStartTimeController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
            }

            self.cancel = function(){
                $scope.app.maskUrl = '';
            }

           
        }
    ])

    .controller('lifeEndTimeController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG',  'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('lifeEndTimeController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
            }

            self.cancel = function(){
            }

           
        }
    ])

    .controller('adsMaterialController', ['$http', '$scope', '$state', '$stateParams', 'util',
        function($http, $scope, $state, $stateParams, util) {
            console.log('adsMaterialController')
            var self = this;
            self.init = function() {
                self.getAdvTagList();
                $state.go('app.adsMaterial.materialList',{advTag:'all'})
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

            self.addAdvTag = function(){
                $scope.app.maskUrl = 'pages/addAdvTag.html';
            }

            self.editAdvTag = function(advTag){
                $scope.app.maskUrl = 'pages/editAdvTag.html';
                $scope.app.params = advTag;
            }
        }
    ])

    // 添加广告素材标签
    .controller('addAdvTagController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addAdvTagController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                
                // 表单需要提交的东西
                self.form = {};
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 添加广告素材标签
            self.addAdvTag = function() {

                self.saving = true;
                var data = {
                    "action": "addAdvTag",
                    "token": util.getParams("token"),
                    "data": {
                        "TagName": self.form.TagName,
                        "Description": self.form.Description
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('material', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告标签添加成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, {reload: true});
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

        }
    ])

    // 广告 添加/编辑 广告标签(全添加)
    .controller('addAdvTagMatrixController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addAdvTagController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.params = $scope.app.params;
                // 表单需要提交的东西
                self.form = {};
                self.getAdvTagList();
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 广告 添加/编辑 广告标签
            self.addAdvTagMatrix = function() {
                var TagID = self.getArray(self.advTagList, 'ID')
                self.saving = true;
                var data = {
                    "action": "addAdvTagMatrix",
                    "token": util.getParams("token"),
                    "data": {
                        "AdvID": self.params.ID - 0,
                        "TagID": TagID
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('material', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("标签编辑成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, { reload: true });
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
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
                        // 
                        for (var i = 0; i < self.advTagList.length; i++) {
                            for (var j = 0; j < self.params.AdvTags.length; j++) {
                                if (self.params.AdvTags[j].TagID == self.advTagList[i]['ID']) {
                                    self.advTagList[i]['checked'] = true;
                                    break;
                                }
                            }
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

            // 提取出数组
            self.getArray = function(arr, key) {
                var flag = [];
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].checked == true){
                        flag.push(arr[i][key])
                    }
                }
                return flag;
            }

        }
    ])

    // 编辑广告素材标签
    .controller('editAdvTagController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('editAdvTagController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.params = $scope.app.params 
                // 表单需要提交的东西
                self.form = self.params;
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            // 添加广告素材标签
            self.editAdvTag = function() {

                self.saving = true;
                var data = {
                    "action": "editAdvTag",
                    "token": util.getParams("token"),
                    "data": {
                        "TagName": self.form.TagName,
                        "Description": self.form.Description,
                        "ID": self.form.ID
                    }
                };
                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('material', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert("广告标签编辑成功");
                        // $state.reload('app.adsBoard');
                        // 代替reload
                        $state.go($state.current, {}, {reload: true});
                        self.cancel();
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

        }
    ])
    
    // 广告素材列表
    .controller('materialListController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, util) {
            console.log('materialListController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.getMaterialList();
            }

            self.addMaterial = function(){
                $scope.app.maskUrl = 'pages/addMaterial.html';
            }

            self.editMaterial = function(material){
                $scope.app.maskUrl = 'pages/editMaterial.html';
                $scope.app.params = material;
            }

            self.addAdvTagMatrix = function(material){
                $scope.app.maskUrl = 'pages/addAdvTagMatrix.html';
                $scope.app.params = material;
            }

            self.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
            
            
            self.showDate = function(){
                self.showDatePicker = true;
            }


            // 根据广告标签来搜索，空数组查询所有 , 来获取广告素材列表
            self.getMaterialList = function(){
                self.loading = true;
                self.tableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    url: ''
                }, {
                    counts: [10,20],
                    getData: function (params) {
                        var data = {
                            "action": "getMaterialList",
                            "token": util.getParams("token")
                            
                        }
                        var paramsUrl = params.url();
                        data.count = paramsUrl.count + '';
                        data.page = paramsUrl.page  + '';
                        if (self.stateParams.advTag == 'all') {
                            // 空数组查询所有
                            data.AdvTags = [];
                        } else {
                            data.AdvTags = [self.stateParams.advTag - 0];
                        }
                        data = JSON.stringify(data);
                        return $http({
                            method: $filter('ajaxMethod')(),
                            url: util.getApiUrl('material', 'shopList', 'server'),
                            data: data
                        }).then(function successCallback(response) {
                            var msg = response.data;
                            if (msg.rescode == '200') {
                                if (msg.data.materialList == 0) {
                                    self.noData = true;
                                    return;
                                }
                                params.total(msg.data.materialList);
                                return msg.data.materialList;
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
                        })
                    }
                });
            }
        }
    ])

    // 上传广告素材
    .controller('addMaterialController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addMaterialController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;

                // 需要上传的东西
                self.form = {};
                // 初始化上传列表对象
                self.uploadList = new UploadLists();
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            //=====日历选择器=============================
            // 弹出体力选择器


            self.showDatePicker = function(start) {
                if (start == 'start') {
                    self.startDatePicker = true;
                    self.endDatePicker = false;
                } else {
                    self.startDatePicker = false;
                    self.endDatePicker = true;
                }

            }
            self.onTimeSet = function(start) {
                if (start == 'start') {
                    self.startDatePicker = false;
                } else {
                    self.endDatePicker = false;
                }
            }

            //=====日历选择器=============================



            // 上传广告素材
            self.saveForm = function() {
                if (self.uploadList.data.length == 0) {
                    alert('请先上传图片');
                    return;
                }
                if (!self.form.LifeStartTime) {
                    alert("请选择开始时间");
                    return;
                }
                if (!self.form.LifeEndTime) {
                    alert("请选择结束时间");
                    return;
                }
                self.saving = true;
                var file = self.uploadList.data[0].file
                var data = {
                    "action": "addMaterial",
                    "token": util.getParams("token"),
                    "data": {
                        "URLRelative": "",
                        "LifeEndTime": $filter('date')(self.form.LifeEndTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Name": self.form.Name,
                        "URL": file.src,
                        "LifeStartTime": $filter('date')(self.form.LifeStartTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Duration": self.form.Duration,
                        "Description": self.form.Description,
                        "Size": file.size
                    }

                }


                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('material', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert('添加成功');
                        self.cancel();
                        $state.reload('app.adsMaterial.materialList');
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

            // 上传广告库资料
            self.uploadAdsFile = function() {
                if (!$scope.adsFile) {
                    alert('请选择图片');
                    return;
                }
                self.uploadList.uploadFile($scope.adsFile, self.uploadList);
            }


            //广告素材 上传
            function UploadLists() {
                this.data = [
                    /*{
                        "id":0, 
                        "video":{
                            "name": "星际迷航", "size": 1111, "percentComplete": 40, "xhr":"xhr", "src":"xx"
                        },
                        "subtitle":{
                            "name": "星际迷航－字幕", "size": 1111, "percentComplete": 40, "xhr":"xhr", "src":"xx"
                        }
                    }*/
                ];
                this.maxId = 0;
            }

            UploadLists.prototype = {
                // 设置未当前选中的广告资料
                set: function(file) {

                    //先清空数组
                    this.data = [];
                    this.data.push({ "file": file, "id": this.maxId });
                    return this.maxId;
                },
                setPercentById: function(type, id, percentComplete) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].id == id) {
                            this.data[i][type].percentComplete = percentComplete;
                            break;
                        }
                    }
                },
                setSrcSizeById: function(type, id, src, size) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].id == id) {
                            this.data[i][type].src = src;
                            this.data[i][type].size = size;
                            break;
                        }
                    }
                },
                deleteById: function(id) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果正在上传，取消上传
                            // 视频
                            if (l[i].video.percentComplete < 100 && l[i].video.percentComplete != '失败') {
                                l[i].video.xhr.abort();
                            }
                            // 字幕
                            if (l[i].subtitle.percentComplete != undefined && l[i].subtitle.percentComplete < 100 && l[i].subtitle.percentComplete != '失败') {
                                l[i].subtitle.xhr.abort();
                            }
                            // 删除data
                            l.splice(i, 1);
                            break;
                        }
                    }
                },
                judgeCompleted: function(id, o) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果视频和字幕都上传完毕
                            if ((l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete == undefined) ||
                                (l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete >= 100)) {
                                o.transcode(id, o);
                            }
                            break;
                        }
                    }
                },
                uploadFile: function(file, o) {
                    // 上传后台地址
                    var uploadUrl = CONFIG.uploadUrl;

                    // xhr对象
                    var fileXhr = new XMLHttpRequest();
                    // var video = {"name": videoFile.name, "size":videoFile.size, "percentComplete": 0, "xhr": videoXhr};

                    // 添加data，并获取id
                    var id = this.set(file);

                    // 上传视频
                    util.uploadFileToUrl(fileXhr, file, uploadUrl, 'normal',
                        // 上传中
                        function(evt) {
                            $scope.$apply(function() {
                                if (evt.lengthComputable) {
                                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                    // 更新上传进度
                                    o.setPercentById('file', id, percentComplete);
                                }
                            });
                        },
                        // 上传成功
                        function(xhr) {
                            var ret = JSON.parse(xhr.responseText);
                            console && console.log(ret);
                            $scope.$apply(function() {
                                o.setSrcSizeById('file', id, ret.upload_path, ret.size);
                                o.judgeCompleted(id, o);
                            });
                            alert('上传成功');
                        },
                        // 上传失败
                        function(xhr) {
                            // $scope.$apply(function(){
                            //   o.setPercentById('video', id, '失败');
                            // });
                            // xhr.abort();
                        }
                    );
                }
            }

        }
    ])

    // 编辑广告素材
    .controller('editMaterialController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('editMaterialController')
            console.log($stateParams)
            console.log($scope.app.params)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                self.form = $scope.app.params;
                
                // 初始化上传列表对象
                self.uploadList = new UploadLists();
                // 编辑前，先取出擦数中的文件对象
                self.uploadList.data =[
                    {file:{
                        src:self.form.URL,
                        size:self.form.Size
                    }}
                ]
            }

            self.cancel = function() {
                $scope.app.maskUrl = '';
            }

            //=====日历选择器=============================
            // 弹出体力选择器


            self.showDatePicker = function(start) {
                if (start == 'start') {
                    self.startDatePicker = true;
                    self.endDatePicker = false;
                } else {
                    self.startDatePicker = false;
                    self.endDatePicker = true;
                }

            }
            self.onTimeSet = function(start) {
                if (start == 'start') {
                    self.startDatePicker = false;
                } else {
                    self.endDatePicker = false;
                }
            }

            //=====日历选择器=============================



            // 编辑广告素材 提交
            self.saveForm = function() {
                if (self.uploadList.data.length == 0) {
                    alert('请先上传图片');
                    return;
                }
                if (!self.form.LifeStartTime) {
                    alert("请选择开始时间");
                    return;
                }
                if (!self.form.LifeEndTime) {
                    alert("请选择结束时间");
                    return;
                }
                self.saving = true;
                var file = self.uploadList.data[0].file
                var data = {
                    "action": "editMaterial",
                    "token": util.getParams("token"),
                    "data": {
                        "ID": self.form.ID - 0,
                        "URLRelative": "",
                        "LifeEndTime": $filter('date')(self.form.LifeEndTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Name": self.form.Name,
                        "URL": file.src,
                        "LifeStartTime": $filter('date')(self.form.LifeStartTime, 'yyyy-MM-dd HH:mm:ss'),
                        "Duration": self.form.Duration,
                        "Description": self.form.Description,
                        "Size": file.size
                    }

                }


                data = JSON.stringify(data);
                $http({
                    method: $filter('ajaxMethod')(),
                    url: util.getApiUrl('material', 'shopList', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var msg = response.data;
                    if (msg.rescode == '200') {
                        alert('编辑成功');
                        self.cancel();
                        $state.reload('app.adsMaterial.materialList');
                    } else if (msg.rescode == "401") {
                        alert('访问超时，请重新登录');
                        $state.go('login');
                    } else {
                        alert(msg.rescode + ' ' + msg.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function(value) {
                    self.saving = false;
                })
            }

            // 上传广告库资料
            self.uploadAdsFile = function() {
                if (!$scope.adsFile) {
                    alert('请选择图片');
                    return;
                }
                self.uploadList.uploadFile($scope.adsFile, self.uploadList);
            }


            //广告素材 上传
            function UploadLists() {
                this.data = [
                    /*{
                        "id":0, 
                        "video":{
                            "name": "星际迷航", "size": 1111, "percentComplete": 40, "xhr":"xhr", "src":"xx"
                        },
                        "subtitle":{
                            "name": "星际迷航－字幕", "size": 1111, "percentComplete": 40, "xhr":"xhr", "src":"xx"
                        }
                    }*/
                ];
                this.maxId = 0;
            }

            UploadLists.prototype = {
                // 设置未当前选中的广告资料
                set: function(file) {

                    //先清空数组
                    this.data = [];
                    this.data.push({ "file": file, "id": this.maxId });
                    return this.maxId;
                },
                setPercentById: function(type, id, percentComplete) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].id == id) {
                            this.data[i][type].percentComplete = percentComplete;
                            break;
                        }
                    }
                },
                setSrcSizeById: function(type, id, src, size) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].id == id) {
                            this.data[i][type].src = src;
                            this.data[i][type].size = size;
                            break;
                        }
                    }
                },
                deleteById: function(id) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果正在上传，取消上传
                            // 视频
                            if (l[i].video.percentComplete < 100 && l[i].video.percentComplete != '失败') {
                                l[i].video.xhr.abort();
                            }
                            // 字幕
                            if (l[i].subtitle.percentComplete != undefined && l[i].subtitle.percentComplete < 100 && l[i].subtitle.percentComplete != '失败') {
                                l[i].subtitle.xhr.abort();
                            }
                            // 删除data
                            l.splice(i, 1);
                            break;
                        }
                    }
                },
                judgeCompleted: function(id, o) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果视频和字幕都上传完毕
                            if ((l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete == undefined) ||
                                (l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete >= 100)) {
                                o.transcode(id, o);
                            }
                            break;
                        }
                    }
                },
                uploadFile: function(file, o) {
                    // 上传后台地址
                    var uploadUrl = CONFIG.uploadUrl;

                    // xhr对象
                    var fileXhr = new XMLHttpRequest();
                    // var video = {"name": videoFile.name, "size":videoFile.size, "percentComplete": 0, "xhr": videoXhr};

                    // 添加data，并获取id
                    var id = this.set(file);

                    // 上传视频
                    util.uploadFileToUrl(fileXhr, file, uploadUrl, 'normal',
                        // 上传中
                        function(evt) {
                            $scope.$apply(function() {
                                if (evt.lengthComputable) {
                                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                    // 更新上传进度
                                    o.setPercentById('file', id, percentComplete);
                                }
                            });
                        },
                        // 上传成功
                        function(xhr) {
                            var ret = JSON.parse(xhr.responseText);
                            console && console.log(ret);
                            $scope.$apply(function() {
                                o.setSrcSizeById('file', id, ret.upload_path, ret.size);
                                o.judgeCompleted(id, o);
                            });
                            alert('上传成功');
                        },
                        // 上传失败
                        function(xhr) {
                            // $scope.$apply(function(){
                            //   o.setPercentById('video', id, '失败');
                            // });
                            // xhr.abort();
                        }
                    );
                }
            }

        }
    ])




    


})();
