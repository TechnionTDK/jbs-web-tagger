'use strict';

describe('myApp.view1 module', function () {

    var $controller;
    var $uibModal;
    var localStorageService;

    beforeEach(module('ngRoute'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('LocalStorageModule'));
    beforeEach(module('myApp.view1'));

    beforeEach(inject(function(_$controller_, _$uibModal_, _localStorageService_){
        $controller = _$controller_;
        $uibModal = _$uibModal_;
        localStorageService = _localStorageService_;
    }));

    describe('view1 controller', function () {
        it('should ....', function () {
            //spec body
            var $scope = {};
            var controller = $controller('View1Ctrl', { $scope: $scope, $uibModal: $uibModal, localStorageService: localStorageService });
            expect(controller).toBeDefined();
        });
    });
});