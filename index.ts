const vevet = new Vevet.Application({
  tablet: 1199,
  phone: 899,
  prefix: 'v-',
  viewportResizeTimeout: 100,
  easing: [0.25, 0.1, 0.25, 1],
});

vevet.pageLoad.onLoaded(() => {
  const videoHandler = () => {
    const videoArr = document.querySelectorAll(
      '.video'
    ) as NodeListOf<HTMLVideoElement>;

    if (videoArr.length === 0) {
      return;
    }

    videoArr.forEach((video) => {
      if (!video) {
        return;
      }

      const source = video.querySelector('source');

      if (!source) {
        return;
      }

      const dataSrc = source.dataset.src;

      if (!dataSrc) {
        return;
      }

      source.src = dataSrc;

      video.load();

      video.addEventListener('loadeddata', () => {
        setTimeout(() => {
          video.classList.add('loaded');
        }, 0);
      });
    });
  };

  videoHandler();

  //scrollBarInit
  const scrollBarInit = () => {
    let scrollBar;
    if (!vevet.isMobile) {
      scrollBar = new Vevet.ScrollBar({ container: window });
    }

    return scrollBar;
  };
  scrollBarInit();

  //config
  type TCallback = () => void;

  interface IDebounce {
    callback: TCallback;
    wait?: number;
    isImmediate?: boolean;
  }

  const debounce = ({
    callback,
    wait = 250,
    isImmediate = false,
  }: IDebounce) => {
    let timeout: NodeJS.Timeout | undefined;

    return () => {
      const later = () => {
        timeout = undefined;
        callback();
      };

      const isCallNow = isImmediate && !timeout;
      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (isCallNow) {
        callback();
      }
    };
  };

  //sliders
  interface IMakeSlider {
    container: HTMLElement | null;
    className: string;
    isThumb?: boolean;
    thumb?: Swiper | undefined;
    config?: SwiperOptions | undefined;
    paginationType?: PaginationOptions['type'];
    renderBullets?: (index: number, className: string) => string;
  }

  interface ITypesSlider {
    item: HTMLElement;
    slider: Swiper;
  }

  interface IInitializedSlider {
    name: string;
    slider: Swiper | undefined;
  }

  const makeSlider = ({
    container,
    className,
    isThumb = false,
    thumb = undefined,
    config,
    paginationType,
    renderBullets,
  }: IMakeSlider) => {
    if (!container || !className) {
      return undefined;
    }

    const slider =
      (container.querySelector(
        `.${className}-slider${isThumb ? '-thumb' : ''}.swiper`
      ) as HTMLElement) || null;

    if (!slider) {
      return undefined;
    }

    const pagination: HTMLElement | null = container.querySelector(
      `.${className}-slider-pagination`
    );

    const arrowPrev = container.querySelector(
      `.${className}-slider${
        isThumb ? '-thumb' : ''
      }-controls .${className}-slider-prev`
    ) as HTMLElement | null;

    const arrowNext = container.querySelector(
      `.${className}-slider${
        isThumb ? '-thumb' : ''
      }-controls .${className}-slider-next`
    ) as HTMLElement | null;

    const sliderInit = new Swiper(slider, {
      thumbs: {
        swiper: thumb,
      },
      pagination: {
        el: pagination,
        clickable: true,
        type: paginationType,
        renderBullet: renderBullets,
      },
      navigation: {
        nextEl: arrowNext,
        prevEl: arrowPrev,
      },

      slidesPerView: 1,
      spaceBetween: 30,

      ...config,
    });

    return sliderInit;
  };

  const swipeToAllHandler = (array: ITypesSlider[]) => {
    array.forEach(({ slider, item: container }) => {
      const paginationContainerArray = container.querySelectorAll<HTMLElement>(
        '.swipe-to-container'
      );

      if (paginationContainerArray.length === 0) {
        return;
      }

      paginationContainerArray.forEach((paginationContainer) => {
        const buttonArray =
          paginationContainer.querySelectorAll<HTMLButtonElement>(
            '.swipe-to-button'
          );

        if (buttonArray.length === 0) {
          return;
        }

        buttonArray.forEach((button, index) => {
          button.addEventListener('click', () => {
            array.forEach(({ slider: sliderCurrent }) => {
              if (sliderCurrent.slides.length < index + 1) {
                sliderCurrent.slideTo(0);
              } else {
                sliderCurrent.slideTo(index);
              }
            });

            buttonArray.forEach((otherButton) => {
              otherButton.classList.remove('active');
            });

            button.classList.add('active');
          });
        });

        slider.on('slideChange', (swiper) => {
          buttonArray.forEach((button, index) => {
            // findActivePicture(slider);

            if (swiper.activeIndex === index) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });
        });
      });
    });
  };

  const sliderActionFormInit = (sliders: Array<IInitializedSlider>) => {
    const containerArray = document.querySelectorAll(
      '.action-popup'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((item, sliderIndex) => {
      const slider = makeSlider({
        container: item,
        className: 'action-popup',
        config: {
          effect: 'fade',
          allowTouchMove: false,
          // autoplay: {
          //   delay: 6000,
          //   disableOnInteraction: false
          // }
        },
      });

      if (!slider) {
        return;
      }

      sliders.push({ name: `action-popup-${sliderIndex}`, slider });
    });
  };

  const sliderTypesInit = (sliders: Array<IInitializedSlider>) => {
    const containerArray = document.querySelectorAll(
      '.types'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    const typeSliders: ITypesSlider[] = [];

    containerArray.forEach((item, sliderIndex) => {
      const slider = makeSlider({
        container: item,
        className: 'types',
        config: {
          effect: 'fade',
          allowTouchMove: false,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
        },
      });

      if (!slider) {
        return;
      }

      // swipeToHandler(slider, item);
      typeSliders.push({ slider, item });
      sliders.push({ name: `types-${sliderIndex}`, slider });
    });

    // console.log(typeSliders);
    swipeToAllHandler(typeSliders);
    // swipeToHandler(typeSliders, item);
  };

  const sliderFeedbackInit = (sliders: Array<IInitializedSlider>) => {
    const containerArray = document.querySelectorAll(
      '.feedback'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((item, sliderIndex) => {
      const slider = makeSlider({
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
            disableOnInteraction: false,
          },
        },
      });

      if (slider) {
        sliders.push({ name: `feedback-${sliderIndex}`, slider });
      }
    });
  };

  const sliderOfferInit = (sliders: Array<IInitializedSlider>) => {
    const containerArray = document.querySelectorAll(
      '.offer'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((item, sliderIndex) => {
      const slider = makeSlider({
        container: item,
        className: 'offer',
        config: {
          effect: 'fade',
          allowTouchMove: false,
          spaceBetween: 10,
          loop: true,

          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
        },
      });

      if (slider) {
        sliders.push({ name: `offer-${sliderIndex}`, slider });
      }
    });
  };

  const sliderCatalogInit = (sliders: Array<IInitializedSlider>) => {
    const containerArray = document.querySelectorAll(
      '.catalog'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((item, sliderIndex) => {
      const slider = makeSlider({
        container: item,
        className: 'catalog',
        paginationType: 'fraction',
        config: {
          allowTouchMove: true,
          slidesPerView: 'auto',
          spaceBetween: 10,

          breakpoints: {
            899: {
              spaceBetween: 24,
            },
          },
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
        },
      });

      if (slider) {
        sliders.push({ name: `catalog-${sliderIndex}`, slider });
      }
    });
  };

  const slidersInit = () => {
    const sliders: Array<IInitializedSlider> = [];

    sliderTypesInit(sliders);
    sliderFeedbackInit(sliders);
    sliderCatalogInit(sliders);
    sliderActionFormInit(sliders);
    sliderOfferInit(sliders);
    return sliders;
  };

  const sliders = slidersInit();

  //resizeTextHelper
  const resizeTextHandler = (textContainer: HTMLElement) => {
    const { width } = textContainer.getBoundingClientRect();
    textContainer.style.setProperty('--slider-width', `${width}px`);
  };

  const resizeTextHelper = (classNameArray: string[]) => {
    classNameArray.forEach((classnameString) => {
      const containerArray =
        document.querySelectorAll<HTMLElement>(classnameString);

      if (containerArray.length === 0) {
        return;
      }

      containerArray.forEach((container) => {
        const textContainer = container.querySelector<HTMLElement>(
          '.resize-text-container'
        );
        if (!textContainer) {
          return;
        }
        resizeTextHandler(textContainer);

        window.addEventListener(
          'resize',
          debounce({
            callback: () => {
              if (container.classList.contains('popup')) {
                if (container.classList.contains('_opened')) {
                  resizeTextHandler(textContainer);
                }
              } else {
                resizeTextHandler(textContainer);
              }
            },
          })
        );
      });
    });
  };

  resizeTextHelper(['.types', '.popup-form']);

  //accordionInit
  const itemHandler = (container: HTMLElement) => {
    const elements =
      container.querySelectorAll<HTMLElement>('.accordion__item');

    if (elements.length === 0) {
      return;
    }

    elements.forEach((element) => {
      const arrow = element.querySelector<HTMLButtonElement>(
        '.accordion__summary'
      );
      const body = element.querySelector<HTMLElement>('.accordion__details');

      if (!arrow || !body) {
        return;
      }

      const bodyInner = body.querySelector<HTMLElement>(
        '.accordion__description'
      );
      if (!bodyInner) {
        return;
      }

      const timeline = new Vevet.Timeline({ duration: 400 });
      timeline.addCallback('progress', ({ easing, progress }) => {
        const height =
          progress === 1 ? 'auto' : `${bodyInner.clientHeight * easing}px`;

        body.style.height = height;
        body.style.opacity = `${easing}`;
      });

      arrow.addEventListener('click', () => {
        element.classList.toggle('_active');

        if (timeline.progress > 0) {
          timeline.reverse();
        } else {
          timeline.play();
        }
      });
    });
  };

  const accordionInit = () => {
    const containerArray = document.querySelectorAll<HTMLElement>('.accordion');

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((container) => {
      itemHandler(container);
    });
  };

  accordionInit();

  //popups
  type TPopupCallback = () => void;
  interface IRenderModalAnimationProps {
    progress: number;
    easing: number;
    parent: HTMLElement;
    scroll: HTMLElement;
    overlay: HTMLElement;
    additional: HTMLElement | null;
  }

  type TClickOutsideEvent = MouseEvent | TouchEvent;

  const useOutsideClick = (element: HTMLElement, callback: () => void) => {
    const listener = (event: TClickOutsideEvent) => {
      if (!element.contains(event?.target as Node) && event.which === 1) {
        callback();
      }
    };

    document.addEventListener('mousedown', listener);
  };

  const useOnEscape = (callback: () => void) => {
    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 27) {
        callback();
      }
    });
  };

  const renderModalAnimation = ({
    progress,
    easing,
    parent,
    overlay,
    scroll,
    additional,
  }: IRenderModalAnimationProps) => {
    if (parent) {
      const element = parent;
      element.style.display = `${progress > 0 ? 'flex' : 'none'}`;

      element.style.opacity = `${progress > 0 ? 1 : 0}`;
    }

    if (overlay) {
      const element = overlay;
      element.style.opacity = `${easing}`;
    }

    if (scroll) {
      const element = scroll;

      if (!parent.classList.contains('popup-search')) {
        element.style.opacity = `${easing}`;
      }

      if (parent.classList.contains('popup-menu')) {
        element.style.transform = `translateX(${(1 - easing) * 100}%)`;
      } else {
        element.style.transform = `translateY(${(1 - easing) * 2}rem)`;
      }
    }

    if (additional) {
      const element = additional;
      element.style.opacity = `${easing}`;
      if (parent.classList.contains('popup-menu')) {
        element.style.transform = `translateX(${(1 - easing) * 100}%)`;
      } else {
        element.style.transform = `translateY(${(1 - easing) * 2}rem)`;
      }
    }
  };

  const makeTimeline = (
    parent: HTMLElement,
    scroll: HTMLElement | null,
    overlay: HTMLElement | null,
    additional: HTMLElement | null,
    video?: HTMLVideoElement | null
  ) => {
    if (!parent || !scroll || !overlay) {
      return undefined;
    }

    const timeline = new Vevet.Timeline({
      duration: 600,
      easing: [0.25, 0.1, 0.25, 1],
    });
    timeline.addCallback('start', () => {
      if (!timeline.isReversed) {
        document.querySelector('html')?.classList.add('lock');
        document.querySelector('body')?.classList.add('lock');

        parent.classList.add('_opened');

        if (video) {
          video.play();
        }
      }
    });

    timeline.addCallback('progress', ({ progress, easing }) => {
      renderModalAnimation({
        parent,
        scroll,
        overlay,
        progress,
        easing,
        additional,
      });
    });

    timeline.addCallback('end', () => {
      if (timeline.isReversed) {
        document.querySelector('html')?.classList.remove('lock');
        document.querySelector('body')?.classList.remove('lock');
        parent.classList.remove('_opened');

        if (video) {
          video.pause();
        }
      }
    });

    return timeline;
  };

  class Popup {
    get parent() {
      return this._parent;
    }

    private _parent: HTMLElement;

    get name() {
      return this._name;
    }

    private _name: string | undefined;

    get isThanks() {
      return this._isThanks;
    }

    private _isThanks: boolean = false;

    get isError() {
      return this._isError;
    }

    private _isError: boolean = false;

    get scroll() {
      return this._scroll;
    }

    private _scroll: HTMLElement | null;

    get overlay() {
      return this._overlay;
    }

    private _overlay: HTMLElement | null;

    get additional() {
      return this._additional;
    }

    private _additional: HTMLElement | null;

    get wrapper() {
      return this._wrapper;
    }

    private _wrapper: HTMLElement | null;

    get video() {
      return this._video;
    }

    private _video: HTMLVideoElement | null;

    get timeline() {
      return this._timeline;
    }

    private _timeline: Vevet.Timeline | undefined;

    get closeButtons() {
      return this._closeButtons;
    }

    private _closeButtons: Array<HTMLElement | null> = [];

    get openButtons() {
      return this._openButtons;
    }

    private _openButtons: HTMLElement[] = [];

    private _callback: TPopupCallback | undefined;

    constructor(domElement: HTMLElement, callback?: TPopupCallback) {
      this._parent = domElement;
      this._callback = callback;
      this._name = domElement.dataset.popupname;
      this._scroll = this._parent.querySelector('.popup__scroll');
      this._overlay = this._parent.querySelector('.popup__overlay');
      this._wrapper = this._parent.querySelector('.popup__wrapper');
      this._additional = this._parent.querySelector('.popup__additional');
      this._video = this._parent.querySelector('.video');

      if (!this._name || !this._scroll || !this._overlay || !this._wrapper) {
        return;
      }
      this._isThanks = this._name === '_popup-thanks';
      this._isError = this._name === '_popup-error';

      this._timeline = makeTimeline(
        this._parent,
        this._scroll,
        this._overlay,
        this._additional,
        this._video
      );

      this._openButtons = Array.from(
        document.querySelectorAll(`[data-popup="${this._name}"]`)
      );
      this._closeButtons = Array.from(
        this._parent.querySelectorAll(
          '.popup__close, .popup__button'
        ) as NodeListOf<HTMLElement>
      );

      if (this._closeButtons.length !== 0) {
        this._closeButtons.forEach((button) => {
          if (!button) {
            return;
          }

          button.addEventListener('click', () => {
            this._timeline?.reverse();
          });
        });
      }

      useOutsideClick(this._wrapper, () => {
        if (this._parent.classList.contains('_opened')) {
          this._timeline?.reverse();
          document.querySelector('html')?.classList.remove('lock');
          document.querySelector('body')?.classList.remove('lock');

          this._video?.pause();
        }
      });

      useOnEscape(() => {
        if (this._parent.classList.contains('_opened')) {
          this._timeline?.reverse();

          document.querySelector('html')?.classList.remove('lock');
          document.querySelector('body')?.classList.remove('lock');

          this._video?.pause();
        }
      });
    }

    initOpen(popupArr: Popup[]) {
      if (popupArr.length === 0 || !this._openButtons) {
        return;
      }
      this._openButtons.forEach((openBtn) => {
        openBtn.addEventListener('click', (evt) => {
          evt.preventDefault();

          popupArr.forEach((popup) => {
            if (
              popup.parent.classList.contains('_opened') &&
              popup.name !== this._name
            ) {
              popup.timeline?.reverse();
            }
          });

          this._timeline?.play();
        });
      });
    }

    onWindowResize(callback: TPopupCallback) {
      this._callback = callback;

      window.addEventListener(
        'resize',
        debounce({
          callback,
        })
      );
    }
  }

  const initPopups = (): Popup[] => {
    const popupDomArr = document.querySelectorAll('.popup');

    if (popupDomArr.length === 0) {
      return [];
    }

    const popupArr: Popup[] = [];

    popupDomArr.forEach((element) => {
      const popup = new Popup(element as HTMLElement);
      popupArr.push(popup);
    });

    popupArr.forEach((popup) => {
      popup.initOpen(popupArr);
    });

    popupArr.forEach((popup) => {
      if (popup.name === '_popup-form') {
        const formPopup = popup;
        setTimeout(() => {
          formPopup.parent.style.display = 'none';
          formPopup.parent.style.opacity = '0';
        }, 0);
      }
    });

    return popupArr;
  };

  const popups = initPopups();

  //anchors
  const closePopupsHandler = (popups: Popup[]) => {
    if (popups.length === 0) {
      return;
    }

    popups.forEach(({ timeline, openButtons }) => {
      if (timeline && timeline.progress > 0) {
        timeline.reverse();

        openButtons.forEach((openBtn) => {
          openBtn.classList.remove('_opened');
        });
      }
    });
  };

  const scrollBannerHandler = (headerHeight: number) => {
    const bannerArray = document.querySelectorAll<HTMLElement>('.banner');

    if (bannerArray.length === 0) {
      return;
    }

    bannerArray.forEach((banner) => {
      const nextElement = banner.nextElementSibling as HTMLElement | null;
      const buttonArray =
        banner.querySelectorAll<HTMLButtonElement>('.banner__down');

      if (buttonArray.length === 0 || !nextElement) {
        return;
      }

      buttonArray.forEach((button) => {
        button.addEventListener('click', (evt) => {
          evt.preventDefault();

          window.scrollTo({
            top: nextElement.offsetTop - headerHeight,
            behavior: 'smooth',
          });
        });
      });
    });
  };

  const scrollHandler = (
    link: HTMLElement,
    headerHeight: number,
    popups: Popup[]
  ) => {
    const sectionName = link.dataset.goto;
    if (!sectionName) {
      return;
    }

    const section = document.querySelector(
      `${sectionName}`
    ) as HTMLElement | null;
    if (!section) {
      return;
    }

    link.addEventListener('click', (evt) => {
      evt.preventDefault();

      closePopupsHandler(popups);

      window.scrollTo({
        top: section.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    });
  };

  const anchorsInit = (headerHeight: number, popups: Popup[]) => {
    const links = Array.from(
      document.querySelectorAll('.anchor') as NodeListOf<HTMLElement>
    );

    if (links.length === 0) {
      return;
    }

    links.forEach((link) => {
      scrollHandler(link, headerHeight, popups);
    });
  };

  anchorsInit(0, popups);
  scrollBannerHandler(0);

  //initStepForm
  interface IResult {
    imageSrc: string;
    text: string;
  }

  const popupOpenHandler = (
    typeValue: IResult,
    popups: Popup[],
    inputProp: HTMLInputElement
  ) => {
    const input = inputProp;

    popups.forEach((popup) => {
      if (popup.name !== '_popup-form') {
        return;
      }

      const { parent, openButtons } = popup;

      const popupImage = parent.querySelector<HTMLImageElement>(
        '.action-popup-media__img img'
      );
      const popupText = parent.querySelector<HTMLImageElement>(
        '.action-popup-media__text'
      );

      if (!popupImage || !popupText) {
        return;
      }

      openButtons.forEach((button) => {
        button.addEventListener('click', () => {
          input.value = typeValue.text;

          popupImage.src = typeValue.imageSrc;
          popupText.innerHTML = typeValue.text;
        });
      });
    });
  };

  const setValueHandler = (slider: Swiper) => {
    const slideArray = slider.el.querySelectorAll<HTMLElement>('.swiper-slide');

    if (slideArray.length === 0) {
      return undefined;
    }

    let result: IResult = {
      imageSrc: '',
      text: '',
    };

    slideArray.forEach((slide, index) => {
      if (slider.activeIndex === index) {
        const image = slide.querySelector<HTMLImageElement>(
          '.types-slider__img img'
        );
        const text = slide.querySelector<HTMLElement>('.types-slider__text');

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

  const chooseTypeInfo = (
    form: HTMLElement,
    slider: Swiper,
    popups: Popup[]
  ) => {
    const inputType =
      form.querySelector<HTMLInputElement>('input[name="type"]');

    if (!inputType) {
      return;
    }

    const typeValue = setValueHandler(slider);

    if (!typeValue) {
      return;
    }

    slider.on('slideChange', (swiper) => {
      const newValue = setValueHandler(swiper);

      if (!newValue) {
        return;
      }

      typeValue.imageSrc = newValue.imageSrc;
      typeValue.text = newValue.text;
    });

    popupOpenHandler(typeValue, popups, inputType);
  };

  const inputRequieredHandler = (
    container: HTMLElement,
    buttonArray: NodeListOf<HTMLElement>
  ) => {
    const inputArray = container.querySelectorAll<HTMLInputElement>('input');

    if (inputArray.length === 0) {
      return;
    }

    inputArray.forEach((input) => {
      if (input.type === 'radio') {
        return;
      }

      input.addEventListener('change', () => {
        const isAnyInputEmpty = !!Array.from(inputArray).find(
          (item) => item.value === ''
        );

        buttonArray.forEach((button) => {
          if (button.dataset.action === 'submit') {
            if (isAnyInputEmpty) {
              button.classList.add('locked');
            } else {
              button.classList.remove('locked');
            }
          }
        });
      });
    });
  };

  const buttonActionHandler = (
    button: HTMLElement,
    slider: Swiper,
    slideArray: NodeListOf<HTMLElement>,
    inputFormArray: NodeListOf<HTMLInputElement>
  ) => {
    const isSumbit = button.dataset.action === 'submit';
    const inputSteps =
      slideArray[slider.activeIndex].querySelectorAll<HTMLInputElement>(
        'input'
      );

    inputSteps.forEach((input) => {
      inputFormArray.forEach((formInputProp) => {
        const formInput = formInputProp;

        if (
          input.type === 'radio' &&
          input.checked &&
          input.name === formInput.name
        ) {
          formInput.value = input.value;
        }

        if (input.type !== 'radio' && input.name === formInput.name) {
          formInput.value = input.value;
        }
      });
    });

    if (isSumbit) {
      setTimeout(() => {
        slider.slideTo(0);

        inputSteps.forEach((inputProp) => {
          const input = inputProp;

          if (input.type !== 'radio') {
            input.value = '';
          }
        });
      }, 400);
    } else {
      slider.slideNext();
    }
  };

  const initFormControl = (form: HTMLElement, slider: Swiper) => {
    const buttonArray = slider.el.querySelectorAll<HTMLElement>(
      '.action-popup__button'
    );
    const slideArray = slider.el.querySelectorAll<HTMLElement>('.swiper-slide');
    const inputFormArray = form.querySelectorAll('input');

    if (buttonArray.length === 0 || slideArray.length === 0) {
      return;
    }

    inputRequieredHandler(slider.el, buttonArray);

    buttonArray.forEach((button) => {
      button.addEventListener('click', () => {
        buttonActionHandler(button, slider, slideArray, inputFormArray);
      });
    });
  };

  const initStepForm = (sliders: IInitializedSlider[], popups: Popup[]) => {
    const formArray = document.querySelectorAll<HTMLFormElement>(
      '.action-popup__form.form'
    );

    if (formArray.length === 0 || sliders.length === 0) {
      return;
    }

    formArray.forEach((form, index) => {
      sliders.forEach(({ name, slider }) => {
        if (name === `types-${index}` && slider) {
          // if (name.includes('types') && slider) {
          chooseTypeInfo(form, slider, popups);
        }

        if (name === `action-popup-${index}` && slider) {
          initFormControl(form, slider);
        }
      });
    });
  };

  initStepForm(sliders, popups);

  //input tel mask
  const initTelephoneMask = () => {
    const maskArray: InputMask<{ mask: string }>[] = [];

    const inputTelArray =
      document.querySelectorAll<HTMLInputElement>('input[type="tel"]');

    if (inputTelArray.length === 0) {
      return undefined;
    }

    inputTelArray.forEach((input) => {
      const options = {
        mask: '+{38} (00) 000 00 00',
      };

      const mask = IMask(input, options);
      maskArray.push(mask);
    });

    return maskArray;
  };

  const inputMaskArray = initTelephoneMask();

  //form
  const formArr = document.querySelectorAll('form');
  const hasError = false;

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

    document.addEventListener(
      'wpcf7mailsent',
      function () {
        popups.forEach(({ timeline, isThanks, isError }) => {
          if (isThanks && !hasError) {
            timeline?.play();

            formArr.forEach((form) => {
              const inputs = Array.from(
                form.querySelectorAll('input, textarea') as NodeListOf<
                  HTMLInputElement | HTMLTextAreaElement
                >
              );

              if (inputs.length !== 0) {
                inputs.forEach((inputProp) => {
                  const input = inputProp;
                  if (input.type === 'tel') {
                    return;
                  }
                  input.value = '';
                });
              }

              if (inputMaskArray) {
                inputMaskArray.forEach((inputMaskProp) => {
                  const inputMask = inputMaskProp;
                  inputMask.value = '';
                  inputMask.updateValue();
                });
              }
            });
          } else if (isError && hasError) {
            timeline?.play();
          } else {
            timeline?.reverse();

            setTimeout(() => {
              document.querySelector('html')?.classList.add('lock');
              document.querySelector('body')?.classList.add('lock');
            }, 300);
          }
        });
      },
      false
    );
  }
});
