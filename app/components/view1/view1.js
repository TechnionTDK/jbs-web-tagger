'use strict';

angular.module('myApp.view1', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'components/view1/view1.html',
            controller: 'View1Ctrl',
            controllerAs: 'vm'
        });
    }])
    .controller('View1Ctrl', function ($rootScope, $scope, $http, $sce, $timeout, $uibModal, $window) {
        var vm = this;

        vm.updateSelectedText = updateSelectedText;
        vm.updateFilter = updateFilter;
        vm.tag = tag;
        vm.removeTag = removeTag;
        vm.loadNextText = loadNextText;
        vm.loadPrevText = loadPrevText;
        vm.openText = openText;
        vm.saveText = saveText;
        vm.isSelectionValid = isSelectionValid;
        vm.showContent = showContent;

        vm.log = true;
        vm.loading = false;
        vm.selectedIndex = 0;
        vm.startOffset = -1;
        vm.endOffset = -1;
        vm.filter = "";
        vm.labelsDBjson = {};
        vm.labelsDBjson.subjects = [];
        vm.labelsDB = angular.toJson(vm.labelsDBjson);
        vm.activeTags = [];
        vm.textArray = [];
        vm.textTags = [];
        vm.highlightedText = {};
        vm.currentSelectedFilter = -1;
        vm.textNumber = 0;
        vm.stateWorking = true;
        vm.stateLoadingText = false;

        activate();

        //////////////////////////////////////////

        function activate() {
        	if (vm.log) console.log("** activate (begin) **");
            createDownAction();
            loadLabels();
            loadText();
        	if (vm.log) console.log("** activate (end) **");
        }

        function showContent(fileContent){
            vm.content = fileContent;
        }
        function clearSelection() {
            vm.startOffset = -1;
            vm.endOffset = -1;
            vm.highlightedText = []
        }
        function loadPrevText() {
            clearSelection();
            if (vm.textNumber > 0) {
                unloadSingleText();
                --vm.textNumber;
                loadSingleText();
            }
        }

        function loadNextText() {
            clearSelection();
            if (vm.textNumber < vm.texts.length) {
                unloadSingleText();
                ++vm.textNumber;
                loadSingleText();
            }
        }


        function createDownAction() {
            $rootScope.down = function (e) {
                if (e.keyCode === 40 && isSelectionValid()) //down
                {
                    if (vm.lim >= 0) {
                        vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = false;
                        vm.currentSelectedFilter = vm.currentSelectedFilter + 1;
                        if (vm.currentSelectedFilter > vm.lim) vm.currentSelectedFilter = 0;
                        vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = true;
                    }
                }
                else if (e.keyCode === 38) //up
                {
                    if (vm.lim >= 0) {
                        vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = false;
                        vm.currentSelectedFilter = vm.currentSelectedFilter - 1;
                        if (vm.currentSelectedFilter < 0) vm.currentSelectedFilter = vm.lim;
                        vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter].selected = true;
                    }
                }
                else if (e.keyCode === 13) //enter
                {
                    if (vm.lim >= 0) {

                        vm.tag(vm.labelsDBjsonFiltered.subjects[vm.currentSelectedFilter]);
                        clearSelection();
                    }
                }
            };
        }

        function loadLabels() {
            $http({
                method: 'GET',
                url: 'http://localhost:8000/data/'
            }).then(function (response) {
                vm.files = response.data;
                vm.files.replace(/>/g, ' ').replace(/</g, ' ').split(' ').forEach(function (file) {
                    if (file.endsWith('.json')) {
                        $http({
                            method: 'GET',
                            url: 'http://localhost:8000/data/' + file
                        }).then(function (content) {
                            vm.labelsDBjson.subjects = vm.labelsDBjson.subjects.concat(content.data.subjects);
                        }, errorCallback);
                    }
                });
            }, errorCallback);

            function errorCallback(response) {
                if (vm.log) console.log("** activate - get data - " + angular.toJson(response));
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }
        }

        function isSelectionValid() {
        	if (vm.log) console.log("** isSelectionValid (begin) **");
            return vm.startOffset >= 0 && vm.endOffset >= 0;
        }

        function unloadSingleText() {
            var titles = {};
            vm.texts[vm.textNumber].tagsInternal = [];
            for (var i in vm.textTags)
            {
                for (var t = 0; t < vm.textTags[i].length; t++)
                {
                    var tag = vm.textTags[i][t];
                    if (!titles[tag.id])
                    {
                        titles[tag.id] = true;
                        vm.texts[vm.textNumber].tagsInternal.push(tag);
                    }
                }
            }
        }

        function loadSingleText() {
            vm.text = vm.texts[vm.textNumber].text;
            var tags = {};

            if (vm.texts[vm.textNumber].tagsInternal)
            {
                for (var i in vm.texts[vm.textNumber].tagsInternal)
                {
                    var tag = vm.texts[vm.textNumber].tagsInternal[i];
                    var startIndex = tag.startIndex;
                    var endIndex = tag.endIndex;

                    for (var j = startIndex; j <= endIndex; j++)
                    {
                        if (!tags[j]) tags[j] = [];
                        tags[j].push(tag);
                    }
                }
            }
            vm.textArray = vm.text.split('');
            vm.templateUrl = 'popoverTemplate.html';
            vm.textArray.forEach(function (char, index) {
                vm.textTags[index] = tags[index] || [];

                var cl = 'ng-class="(vm.highlightedText[' + index + ']) ? \'highlighted-text\' : \'\'"';
                vm.textArray[index] = '<span ' + cl + '>' +
                    '<span ng-show="vm.textTags[' + index + '].length > 0">' +
                    '<a class="tagged-text" id="text_' + index + '_tagged" ng-click="vm.selectedIndex=' + index + '" uib-popover-template="vm.templateUrl" popover-trigger="\'outsideClick\'" popover-append-to-body="true" popover-placement="bottom">' +
                    char +
                    '</a>' +
                    '</span>' +
                    '<span id="text_' + index + '_untagged" ng-hide="vm.textTags[' + index + '].length > 0">' +
                    char +
                    '</span>' +
                    '</span>';
                vm.maxIndex = index;
            });
            vm.taggedText = $sce.trustAsHtml(vm.textArray.join(''));
        }

        function loadText(content) {
            if (!content)
            {
                vm.texts = [];
            }
            else
            {
                var data = JSON.parse(content);
                vm.texts = data.subjects;

                vm.texts.forEach(function (text) {
                    text.tagsInternal = [];
                });
                clearSelection();
                loadSingleText();
                
            }
            vm.loading = false;
        }

        function removeTag(index) {
        	if (vm.log) console.log("** removeTag (begin) **");
            var tag = vm.textTags[vm.selectedIndex][index];
            for (var i = tag.startIndex; i <= tag.endIndex; ++i) {
                vm.textTags[i] = _.without(vm.textTags[i], tag);
            }
            if (vm.log) console.log("** removeTag (end) **");
        }

        function updateSelectedText() {
            var sel = window.getSelection();

            function isWhiteSpace(index) {
                return vm.text[index] === " " || vm.text[index] === "\n";
            }

            function checkLeadingSpaces() {
                return vm.startOffset < vm.maxIndex && isWhiteSpace(vm.startOffset);
            }

            function checkForStart() {
                return vm.startOffset >= 0 && !isWhiteSpace(vm.startOffset);
            }

            function checkEndingSpaces() {
                return vm.endOffset && isWhiteSpace(vm.endOffset);
            }

            function checkForEnd() {
                return vm.endOffset <= vm.maxIndex && !isWhiteSpace(vm.endOffset);
            }

            if (sel)
            {
            	var a = sel.getRangeAt(0).startContainer.parentNode.id;
            	var b = sel.getRangeAt(0).endContainer.parentNode.id;
            	
            	if (a.indexOf('text_') === 0 && b.indexOf('text_') === 0)
            	{
            		a = a.split("_")[1];
            		b = b.split("_")[1];
            		vm.startOffset = Number(a);
            		vm.endOffset = Number(b);

            		//fix to the left
            		while (checkLeadingSpaces())
            		{
            			vm.startOffset++;
            		}
        			while (checkForStart())
        			{
        				vm.startOffset--;
        			}
        			vm.startOffset++;
            		//fix to the right
            		while (checkEndingSpaces())
            		{
            			vm.endOffset--;
            		}
        			while (checkForEnd())
        			{
        				vm.endOffset++;
        			}
        			
        			vm.highlightedText = {};
        			for (var i = vm.startOffset; i < vm.endOffset; i++)
        			{
        				vm.highlightedText[i] = true;
        			}
            	}
            }
            $window.getSelection().removeAllRanges();
        }

        function updateFilter() {
        	if (vm.log) console.log("** updateFilter (begin) **");
            vm.labelsDBjsonFiltered = {"subjects": []};
            vm.labelsDBjsonFiltered.subjects = [];
            if (vm.filter.length > 0) {
                vm.labelsDBjson.subjects.forEach(function (titlesObj) {
                    titlesObj.titles.every(function (title) {
                        if (title.title.includes(vm.filter)) {
                            vm.labelsDBjsonFiltered.subjects.push(titlesObj);
                            return false;
                        }
                        return true;
                    });
                });
            }
            vm.lim = Math.min(vm.labelsDBjsonFiltered.subjects.length, 10) - 1;
            if (vm.labelsDBjsonFiltered.subjects.length > 0)
            {
            	if (vm.currentSelectedFilter === -1)
            	{
            		vm.currentSelectedFilter = 0;
            	}
            	else if (vm.currentSelectedFilter > vm.lim)
            	{
            		vm.currentSelectedFilter = vm.lim;
            	}
            }
            
            for (var i = 0; i<= vm.lim; i++) {
            	vm.labelsDBjsonFiltered.subjects[i].selected = (vm.currentSelectedFilter === i);
            }
        	if (vm.log) console.log("** updateFilter (end) **");
        }

        function tag(titlesObj) {
        	if (vm.log) console.log("** tag (begin) **");
            if (vm.startOffset >= 0 && vm.endOffset > 0) {
                var title = {};
                title.id = titlesObj.$$hashKey + "_" + vm.startOffset + "_" + (vm.endOffset -1);
                title.startIndex = vm.startOffset;
                title.endIndex = vm.endOffset - 1;
                title.title = titlesObj.titles[0].title;
                title.text = vm.text.substring(vm.startOffset,vm.endOffset);
                title.object = titlesObj;
                for (var i = title.startIndex; i < vm.endOffset; i++)
                {
                	vm.textTags[i].push(title);
                }
            }
        	if (vm.log) console.log("** tag (end) **");
        }
        
        function openText() {
            var el = document.getElementById('fileReaderButton');
            $("#fileReaderButton").on('change',function(){
                 vm.loading = true;
                 $timeout(function() {
                    loadText(vm.content);
                 }, 1000);
            });
            el.click();
        }

        function saveText() {
            console.log("saveText");
            unloadSingleText();

            var res = [];
            vm.texts.forEach(function (text) {
                var resObj = {};
                resObj.text = text.text;
                resObj.title = text.title;
                resObj.type = text.type;
                resObj.uri = text.uri;
                resObj.tags = [];

                text.tagsInternal.forEach(function (tagInternal) {
                    var tag = {};
                    tag.span = [tagInternal.startIndex, tagInternal.endIndex];
                    tag.uri = tagInternal.object.uri;
                    resObj.tags.push(tag);
                });
                res.push(resObj);
            });
            
            var data = JSON.stringify({subjects:res}, undefined, 2);
            var blob = new Blob([data], {type: 'text/json'});
            var filename = "oren.json";
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else{
              var e = document.createEvent('MouseEvents'),
                  a = document.createElement('a');

              a.download = filename;
              a.href = window.URL.createObjectURL(blob);
              a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
              e.initEvent('click', true, false, window,
                  0, 0, 0, 0, 0, false, false, false, false, 0, null);
              a.dispatchEvent(e);
            }
        }
    });

