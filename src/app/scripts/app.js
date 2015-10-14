'use strict';

/**
 * @ngdoc overview
 * @name conojoApp
 * @description
 * # conojoApp
 *
 * Main module of the application.
 */
angular
    .module('conojoApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angular-storage',
        'logglyLogger',
        'config',
        'ngFileUpload'
    ])
    .config(function ($routeProvider, $httpProvider, LogglyLoggerProvider) {

        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;

        LogglyLoggerProvider.inputToken('c27a2843-94a4-43d4-a4eb-55908ee737f6');
        LogglyLoggerProvider.includeTimestamp(true);
        LogglyLoggerProvider.inputTag('conojoApp');
        $httpProvider.interceptors.push('ResponseInterceptor');


        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                title: 'Login | Conojo Collaboration Platform',
                description: 'Login | The most comprehensive creative collaboration platform there is. Get feedback on UI/UX, video and files in real-time. Get started with our free trial.'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl',
                title: 'Register | Conojo Collaboration Platform',
                description: 'Register | The most comprehensive creative collaboration platform there is. Get feedback on UI/UX, video and files in real-time. Get started with our free trial.'
            })
            .when('/project', {
                templateUrl: 'views/project.html',
                controller: 'ProjectCtrl',
                title: 'Projects | Conojo Collaboration Platform'
            })
            .when('/activity', {
                templateUrl: 'views/activity.html',
                controller: 'ActivityCtrl'
            })
            .when('/message', {
                templateUrl: 'views/message.html',
                controller: 'MessageCtrl'
            })
            .when('/team', {
                templateUrl: 'views/team.html',
                controller: 'TeamCtrl'
            })
            .when('/userpage/:ouuid/:tuuid', {
                templateUrl: 'views/userpage.html',
                controller: 'UserpageCtrl'
            })
            .when('/project-build/:puuid/:suuid', {
                templateUrl: 'views/project-build.html',
                controller: 'ProjectBuildCtrl'
            })
            .when('/project-screen/:uuid', {
                templateUrl: 'views/project-screen.html',
                controller: 'ProjectScreenCtrl'
            })
            .when('/project-activity/:uuid', {
                templateUrl: 'views/project-activity.html',
                controller: 'ProjectActivityCtrl'
            })
            .when('/project-comment/:uuid', {
                templateUrl: 'views/project-comment.html',
                controller: 'ProjectCommentCtrl'
            })
            .when('/project-screenUpload/:uuid', {
                templateUrl: 'views/project-screenUpload.html',
                controller: 'ProjectScreenUploadCtrl'
            })
            .when('/invitation/:invite/:type', {
                templateUrl: 'views/invitation.html',
                controller: 'InvitationCtrl'
            })
            .when('/meeting/:uuid', {
                templateUrl: 'views/meeting.html',
                controller: 'MeetingCtrl'
            })
            .when('/profile-project', {
                templateUrl: 'views/profile-project.html',
                controller: 'ProfileProjectCtrl'
            })
            .when('/profile-profile', {
                templateUrl: 'views/profile-profile.html',
                controller: 'ProfileProfileCtrl'
            })
            .when('/profile-billing', {
                templateUrl: 'views/profile-billing.html',
                controller: 'ProfileBillingCtrl'
            })
            .when('/profile-notice', {
                templateUrl: 'views/profile-notice.html',
                controller: 'ProfileNoticeCtrl'
            })
            .when('/project-video/:uuid', {
                templateUrl: 'views/project-video.html',
                controller: 'ProjectVideoCtrl'
            })
            .when('/project-videoUpload/:uuid', {
                templateUrl: 'views/project-videoUpload.html',
                controller: 'ProjectVideoUploadCtrl'
            })
            .when('/project-videoPlay/:puuid/:vuuid', {
                templateUrl: 'views/project-videoPlay.html',
                controller: 'ProjectVideoPlayCtrl'
            })
            .when('/project-activity-video/:uuid', {
                templateUrl: 'views/project-activity-video.html',
                controller: 'ProjectActivityVideoCtrl'
            })
            .when('/project-comment-video/:uuid', {
                templateUrl: 'views/project-comment-video.html',
                controller: 'ProjectCommentVideoCtrl'
            })
            .when('/project-build-template/:puuid/:suuid', {
                templateUrl: 'views/project-build-template.html',
                controller: 'ProjectBuildTemplateCtrl'
            })
            .when('/project-screen-template/:uuid', {
                templateUrl: 'views/project-screen-template.html',
                controller: 'ProjectScreenTemplateCtrl'
            })
            .when('/project-templateSelect/:uuid', {
                templateUrl: 'views/project-templateSelect.html',
                controller: 'ProjectTemplateSelectCtrl'
            })
            .when('/project-activity-template/:uuid', {
                templateUrl: 'views/project-activity-template.html',
                controller: 'ProjectActivityTemplateCtrl'
            })
            .when('/project-comment-template/:uuid', {
                templateUrl: 'views/project-comment-template.html',
                controller: 'ProjectCommentTemplateCtrl'
            })
            .when('/register-billingInfo', {
                templateUrl: 'views/register-billingInfo.html',
                controller: 'registerBillingCtrl'
            })
            .when('/register-plan', {
                templateUrl: 'views/register-plan.html',
                controller: 'registerPlanCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(['$location', '$rootScope', function ($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            $rootScope.title = current.$$route.title;
            $rootScope.description = current.$$route.description;
        });
    }]);
