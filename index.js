var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var vevet = new Vevet.Application({
    tablet: 1199,
    phone: 899,
    prefix: 'v-',
    viewportResizeTimeout: 100,
    easing: [0.25, 0.1, 0.25, 1]
});
vevet.pageLoad.onLoaded(function () {
    var videoHandler = function () {
        var videoArr = document.querySelectorAll('.video');
        if (videoArr.length === 0) {
            return;
        }
        videoArr.forEach(function (video) {
            if (!video) {
                return;
            }
            var source = video.querySelector('source');
            if (!source) {
                return;
            }
            var dataSrc = source.dataset.src;
            if (!dataSrc) {
                return;
            }
            source.src = dataSrc;
            video.load();
            video.addEventListener('loadeddata', function () {
                setTimeout(function () {
                    video.classList.add('loaded');
                }, 0);
            });
        });
    };
    videoHandler();
    //scrollBarInit
    var scrollBarInit = function () {
        var scrollBar;
        if (!vevet.isMobile) {
            scrollBar = new Vevet.ScrollBar({ container: window });
        }
        return scrollBar;
    };
    scrollBarInit();
    var debounce = function (_a) {
        var callback = _a.callback, _b = _a.wait, wait = _b === void 0 ? 250 : _b, _c = _a.isImmediate, isImmediate = _c === void 0 ? false : _c;
        var timeout;
        return function () {
            var later = function () {
                timeout = undefined;
                callback();
            };
            var isCallNow = isImmediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (isCallNow) {
                callback();
            }
        };
    };
    var makeSlider = function (_a) {
        var container = _a.container, className = _a.className, _b = _a.isThumb, isThumb = _b === void 0 ? false : _b, _c = _a.thumb, thumb = _c === void 0 ? undefined : _c, config = _a.config, paginationType = _a.paginationType, renderBullets = _a.renderBullets;
        if (!container || !className) {
            return undefined;
        }
        var slider = container.querySelector(".".concat(className, "-slider").concat(isThumb ? '-thumb' : '', ".swiper")) || null;
        if (!slider) {
            return undefined;
        }
        var pagination = container.querySelector(".".concat(className, "-slider-pagination"));
        var arrowPrev = container.querySelector(".".concat(className, "-slider").concat(isThumb ? '-thumb' : '', "-controls .").concat(className, "-slider-prev"));
        var arrowNext = container.querySelector(".".concat(className, "-slider").concat(isThumb ? '-thumb' : '', "-controls .").concat(className, "-slider-next"));
        var sliderInit = new Swiper(slider, __assign({ thumbs: {
                swiper: thumb
            }, pagination: {
                el: pagination,
                clickable: true,
                type: paginationType,
                renderBullet: renderBullets
            }, navigation: {
                nextEl: arrowNext,
                prevEl: arrowPrev
            }, slidesPerView: 1, spaceBetween: 30 }, config));
        return sliderInit;
    };
    var swipeToAllHandler = function (array) {
        array.forEach(function (_a) {
            var slider = _a.slider, container = _a.item;
            var paginationContainerArray = container.querySelectorAll('.swipe-to-container');
            if (paginationContainerArray.length === 0) {
                return;
            }
            paginationContainerArray.forEach(function (paginationContainer) {
                var buttonArray = paginationContainer.querySelectorAll('.swipe-to-button');
                if (buttonArray.length === 0) {
                    return;
                }
                buttonArray.forEach(function (button, index) {
                    button.addEventListener('click', function () {
                        array.forEach(function (_a) {
                            var sliderCurrent = _a.slider;
                            if (sliderCurrent.slides.length < index + 1) {
                                sliderCurrent.slideTo(0);
                            }
                            else {
                                sliderCurrent.slideTo(index);
                            }
                        });
                        buttonArray.forEach(function (otherButton) {
                            otherButton.classList.remove('active');
                        });
                        button.classList.add('active');
                    });
                });
                slider.on('slideChange', function (swiper) {
                    buttonArray.forEach(function (button, index) {
                        // findActivePicture(slider);
                        if (swiper.activeIndex === index) {
                            button.classList.add('active');
                        }
                        else {
                            button.classList.remove('active');
                        }
                    });
                });
            });
        });
    };
    var swipeToHandler = function (slider, container) {
        var paginationContainerArray = container.querySelectorAll('.swipe-to-container');
        if (paginationContainerArray.length === 0) {
            return;
        }
        paginationContainerArray.forEach(function (paginationContainer) {
            var buttonArray = paginationContainer.querySelectorAll('.swipe-to-button');
            if (buttonArray.length === 0) {
                return;
            }
            buttonArray.forEach(function (button, index) {
                button.addEventListener('click', function () {
                    if (slider.slides.length < index + 1) {
                        slider.slideTo(0);
                    }
                    else {
                        slider.slideTo(index);
                    }
                    buttonArray.forEach(function (otherButton) {
                        otherButton.classList.remove('active');
                    });
                    button.classList.add('active');
                });
            });
            slider.on('slideChange', function (swiper) {
                buttonArray.forEach(function (button, index) {
                    // findActivePicture(slider);
                    if (swiper.activeIndex === index) {
                        button.classList.add('active');
                    }
                    else {
                        button.classList.remove('active');
                    }
                });
            });
        });
    };
    var sliderActionFormInit = function (sliders) {
        var containerArray = document.querySelectorAll('.action-popup');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (item, sliderIndex) {
            var slider = makeSlider({
                container: item,
                className: 'action-popup',
                config: {
                    effect: 'fade',
                    allowTouchMove: false
                }
            });
            if (!slider) {
                return;
            }
            sliders.push({ name: "action-popup-".concat(sliderIndex), slider: slider });
        });
    };
    var sliderTypesInit = function (sliders) {
        var containerArray = document.querySelectorAll('.types');
        if (containerArray.length === 0) {
            return;
        }
        var typeSliders = [];
        containerArray.forEach(function (item, sliderIndex) {
            var slider = makeSlider({
                container: item,
                className: 'types',
                config: {
                    effect: 'fade',
                    allowTouchMove: false
                }
            });
            if (!slider) {
                return;
            }
            swipeToHandler(slider, item);
            typeSliders.push({ slider: slider, item: item });
            sliders.push({ name: "types-".concat(sliderIndex), slider: slider });
        });
        // console.log(typeSliders);
        //swipeToAllHandler(typeSliders);
        // swipeToHandler(typeSliders, item);
    };
    var sliderFeedbackInit = function (sliders) {
        var containerArray = document.querySelectorAll('.feedback');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (item, sliderIndex) {
            var slider = makeSlider({
                container: item,
                className: 'feedback',
                paginationType: 'fraction',
                config: {
                    allowTouchMove: true,
                    slidesPerView: 'auto',
                    // breakpoints: {
                    //   650: {
                    //     slidesPerView: 2
                    //   }
                    // }
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                }
            });
            if (slider) {
                sliders.push({ name: "feedback-".concat(sliderIndex), slider: slider });
            }
        });
    };
    var sliderOfferInit = function (sliders) {
        var containerArray = document.querySelectorAll('.offer');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (item, sliderIndex) {
            var slider = makeSlider({
                container: item,
                className: 'offer',
                config: {
                    effect: 'fade',
                    allowTouchMove: false,
                    spaceBetween: 10,
                    loop: true,
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                }
            });
            if (slider) {
                sliders.push({ name: "offer-".concat(sliderIndex), slider: slider });
            }
        });
    };
    var sliderCatalogInit = function (sliders) {
        var containerArray = document.querySelectorAll('.catalog');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (item, sliderIndex) {
            var slider = makeSlider({
                container: item,
                className: 'catalog',
                paginationType: 'fraction',
                config: {
                    allowTouchMove: true,
                    slidesPerView: 'auto',
                    spaceBetween: 10,
                    breakpoints: {
                        899: {
                            spaceBetween: 24
                        }
                    },
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                }
            });
            if (slider) {
                sliders.push({ name: "catalog-".concat(sliderIndex), slider: slider });
            }
        });
    };
    var slidersInit = function () {
        var sliders = [];
        sliderTypesInit(sliders);
        sliderFeedbackInit(sliders);
        sliderCatalogInit(sliders);
        sliderActionFormInit(sliders);
        sliderOfferInit(sliders);
        return sliders;
    };
    var sliders = slidersInit();
    //resizeTextHelper
    var resizeTextHandler = function (textContainer) {
        var width = textContainer.getBoundingClientRect().width;
        textContainer.style.setProperty('--slider-width', "".concat(width, "px"));
    };
    var resizeTextHelper = function (classNameArray) {
        classNameArray.forEach(function (classnameString) {
            var containerArray = document.querySelectorAll(classnameString);
            if (containerArray.length === 0) {
                return;
            }
            containerArray.forEach(function (container) {
                var textContainer = container.querySelector('.resize-text-container');
                if (!textContainer) {
                    return;
                }
                resizeTextHandler(textContainer);
                window.addEventListener('resize', debounce({
                    callback: function () {
                        if (container.classList.contains('popup')) {
                            if (container.classList.contains('_opened')) {
                                resizeTextHandler(textContainer);
                            }
                        }
                        else {
                            resizeTextHandler(textContainer);
                        }
                    }
                }));
            });
        });
    };
    resizeTextHelper(['.types', '.popup-form']);
    //accordionInit
    var itemHandler = function (container) {
        var elements = container.querySelectorAll('.accordion__item');
        if (elements.length === 0) {
            return;
        }
        elements.forEach(function (element) {
            var arrow = element.querySelector('.accordion__summary');
            var body = element.querySelector('.accordion__details');
            if (!arrow || !body) {
                return;
            }
            var bodyInner = body.querySelector('.accordion__description');
            if (!bodyInner) {
                return;
            }
            var timeline = new Vevet.Timeline({ duration: 400 });
            timeline.addCallback('progress', function (_a) {
                var easing = _a.easing, progress = _a.progress;
                var height = progress === 1 ? 'auto' : "".concat(bodyInner.clientHeight * easing, "px");
                body.style.height = height;
                body.style.opacity = "".concat(easing);
            });
            arrow.addEventListener('click', function () {
                element.classList.toggle('_active');
                if (timeline.progress > 0) {
                    timeline.reverse();
                }
                else {
                    timeline.play();
                }
            });
        });
    };
    var accordionInit = function () {
        var containerArray = document.querySelectorAll('.accordion');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (container) {
            itemHandler(container);
        });
    };
    accordionInit();
    var useOutsideClick = function (element, callback) {
        var listener = function (event) {
            if (!element.contains(event === null || event === void 0 ? void 0 : event.target) && event.which === 1) {
                callback();
            }
        };
        document.addEventListener('mousedown', listener);
    };
    var useOnEscape = function (callback) {
        window.addEventListener('keydown', function (evt) {
            if (evt.keyCode === 27) {
                callback();
            }
        });
    };
    var renderModalAnimation = function (_a) {
        var progress = _a.progress, easing = _a.easing, parent = _a.parent, overlay = _a.overlay, scroll = _a.scroll, additional = _a.additional;
        if (parent) {
            var element = parent;
            element.style.display = "".concat(progress > 0 ? 'flex' : 'none');
            element.style.opacity = "".concat(progress > 0 ? 1 : 0);
        }
        if (overlay) {
            var element = overlay;
            element.style.opacity = "".concat(easing);
        }
        if (scroll) {
            var element = scroll;
            if (!parent.classList.contains('popup-search')) {
                element.style.opacity = "".concat(easing);
            }
            if (parent.classList.contains('popup-menu')) {
                element.style.transform = "translateX(".concat((1 - easing) * 100, "%)");
            }
            else {
                element.style.transform = "translateY(".concat((1 - easing) * 2, "rem)");
            }
        }
        if (additional) {
            var element = additional;
            element.style.opacity = "".concat(easing);
            if (parent.classList.contains('popup-menu')) {
                element.style.transform = "translateX(".concat((1 - easing) * 100, "%)");
            }
            else {
                element.style.transform = "translateY(".concat((1 - easing) * 2, "rem)");
            }
        }
    };
    var makeTimeline = function (parent, scroll, overlay, additional, video, iframe) {
        if (!parent || !scroll || !overlay) {
            return undefined;
        }
        var timeline = new Vevet.Timeline({
            duration: 600,
            easing: [0.25, 0.1, 0.25, 1]
        });
        timeline.addCallback('start', function () {
            var _a, _b;
            if (!timeline.isReversed) {
                (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.add('lock');
                (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.classList.add('lock');
                parent.classList.add('_opened');
                if (video) {
                    video.play();
                }
                if (iframe && iframe.contentWindow) {
                    var vidFunc = 'playVideo';
                    // console.dir(iframe.contentWindow.postMessage);
                    iframe.contentWindow.postMessage('{"event":"command","func":"' + vidFunc + '","args":""}', '*');
                }
            }
        });
        timeline.addCallback('progress', function (_a) {
            var progress = _a.progress, easing = _a.easing;
            renderModalAnimation({
                parent: parent,
                scroll: scroll,
                overlay: overlay,
                progress: progress,
                easing: easing,
                additional: additional
            });
        });
        timeline.addCallback('end', function () {
            var _a, _b;
            if (timeline.isReversed) {
                (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.remove('lock');
                (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                parent.classList.remove('_opened');
                if (video) {
                    video.pause();
                }
                if (iframe && iframe.contentWindow) {
                    // console.log(iframe, iframe.contentWindow);
                    var vidFunc = 'pauseVideo';
                    iframe.contentWindow.postMessage('{"event":"command","func":"' + vidFunc + '","args":""}', '*');
                }
            }
        });
        return timeline;
    };
    var Popup = /** @class */ (function () {
        function Popup(domElement, callback) {
            var _this = this;
            this._isThanks = false;
            this._isError = false;
            this._closeButtons = [];
            this._openButtons = [];
            this._parent = domElement;
            this._callback = callback;
            this._name = domElement.dataset.popupname;
            this._scroll = this._parent.querySelector('.popup__scroll');
            this._overlay = this._parent.querySelector('.popup__overlay');
            this._wrapper = this._parent.querySelector('.popup__wrapper');
            this._additional = this._parent.querySelector('.popup__additional');
            this._video = this._parent.querySelector('.video');
            this._iframe = this._parent.querySelector('iframe, eframe');
            if (!this._name || !this._scroll || !this._overlay || !this._wrapper) {
                return;
            }
            this._isThanks = this._name === '_popup-thanks';
            this._isError = this._name === '_popup-error';
            this._timeline = makeTimeline(this._parent, this._scroll, this._overlay, this._additional, this._video, this._iframe);
            this._openButtons = Array.from(document.querySelectorAll("[data-popup=\"".concat(this._name, "\"]")));
            this._closeButtons = Array.from(this._parent.querySelectorAll('.popup__close, .popup__button'));
            if (this._closeButtons.length !== 0) {
                this._closeButtons.forEach(function (button) {
                    if (!button) {
                        return;
                    }
                    button.addEventListener('click', function () {
                        var _a, _b, _c, _d;
                        (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                        (_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                        (_c = document.querySelector('body')) === null || _c === void 0 ? void 0 : _c.classList.remove('lock');
                        (_d = _this._video) === null || _d === void 0 ? void 0 : _d.pause();
                        if (_this._iframe && _this._iframe.contentWindow) {
                            _this._iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                        }
                    });
                });
            }
            useOutsideClick(this._wrapper, function () {
                var _a, _b, _c, _d;
                if (_this._parent.classList.contains('_opened')) {
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                    (_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                    (_c = document.querySelector('body')) === null || _c === void 0 ? void 0 : _c.classList.remove('lock');
                    (_d = _this._video) === null || _d === void 0 ? void 0 : _d.pause();
                    if (_this._iframe && _this._iframe.contentWindow) {
                        _this._iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    }
                }
            });
            useOnEscape(function () {
                var _a, _b, _c, _d;
                if (_this._parent.classList.contains('_opened')) {
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                    (_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                    (_c = document.querySelector('body')) === null || _c === void 0 ? void 0 : _c.classList.remove('lock');
                    (_d = _this._video) === null || _d === void 0 ? void 0 : _d.pause();
                    if (_this._iframe && _this._iframe.contentWindow) {
                        _this._iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    }
                }
            });
        }
        Object.defineProperty(Popup.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "isThanks", {
            get: function () {
                return this._isThanks;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "isError", {
            get: function () {
                return this._isError;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "scroll", {
            get: function () {
                return this._scroll;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "overlay", {
            get: function () {
                return this._overlay;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "additional", {
            get: function () {
                return this._additional;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "wrapper", {
            get: function () {
                return this._wrapper;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "video", {
            get: function () {
                return this._video;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "iframe", {
            get: function () {
                return this._iframe;
            },
            set: function (newValue) {
                this._iframe = newValue;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "timeline", {
            get: function () {
                return this._timeline;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "closeButtons", {
            get: function () {
                return this._closeButtons;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "openButtons", {
            get: function () {
                return this._openButtons;
            },
            enumerable: false,
            configurable: true
        });
        Popup.prototype.initOpen = function (popupArr) {
            var _this = this;
            if (popupArr.length === 0 || !this._openButtons) {
                return;
            }
            this._openButtons.forEach(function (openBtn) {
                openBtn.addEventListener('click', function (evt) {
                    var _a;
                    evt.preventDefault();
                    popupArr.forEach(function (popup) {
                        var _a;
                        if (popup.parent.classList.contains('_opened') &&
                            popup.name !== _this._name) {
                            (_a = popup.timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                        }
                    });
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.play();
                });
            });
        };
        Popup.prototype.onWindowResize = function (callback) {
            this._callback = callback;
            window.addEventListener('resize', debounce({
                callback: callback
            }));
        };
        return Popup;
    }());
    var initPopups = function () {
        var popupDomArr = document.querySelectorAll('.popup');
        if (popupDomArr.length === 0) {
            return [];
        }
        var popupArr = [];
        popupDomArr.forEach(function (element) {
            var popup = new Popup(element);
            popupArr.push(popup);
        });
        popupArr.forEach(function (popup) {
            popup.initOpen(popupArr);
        });
        popupArr.forEach(function (popup) {
            if (popup.name === '_popup-form') {
                var formPopup_1 = popup;
                setTimeout(function () {
                    formPopup_1.parent.style.display = 'none';
                    formPopup_1.parent.style.opacity = '0';
                }, 0);
            }
        });
        return popupArr;
    };
    var popups = initPopups();
    //anchors
    var closePopupsHandler = function (popups) {
        if (popups.length === 0) {
            return;
        }
        popups.forEach(function (_a) {
            var timeline = _a.timeline, openButtons = _a.openButtons;
            if (timeline && timeline.progress > 0) {
                timeline.reverse();
                openButtons.forEach(function (openBtn) {
                    openBtn.classList.remove('_opened');
                });
            }
        });
    };
    var scrollBannerHandler = function (headerHeight) {
        var bannerArray = document.querySelectorAll('.banner');
        if (bannerArray.length === 0) {
            return;
        }
        bannerArray.forEach(function (banner) {
            var nextElement = banner.nextElementSibling;
            var buttonArray = banner.querySelectorAll('.banner__down');
            if (buttonArray.length === 0 || !nextElement) {
                return;
            }
            buttonArray.forEach(function (button) {
                button.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    window.scrollTo({
                        top: nextElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                });
            });
        });
    };
    var scrollHandler = function (link, headerHeight, popups) {
        var sectionName = link.dataset.goto;
        if (!sectionName) {
            return;
        }
        var section = document.querySelector("".concat(sectionName));
        if (!section) {
            return;
        }
        link.addEventListener('click', function (evt) {
            evt.preventDefault();
            closePopupsHandler(popups);
            window.scrollTo({
                top: section.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    };
    var anchorsInit = function (headerHeight, popups) {
        var links = Array.from(document.querySelectorAll('.anchor'));
        if (links.length === 0) {
            return;
        }
        links.forEach(function (link) {
            scrollHandler(link, headerHeight, popups);
        });
    };
    anchorsInit(0, popups);
    scrollBannerHandler(0);
    var popupOpenHandler = function (typeValue, popups, inputProp, sliderIndex) {
        var input = inputProp;
        popups.forEach(function (popup) {
            if (popup.name !== '_popup-form') {
                return;
            }
            var parent = popup.parent, openButtons = popup.openButtons;
            var popupImage = parent.querySelector('.action-popup-media__img img');
            var popupText = parent.querySelector('.action-popup-media__text');
            if (!popupImage || !popupText) {
                return;
            }
            openButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    if (button.dataset.type && sliderIndex === +button.dataset.type) {
                        input.value = typeValue.text;
                        popupImage.src = typeValue.imageSrc;
                        popupText.innerHTML = typeValue.text;
                    }
                });
            });
        });
    };
    var setValueHandler = function (slider) {
        var slideArray = slider.el.querySelectorAll('.swiper-slide');
        if (slideArray.length === 0) {
            return undefined;
        }
        var result = {
            imageSrc: '',
            text: ''
        };
        slideArray.forEach(function (slide, index) {
            if (slider.activeIndex === index) {
                var image = slide.querySelector('.types-slider__img img');
                var text = slide.querySelector('.types-slider__text');
                if (!image || !text) {
                    return;
                }
                result.imageSrc = image.src;
                result.text = text.innerHTML;
            }
        });
        if (result.imageSrc === '' || result.text === '') {
            return undefined;
        }
        return result;
    };
    var chooseTypeInfo = function (form, slider, popups, sliderIndex) {
        var inputType = form.querySelector('input[name="type"]');
        if (!inputType) {
            return;
        }
        var typeValue = setValueHandler(slider);
        if (!typeValue) {
            return;
        }
        slider.on('slideChange', function (swiper) {
            var newValue = setValueHandler(swiper);
            if (!newValue) {
                return;
            }
            typeValue.imageSrc = newValue.imageSrc;
            typeValue.text = newValue.text;
        });
        popupOpenHandler(typeValue, popups, inputType, sliderIndex);
    };
    var inputRequieredHandler = function (container, buttonArray) {
        var inputArray = container.querySelectorAll('input');
        if (inputArray.length === 0) {
            return;
        }
        inputArray.forEach(function (input) {
            if (input.type === 'radio') {
                return;
            }
            var typingTimer;
            var interval = 1000;
            var doneTyping = function () {
                // console.log('done');
                var isAnyInputEmpty = !!Array.from(inputArray).find(function (item) { return item.value === ''; });
                var isTelInputEmpty = !!Array.from(inputArray).find(function (item) { return item.type === 'tel' && item.value.length < 19; });
                // console.log(isTelInputEmpty);
                buttonArray.forEach(function (button) {
                    if (button.dataset.action === 'submit') {
                        if (isAnyInputEmpty || isTelInputEmpty) {
                            button.classList.add('locked');
                        }
                        else {
                            button.classList.remove('locked');
                        }
                    }
                });
            };
            input.addEventListener('keyup', function () {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, interval);
            });
            input.addEventListener('keydown', function () {
                clearTimeout(typingTimer);
            });
        });
    };
    var buttonActionHandler = function (button, slider, slideArray, inputFormArray) {
        var isSumbit = button.dataset.action === 'submit';
        var inputSteps = slideArray[slider.activeIndex].querySelectorAll('input');
        inputSteps.forEach(function (input) {
            inputFormArray.forEach(function (formInputProp) {
                var formInput = formInputProp;
                if (input.type === 'radio' &&
                    input.checked &&
                    input.name === formInput.name) {
                    formInput.value = input.value;
                }
                if (input.type !== 'radio' && input.name === formInput.name) {
                    formInput.value = input.value;
                }
            });
        });
        if (isSumbit) {
            setTimeout(function () {
                slider.slideTo(0);
                inputSteps.forEach(function (inputProp) {
                    var input = inputProp;
                    if (input.type !== 'radio') {
                        input.value = '';
                    }
                });
            }, 400);
        }
        else {
            slider.slideNext();
        }
    };
    var initFormControl = function (form, slider) {
        var buttonArray = slider.el.querySelectorAll('.action-popup__button');
        var slideArray = slider.el.querySelectorAll('.swiper-slide');
        var inputFormArray = form.querySelectorAll('input');
        if (buttonArray.length === 0 || slideArray.length === 0) {
            return;
        }
        inputRequieredHandler(slider.el, buttonArray);
        buttonArray.forEach(function (button) {
            button.addEventListener('click', function () {
                buttonActionHandler(button, slider, slideArray, inputFormArray);
            });
        });
    };
    var initStepForm = function (sliders, popups) {
        var formArray = document.querySelectorAll('.action-popup__form.form');
        if (formArray.length === 0 || sliders.length === 0) {
            return;
        }
        formArray.forEach(function (form, index) {
            sliders.forEach(function (_a, sliderIndex) {
                var name = _a.name, slider = _a.slider;
                //if (name === `types-${index}` && slider) {
                if (name.includes('types') && slider) {
                    chooseTypeInfo(form, slider, popups, sliderIndex);
                }
                if (name === "action-popup-".concat(index) && slider) {
                    initFormControl(form, slider);
                }
            });
        });
    };
    initStepForm(sliders, popups);
    //input tel mask
    var initTelephoneMask = function () {
        var maskArray = [];
        var inputTelArray = document.querySelectorAll('input[type="tel"]');
        if (inputTelArray.length === 0) {
            return undefined;
        }
        inputTelArray.forEach(function (input) {
            var options = {
                mask: '+{38\\0} (00) 000 00 00'
            };
            var mask = IMask(input, options);
            maskArray.push(mask);
        });
        return maskArray;
    };
    var inputMaskArray = initTelephoneMask();
    //form
    var formArr = document.querySelectorAll('form');
    var hasError = false;
    if (formArr.length !== 0) {
        // formArr.forEach((form) => {
        //   form.addEventListener('submit', (evt) => {
        //     evt.preventDefault();
        //     const inputs = Array.from(
        //       form.querySelectorAll('input, textarea') as NodeListOf<
        //         HTMLInputElement | HTMLTextAreaElement
        //       >
        //     );
        //     popups.forEach(({ timeline, isThanks, isError }) => {
        //       if (isThanks && !hasError) {
        //         timeline?.play();
        //         if (inputs.length !== 0) {
        //           inputs.forEach((inputProp) => {
        //             const input = inputProp;
        //             console.log(input, input.value);
        //             if (input.type === 'tel') {
        //               return;
        //             }
        //             input.value = '';
        //           });
        //         }
        //         if (inputMaskArray) {
        //           inputMaskArray.forEach((inputMaskProp) => {
        //             const inputMask = inputMaskProp;
        //             inputMask.value = '';
        //             inputMask.updateValue();
        //           });
        //         }
        //       } else if (isError && hasError) {
        //         timeline?.play();
        //       } else {
        //         timeline?.reverse();
        //         setTimeout(() => {
        //           document.querySelector('html')?.classList.add('lock');
        //           document.querySelector('body')?.classList.add('lock');
        //         }, 300);
        //       }
        //     });
        //   });
        // });
        document.addEventListener('wpcf7mailsent', function () {
            popups.forEach(function (_a) {
                var timeline = _a.timeline, isThanks = _a.isThanks, isError = _a.isError;
                if (isThanks && !hasError) {
                    timeline === null || timeline === void 0 ? void 0 : timeline.play();
                    formArr.forEach(function (form) {
                        var inputs = Array.from(form.querySelectorAll('input, textarea'));
                        if (inputs.length !== 0) {
                            inputs.forEach(function (inputProp) {
                                var input = inputProp;
                                if (input.type === 'tel') {
                                    return;
                                }
                                input.value = '';
                            });
                        }
                        if (inputMaskArray) {
                            inputMaskArray.forEach(function (inputMaskProp) {
                                var inputMask = inputMaskProp;
                                inputMask.value = '';
                                inputMask.updateValue();
                            });
                        }
                    });
                }
                else if (isError && hasError) {
                    timeline === null || timeline === void 0 ? void 0 : timeline.play();
                }
                else {
                    timeline === null || timeline === void 0 ? void 0 : timeline.reverse();
                    setTimeout(function () {
                        var _a, _b;
                        (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.add('lock');
                        (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.classList.add('lock');
                    }, 300);
                }
            });
        }, false);
    }
});
