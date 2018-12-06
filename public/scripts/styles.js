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

(function ($) {
 $(document).ready(function(){
   if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
       // hide .navbar first
      //  $(".navbar").hide();
      if ($(this).scrollTop() >= $(".background, .portfolio-background, .contact-background, .blog-background").height()) {
         $('.navbar').addClass("solid");
         $('.navbar-inverse .navbartoggle').addClass("solid");
      } else {
         $('.navbar').removeClass("solid");
         $('.navbar-inverse .navbartoggle').removeClass("solid");
      }
   
       // fade in .navbar
      $(function () {
         $(window).scroll(function () {
                // set distance user needs to scroll before we start fadeIn
            if ($(this).scrollTop() >= $(".background, .portfolio-background, .contact-background, .blog-background").height()) {
                $('.navbar').addClass("solid");
                $('.navbar-inverse .navbartoggle').addClass("solid");
               //  $('.navbar-inverse .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover').addClass("solid");
            } else {
                $('.navbar').removeClass("solid");
                $('.navbar-inverse .navbartoggle').removeClass("solid");
               //  $('.navbar-inverse .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover').removeClass("solid");
            }
         });
      });
   } else {
      $(".navbar").addClass("solid");
      $('.navbar-inverse .navbartoggle').addClass("solid");
   }
});
 }(jQuery));

// (function ($) {
//  $(document).ready(function(){
    
//     // hide .navbar first
//    //  $(".navbar").hide();
//    if ($(this).scrollTop() >= $(".background, .portfolio-background, .contact-background, .blog-background").height()) {
//       $('.navbar').addClass("solid");
//    } else {
//       $('.navbar').removeClass("solid");
//    }

//     // fade in .navbar
//     $(function () {
//        $(window).scroll(function () {

//                 // set distance user needs to scroll before we start fadeIn
//             if ($(this).scrollTop() >= $(".background, .portfolio-background, .contact-background, .blog-background").height()) {
//                 $('.navbar').addClass("solid");
//             } else {
//                 $('.navbar').removeClass("solid");
//             }
//        });
//     });

// });
//  }(jQuery));

// (function ($) {
//  $(document).ready(function(){

//     // hide .navbar first
//     $(".navbar").hide();

//     // fade in .navbar
//     $(function () {
//        $(window).scroll(function () {

//                 // set distance user needs to scroll before we start fadeIn
//             if ($(this).scrollTop() > 100) {
//                 $('.navbar').fadeIn();
//             } else {
//                 $('.navbar').fadeOut();
//             }
//        });
//     });

// });
//  }(jQuery));