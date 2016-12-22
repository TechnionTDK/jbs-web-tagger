'use strict';

angular.module('myApp.view1', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'components/view1/view1.html',
            controller: 'View1Ctrl',
            controllerAs: 'vm'
        });
    }])
    .controller('View1Ctrl', function ($rootScope, $scope, $http, $sce, $timeout, $uibModal, $window, $location, $route) {
        var vm = this;
        vm.labelsDBjsonFiltered = {};
        vm.labelsDBjsonFiltered.subjects = [];
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
        vm.suggestions = [];

        vm.suggestTags = suggestTags;
        vm.prepareSave = prepareSave;
        vm.suggestSave = suggestSave;
        vm.saveSetAll = saveSetAll;
        vm.cancelOpenText = cancelOpenText;
        vm.approveOpenText = approveOpenText;


        vm.suggestionsClose = suggestionsClose;
        vm.suggestionApply = suggestionApply;
        vm.suggestionDissmiss = suggestionDissmiss;
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
            if (vm.textNumber < vm.texts.length - 1) {
                unloadSingleText();
                ++vm.textNumber;
                loadSingleText();
            }
        }


        function createDownAction() {
            $rootScope.down = function (e) {
                console.log(e.keyCode);

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
            var host = $location.host();
            $http({
                method: 'GET',
                url: 'http://' + host + ':8000/data/'
            }).then(function (response) {
                vm.files = response.data;
                vm.files.replace(/>/g, ' ').replace(/</g, ' ').split(' ').forEach(function (file) {
                    if (file.endsWith('.json')) {
                        $http({
                            method: 'GET',
                            url: 'http://' + host + ':8000/data/' + file
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
            vm.wordNumber = [];
            vm.templateUrl = 'popoverTemplate.html';
            var curr_word_num = 1;
            vm.textArray.forEach(function (char, index) {
                vm.textTags[index] = tags[index] || [];
                if (char === ' ') curr_word_num++;
                vm.wordNumber.push(curr_word_num);
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

        function findIndex(wordIndex, last) {
            var curr_word_num = 1;
            for (var i in vm.textArray) {
                if (curr_word_num === Number(wordIndex))
                {
                    if (last)
                    {
                        while (vm.textArray[++i] !== ' ') {}
                        --i;
                    }
                    return i;
                }
                if (vm.textArray[i] === ' ') curr_word_num++;
            }
        }

        function loadText(content) {
            if (!content)
            {
                vm.texts = [];
            }
            else
            {
                vm.loading = true;
                vm.texts = [];
                $timeout(function() {
                    try {
                        var data = JSON.parse(content);
                        vm.texts = data.subjects;

                        vm.texts.forEach(function (text) {
                            text.tagsInternal = [];
                            if (text.tags) {
                                vm.textArray = text.text.split('');
                                text.tags.forEach(function (tag) {
                                    var wordIndexes = tag.span.split('-');
                                    tag.startWord = wordIndexes[0];
                                    tag.endWord = wordIndexes[1];
                                    tag.startIndex = findIndex(wordIndexes[0]);
                                    tag.endIndex = findIndex(wordIndexes[1], true);
                                    tag.text = text.text.substring(tag.startIndex,tag.endIndex+1);
                                    tag.id = tag.object.$$hashKey + "_" + tag.startIndex + "_" + tag.endIndex;
                                    tag.object = findTitle(tag.uri);
                                    tag.title = tag.object.titles[0].title;
                                    text.tagsInternal.push(tag);
                                });
                            }                        
                            clearSelection();
                            loadSingleText();                    
                        });
                    }
                    catch(e) {
                        if (vm.log) console.log(e);
                        $window.alert("Data is corrupted, please fix data and try again - " + e.message);
                        $route.reload();
                    }
                    vm.loading = false;
                }, 10);
                
            }
            
        }

        function findTitle(uri) {
            for (var i in vm.labelsDBjson.subjects) {
                if (vm.labelsDBjson.subjects[i].uri === uri) {
                    return vm.labelsDBjson.subjects[i];
                }
            }
        }

        function removeTag(index) {
        	if (vm.log) console.log("** removeTag (begin) **");
            var tag = vm.textTags[vm.selectedIndex][index];
            for (var i = tag.startIndex; i <= tag.endIndex; ++i) {
                vm.textTags[i] = _.without(vm.textTags[i], tag);
            }
            clearSelection();
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
            console.log(isSelectionValid());
            if (isSelectionValid())
            {
                var el = document.getElementById('tagNameInput');
                $timeout(function() {el.focus();}, 10);
            }
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
                title.startWord = vm.wordNumber[vm.startOffset];
                title.endWord = vm.wordNumber[vm.endOffset-1];
                title.startIndex = vm.startOffset;
                title.endIndex = vm.endOffset - 1;
                title.title = titlesObj.titles[0].title;
                title.text = vm.text.substring(vm.startOffset,vm.endOffset);
                title.object = titlesObj;
                for (var i = title.startIndex; i < vm.endOffset; i++)
                {
                	vm.textTags[i].push(title);
                }
                vm.currTagsCount++;
            }
            else
            {
                console.log("no selection to tag")
            }

            for(var i = 0; i < Math.min(10,vm.labelsDBjsonFiltered.subjects.length); ++i)
            {
                vm.labelsDBjsonFiltered.subjects[i].selected = false;
                
            }
            titlesObj.selected=true;
            clearSelection();

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
                if (text.savingState)
                {
                    var resObj = {};
                    resObj.text = text.text;
                    resObj.titles = text.titles;
                    resObj.type = text.type;
                    resObj.uri = text.uri;
                    resObj.tags = [];

                    text.tagsInternal.forEach(function (tagInternal) {
                        var tag = {};
                        tag.span = "" + tagInternal.startWord + "-" + tagInternal.endWord;
                        tag.uri = tagInternal.object.uri;
                        resObj.tags.push(tag);
                    });
                    res.push(resObj);
                }
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


        function suggestTags() {
            var txt = vm.texts[vm.textNumber].text.split(' ');
            var bracesTo = 0;
            var bracesFrom = 0;
            var quateFrom = 0;
            var quateTo = 0;
            var inQuate = false;
            var inBraces = false;

            vm.suggestions = [];
            for (var i in txt)
            {
                var w = txt[i];
                if (!inBraces && !inQuate && w.startsWith('('))
                {
                    inBraces = true;
                    bracesFrom = i;
                }
                if (inBraces && !inQuate && w.endsWith(')'))
                {
                    inBraces = false;
                    bracesTo = i;
                }
                else if (!inBraces && !inQuate && (w.startsWith('\"') || w.startsWith('\'\'')) && bracesTo == (Number(i) - 1))
                {
                    inQuate = true;
                    quateFrom = i;
                }
                else if (!inBraces && inQuate && (w.endsWith('\"') || w.endsWith('\'\'') || w.endsWith('\".') || w.endsWith('\'\'.')|| w.endsWith('\",') || w.endsWith('\'\',')))
                {
                    inQuate = false;
                    quateTo = i;

                    var currtxt;
                    var partial_1 = {'className' : 'suggested-span'};
                    var partial_2 = {'className' : 'suggested-span'};
                    var partial_3 = {'className' : 'suggested-span'};
                    var partial_4 = {'className' : 'suggested-span'};
                    var partial_5 = {'className' : 'suggested-span'};
                    console.log(bracesFrom,bracesTo,quateFrom,quateTo)
                    // building p1
                    currtxt = [];
                    var c = 0;
                    for (var b = 0; b < Math.min(bracesFrom, quateFrom); b++)
                    {
                        currtxt.push(txt[b]);
                    }
                    partial_1.text = currtxt.join(' ') + ' ';
                    partial_1.index = c;
                    c += partial_1.text.length;
                    // building p2
                    currtxt = [];
                    for (var b = Math.min(bracesFrom, quateFrom); b <= Math.min(bracesTo, quateTo); b++)
                    {
                        currtxt.push(txt[b]);
                    }
                    partial_2.text = currtxt.join(' ');
                    partial_2.index = c;
                    c += partial_2.text.length;
                    partial_2.className += ' suggested-tag-name';
                    currtxt = [];
                    for (var b = (Math.min(bracesTo, quateTo) + 1); b < Math.max(bracesFrom, quateFrom); b++)
                    {
                        currtxt.push(txt[b]);
                    }
                    partial_3.text = (currtxt.length === 0) ? ' ' : ' ' + currtxt.join(' ') + ' ';
                    partial_3.index = c;
                    c += partial_3.text.length;
                    // building p4
                    currtxt = [];
                    for (var b = Math.max(bracesFrom, quateFrom); b <= Math.max(bracesTo, quateTo); b++)
                    {
                        currtxt.push(txt[b]);
                    }
                    partial_4.text = currtxt.join(' ');
                    partial_4.index = c;
                    c += partial_4.text.length;
                    partial_4.className += ' suggested-tag-text';
                    // building p5
                    currtxt = [];
                    for (var b = Math.max(bracesTo, quateTo) + 1; b < txt.length; b++)
                    {
                        currtxt.push(txt[b]);
                    }
                    partial_5.text = (currtxt.length === 0) ? '' : ' ' + currtxt.join(' ');
                    partial_5.index = c;

                    var suggestion = {};
                    suggestion.p1 = partial_1;
                    suggestion.p2 = partial_2;
                    suggestion.p3 = partial_3;
                    suggestion.p4 = partial_4;
                    suggestion.p5 = partial_5;
                    console.log(getTag(suggestion.p2.text));
                    console.log(findTagsByName(getTag(suggestion.p2.text)));

                    suggestion.tags = findTagsByName(getTag(suggestion.p2.text));
                    vm.suggestions.push(suggestion);

                }
            }
            suggestMode();            
        }
        vm.suggestMode = false;
        function suggestMode() {
            if (vm.suggestions.length === 0)
            {
                alert("אין המלצות לטקסט זה");
            }
            else
            {
                vm.suggestMode = true;
                vm.currentSuggestion = 0;
                vm.s = vm.suggestions[vm.currentSuggestion];
            }
        }

        function getTag(source) {
            function escapeRegExp(str) {
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }

            function replaceAll(str, find, replace) {
              return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
            }
            var str = source;
            str = replaceAll(str, "(","");
            str = replaceAll(str, ")","");
            str = replaceAll(str, "-"," ");
            return str;
        }

        function findTagsByName(name) {
            var tags = [];
            vm.labelsDBjson.subjects.forEach(function (titlesObj) {
                titlesObj.titles.every(function (title) {
                    if (title.title.includes(name)) {
                        tags.push(titlesObj);
                        return false;
                    }
                    return true;
                });
            });
            return tags;
        }


        function prepareSave() {
            unloadSingleText();
            vm.savingModalMode = 1;     //1 = show all ; 2 = show only selected
            vm.suggestSave();
        }

        function suggestSave() {
            for (var i in vm.texts)
            {
                vm.texts[i].savingState = (vm.texts[i].tagsInternal.length > 0);
            }
        }

        function saveSetAll(flag) {
            for (var i in vm.texts)
            {
                vm.texts[i].savingState = flag;
            }
        }

        function cancelOpenText() {
            vm.stateWorking = true;
            vm.stateLoadingText = false;    
        }
        
        function approveOpenText() {
            vm.stateWorking = true;
            vm.stateLoadingText = false;    
        }


        function suggestionsClose() {
            vm.suggestions = [];
            vm.suggestMode = false;   
        }
        function suggestionApply() {
            // todo - add tag
            console.log(vm.s);
            vm.startOffset =  vm.s.p4.index; 
            vm.endOffset = vm.s.p5.index;
            tag(vm.s.tags[0]);
            nextSuggestion();
        }
        function suggestionDissmiss() {
            nextSuggestion();   
        }

        function nextSuggestion() {
            vm.currentSuggestion++;
            if (vm.currentSuggestion >= vm.suggestions.length)
            {
                suggestionsClose();
            }
            else
            {
                vm.s = vm.suggestions[vm.currentSuggestion];
            }
        }
});

