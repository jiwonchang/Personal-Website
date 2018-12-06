// function for modal image display functionality
$(".pop").on("click", function() {
   $('.imagepreview').attr('src', $(this).find('img').attr('src')); // here asign the image to the modal when the user click the enlarge link
   $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
});

// function for parallax scrolling
$window = $(window);
$window.on('scroll', function() {
   if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      //  $('.background').css('margin-top', $(window).scrollTop() * .3);
       $('.parallax').css('margin-top', $(window).scrollTop() * .9);
   }
});

// makes navbar transparent above a certain point and have color after a certain point of scrolling
(function ($) {
 $(document).ready(function(){
   //  "IF NOT A MOBILE DEVICE" (Not limited to changing navbars, but everything else that needs to be done only on a computer!)
   //  ONLY CHANGE NAV BAR TO BE FANCY ON COMPUTERS AND NOT ON MOBILE DEVICES
   if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // add the original navbar background-color to the resume div. Since the resume div has a padding-top which goes under the
      // fixed-top navbar, the navbar will seem to have a background color ONLY for the resume page.
      $(".content-beginning-white-space").addClass("add-navbar-color");
      
      // if we refresh the page while we're at a scroll location where the color should have been added, then quickly add the color
      // into the navbar as soon as the page loads at that point.
      // if we refresh the page while at a scroll location where the nav bar should be transparent, make it transparent as soon as
      // the page loads
      if ($(this).scrollTop() >= $(".background-div").height()) {
         $('.navbar').css("transition", "background-color 0s ease 0s");
         $('.navbar').addClass("solid");
         $('.navbar-inverse .navbartoggle').addClass("solid");
      } else {
         $('.navbar').css("transition", "background-color 0s ease 0s");
         $('.navbar').removeClass("solid");
         $('.navbar-inverse .navbartoggle').removeClass("solid");
      }
   
      // Once we have scrolled past a certain point (in this case, the bottom of a background image), add color to the transparent
      //  navbar by adding a "solid" class to the ".navbar".
      $(function () {
         $(window).scroll(function () {
                // set distance user needs to scroll before we start fadeIn
            if ($(this).scrollTop() >= $(".background-div").height()) {
               $('.navbar').css("transition", "background-color 0.5s ease 0s");
               $('.navbar').addClass("solid");
               $('.navbar-inverse .navbartoggle').addClass("solid");
               //  $('.navbar-inverse .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover').addClass("solid");
            } else {
               $('.navbar').css("transition", "background-color 0.5s ease 0s");
               $('.navbar').removeClass("solid");
               $('.navbar-inverse .navbartoggle').removeClass("solid");
               //  $('.navbar-inverse .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover').removeClass("solid");
            }
         });
      });
   } else {
      // if on a mobile device, add the "solid" class and thereby make the navbar be non-transparent
      $(".navbar").addClass("solid");
      $('.navbar-inverse .navbartoggle').addClass("solid");
   }
});
 }(jQuery));