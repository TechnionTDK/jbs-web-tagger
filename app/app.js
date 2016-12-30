'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'LocalStorageModule',
  'ui.bootstrap',
  'myApp.bl',
  'myApp.directives',
  'myApp.view1',
  'myApp.version'
]).
config(function($locationProvider, $routeProvider, localStorageServiceProvider) {
  $locationProvider.hashPrefix('!');
  localStorageServiceProvider.setPrefix('jbs-web-tagger');
  $routeProvider.otherwise({redirectTo: '/view1'});
});
