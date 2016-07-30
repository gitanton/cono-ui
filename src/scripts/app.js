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
        'ngMessages',
        'ngPassword',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angular-storage',
        'logglyLogger',
        'config',
        'ngFileUpload',
        'angularModalService',
        'ui.select',

    ])
    .constant('NAV', {
        PROJECT: 'project',
        PROJECT_BUILD: 'project-build',
        PROJECT_BUILD_SCREEN: 'project-build-screen',
        PROJECT_SCREEN: 'project-screen',
        PROJECT_ACTIVITY: 'project-activity',
        PROJECT_COMMENT: 'project-comment',


        PROJECT_SCREEN_UPLOAD: 'project-screen-upload',

        PROJECT_TEMPLATE_BUILD: 'project-template-build',
        PROJECT_TEMPLATE_BUILD_SCREEN: 'project-template-build-screen',
        PROJECT_TEMPLATE_ACTIVITY: 'project-template-activity',
        PROJECT_TEMPLATE_COMMENT: 'project-template-comment',
        PROJECT_TEMPLATE_SELECT: 'project-template-select',
        PROJECT_TEMPLATE_SCREEN: 'project-template-screen',

        PROJECT_VIDEO: 'project-video',
        PROJECT_VIDEO_PLAY: 'project-video-play',
        PROJECT_VIDEO_UPLOAD: 'project-video-upload',
        PROJECT_VIDEO_ACTIVITY: 'project-video-activity',
        PROJECT_VIDEO_COMMENT: 'project-video-comment',
    })
    .config(function ($routeProvider, $httpProvider, LogglyLoggerProvider, uiSelectConfig, NAV) {

        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;

        LogglyLoggerProvider.inputToken('c27a2843-94a4-43d4-a4eb-55908ee737f6');
        LogglyLoggerProvider.includeTimestamp(true);
        LogglyLoggerProvider.inputTag('conojoApp');
        $httpProvider.interceptors.push('ResponseInterceptor');
        uiSelectConfig.theme = 'bootstrap';


        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                title: 'Login | Conojo Collaboration Platform',
                description: 'Login | The most comprehensive creative collaboration platform there is. Get feedback on UI/UX, video and files in real-time. Get started with our free trial.'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl',
                title: 'Register | Conojo Collaboration Platform',
                description: 'Register | The most comprehensive creative collaboration platform there is. Get feedback on UI/UX, video and files in real-time. Get started with our free trial.'
            })
            .when('/'+NAV.PROJECT, {
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
            .when('/drawing', {
                templateUrl: 'views/drawing.html',
                controller: 'DrawingCtrl'
            })
            .when('/userpage/:ouuid/:tuuid', {
                templateUrl: 'views/userpage.html',
                controller: 'UserPageCtrl'
            })
            .when('/'+NAV.PROJECT_BUILD+'/:puuid', {
                templateUrl: 'views/project-build.html',
                controller: 'ProjectBuildCtrl'
            })
            .when('/'+NAV.PROJECT_BUILD_SCREEN+'/:puuid/:suuid', {
                templateUrl: 'views/project-build.html',
                controller: 'ProjectBuildCtrl'
            })
            .when('/'+NAV.PROJECT_SCREEN+'/:uuid', {
                templateUrl: 'views/project-screen.html',
                controller: 'ProjectScreenCtrl'
            })
            .when('/'+NAV.PROJECT_ACTIVITY+'/:uuid', {
                templateUrl: 'views/project-activity.html',
                controller: 'ProjectActivityCtrl'
            })
            .when('/'+NAV.PROJECT_COMMENT+'/:uuid', {
                templateUrl: 'views/project-comment.html',
                controller: 'ProjectCommentCtrl'
            })
            .when('/'+NAV.PROJECT_SCREEN_UPLOAD+'/:uuid', {
                templateUrl: 'views/project-screen-upload.html',
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
                controller: 'profileBillingCtrl'
            })
            .when('/profile-notice', {
                templateUrl: 'views/profile-notice.html',
                controller: 'ProfileNoticeCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO+'/:uuid', {
                templateUrl: 'views/project-video.html',
                controller: 'ProjectVideoCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO_UPLOAD+'/:uuid', {
                templateUrl: 'views/project-video-upload.html',
                controller: 'ProjectVideoUploadCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO_PLAY+'/:puuid/:vuuid', {
                templateUrl: 'views/project-video-play.html',
                controller: 'ProjectVideoPlayCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO_PLAY+'/:puuid', {
                templateUrl: 'views/project-video-play.html',
                controller: 'ProjectVideoPlayCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO_ACTIVITY+'/:uuid', {
                templateUrl: 'views/project-video-activity.html',
                controller: 'ProjectActivityVideoCtrl'
            })
            .when('/'+NAV.PROJECT_VIDEO_COMMENT+'/:uuid', {
                templateUrl: 'views/project-video-comment.html',
                controller: 'ProjectCommentVideoCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_BUILD_SCREEN+'/:puuid/:suuid', {
                templateUrl: 'views/project-template-build.html',
                controller: 'ProjectBuildTemplateCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_BUILD+'/:puuid', {
                templateUrl: 'views/project-template-build.html',
                controller: 'ProjectBuildTemplateCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_SCREEN+'/:uuid', {
                templateUrl: 'views/project-template-screen.html',
                controller: 'ProjectScreenTemplateCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_SELECT+'/:uuid', {
                templateUrl: 'views/project-template-select.html',
                controller: 'ProjectTemplateSelectCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_ACTIVITY+'/:uuid', {
                templateUrl: 'views/project-template-activity.html',
                controller: 'ProjectActivityTemplateCtrl'
            })
            .when('/'+NAV.PROJECT_TEMPLATE_COMMENT+'/:uuid', {
                templateUrl: 'views/project-template-comment.html',
                controller: 'ProjectCommentTemplateCtrl'
            })
            .when('/register-billing-info', {
                templateUrl: 'views/register-billing-info.html',
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
            if(current.$$route != undefined)
            {
                $rootScope.title = current.$$route.title;
                $rootScope.description = current.$$route.description;
            }
            else{
                
            }
            
        });
    }]);
