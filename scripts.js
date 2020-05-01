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
    $('#login').hide()
//    $('#home').show()
    home() 
})

function home(){
    $('#homeContent').empty()
    hideAll()
    $('#home').show()
    $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/holidays'
    })
    
    .done(response => {
        console.log(response)
        let today = new Date()
        let todaymonth = new Date().toLocaleString('default', { month: 'long' })
        $('#homeContent').html(`
            <h1>${todaymonth}<h1>
            
        `)
        for (let i =0; i < (new Date(today.getFullYear(), today.getMonth(),0).getDate()); i+6){
                $('#homeContent').append(`
                    <div class="columns">
                    <div class="column">${i+1}</div>
                    <div class="column">${i+2}</div>
                    <div class="column">${i+3}</div>
                    <div class="column">${i+4}</div>
                    <div class="column">${i+5}</div>
                    <div class="column">${i+6}</div>
                    <div class="column">${i+7}</div>
                    </div>
                    `)
//            if(i % 7 == 0){
//                    $('#homeContent').append(`
//                       </div>
//                        <div class="columns">
//                    `)
//            }
        }

    })
    
    .fail(err => {
      console.log(err.responseJSON)
    })
    
}

function login(email, password) {
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


    })
    .fail(err => {
      console.log(err.responseJSON)

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

function hideAll() {
    $('#home').hide()
  $('#edit').hide()
  $('#list').hide()
  $('#add').hide()
  $('#login').hide()
  $('#register').hide()
    $('#delete').hide()
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
      $('#toDoTable').empty()
      $('#toDoTable').append(`
                <tr>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Status</td>
                    <td>Due Date</td>
                    <td>Actions</td>
                </tr>`)
      const toDo = response.todos
      // console.log(toDo)
      $('#listtitle').html(`welcome back ${toDo[0].User.first_name} ${toDo[0].User.last_name}, here's your toDo List`)
      //      console.log(response)
      toDo.forEach(temp => {
        var date = new Date(temp.due_date)
        $('#toDoTable').append(`
        <tr>
            <td>${temp.title}</td>
            <td>${temp.description}</td>
            <td>${temp.status ? 'completed' : 'incompleted'}</td>
            <td>${date.getDate()}-${date.getMonth()}-${date.getFullYear()}</td>
            <td><button class="button is-small is-primary has-background-info" onclick="showEditPage(${temp.id},'${temp.title}','${temp.description}','${temp.due_date}',${temp.status},${temp.UserId})">edit</button>
            <button  class="button is-small is-primary has-background-danger" onclick="showRemoveConfirm(${temp.id})">delete</button></td>
        </tr><br>
         `)
      })
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function register(userdata) {
  console.log(userdata)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/register',
    data: {
      first_name: userdata.first_name,
      last_name: userdata.last_name,
      email: userdata.email,
      password: userdata.password
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
    })
}



function logout() {
  hideAll()
  $('#toDoHeader').hide()
  $('#loginHeader').show()
}

function showLogin() {
  hideAll()
  $('#login').show()
}

function showRegister() {
  hideAll()
  $('#register').show()
}

function showList() {
  hideAll()
  $('#list').show()
}

function showAddPage() {
  hideAll()
    $('#addErrorHeader').hide()
  $('#add').show()
}

function addToDo() {
  const token = localStorage.getItem('token')

  let title = $('#addTitle').val()
  let description = $('#addDescription').val()
  let due_date = $('#adddue_date').val()
//  $('#sumitLogin').addClass('is-loading')
  console.log(title, description, due_date)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/todos',
    headers: {
      token
    },
    data: {
      title,
      description,
      due_date
    }
  })
    .done(response => {
      fetchToDo()
      showList()
    })
    .fail(err => {
      let error = err.responseJSON.err.split(",")
      $('#addErrorHeader').show()
      $('#addError').text(error[0])
//      console.log(err.responseJSON)
    })
}


function showDelete(){
    hideAll()
    $('#delete').show()
    $('#delete').html(`<div class="box">
                    <h1 class="hero-body title">Edit ToDo</h1>
                    <h2 id="editError" class=""></h2>
                    <input class="input is-medium" type="text" placeholder="title" id="editTitle" value="${title}"><br>
                    <input class="input is-medium" type="text" placeholder="description" id="editDescription" value="${description}"><br>
                    <input class="input is-medium" type="text" placeholder="due date" id="editdue_date" value="${due_date}"><br>
                    <input class="radio" type="radio" id="editStatus" name="status" value="false" ${!status ? "checked" : ""}>not completed
                    <input class="radio" type="radio" id="editStatus" name="status" value="true" ${status ? "checked" : ""}>completed
                    <button class="button is-block is-info is-large is-fullwidth" onclick="update('${id}','${title}','${description}','${due_date}','${status}','${UserId}')">Edit</button>
                    <div>
    `)
}

function showRemoveConfirm(id){
    $('#delete').show()
    $('#delete').append()
}


function remove(id) {
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'delete',
    url: `http://localhost:3000/todos/${id}`,
    params: { id },
    headers: { token }
  })
    .done(response => {
      fetchToDo()
      showList()
    })
    .fail(err => {
      console.log(err.responseJSON)
    })

}

function showEditPage(id, title, description, due_date, status, UserId) {
  due_date = new Date(due_date)
  console.log(due_date)
  hideAll()
  $('#edit').show()
  $('#edit').html(`<div class="box">
                    <h1 class="hero-body title">Edit ToDo</h1>
                    <h2 id="editError" class=""></h2>
                    <input class="input is-medium" type="text" placeholder="title" id="editTitle" value="${title}"><br>
                    <input class="input is-medium" type="text" placeholder="description" id="editDescription" value="${description}"><br>
                    <input class="input is-medium" type="text" placeholder="due date" id="editdue_date" value="${due_date}"><br>
                    <input class="radio" type="radio" id="editStatus" name="status" value="false" ${!status ? "checked" : ""}>not completed
                    <input class="radio" type="radio" id="editStatus" name="status" value="true" ${status ? "checked" : ""}>completed
                    <button class="button is-block is-info is-large is-fullwidth" onclick="update('${id}','${title}','${description}','${due_date}','${status}','${UserId}')">Edit</button>
                    <div>
    `)

}

function update(id) {
  const token = localStorage.getItem('token')

  title = $('#editTitle').val()
  description = $('#editDescription').val()
  due_date = $('#editdue_date').val()
  status = $("#editStatus[name=status]:checked").val()
//  console.log(status)
  $.ajax({
    method: 'put',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      token
    },
    data: {
      title,
      description,
      due_date,
      status
    }
  })

    .done(response => {
//      console.log("eh masuk")
      fetchToDo()
      showList()
    })

    .fail(err => {
      $('#editError').html(err.responseJSON.err)
//      console.log("eh gak")
      console.log(err)
    })


}

function logout() {
   const auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
     localStorage.removeItem('access_token');
     $('#main').empty();
     $('#login-navbar-button').hide();
     $('#not-login-navbar-button').show();
     showFormLogin();
   });
  localStorage.clear()

  checkStorage()
}

function onSignIn(googleUser) {

  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/logingoogle',
    headers: {
      google_token: id_token
    }
  })

    .done(response => {
      const token = response.token
      console.log(response)
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('token', token)
      checkStorage()
    })

    .fail(err => {
      console.log(err.responseJSON)
    })
}
