import { Swiper } from 'swiper/bundle';


export const modalInit = () => {
  /* 定義
  ------------------- */
  const modals = document.querySelector('.js-modal');
  const menus = document.querySelectorAll('.js-header__menuItem');
  const closes = document.querySelectorAll('.js-modalClose');
  const OPEN_CLASS = 'modal--open';

  /* 処理
  ------------------- */
  for(let menu of menus) {
    menu.addEventListener('click', function(){
      const modalIndex = this.dataset.modalIndex;
      const modal = document.querySelector(`[data-modal="${modalIndex}"]`);
      const isOpen = modal.classList.contains(OPEN_CLASS);

      isOpen ? modal.classList.remove(OPEN_CLASS) :  modal.classList.add(OPEN_CLASS);

    });
  }

  for(let close of closes) {
    close.addEventListener('click', function(){
      const currentViewModal = this.closest('.js-modal');
      currentViewModal.classList.add('animate__fadeOut');
      setTimeout(function(){
        currentViewModal.classList.remove(OPEN_CLASS, 'animate__fadeOut');
      }, 500);
    });
  }

  window.addEventListener('load', function(){
    // case用のSwiper
  new Swiper('.swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
    },
    /* breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 32,
        centeredSlides: true,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1080: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1380: {
        slidesPerView: 4,
        spaceBetween: 32,
      }
    }, */
  });
  })
}