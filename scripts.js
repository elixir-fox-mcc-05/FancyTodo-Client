$(document).ready(function () {
//    $('#edit').hide()
//    $('#list').hide()
//    $('#add').hide()
  checkStorage()
  $('#login').on('submit', function (event) {
    event.preventDefault()
    const email = $('#loginEmail').val()
    const password = $('#loginPassword').val()
    login(email, password)
  })
    
    $('#register').on('submit', function (event) {
    event.preventDefault()
    let data = {}
    data.first_name = $('#regFirst_Name').val()
    data.last_name = $('#regLast_Name').val()
    data.email = $('#regEmail').val()
    data.password = $('#regPassword').val()
    register(data)
  })
})



function login(email,password){
//    const email = $('#loginEmail').val()
//    const password = $('#loginPassword').val()
$.ajax({
    method: 'POST',
    url: 'http://localhost:3000/login',
    data: {
      email,
      password
    }
  })
    .done(response => {
        const token = response.token
        $('#loginEmail').val('')
        $('#loginPassword').val('')
        localStorage.setItem('token', token)
        hideAll()
        $('#addPage').hide()
        $('#list').show()
        // hide landing
//      $('#landingPage').hide()
//      $('#signInError').hide()
      // show dashboard
//      $('#dashboardPage').show()

    })
    .fail(err => {
    console.log(err.responseJSON)
//      console.log(err.responseJSON.message, ' <<< error')
//      $('#loginError').show()
//      $('#loginError').text(err.responseJSON.message)
    })
}

function checkStorage() {
  if (localStorage.token) {
    $('#landingPage').hide()
    $('#dashboardPage').show()
    hideAll()
    $('#list').show()
    fetchToDo()
  } else {
    $('#landingPage').show()
    $('#dashboardPage').hide()
  }
}

function hideAll(){
    $('#edit').hide()
    $('#list').hide()
    $('#add').hide()
    $('#login').hide()
    $('#register').hide()
}

function fetchToDo() {
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/todos',
    headers: {
      token
    }
  })
    .done(function (response) {
      const toDo = response.todos
//      console.log(response)
      toDo.forEach(temp => {
          var date = new Date(temp.due_date)
           $('#toDoTable').append(`
        <tr>
            <td>${temp.title}</td>
            <td>${temp.description}</td>
            <td>${temp.status ? 'completed' : 'incompleted'}</td>
            <td>${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
            <td><button onclick="update({temp.id})">edit</button>
            <button onclick="delete({temp.id})">delete</button></td>
        </tr><br>
         `)
      })     
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function register(userdata){
    console.log(userdata)
$.ajax({
    method: 'POST',
    url: 'http://localhost:3000/register',
    data: {
        first_name : userdata.first_name,
        last_name : userdata.last_name,
        email : userdata.email,
        password : userdata.password
    }
  })
    .done(function (response) {
        $('#regFirst_Name').val('')
        $('#regLast_Name').val('')
        $('#regEmail').val('')
        $('#regPassword').val('')
        
    $('#register').hide()
    $('#login').show()

    })
    .fail(function (err) {
      console.log(err.responseJSON)
//      console.log(err.responseJSON.message, ' <<< error')
//      $('#loginError').show()
//      $('#loginError').text(err.responseJSON.message)
    })
}



function logout(){
    hideAll()
    $('#toDoHeader').hide()
    $('#loginHeader').show()
}

function showLogin(){
    hideAll()
    $('#login').show()
}

function showRegister(){
    hideAll()
    $('#register').show()
}

function showList(){
    hideAll()
    $('#list').show()
}

function showAddPage(){
    hideAll()
    $('#add').show()
}

function addToDo(){
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/todos',
        data: {
            title,
            description,
            due_date
        }
      })
    .done(response => {
        
    })
    .fail(err => {
        console.log(err)
    })
}

function remove(id){
    
     $.ajax({
        method: 'REMOVE',
        url: 'http://localhost:3000/todos/:id',
        params : { id }
      })
    .done(response => {
        const toDo = response.toDo
        $('#toDoTable').append(`
        <tr>
            <td>${toDo.title}</td>
            <td>${toDo.description}</td>
            <td>${toDo.status ? 'completed' : 'incompleted'}</td>
            <td>${toDo.due_date}</td>
            <td><button type="submit">edit</button><button type="submit">delete</button></td>
        </tr><br>
         `)
    })
    .fail(err => {
        console.log(err)
    })
    
}

function showEditPage(){
    hideAll()
    $('#edit').show()
    
}

function update(id){
    
     $.ajax({
        method: 'PUT',
        url: 'http://localhost:3000/todos/:id',
        params : { id }
      })
    
    .done(response => {
        const toDo = response.toDo
        $('#toDoTable').append(`
        <tr>
            <td>${toDo.title}</td>
            <td>${toDo.description}</td>
            <td>${toDo.status ? 'completed' : 'incompleted'}</td>
            <td>${toDo.due_date}</td>
            <td><button type="submit">edit</button><button type="submit">delete</button></td>
        </tr><br>
         `)
    })
    
    .fail(err => {
        console.log(err)
    })
}

function logout() {
//  const auth2 = gapi.auth2.getAuthInstance();
//  auth2.signOut().then(function () {
//    localStorage.removeItem('access_token');
//    $('#main').empty();
//    $('#login-navbar-button').hide();
//    $('#not-login-navbar-button').show();
//    showFormLogin();
//  });
    localStorage.clear()
    showLogin()
}
