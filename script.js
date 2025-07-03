'use state';

//Using the Event Bublling/ Event Delegation: Implementing Page Navigation

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();

  section1.scrollIntoView({ behavior: 'smooth' });
});

//page Navigation wihout Event Delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // prevents reloading of the anchor tags
//     const id = this.getAttribute('href'); // remember getattribute gives relative url thats what we want from #, and we dont want htpps..
//     //the above gives the id of the queryselector. gives the output of #section--1 etc
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// the above works well but it is not effecient, since the same function is attched to three elements
//what if we have a 100 elemenets, wewill be creating more copies of that function
// the solution is we use event delegation and target the common parent of all the children we are targeting

//USing Event Delegation
//1: add Event LIsterner to the common parent
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //e.target is used to show wherre the trigger originated from, in this case match the elements tht you want

  //Matching Stategy --> ignoring clicks that did not come from the clicks we want
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  if (!clicked) return; // this means that if there is no clicked, js will not execute the following code, hence, no error will occur
  //Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // remove active class from all of them and then add it to the one clicked
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Content Active Area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) //tab --> part after the data e.g data-tab
    .classList.add('operations__content--active');
});

//Menu Fade Animation
const nav = document.querySelector('.nav');

const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Method 1////////////////////////////////////////

// Implementing a stikcy Navigation
//using a scroll Event
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY); //from top of view port to the top of the page
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// //the above is not good becuase of perfomance, this is because the scroll changes all the time and is fired all the time
// //using the intersection of server API
// //the API allows the code to observer changes to the way a certain target element intersects another element or the way intersects the viewport
// const obsCallback = function (entries, observer) {
//   //in the above, the callback is passed when moving into the view and out of the view
//   // gets called no matter we scrolling up or down, --> entries is an array of threshold
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, // the element that is targeting to intersect, null intersects the entire viewport
//   threshold: [0, 0], // the percentage of intersection at which the observer function will be called
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//when do we want the navigation to be sticky, when the navigation moves out of view
//this time observing the header

////////////////////////////////////////////////////////////////////////////////
////////////////////////method 2///////////////////////////////////////////////
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Revealing Elements Scroll
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  //need one specific target and that comes from the target
  if (!entry.isIntersecting) return; // remove the class only when it is intersection
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //stop the observing event for perfomance
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, //ths is the viewport
  threshold: 0.15, //show the viewport when its 15% visible, point of intersection, by default is 0
});

allSections.forEach(function (section) {
  // al the sections
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

////////////////Implementing Lazy Loading of Images/.////////
// select the image targets, we not selecting all the images, such as profile images and logos
//only images containing attributes of data source
const imgTargets = document.querySelectorAll('img[data-src');

const loadImg = function (entries, observer) {
  const [entry] = entries; // we have only one threshold, hence onely one entry, get it
  // console.log(entry);

  if (!entry.isIntersecting) return; //if they are not intersecting, then we need to do an early return, otherwise
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //remove the blur after the image have finisehd to load
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-50px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//Building a Slider Component

const slider = function () {
  //establish a condition where they are side by side on the slider
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  ///////Implementing Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i} </button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //making the buttons work
  //Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //using Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();
};

slider();
