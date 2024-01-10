/* Original Credit for framework to 
// Materializecss Stepper - By Kinark 2016
// https://github.com/Kinark/Materialize-stepper
// JS v2.0.3
//
// Edits for R and themeing to 
// Carl Boneri 2017
//
//
*/

var validation = $.isFunction($.fn.valid) ? 1 : 0;

$.fn.isValid = function() {
  if (validation) {
    return this.valid();
  } else {
    return true;
  }
};

/* Style Attributions inserted
// ul.stepper:not(.horizontal) .step.wrong::before, 
// ul.stepper.horizontal .step.wrong .step-title::before {
//   content: '\e001';
//   font-size: 24px;
//   font-family: 'Material Icons';
//   background-color: red !important;
// }
// ul.stepper:not(.horizontal) .step.active::before,
// ul.stepper:not(.horizontal) .step.done::before, 
// ul.stepper.horizontal .step.active .step-title::before,
// ul.stepper.horizontal .step.done .step-title::before {
//   background-color: #2196f3;
// }
// ul.stepper:not(.horizontal) .step.done::before, 
// ul.stepper.horizontal .step.done .step-title::before {
//   content: '\e5ca';
//   font-size: 16px;
//   font-family: 'Material Icons';
// }
*/
if (validation) {
  $.validator.setDefaults({
    errorClass: 'invalid',
    validClass: "valid",
    errorPlacement: function(error, element) {
      if (element.is(':radio') || element.is(':checkbox')) { // Input checkboxes or radio, maybe switches?
        error.insertBefore($(element).parent());
      } else {
        error.insertAfter(element); // default error placement.
        // element.closest('label').data('error', error);
        // element.next().attr('data-error', error);
      }
    },
    success: function(element) {
      if (!$(element).closest('li').find('label.invalid:not(:empty)').length) {
        $(element).closest('li').removeClass('wrong');
      }
    }
  });
}

$.fn.getActiveStep = function() {
  active = this.find('.step.active');
  return $(this.children('.step:visible')).index($(active)) + 1;
};

$.fn.activateStep = function() {
  $(this).addClass("step").stop().slideDown(function() {
    $(this).css({
      'height': 'auto',
      'margin-bottom': ''
    });
  });
};

$.fn.deactivateStep = function() {
  $(this).removeClass("step").stop().slideUp(function() {
    $(this).css({
      'height': 'auto',
      'margin-bottom': '10px'
    });
  });
};

$.fn.showError = function(error) {
  if (validation) {
    name = this.attr('name');
    form = this.closest('form'); // Change if not using FORM elements
    var obj = {};
    obj[name] = error;
    form.validate().showErrors(obj);
    this.closest('li').addClass('wrong');
  } else {
    this.removeClass('valid').addClass('invalid');
    this.next().attr('data-error', error);
  }
};
/* CSS ADJUSTMENTS
// This controls any progress indicators in the step forms. Styles should be adjusted accordingly to template.
// SEE http://materializecss.com/preloader.html For variations on preloader colors or simply:
// .spinner-(\\w+),.spinner-(\\w+)-only {
//    border-color: #0f9d58
// }
//
// .active .spinner-layer.spinner-(\\w+) {
//    -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
//                       (\\w+)-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
//      animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
//                 (\\w+)-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both
// }
// @-webkit-keyframes blue-fade-in-out {
//   from {
//       opacity: 1
//   }
//   25% {
//       opacity: 1
//   }
//   26% {
//       opacity: 0
//   }
//   89% {
//       opacity: 0
//   }
//   90% {
//       opacity: 1
//   }
//   100% {
//       opacity: 1
//   }
// }
// @keyframes blue-fade-in-out {
//   from {
//       opacity: 1
//   }
//   25% {
//       opacity: 1
//   }
//   26% {
//       opacity: 0
//   }
//   89% {
//       opacity: 0
//   }
//   90% {
//       opacity: 1
//   }
//   100% {
//       opacity: 1
//   }
// }
*/
$.fn.activateFeedback = function() {
  active = this.find('.step.active:not(.feedbacking)').addClass('feedbacking').find('.step-content');
  active.prepend(
    '<div class="wait-feedback">' +
    '  <div class="preloader-wrapper active">' +
    '    <div class="spinner-layer spinner-blue">' + //style attribute in class
    '      <div class="circle-clipper left">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="gap-patch">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="circle-clipper right">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="spinner-layer spinner-red">' + //style attribute in class
    '      <div class="circle-clipper left">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="gap-patch">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="circle-clipper right">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="spinner-layer spinner-yellow">' + //style attribute in class
    '      <div class="circle-clipper left">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="gap-patch">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="circle-clipper right">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="spinner-layer spinner-green">' + //style attribute in class
    '      <div class="circle-clipper left">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="gap-patch">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '      <div class="circle-clipper right">' +
    '        <div class="circle"></div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>');
  /*
  // MINIMIZED
  //'<div class="wait-feedback"> <div class="preloader-wrapper active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div></div>');
  */
};

$.fn.destroyFeedback = function() {
  active = this.find('.step.active.feedbacking');
  if (active) {
    active.removeClass('feedbacking');
    active.find('.step-content').find('.wait-feedback').remove();
  }
  return true;
};

$.fn.resetStepper = function(step) {
  if (!step) step = 1;
  form = $(this).closest('form'); // Change if not using FORM elements
  $(form)[0].reset();
  Materialize.updateTextFields();
  return $(this).openStep(step);
};

$.fn.submitStepper = function(step) {
  form = this.closest('form'); // Change if not using FORM elements
  if (form.isValid()) {
    form.submit();
  }
};

$.fn.nextStep = function(ignorefb) {
  stepper = this;
  form = this.closest('form');
  active = this.find('.step.active');
  next = $(this.children('.step:visible')).index($(active)) + 2;
  feedback = $(active.find('.step-content').find('.step-actions').find('.next-step')).data("feedback");
  if (form.isValid()) {
    if (feedback && ignorefb) {
      stepper.activateFeedback();
      return window[feedback].call();
    }
    active.removeClass('wrong').addClass('done');
    this.openStep(next);
    return this.trigger('nextstep');
  } else {
    return active.removeClass('done').addClass('wrong');
  }
};

$.fn.prevStep = function() {
  active = this.find('.step.active');
  prev = $(this.children('.step:visible')).index($(active));
  active.removeClass('wrong');
  this.openStep(prev);
  return this.trigger('prevstep');
};

$.fn.openStep = function(step, callback) {
  $this = this;
  step_num = step - 1;
  step = this.find('.step:visible:eq(' + step_num + ')');
  if (step.hasClass('active')) return;
  active = this.find('.step.active');
  prev_active = next = $(this.children('.step:visible')).index($(active));
  order = step_num > prev_active ? 1 : 0;
  if (active.hasClass('feedbacking')) $this.destroyFeedback();
  active.closeAction(order);
  step.openAction(order, function() {
    $this.trigger('stepchange').trigger('step' + (step_num + 1));
    if (step.data('event')) $this.trigger(step.data('event'));
    if (callback) callback();
  });
};

$.fn.closeAction = function(order, callback) {
  closable = this.removeClass('active').find('.step-content');
  if (!this.closest('ul').hasClass('horizontal')) {
    closable.stop().slideUp(300, "easeOutQuad", callback);
  } else {
    if (order == 1) {
      closable.animate({
        left: '-100%'
      }, function() {
        closable.css({
          display: 'none',
          left: '0%'
        }, callback);
      });
    } else {
      closable.animate({
        left: '100%'
      }, function() {
        closable.css({
          display: 'none',
          left: '0%'
        }, callback);
      });
    }
  }
};

$.fn.openAction = function(order, callback) {
  openable = this.removeClass('done').addClass('active').find('.step-content');
  if (!this.closest('ul').hasClass('horizontal')) {
    openable.slideDown(300, "easeOutQuad", callback);
  } else {
    if (order == 1) {
      openable.css({
        left: '100%',
        display: 'block'
      }).animate({
        left: '0%'
      }, callback);
    } else {
      openable.css({
        left: '-100%',
        display: 'block'
      }).animate({
        left: '0%'
      }, callback);
    }
  }
};

$.fn.activateStepper = function() {
  $(this).each(function() {
    var $stepper = $(this);
    if (!$stepper.parents("form").length) {
      method = $stepper.data('method');
      action = $stepper.data('action');
      method = (method ? method : "GET");
      action = (action ? action : "?");
      $stepper.wrap('<form action="' + action + '" method="' + method + '"></div>');
    }
    $stepper.find('li.step.active').openAction(1);

    $stepper.on("click", '.step:not(.active)', function() {
      object = $($stepper.children('.step:visible')).index($(this));
      if (!$stepper.hasClass('linear')) {
        $stepper.openStep(object + 1);
      } else {
        active = $stepper.find('.step.active');
        if ($($stepper.children('.step:visible')).index($(active)) + 1 == object) {
          $stepper.nextStep(true);
        } else if ($($stepper.children('.step:visible')).index($(active)) - 1 == object) {
          $stepper.prevStep();
        }
      }
    }).on("click", '.next-step', function(e) {
      e.preventDefault();
      $stepper.nextStep(true);
    }).on("click", '.previous-step', function(e) {
      e.preventDefault();
      $stepper.prevStep();
      // May want to ammend to 'a' tag for R purposes or more than likely use an ID selector
      // for shiny observer purposes... so for R if the action button for submissions was 
      // `input$form_step_submit`:
      //}).on("click", "#form_step_submit", function(e) { 
    }).on("click", "button:submit:not(.next-step, .previous-step)", function(e) {
      e.preventDefault();
      form = $stepper.closest('form');
      if (form.isValid()) {
        form.submit();
      }
    });
  });
};

function someFunction() {
  setTimeout(function() {
    $('#feedbacker').nextStep();
  }, 200);
}
$(document).ready(function() {
  $('ul.tabs').tabs()
  $('.rt-select').material_select();
  //Init for stepper
  $('.stepper').activateStepper();
  //$(selector).nextStep();

});