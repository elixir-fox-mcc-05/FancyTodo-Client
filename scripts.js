$(document).ready(function () {
  checkStorage()
  $('#login').on('submit', function (event) {
    event.preventDefault()
    const email = $('#loginEmail').val()
    const password = $('#loginPassword').val()
    login(email, password)
  })
})


function login(email,password){
$.ajax({
    method: 'POST',
    url: 'http://localhost:3000/login',
    data: {
      email,
      password
    }
  })
    .done(function (response) {
      const token = response.token
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('token', token)
      $('#list').show()
      // hide landing
//      $('#landingPage').hide()
//      $('#signInError').hide()
      // show dashboard
//      $('#dashboardPage').show()

    })
    .fail(function (err) {
      console.log(err.responseJSON.message, ' <<< error')
      $('#loginError').show()
      $('#loginError').text(err.responseJSON.message)
    })
}


function register(data){
$.ajax({
    method: 'POST',
    url: 'http://localhost:3000/login',
    data: {
      email,
      password
    }
  })
    .done(function (response) {
      const token = response.token
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('token', token)
      // hide landing
//      $('#landingPage').hide()
//      $('#signInError').hide()
      // show dashboard
//      $('#dashboardPage').show()

    })
    .fail(function (err) {
      console.log(err.responseJSON.message, ' <<< error')
      $('#loginError').show()
      $('#loginError').text(err.responseJSON.message)
    })
}

function logout(){
    $('#toDoHeader').hide()
    $('#loginHeader').show()
}

function showLogin(){
    $('.login').show()
    $('.register').hide()
}

function showRegister(){
    $('.login').hide()
    $('.register').show()
}

function showList(){
    $('#edit').hide()
    $('#list').show()
    $('#add').hide()
}

function showAddPage(){
    
}
function addToDo(){
    $('#edit').hide()
    $('#list').hide()
    $('#add').show()
}

function remove(){
    
}
function showEditPage(){
    $('#edit').show()
    $('#list').hide()
    $('#add').hide()
}
function update(){
    
}
