'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'components/view1/view1.html',
        controller: 'View1Ctrl',
        controllerAs: 'vm'
    });
}])

.controller('View1Ctrl', [function () {
    var vm = this;

    vm.state = 0; //before any load

    vm.loadLabelsDB = loadLabelsDB;
    vm.loadText = loadText;
    vm.updateSelectedText = updateSelectedText;
    vm.updateFilter = updateFilter;
    vm.tag = tag;

    activate();

    //////////////////////////////////////////

    function activate() {

    }

    function loadLabelsDB() {
        vm.state = 1;
        vm.labelsDBjson = JSON.parse(vm.labelsDB);
        vm.labelsDBjsonFiltered = {"collection": []};
    }

    function loadText() {
        vm.state = 2;
    }

    function updateSelectedText() {
        var flag = 0;
        var sel = window.getSelection();
        vm.startOffset = -1;
        vm.endOffset = -1;

        for (var i = 0; i < sel.rangeCount; i++) {
            var s = sel.getRangeAt(i).startContainer.parentNode.id;
            var e = sel.getRangeAt(i).endContainer.parentNode.id;
            // console.log(i,s,e,sel);
            if (s == "text") flag = 1;
            if (flag = 1 && e == "text" || e == "child") flag = 2;
            if (flag == 2) {
                vm.startOffset = sel.getRangeAt(i).startOffset;
                vm.endOffset = sel.getRangeAt(i).endOffset;
            }
        }
        if (flag == 2) {
            //console.log(vm.text.substring(startOffset, endOffset))
        }
    }

    function updateFilter() {
        vm.labelsDBjsonFiltered = {"collection": []};
        vm.labelsDBjsonFiltered.collection = [];
        if (vm.filter.length > 0) {
            vm.labelsDBjson.collection.forEach(function (labelObj) {
                labelObj.labels.every(function (label) {
                    if (label.label.includes(vm.filter)) {
                        vm.labelsDBjsonFiltered.collection.push(labelObj);
                        return false;
                    }
                    return true;
                });
            });
        }
    }

    function tag(labelObj) {
        vm.taggedText = vm.taggedText.substring(0,vm.startOffset)
            + '"'
            + vm.taggedText.substring(vm.startOffset,vm.endOffset)
            + '"'
            + '('
            + labelObj.labels[0].label
            + ')'
            + vm.taggedText.substring(vm.endOffset);
        console.log(vm.startOffset);
        console.log(vm.endOffset);
    }

    vm.labelsDBjson = {
        "collection": [
            {
                "uri": "text:tanach-1-1-1", "text": "...",
                "labels": [
                    {"label": "בראשית א א"},
                    {"label": "בראשית פרק א פסוק א"}
                ]
            },
            {
                "uri": "text:tanach-1-1-2", "text": "...",
                "labels": [
                    {"label": "בראשית א ב"},
                    {"label": "בראשית פרק א פסוק ב"}
                ]
            },
            {
                "uri": "text:tanach-1-1-3", "text": "...",
                "labels": [
                    {"label": "בראשית א ג"},
                    {"label": "בראשית פרק א פסוק ג"}
                ]
            },
            {
                "uri": "text:tanach-1-1-4", "text": "...",
                "labels": [
                    {"label": "בראשית א ד"},
                    {"label": "בראשית פרק א פסוק ד"}
                ]
            },
            {
                "uri": "text:tanach-1-1-5", "text": "...",
                "labels": [
                    {"label": "בראשית א ה"},
                    {"label": "בראשית פרק א פסוק ה"}
                ]
            },
            {
                "uri": "text:tanach-1-2-1", "text": "...",
                "labels": [
                    {"label": "בראשית ב א"},
                    {"label": "בראשית פרק ב פסוק א"}
                ]
            },
            {
                "uri": "text:tanach-1-2-2", "text": "...",
                "labels": [
                    {"label": "בראשית ב ב"},
                    {"label": "בראשית פרק ב פסוק ב"}
                ]
            },
            {
                "uri": "text:tanach-2-1-1", "text": "...",
                "labels": [
                    {"label": "שמות א א"},
                    {"label": "שמות פרק א פסוק א"}
                ]
            },
            {
                "uri": "text:tanach-2-1-2", "text": "...",
                "labels": [
                    {"label": "שמות א ב"},
                    {"label": "שמות פרק א פסוק ב"}
                ]
            },
            {
                "uri": "text:tanach-2-1-3", "text": "...",
                "labels": [
                    {"label": "שמות א ג"},
                    {"label": "שמות פרק א פסוק ג"}
                ]
            },
            {
                "uri": "text:tanach-2-1-4", "text": "...",
                "labels": [
                    {"label": "שמות א ד"},
                    {"label": "שמות פרק א פסוק ד"}
                ]
            }

        ]
    };
    vm.labelsDB = angular.toJson(vm.labelsDBjson);
    vm.text = "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla\n" +
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla";
    vm.taggedText = vm.text;
    vm.filter = "";
}]);