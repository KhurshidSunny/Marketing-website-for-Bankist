'use strict';

//////////////////////////////////////

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const header = document.querySelector('header');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Model window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((modal, i) => {
  modal.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// nav bar links smooth scrolling
// for smooth scrolling efficiently and using only one
// event handler for all elements using (Event Deligaton)

// use event handler on one common parent and it will apply on the remaining children

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy just do work click on elment not whole nav bar
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Smooth Scrolling
btnScrollTo.addEventListener('click', function () {
  // more modern and easy way to scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed Component

// Adding event handler to buttons
// we will use event Deligation

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  //  Remove Active tabs
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(op => op.classList.remove('operations__content--active'));

  // Add Active Classes
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // select all the siblings
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // also select the logo
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
// passing arguments into event handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// using sticky navigation for our website

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when section1 is completely hidden in viewport means 0
  rootMargin: `${-navHeight}px`,
});

headerObserver.observe(header);

// scrolling of sections
const allSections = document.querySelectorAll('.section');

const sectionCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // once the sections are observed then they will not be observed every time with  scroll
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const allImages = document.querySelectorAll('img[data-src]');

const imgCallback = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImages.forEach(feature => {
  imgObserver.observe(feature);
});

// slider

const slider = function () {
  let curSlide = 0;

  const slides = document.querySelectorAll('.slide');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const maxSlide = slides.length - 1;
  const dotContainer = document.querySelector('.dots');

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach((dot, i) => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // goto Slide
  const gotoSlide = function (slide) {
    slides.forEach(
      (sl, i) => (sl.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // go to next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // change slide with arrow keys
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') nextSlide();
    if (e.key === 'ArrowRight') prevSlide();
  });

  // dots slide change
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
