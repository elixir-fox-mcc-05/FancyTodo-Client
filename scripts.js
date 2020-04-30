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
        checkStorage()
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
    $('#loggedin').show()
    $('#loggedout').hide()
    hideAll()
    $('#list').show()
    fetchToDo()
  } else {
    $('#landingPage').show()
    $('#dashboardPage').hide()
    hideAll()
    $('#login').show()
    $('#loggedin').hide()
    $('#loggedout').show()
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
            <td><button onclick="showEditPage(${temp.id},'${temp.title}','${temp.description}','${temp.due_date}',${temp.status},${temp.UserId})">edit</button>
            <button onclick="remove(${temp.id})">delete</button></td>
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
     const token = localStorage.getItem('token')
     $.ajax({
        method: 'delete',
        url: `http://localhost:3000/todos/${id}`,
        params : { id },
         headers : { token }
      })
    .done(response => {
        fetchToDo()
    })
    .fail(err => {
        console.log(err.responseJSON)
    })
    
}

function showEditPage(id,title,description,due_date,status,UserId){
    due_date = new Date(due_date)
    console.log(due_date)
    hideAll()
    $('#edit').show()
    $('#edit').append(`
                    <input type="text" placeholder="title" id="editTitle" value="${title}"><br>
                    <input type="text" placeholder="description" id="editDescription" value="${description}"><br>
                    <input type="text" placeholder="due date" id="editdue_date" value="${due_date}"><br>
                    <input type="radio" id="editStatus" name="not completed" value="false" ${!status ? "selected" : ""}>not completed
                    <input type="radio" id="editStatus" name="not completed" value="true" ${status ? "selected" : ""}>completed
                    <button class="is-centered" onclick="update('${id}','${title}','${description}','${due_date}','${status}','${UserId}')">Edit</button>
    `)
    
//    $('#').value(`${data.title}`)
//    $('#').value(`${data.description}`)
//    $('#').value(`${data.due_date}`)
}

function update(id){
     const token = localStorage.getItem('token')
     
    title = $('#editTitle').val()
    description = $('#editDescription').val()
    due_date = $('#editdue_date').val()
    status = $('#editStatus').val()
    console.log(id,title,description,due_date,status)
    $.ajax({
       method: 'put',
       url: `http://localhost:3000/todos/${id}`,
        headers : {
            token
        },
        data : {
            title,
            description,
            due_date,
            status
        },
              
          success: function(msg){
            console.log("eh masuk")
            fetchToDo()
        }
     })
    
     /*
    .done(response => {
      console.log("eh masuk")
       fetchToDo()
    })
    
    .fail(err => {
      console.log("eh gak")
        console.log(err)
    })
    */
    
    console.log("bodo")
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
    $('#toDoTable').empty()
    $('#toDoTable').append(`
                <tr>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Status</td>
                    <td>Due Date</td>
                    <td>Actions</td>
                </tr>`)
    checkStorage()
}
