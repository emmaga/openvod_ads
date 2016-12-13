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


    .controller('addMaterialController', ['$http', '$scope', '$state', '$stateParams', '$filter', 'NgTableParams', 'CONFIG', 'util',
        function($http, $scope, $state, $stateParams, $filter, NgTableParams, CONFIG, util) {
            console.log('addMaterialController')
            console.log($stateParams)
            var self = this;
            self.init = function() {
                self.stateParams = $stateParams;
                // self.getMaterialList();

                // 初始化上传列表对象
                self.uploadList = new UploadLists();
            }

            self.cancel = function(){
                $scope.app.maskUrl = '';
            }

            self.uploadAdsFile = function(){
               self.uploadList.uploadFile($scope.adsFile,self.uploadList);
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
                add: function(video, subtitle) {
                    this.data.push({"video": video, "subtitle": subtitle, "id": this.maxId});
                    return this.maxId++;
                },
                setPercentById: function(type, id, percentComplete) {
                    for(var i =0; i < this.data.length; i++) {
                        if(this.data[i].id == id) {
                            this.data[i][type].percentComplete = percentComplete;
                            break;
                        }
                    }
                },
                setSrcSizeById: function(type, id, src, size) {
                    for(var i =0; i < this.data.length; i++) {
                        if(this.data[i].id == id) {
                            this.data[i][type].src = src;
                            this.data[i][type].size = size;
                            break;
                        }
                    }
                },
                deleteById: function(id) {
                    var l = this.data;
                    for(var i = 0; i <l.length; i++) {
                        if (l[i].id == id) {
                            // 如果正在上传，取消上传
                            // 视频
                            if(l[i].video.percentComplete < 100 && l[i].video.percentComplete != '失败') {
                                l[i].video.xhr.abort();
                            }
                            // 字幕
                            if(l[i].subtitle.percentComplete != undefined && l[i].subtitle.percentComplete < 100 && l[i].subtitle.percentComplete != '失败') {
                                l[i].subtitle.xhr.abort();
                            }
                            // 删除data
                            l.splice(i, 1);
                            break;
                        }
                    }
                },
                judgeCompleted: function(id, o){
                    var l = this.data;
                    for(var i = 0; i <l.length; i++) {
                        if (l[i].id == id) {
                            // 如果视频和字幕都上传完毕
                            if((l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete == undefined) || 
                                (l[i].video.percentComplete >= 100 && l[i].subtitle.percentComplete >= 100)) {
                                o.transcode(id, o);
                            }
                            break;
                        }
                    }
                },
                transcode: function(id, o) {
                    var o = o;
                    var id = id;
                    var l = this.data;
                    var source = {};
                    for(var i = 0; i <l.length; i++) {
                        if (l[i].id == id) {
                            source = l[i];
                            break;
                        }
                    }
                    // 转码
                    var data = JSON.stringify({
                        "action": "submitTranscodeTask",
                        "token": util.getParams('token'),
                        "rescode": "200",
                        "data": {
                            "movie": {
                                "oriFileName": source.video.name,
                                "filePath": source.video.src
                            },
                            "subtitle": {
                                "oriFileName": source.subtitle.name,
                                "filePath": source.subtitle.src
                            }
                        }
                    })
                    console&&console.log(data);
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('tanscodetask', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var msg = response.data;
                        if (msg.rescode == '200') {
                            console&&console.log('转码 ' + id);
                            // 从列表中删除
                            o.deleteById(id);
                        } 
                        else if(msg.rescode == '401') {
                            alert('访问超时，请重新登录');
                            $state.go('login');
                        }
                        else {
                            // 转码申请失败后再次调用
                            console&&console.log('转码申请失败后再次调用');
                            setTimeout(function() {
                                o.transcode(id, o);
                            },5000);
                            
                        }
                    }, function errorCallback(response) {
                        // 转码申请失败后再次调用
                        console&&console.log('转码申请失败后再次调用');
                        console&&console.log(response);
                        setTimeout(function() {
                            o.transcode(id, o);
                        },5000);
                    });
                },
                uploadFile: function(file, obj) {
                    // 上传后台地址
                    var uploadUrl = CONFIG.uploadUrl;

                    // 对象
                    var videoXhr = new XMLHttpRequest();
                    var video = {"name": videoFile.name, "size":videoFile.size, "percentComplete": 0, "xhr": videoXhr};
                    
                    // 添加data，并获取id
                    var id = this.add(video, subtitle);

                    // 上传视频
                    util.uploadFileToUrl(videoXhr, videoFile, uploadUrl, 'normal',
                        // 上传中
                        function(evt) {
                          $scope.$apply(function(){
                            if (evt.lengthComputable) {
                              var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                              // 更新上传进度
                              o.setPercentById('video', id, percentComplete);
                            }
                          });
                        },
                        // 上传成功
                        function(xhr) {
                            var ret = JSON.parse(xhr.responseText);
                            console && console.log(ret);
                            $scope.$apply(function(){
                              o.setSrcSizeById('video', id, ret.filePath, ret.size);
                              o.judgeCompleted(id, o);
                            });
                        },
                        // 上传失败
                        function(xhr) {
                            $scope.$apply(function(){
                              o.setPercentById('video', id, '失败');
                            });
                            xhr.abort();
                        }
                    );
                }
            }
           
        }
    ])



    


})();
