'use strict';

angular.module('myApp.tagModal', [])
    .controller('tagModalCtrl', function tagModalCtrl($uibModalInstance, header) {
    /* jshint validthis: true */
    var vm = this;

    vm.cancel = cancel;
    vm.activate = activate;

    vm.header = header;

    activate();

    ////////////////

    function activate() {
    }


    function cancel(){
        $uibModalInstance.dismiss();
    }
});
