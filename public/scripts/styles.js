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

// function for changing the index page background 
// $(function() {
//     $(window).resize(function() {
//        if ($(this).width() < 1000) {
//             $('body').css('background-image', "url('images/background-mobile.svg')");
//        } else { 
//             // default setting for desktop here...
//             $('body').css('background-image', 'none');
//        }
//     });
// });