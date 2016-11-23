(function (angular, undefined) {
    'use strict';
    var DEFAULT_MENU = [
        [
            'code',
            'google_format'
        ],
        [
            'bold',
            'italic',
            'underline',
            'strikethrough'
        ],
        ['font-size'],
        [
            'font-color',
            'hilite-color'
        ],
        [
            'left-justify',
            'center-justify',
            'right-justify'
        ]
    ];

    DEFAULT_MENU.last().classes = "hide-xs";
    DEFAULT_MENU[2].classes = "hide-xs";

    angular.module('app').directive('textEditor', [
        '$timeout',
        'wysiwgGui',
        '$compile',
        '$interval',
        function ($timeout, wysiwgGui, $compile) {
            return {
                template: '<div class="toolbar"></div>' + '<div id="{{textareaId}}" contentEditable="{{!disabled}}" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>',
                restrict: 'E',
                scope: {
                    value: '=ngModel',
                    textareaName: '@textareaName',
                    textareaClass: '@textareaClass',
                    textareaRequired: '@textareaRequired',
                    textareaId: '@textareaId',
                    textareaMenu: '=textareaMenu',
                    textareaCustomMenu: '=textareaCustomMenu',
                    fn: '&',
                    disabled: '=?disabled'
                },
                require: 'ngModel',
                link: link,
                transclude: true
            };
            function link(scope, element, attrs, ngModelController) {
                var textarea = element.find('div.wysiwyg-textarea');
                scope.isLink = false;
                scope.fontSizes = [
                    {
                        value: '1',
                        size: '10px'
                    },
                    {
                        value: '2',
                        size: '14px'
                    },
                    {
                        value: '3',
                        size: '16px'
                    },
                    {
                        value: '4',
                        size: '18px'
                    },
                    {
                        value: '5',
                        size: '24px'
                    },
                    {
                        value: '6',
                        size: '32px'
                    },
                    {
                        value: '7',
                        size: '48px'
                    }
                ];
                scope.formatBlocks = [
                    {
                        name: 'Heading Blocks',
                        value: 'div'
                    },
                    {
                        name: 'Heading 1',
                        value: 'h1'
                    },
                    {
                        name: 'Heading 2',
                        value: 'h2'
                    },
                    {
                        name: 'Heading 3',
                        value: 'h3'
                    },
                    {
                        name: 'Heading 4',
                        value: 'h4'
                    },
                    {
                        name: 'Heading 5',
                        value: 'h5'
                    },
                    {
                        name: 'Heading 6',
                        value: 'h6'
                    }
                ];
                scope.formatBlock = scope.formatBlocks[0];
                scope.fontSize = scope.fontSizes[1];
                if (angular.isArray(scope.cssClasses)) {
                    scope.cssClasses.unshift('css');
                    scope.cssClass = scope.cssClasses[0];
                }
                scope.fonts = [
                    'Georgia',
                    'Palatino Linotype',
                    'Times New Roman',
                    'Arial',
                    'Helvetica',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Sans Unicode',
                    'Tahoma',
                    'Trebuchet MS',
                    'Verdana',
                    'Courier New',
                    'Lucida Console',
                    'Helvetica Neue'
                ].sort();
                scope.font = scope.fonts[6];
                init();
                function init() {
                    compileMenu();
                    configureDisabledWatch();
                    configureListeners();
                }

                function compileMenu() {
                    wysiwgGui.setCustomElements(scope.textareaCustomMenu);
                    var menuDiv = element.children('div.toolbar')[0];
                    menuDiv.appendChild(wysiwgGui.createMenu(scope.textareaMenu));
                    $compile(menuDiv)(scope);
                }

                function configureDisabledWatch() {
                    scope.$watch('disabled', function (newValue) {
                        angular.element('div.toolbar').find('button').each(function () {
                            angular.element(this).attr('disabled', newValue);
                        });
                        angular.element('div.toolbar').find('select').each(function () {
                            angular.element(this).attr('disabled', newValue);
                        });
                    });
                }

                function configureListeners() {
                    //Send message to calling controller that a button has been clicked.
                    angular.element('.toolbar').find('button').on('click', function () {
                        var title = angular.element(this);
                        scope.$emit('wysiwyg.click', title.attr('title') || title.attr('data-original-title'));
                    });
                    textarea.on('input keyup paste mouseup', function () {
                        var html = textarea.html();
                        if (html === '<br>') {
                            html = '';
                        }
                        ngModelController.$setViewValue(html);
                    });
                    textarea.on('keydown', function (event) {
                        var sel, range, node;
                        if (event.keyCode === 9) {
                            sel = window.getSelection();
                            range = sel.getRangeAt(0);

                            node = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
                            range.insertNode(node);
                            range.setStartAfter(node);
                            range.setEndAfter(node);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            event.preventDefault();
                            return false;
                        }
                        if (event.keyCode === 13) {
                            if (!scope.isPre) {
                                return;
                            }
                            sel = window.getSelection();
                            range = sel.getRangeAt(0);
                            node = document.createTextNode("\n");
                            range.insertNode(node);
                            range.setStartAfter(node);
                            range.setEndAfter(node);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            event.preventDefault();
                        }
                    });

                    textarea.on('click keyup focus mouseup', function () {
                        $timeout(function () {
                            scope.isBold = scope.cmdState('bold');
                            scope.isUnderlined = scope.cmdState('underline');
                            scope.isStrikethrough = scope.cmdState('strikethrough');
                            scope.isItalic = scope.cmdState('italic');
                            scope.isSuperscript = itemIs('SUP');
                            //scope.cmdState('superscript');
                            scope.isSubscript = itemIs('SUB');
                            //scope.cmdState('subscript');
                            scope.isRightJustified = scope.cmdState('justifyright');
                            scope.isLeftJustified = scope.cmdState('justifyleft');
                            scope.isCenterJustified = scope.cmdState('justifycenter');
                            scope.isPre = scope.cmdValue('formatblock') === 'pre';
                            scope.isBlockquote = scope.cmdValue('formatblock') === 'blockquote';
                            scope.isOrderedList = scope.cmdState('insertorderedlist');
                            scope.isUnorderedList = scope.cmdState('insertunorderedlist');
                            scope.fonts.forEach(function (v) {
                                //works but kinda crappy.
                                if (scope.cmdValue('fontname').indexOf(v) > -1) {
                                    scope.font = v;
                                    return false;
                                }
                            });
                            scope.cmdValue('formatblock').toLowerCase();
                            scope.formatBlocks.forEach(function (v) {
                                if (scope.cmdValue('formatblock').toLowerCase() === v.value.toLowerCase()) {
                                    scope.formatBlock = v;
                                    return false;
                                }
                            });
                            scope.fontSizes.forEach(function (v) {
                                if (scope.cmdValue('fontsize') === v.value) {
                                    scope.fontSize = v;
                                    return false;
                                }
                            });
                            scope.hiliteColor = getHiliteColor();
                            element.find('button.wysiwyg-hiliteColor').css('background-color', scope.hiliteColor);
                            scope.fontColor = scope.cmdValue('forecolor');
                            element.find('button.wysiwyg-fontcolor').css('color', scope.fontColor);
                            scope.isLink = itemIs('A');
                        }, 0);
                    });
                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function itemIs(tag) {
                    if (!window.getSelection() || window.getSelection().rangeCount === 0)
                        return false;
                    var selection = window.getSelection().getRangeAt(0);
                    if (!selection)
                        return false;
                    return selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase();
                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function getHiliteColor() {
                    if (!window.getSelection() || window.getSelection().rangeCount === 0)
                        return false;
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        var style = angular.element(selection.startContainer.parentNode).attr('style');
                        if (!angular.isDefined(style))
                            return false;
                        var a = style.split(';');
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].split(':');
                            if (s[0] === 'background-color') {
                                return s[1].substr(1);
                            }
                        }
                        return 'rgb(255, 255, 255)';
                    } else {
                        return 'rgb(255, 255, 255)';
                    }
                }

                // model -> view
                ngModelController.$render = function () {
                    textarea.html(ngModelController.$viewValue);
                };
                scope.format = function (cmd, arg) {
                    document.execCommand(cmd, false, arg);
                };

                scope.codilize = function () {
                    if (scope.isPre)
                        return;
                    scope.format('formatBlock', 'pre');
                };

                scope.codePrettify = function () {
                    element.find('pre').each(function (key, c) {
                        var child = $(c);
                        if (!child.hasClass("prettyprint")) {
                            child.addClass("prettyprint linenums");
                        } else {
                            var value = "";
                            child.find("ol li").each((key, v)=> {
                                value += $(v).text().replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
                            });
                            child.html(value);
                        }
                        child.removeClass('prettyprinted');
                    });
                    PR.prettyPrint();
                };


                scope.cmdState = function (cmd) {
                    return document.queryCommandState(cmd);
                };
                scope.cmdValue = function (cmd) {
                    return document.queryCommandValue(cmd);
                };
                scope.createLink = function () {
                    // var input = prompt('Enter the link URL');
                    // if (input && input !== undefined)
                    //     scope.format('createlink', input);
                };
                scope.insertImage = function () {
                    // var input = prompt('Enter the image URL');
                    // if (input && input !== undefined)
                    //     scope.format('insertimage', input);
                };
                scope.setFont = function () {
                    scope.format('fontname', scope.font);
                };
                scope.setFontSize = function (fontSize) {
                    scope.format('fontsize', fontSize.value);
                };
                scope.setFormatBlock = function () {
                    scope.format('formatBlock', scope.formatBlock.value);
                };
                scope.setFontColor = function () {
                    if (!scope.fontColor)
                        return;
                    scope.format('forecolor', scope.fontColor);
                    if (!scope.hiliteColor)
                        return;
                    scope.format('hiliteColor', scope.hiliteColor);
                };
                scope.setHiliteColor = function () {
                    if (!scope.hiliteColor)
                        return;
                    scope.format('hiliteColor', scope.hiliteColor);
                    if (!scope.fontColor)
                        return;
                    scope.format('forecolor', scope.fontColor);
                };
                scope.format('enableobjectresizing', true);
                scope.format('styleWithCSS', true);
            }
        }
    ]).factory('wysiwgGui', [
        'wysiwgGuiElements',
        function (wysiwgGuiElements) {
            var ELEMENTS = wysiwgGuiElements;
            var custom = {};
            var setCustomElements = function (el) {
                custom = el;
            };
            var getMenuGroup = function (menu) {
                var result = {
                    tag: 'div',
                    classes: 'btn-group btn-group-sm wysiwyg-btn-group-margin'
                };
                if (menu.classes)
                    result.classes += " " + menu.classes;
                return result;
            };
            var getMenuItem = function (item) {
                return ELEMENTS[item] || {};
            };
            var createMenu = function (menu) {
                angular.extend(ELEMENTS, custom);
                //Get the default menu or the passed in menu
                if (!angular.isDefined(menu) || menu === '') {
                    menu = DEFAULT_MENU;
                }
                //create div to add everything to.
                var startDiv = document.createElement('div');
                var el;
                for (var i = 0; i < menu.length; i++) {
                    var menuGroup = create(getMenuGroup(menu[i]));
                    for (var j = 0; j < menu[i].length; j++) {
                        //link has two functions link and unlink
                        if (menu[i][j] === 'link') {
                            el = create(getMenuItem('unlink'));
                            menuGroup.appendChild(el);
                        }
                        el = create(getMenuItem(menu[i][j]));
                        menuGroup.appendChild(el);
                    }
                    startDiv.appendChild(menuGroup);
                }
                return startDiv;
            };

            function create(obj) {
                var el;
                if (obj.tag) {
                    el = document.createElement(obj.tag);
                } else if (obj.text) {
                    el = document.createElement('span');
                } else {
                    return;
                }
                if (obj.text && document.all) {
                    el.innerText = obj.text;
                } else {
                    el.textContent = obj.text;
                }
                if (obj.classes) {
                    el.className = obj.classes;
                }
                if (obj.html) {
                    el.innerHTML = obj.html;
                }
                if (obj.attributes && obj.attributes.length) {
                    for (var i in obj.attributes) {
                        var attr = obj.attributes[i];
                        if (attr.name && attr.value) {
                            el.setAttribute(attr.name, attr.value);
                        }
                    }
                }
                if (obj.data && obj.data.length) {
                    for (var item in obj.data) {
                        var child = create(obj.data[item]);
                        if (child)
                            el.appendChild(child);
                    }
                }
                return el;
            }

            return {
                createMenu: createMenu,
                setCustomElements: setCustomElements
            };
        }
    ]).value('wysiwgGuiElements', {
        'bold': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '굵게'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'bold\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isBold }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_bold'
            }]
        },
        'italic': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '기울임체'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'italic\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isItalic }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_italic'
            }]
        },
        'underline': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '밑줄'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'underline\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isUnderlined }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_underlined'
            }]
        },
        'strikethrough': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '취소선'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'strikethrough\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isStrikethrough }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_strikethrough'
            }]
        },
        'subscript': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Subscript'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'subscript\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isSubscript }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                classes: 'fa fa-subscript'
            }]
        },
        'superscript': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Superscript'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'superscript\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isSuperscript }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                classes: 'fa fa-superscript'
            }]
        },
        'remove-format': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '스타일 지우기'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'removeFormat\')'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_clear'
            }]
        },
        'ordered-list': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '순서 있는 리스트'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'insertorderedlist\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isOrderedList }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_list_numbered'
            }]
        },
        'unordered-list': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '순서 없는 리스트'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'insertunorderedlist\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isUnorderedList }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_list_bulleted'
            }]
        },
        'outdent': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '내어쓰기'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'outdent\')'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_indent_decrease'
            }]
        },
        'indent': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '들여쓰기'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'indent\')'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_indent_increase'
            }]
        },
        'left-justify': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '왼쪽정렬'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'justifyleft\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isLeftJustified }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_align_left'
            }]
        },
        'center-justify': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '중앙 정렬'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'justifycenter\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isCenterJustified }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_align_center'
            }]
        },
        'right-justify': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '오른쪽 정렬'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'justifyright\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isRightJustified }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_align_right'
            }]
        },
        'code': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '코드 입력'
                },
                {
                    name: 'ng-click',
                    value: 'codilize()'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isPre }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'code'
            }]
        },
        'google_format': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '코드 블락에 라인넘버와 키워드를 표시합니다.'
                },
                {
                    name: 'ng-click',
                    value: 'codePrettify()'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isPre }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'play_arrow',
                classes:'color-grey'
            }]
        },
        'quote': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Quote'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'formatblock\', \'blockquote\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isBlockquote }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'format_quote'
            }]
        },
        'paragraph': {
            tag: 'button',
            classes: 'btn',
            text: 'P',
            attributes: [
                {
                    name: 'title',
                    value: 'Paragragh'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'insertParagraph\')'
                },
                {
                    name: 'ng-class',
                    value: '{ active: isParagraph }'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ]
        },
        'image': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Image'
                },
                {
                    name: 'ng-click',
                    value: 'insertImage()'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'insert_photo'
            }]
        },
        'font-color': {
            tag: 'font-color-picker',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '글자색'
                },
                {
                    name: 'ng-model',
                    value: 'fontColor'
                },
                {
                    name: 'change',
                    value: 'setFontColor'
                }
            ]
        },
        'hilite-color': {
            tag: 'back-color-picker',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: '음영색'
                },
                {
                    name: 'display',
                    value: 'H'
                },
                {
                    name: 'ng-model',
                    value: 'hiliteColor'
                },
                {
                    name: 'change',
                    value: 'setHiliteColor()'
                }
            ]
        },
        'font': {
            tag: 'select',
            classes: 'form-control wysiwyg-select',
            attributes: [
                {
                    name: 'title',
                    value: 'Image'
                },
                {
                    name: 'ng-model',
                    value: 'font'
                },
                {
                    name: 'ng-options',
                    value: 'f for f in fonts'
                },
                {
                    name: 'ng-change',
                    value: 'setFont()'
                }
            ]
        },
        'font-size': {
            tag: 'dropdown',
            attributes: [
                {
                    name: 'title',
                    value: '글자크기'
                },
                {
                    name: 'name',
                    value: 'size'
                },
                {
                    name: 'classes',
                    value: 'btn'
                },
                {
                    name: 'ng-model',
                    value: 'fontSize'
                },
                {
                    name: 'options',
                    value: 'fontSizes'
                },
                {
                    name: 'ng-change',
                    value: 'setFontSize'
                }
            ]
        },
        'format-block': {
            tag: 'select',
            classes: 'form-control wysiwyg-select',
            attributes: [
                {
                    name: 'title',
                    value: 'Format Block'
                },
                {
                    name: 'ng-model',
                    value: 'formatBlock'
                },
                {
                    name: 'ng-options',
                    value: 'f.name for f in formatBlocks'
                },
                {
                    name: 'ng-change',
                    value: 'setFormatBlock()'
                }
            ]
        },
        'link': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Link'
                },
                {
                    name: 'ng-click',
                    value: 'createLink()'
                },
                {
                    name: 'ng-show',
                    value: '!isLink'
                }
            ],
            data: [
                {
                    tag: 'i',
                    text: 'link'
                }
            ]
        },
        'unlink': {
            tag: 'button',
            classes: 'btn',
            attributes: [
                {
                    name: 'title',
                    value: 'Unlink'
                },
                {
                    name: 'ng-click',
                    value: 'format(\'unlink\')'
                },
                {
                    name: 'ng-show',
                    value: 'isLink'
                },
                {
                    name: 'type',
                    value: 'button'
                }
            ],
            data: [{
                tag: 'i',
                text: 'remove'
            }]
        }
    });
}(angular));