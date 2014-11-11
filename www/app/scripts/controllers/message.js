'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MessageCtrl', function ($scope) {
    $scope.openAddNewMessage = function(){
        $('#addNewMessage').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.replyMessageModal = function(){
        $('#replymessage').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.deleteMessageModal = function(){
        $('#deletemessage').modal('toggle');
        $('body').css('padding',0);
    };
    
    $scope.deleteMessage = function(uuid){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/projects/project/'+uuid,
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#deletemessage').modal('hide');
        });
    };
  });
