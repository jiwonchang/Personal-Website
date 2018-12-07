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

// makes the text fade in AFTER the background image has been loaded
 // the code immediately below selects the background div's background image URL and stores it in a variable, then removes the
 // "url(" and ")" that "background-image" style requires.
var bgImgUrlOrg = $('.background-div').css('background-image');
var bgImgUrl = $('.background-div').css('background-image');
bgImgUrl = bgImgUrl.replace('url(','').replace(')','').replace(/\"/gi, "");
 // the code below makes a new image based on the background image URL, loads that image, THEN makes the text fade in.
 // this makes it so that the text doesn't awkwardly fade in before the picture is loaded.
$('<img/>').attr('src', bgImgUrl).on('load', function() {
   $(this).remove(); // prevent memory leaks as @benweet suggested
   $('background-div').css('background-image', bgImgUrlOrg);
   // code, run after image load
   $(".fade-in-text").addClass("load");
    
   // delay for 0.7 seconds to fade in subtitles
   setTimeout(
      function() {
       $(".delay-fade-in-text").addClass("load");
      }, 1000);
});
 // the below code is an alternate, perhaps less efficient method for waiting until background image is loaded before fade-in:
// var image = new Image();
// image.src = bgImgUrl;
// image.onload = function() {
//    $(this).remove();
   
//    // code, run after image load
//    $(".fade-in-text").addClass("load");
    
//    // delay for 0.7 seconds to fade in subtitles
//    setTimeout(
//       function() {
//        $(".delay-fade-in-text").addClass("load");
//       }, 700);
// }

// code for making the text fade in (without waiting for image to load)
// $(".fade-in-text").addClass("load");
 
// // delay for 0.7 seconds to fade in subtitles
// setTimeout(
//    function() {
//     $(".delay-fade-in-text").addClass("load");
//    }, 700);

if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
   //  $('.background').css('margin-top', $(window).scrollTop() * .3);
   $('.resume-div .resume').css('display', 'none');
   // $('.resume-div').addClass('resume-div-center-btn');
   //  $('.resume-div').css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'});
   $('.resume-btn-desc').addClass('resume-btn-desc-active');
   $('.resume-btn-div').addClass('resume-btn-div-active');
   $('.resume-div .resume-btn').addClass('resume-btn-active');
}