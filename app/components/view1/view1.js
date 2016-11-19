'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'components/view1/view1.html',
            controller: 'View1Ctrl',
            controllerAs: 'vm'
        });
    }])

    .controller('View1Ctrl', ['$rootScope', '$scope', '$http', '$document', function ($rootScope, $scope, $http, $document) {

        var vm = this;

        vm.isTagScreenOn = false;


        $rootScope.down = function(e) 
        {
            if (e.keyCode === 84 && isSelectionValid() && !vm.isTagScreenOn)
            {
                showTagScreen();               
            }
            if (e.keyCode === 27 && isSelectionValid() && vm.isTagScreenOn)
            {
                closeTagScreen();
            }
        };


        function showTagScreen() 
        {
            console.log("<show tag screen>");
            vm.isTagScreenOn = true;
        }

        function closeTagScreen() 
        {
            console.log("<close tag screen>");
            vm.isTagScreenOn = false;
        }




        function isSelectionValid() {
            return vm.startOffset >= 0 && vm.endOffset >= 0;
        }



        var div = $document[0].getElementById('tagsDiv');

        vm.activeTags = [];
        vm.state = 0; //before any load

        vm.loadLabelsDB = loadLabelsDB;
        vm.loadText = loadText;
        vm.updateSelectedText = updateSelectedText;
        vm.updateFilter = updateFilter;
        vm.tag = tag;
        vm.showTagsDiv = showTagsDiv;

        vm.startOffset = -1;
        vm.endOffset = -1;
        vm.freezeDiv = false;
        vm.filter = "";
        vm.labelsDBjson = {"subjects": []};
        vm.labelsDB = angular.toJson(vm.labelsDBjson);

        //vm.hoveredPart = {tags:[]};
        activate();

        //////////////////////////////////////////

        function activate() {
            $http({
                method: 'GET',
                url: 'http://localhost:8000/data/book1.json'
            }).then(function successCallback(response) {
                vm.labelsDBjson = response.data;
                vm.labelsDB = angular.toJson(response.data);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            vm.text = "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה\n" +
                "בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה";

            vm.taggedText = [
                {
                    text: vm.text,
                    i: 0,
                    length: vm.text.length,
                    tags: []
                }
            ];

            vm.loadLabelsDB();
            vm.loadText();
        }

        function loadLabelsDB() {
            vm.state = 1;
            vm.labelsDBjson = JSON.parse(vm.labelsDB);
            vm.labelsDBjsonFiltered = {"collection": []};
        }

        function loadText() {
            vm.state = 2;
            for (var i in vm.taggedText)
            {
                vm.taggedText[i].id = "text_" + i;
            }
        }

        function updateSelectedText() {
            console.log("<updateSelectedText>")
            var flag = 0;
            var sel = window.getSelection();
            vm.startOffset = -1;
            vm.endOffset = -1;

            for (var i = 0; i < sel.rangeCount; i++) {

                var s = sel.getRangeAt(i).startContainer.parentNode.id;
                var e = sel.getRangeAt(i).endContainer.parentNode.id;
                // console.log(i,s,e,sel);
                console.log(s)
                if (s.startsWith("text_")) flag = 1;
                if (flag = 1 && e.startsWith("text_") || e === "child") flag = 2;
                if (flag === 2) {
                    vm.startOffset = sel.getRangeAt(i).startOffset;
                    vm.endOffset = sel.getRangeAt(i).endOffset;
                }
            }
            if (flag === 2) {
                //console.log(vm.text.substring(startOffset, endOffset))
            }
            console.log("vm.startOffset = " + vm.startOffset)
            console.log("vm.endOffset = " + vm.endOffset)
        }

        function updateFilter() {

            vm.labelsDBjsonFiltered = {"subjects": []};
            vm.labelsDBjsonFiltered.subjects = [];
            if (vm.filter.length > 0) {
                vm.labelsDBjson.subjects.forEach(function (titleslObj) {
                    titleslObj.titles.every(function (title) {
                        if (title.title.includes(vm.filter)) {
                            vm.labelsDBjsonFiltered.subjects.push(titleslObj);
                            return false;
                        }
                        return true;
                    });
                });
            }
        }

        function tag(titlesObj) {
            if (vm.startOffset >= 0 && vm.endOffset >= 0) {
                var activeTag = {};
                activeTag.start = vm.startOffset;
                activeTag.length = vm.endOffset - vm.startOffset + 1;
                activeTag.tag = titlesObj;
                console.log('oren');

                for (var i = 0; i < vm.taggedText.length; i++) {
                    var textObj = vm.taggedText[i];

                    if (vm.startOffset === textObj.i)															// tagging from start of part
                    {
                        console.log('case 1');
                        var tmp = [];
                        for (var j = 0; j < i; j++) {
                            tmp.push(vm.taggedText[j]);
                        }
                        var txtObj1 = {};
                        txtObj1.text = textObj.text.substring(0, vm.endOffset - vm.startOffset + 1);
                        txtObj1.i = textObj.i;
                        txtObj1.length = txtObj1.text.length;
                        txtObj1.tags = [];
                        for (var t in textObj.tags) {
                            txtObj1.tags.push(textObj.tags[t]);
                        }
                        txtObj1.tags.push(titlesObj);
                        tmp.push(txtObj1);
                        var txtObj2 = {};
                        txtObj2.text = textObj.text.substring(vm.endOffset - vm.startOffset + 1);
                        txtObj2.i = textObj.i + txtObj1.length;
                        txtObj2.length = txtObj2.text.length;
                        txtObj2.tags = [];
                        for (var t in textObj.tags) {
                            txtObj2.tags.push(textObj.tags[t]);
                        }
                        tmp.push(txtObj2);
                        for (var j = i + 1; j < vm.taggedText.length; j++) {
                            tmp.push(vm.taggedText[j]);
                        }
                        vm.taggedText = tmp;
                    }
                    else if (vm.startOffset > textObj.i && vm.endOffset < (textObj.i + textObj.length))		// tagging inside a text part
                    {
                        console.log('case 2');
                        var tmp = [];
                        for (var j = 0; j < i; j++) {
                            tmp.push(vm.taggedText[j]);
                        }
                        var i = textObj.i;
                        var a0 = 0;
                        var b0 = vm.startOffset - textObj.i;
                        var a1 = vm.startOffset - textObj.i;
                        var b1 = vm.endOffset - textObj.i;
                        var a2 = vm.endOffset - textObj.i;
                        var txtObj0 = {};
                        var txtObj1 = {};
                        var txtObj2 = {};
                        txtObj0.text = textObj.text.substring(a0, b0);
                        txtObj1.text = textObj.text.substring(a1, b1);
                        txtObj2.text = textObj.text.substring(a2);
                        txtObj0.i = textObj.i;
                        txtObj1.i = textObj.i + a1;
                        txtObj2.i = textObj.i + a2;
                        txtObj0.length = txtObj0.text.length;
                        txtObj1.length = txtObj1.text.length;
                        txtObj2.length = txtObj2.text.length;
                        txtObj0.tags = [];
                        txtObj1.tags = [];
                        txtObj2.tags = [];
                        for (var t in textObj.tags) {
                            txtObj0.tags.push(textObj.tags[t]);
                            txtObj1.tags.push(textObj.tags[t]);
                            txtObj2.tags.push(textObj.tags[t]);
                        }
                        txtObj1.tags.push(titlesObj);
                        tmp.push(txtObj0);
                        tmp.push(txtObj1);
                        tmp.push(txtObj2);
                        for (var j = i + 1; j < vm.taggedText.length; j++) {
                            tmp.push(vm.taggedText[j]);
                        }
                        vm.taggedText = tmp;
                    }
                    else if (vm.startOffset > textObj.i && vm.endOffset === (textObj.i + textObj.length))	// tagging from inside to the end of text part
                    {
                        console.log('case 3', vm.startOffset, vm.endOffset);
                        var tmp = [];
                        for (var j = 0; j < i; j++) {
                            tmp.push(vm.taggedText[j]);
                        }
                        var i = textObj.i;
                        var a0 = 0;
                        var b0 = vm.startOffset - textObj.i;
                        var a1 = vm.startOffset - textObj.i;
                        var txtObj0 = {};
                        var txtObj1 = {};
                        txtObj0.text = textObj.text.substring(a0, b0);
                        txtObj1.text = textObj.text.substring(a1);
                        txtObj0.i = textObj.i;
                        txtObj1.i = textObj.i + a1;
                        txtObj0.length = txtObj0.text.length;
                        txtObj1.length = txtObj1.text.length;
                        txtObj0.tags = [];
                        txtObj1.tags = [];
                        textObj.tags.forEach(function (tag) {
                            txtObj0.tags.push(tag);
                            txtObj1.tags.push(tag);
                        });
                        txtObj1.tags.push(titlesObj);
                        tmp.push(txtObj0);
                        tmp.push(txtObj1);
                        vm.taggedText.forEach(function (taggedText) {
                            tmp.push(taggedText);
                        });
                        vm.taggedText = tmp;

                    }
                    else if (vm.startOffset === textObj.i && vm.endOffset === (textObj.i + textObj.length))	// tagging all the text part
                    {
                        console.log('case 4');
                        textObj.tags.push(titlesObj);
                    }
                    else {
                        continue;
                    }
                    vm.taggedText.forEach(function (taggedText, index) {
                        taggedText.id = "text_" + index;
                    });
                    break;
                }

                vm.activeTags.push(activeTag);
                closeTagScreen();

            }
        }

        /*******************************************************************************************************************
         * Methods name :    mover
         * ******************************************************************************************************************
         * Description  :    This method will handle mouse over show of hover div
         * input params :    -
         * ******************************************************************************************************************/
        function showTagsDiv(event, text) {
            if (text.tags.length > 0) {
                vm.freezeDiv = false;
                var x = event.clientX - 70;
                var y = event.clientY + 30;
                div.style.visibility = 'visible';
                div.style.top = y + 30;
                div.style.left = x - 70;
                div.style["top"] = y + "px";
                div.style["left"] = x + "px";
                vm.hoveredPart = text;
            }
        }

        /*******************************************************************************************************************
         * Methods name :    mleave
         * ******************************************************************************************************************
         * Description  :    This method will handle mouse leave hide of hover div
         * input params :    -
         * ******************************************************************************************************************/
        vm.hideTagsDiv = function (event, text) {
            if (!vm.freezeDiv && text.tags.length > 0) {
                div.style.visibility = 'hidden';
                vm.hoveredPart = {tags: []};
            }
        };


        vm.RemoveTag = function (tag) {
            console.log(vm.hoveredPart, tag);
            var newTags = [];
            vm.hoveredPart.tags.forEach(function (newTag) {
                if (newTag !== tag) {
                    newTags.push(newTag);
                }
            });
            vm.hoveredPart.tags = newTags;
            vm.fixTexts();
            vm.freezeDiv = false;
            div.style.visibility = 'hidden';
            vm.hoveredPart = {tags: []};
        };


        vm.fixTexts = function () {
            var newTaggedText = [];
            var skipNext = false;
            vm.taggedText.forEach(function (text, index) {
                if (skipNext) {
                    skipNext = false;
                    return;
                }
                if (index === vm.taggedText.length - 1) {
                    newTaggedText.push(text);
                }
                else {
                    var nextText = vm.taggedText[index + 1];

                    if (text.tags.length === 0 && nextText.tags.length === 0) {
                        text.text = text.text + nextText.text;
                        text.length = text.length + nextText.length;
                        nextText.text = "";
                        nextText.length = text.i + text.length;
                        skipNext = true;
                    }
                }
                newTaggedText.push(text);
            });
            vm.taggedText = newTaggedText;
            vm.taggedText.forEach(function (text) {
                console.log(text.$$hashKey, text.i, text.length);
            });
        };
    }]);