'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectScreenCtrl
 * @description
 * # ProjectScreenCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
 .controller('ProjectScreenCtrl', function ($scope,$http,$location,$routeParams) {
    $scope.activeProjectUuid = $routeParams.uuid;
    $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.projectScreenBody = $(window).height() - 176;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".projectScreen-content-body").css('height',$scope.projectScreenBody);
        
        	
        // Makes sure the dataTransfer information is sent when we
        // Drop the item in the drop box.
        jQuery.event.props.push('dataTransfer');

        // The number of images to display
        var errMessage = 0;

        // Get all of the data URIs and put them in an array
        var dataArray = [];

        // Bind the drop event to the dropzone.
        $('#drop-files').bind('drop', function(e) {
                // Stop the default action, which is to redirect the page
                // To the dropped file
                var files = e.dataTransfer.files;

                // For each file
                $.each(files, function(index, file) {

                        // Some error messaging
                        if (!files[index].type.match('image.*')) {

                                if(errMessage == 0) {
                                        $('#drop-files').html('Hey! Images only');
                                        ++errMessage
                                }
                                else if(errMessage == 1) {
                                        $('#drop-files').html('Stop it! Images only!');
                                        ++errMessage
                                }
                                else if(errMessage == 2) {
                                        $('#drop-files').html("Can't you read?! Images only!");
                                        ++errMessage
                                }
                                else if(errMessage == 3) {
                                        $('#drop-files').html("Fine! Keep dropping non-images.");
                                        errMessage = 0;
                                }
                                return false;
                        }
                        // Start a new instance of FileReader
                        var fileReader = new FileReader();
                                // When the filereader loads initiate a function
                                fileReader.onload = (function(file) {
                                        return function(e) { 
                                                // Push the data URI into an array
                                                dataArray.push({name : file.name, value : this.result});
                                                console.log(this.result);
                                        }; 
                                })(files[index]);
                        // For data URI purposes
                        fileReader.readAsDataURL(file);
                });
        });

        // Just some styling for the drop file container.
        $('#drop-files').bind('dragenter', function() {
                $(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '4px dashed #bb2b2b'});
                return false;
        });

        $('#drop-files').bind('drop', function() {
                $(this).css({'box-shadow' : 'none', 'border' : '4px dashed #fff'});
                return false;
        });
    };
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.updateProjectTitle = data.name;
            $scope.updateProjectTypeid = data.type_id;
        });
        
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
            $scope.screens = data;
        });
    };
    
    $scope.openUpdateProject = function(){
        $('#updateproject').modal('toggle');
    };
    
    $scope.updateMyProject = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'PUT',
            data: {name:$scope.updateProjectTitle,type_id:$scope.updateProjectTypeid}
        }).success(function() {
            $scope.init();
            $('#updateproject').modal('hide');
        });
   };
     
    $scope.openAddProjectMember = function(){
        $('#addPeopleToProject').modal('toggle');
    };
    
    $scope.addProjectMember = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+$scope.activeProjectUuid+'/invite',
            method: 'POST',
            data: $.param({uuid:$scope.activeProjectUuid,email:$scope.memberEmail}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $('#addPeopleToProject').modal('hide');
        });
    };
    
    $scope.openUploadScreen = function(){
        $('#addProjectScreen').modal('toggle');
    };
    
    $scope.addUploadScreen = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/screens/project/'+$scope.activeProjectUuid,
            method: 'POST',
            data: $.param({project_uuid:$scope.activeProjectUuid,url:$scope.screenUrl}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#addProjectScreen').modal('hide');
        });
    };
    
    $scope.toBuildNewScreen = function(){
        var url = '/project-build/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toBuild = function(suuid){
        var url = '/project-build/'+$scope.activeProjectUuid+'/'+suuid;
        $location.path(url);
    }
    
    $scope.toActivity = function(){
        var url = '/project-activity/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.toComment = function(){
        var url = '/project-comment/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
     $scope.openMessage = function(){
        var url = '/message/'+$scope.activeProjectUuid;
        $location.path(url);
    }
    
    $scope.init();
});
