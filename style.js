let open = true

function openNav() {
    if (open == true) {
        $('#sidebar').hide()
        open = false;
        console.log(open)
    } else if (open==false) {
        $('#sidebar').show()
        open = true;
    }
  }
  
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}

  function todoNavBtn () {
    $('#todoList').show()
    $('#settings').hide()
    $('#newTask').show()
    $('#editTask').hide()
    $('#taskRes').hide()
    $('#taskResErr').hide()
    $('#taskResDel').hide()
}

function setNavBtn () {
    $('#todoList').hide()
    $('#newTask').hide()
    $('#editTask').hide()
    $('#settings').show()
}

function themeGray() {
  $('#sidebar').css('background','#f1f1f1')
  $('#themeNav').css('background','#f1f1f1')
  $('#main').css('background','white')
  $('.navBtnGroup').css('background','#fcfcfc')
  $('*').css('color','black')
  
}

function themeBlue() {
    $('body').css('color','black')
    $('#sidebar').css('background','#7de1f5')
    $('#themeNav').css('background','#7de1f5')
    $('#main').css('background','#edfcff')
    $('.navBtnGroup').css('background','#8aecff')
    $('*').css('color','black')
    
}

function themeRed() {
  $('body').css('color','black')
  $('#sidebar').css('background','#f57d7d')
  $('#themeNav').css('background','#f57d7d')
  $('#main').css('background','#ffeded')
  $('.navBtnGroup').css('background','#ff8a8a')
  $('*').css('color','black')
}


function themeGreen () {
  $('body').css('color','black')
  $('#sidebar').css('background','#7df5bb')
  $('#themeNav').css('background','#7df5bb')
  $('#main').css('background','#edfff5')
  $('.navBtnGroup').css('background','#8affbb')
  $('*').css('color','black')
}

function themeYellow () {
  $('#sidebar').css('background','#f5e97d')
  $('#themeNav').css('background','#f5e97d')
  $('#main').css('background','#feffed')
  $('.navBtnGroup').css('background','#fdff8a')
  $('*').css('color','black')
}

function themeDark () {
  $('body').css('color','whitesmoke')
  $('#sidebar').css('background','#000000')
  $('#themeNav').css('background','#000000')
  $('#main').css('background','#1c1c1c')
  $('.navBtnGroup').css('background','#111')
  $('*').css('color','whitesmoke')
}

