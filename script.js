const baseUrl = 'http://localhost:3000'

$( document ).ready(function(){
    authorize()
    if(localStorage.getItem('token')){
        empty()
        fetchTodo()
    }
    $("#login-form").submit(function(event) {
        event.preventDefault()
        $.ajax({
            type: "post",
            url: baseUrl + '/user/login',
            data: {
                email : $('#email').val(),
                password : $('#password').val()
            },
        })
            .done(data => {
                localStorage.setItem('token', data.Token)
                authorize()
                $("#succes-create").empty()
                errorEmpty()
                empty()
                fetchTodo()
            })
            .fail(err => {
                errorResponse(err)
            })
    })
    $("#register-form").submit(function(event) {
        event.preventDefault()
        $.ajax({
            type: "post",
            url: baseUrl + '/user/register',
            data: {
                email : $('#email-regis').val(),
                password : $('#password-regis').val(),
                confirmPassword : $('#confirmpassword-regis').val()
            },
        })
            .done(data => {
                $("#succes-create").append(`
                    "Succes Create Account"
                `)
                errorEmpty()
                $('#login-page').show()
            })
            .fail(err => {
                errorResponse(err)
            })
    })
})

function authorize(){
    if(localStorage.getItem('token')){
        $('#login-page').hide()
        $('#main-page').show()
        $('#register-page').hide()
        $('#navbar-page').hide()
        $('#navbar-user').show()
        $('.create-todo').hide()
        $('.edit-todo').hide()
    } else {
        $('#login-page').show()
        $('#navbar-user').hide()
        $('#navbar-page').show()
        $('#main-page').hide()
        $('#register-page').hide()
        $('.edit-todo').hide()
        $('.create-todo').hide()
    }
}
function logout(){
    errorEmpty()
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.logout(function(response) {
                localStorage.clear()
                authorize()
              });
        } else {
            const auth2 = gapi.auth2.getAuthInstance()
            auth2.signOut().then(function () {
                localStorage.clear()
                authorize()
            })
        }
    })
}
function login(){
    $('#login-page').show()
    $('#main-page').hide();
    $('#register-page').hide()
    $('.create-todo').hide()
    $('.edit-todo').hide()
}
function register(){
    $('#register-page').show()
    $('#login-page').hide()
    $('#main-page').hide()
    $('.create-todo').hide()
    $('.edit-todo').hide()
}
function homeUser(){
    errorEmpty()
    $('#main-page').show();
    $('.create-todo').hide()
    $('.edit-todo').hide()
}
function create(){
    $('.create-todo').show()
    $('#main-page').hide()
    $('.edit-todo').hide()
}
function GetTodo(value){
    $('#main-page').hide()
    $('.create-todo').hide()
    $('.edit-todo').show()
    $('#form-input-edit').empty();
    const token = localStorage.token
    $.ajax({
        method : "get",
        url : baseUrl + `/todos/${value}`,
        headers: {
            token,
        },
    })
        .done(response=> {
            let Todos = response.Todos
            $('#form-input-edit').append(`
            <input type="text" id="title-edit" value="${Todos.title}" />
            <input type="text" id="description-edit" value="${Todos.description}" />
            <select type="radio" id="status-edit" >
                <option value="true" ${Todos.status ? "selected" : ""}>Complete</option>
                <option value="false" ${!Todos.status ? "selected" : ""}>Uncomplete</option>
            </select>
            <input type="date" id="due_date-edit" value="${Todos.due_date}">
            <input type="hidden" id="id-edit"value="${Todos.id}">
            <button type="submit">Submit Todo</button>
            `)
        })
        .fail(err => {
            errorResponse(err)
        })
}
function errorResponse(err) {
    errorEmpty()
    $("#error").append(`
        <p style="color:red;">${err.responseJSON.Message}<p>
    `)
}
function errorEmpty(){
    $("#error").empty()
}

function edit(){
    const token = localStorage.getItem('token')
    const title = $('#title-edit').val()
    const description = $('#description-edit').val()
    const status = $('#status-edit').val()
    const due_date = $('#due_date-edit').val()
    const id = $("#id-edit").val()
    $.ajax({
        method : "put",
        url : baseUrl + `/todos/${id}`,
        headers : {
            token,
        },
        data : {
            title,
            description,
            status,
            due_date
        }
    })
        .done(response => {
            errorEmpty()
            $('#main-page').show();
            fetchTodo()
        })
        .fail(err=>{
            errorResponse(err)
        })
}

function fetchTodo(){
    $.ajax({
        method : 'get',
        url : baseUrl + '/todos/',
        headers : {
            token : localStorage.token
        }
    })
        .done(data => {
            $("#table-todo").empty()
            data.Todos.forEach(element => {
                $("#table-todo").append(`
                    <tr>
                        <td>${element.title}</td>
                        <td>${element.description}</td>
                        <td>${element.status ? "Complete" : "Uncomplete"}</td>
                        <td>${element.due_date}</td>
                        <td><button type="button" class="btn btn-outline-primary" onclick="GetTodo(${element.id})">EDIT</button> || <button type="button" class="btn btn-outline-danger" onclick="deleteTodo(${element.id})">DELETE</button></td>
                    </tr>
                `)
            })
            $(".main-container").append(`
                <div id="weather">
                    <p>Location = Depok</p>
                    <p>Date = ${data.Weather.dataseries[0].date}</p>
                    <p>Weather = ${data.Weather.dataseries[0].weather}</p>
                    <p>Max Wind = ${data.Weather.dataseries[0].wind10m_max} m/s</p>
                </div>
            `)
        })
        .fail(err => {
            errorResponse(err)
        })
}
function empty() { 
    $(".main-container").empty()
 }

function deleteTodo(value){  
    const token = localStorage.token
    $.ajax({
        method : "delete",
        url : baseUrl + `/todos/${value}`,
        headers : {
            token : localStorage.token
        }
    })
        .done(response => {
            console.log("Succes Delete Data")
            errorEmpty()
            fetchTodo()
        })
        .fail(err => {
            errorResponse(err)
        })
}

function createTodo(event) {
    const token = localStorage.getItem('token')
    const title = $('#title').val()
    const description = $('#description').val()
    const due_date = $('#due_date').val()

    $.ajax({
      method: 'post',
      url: baseUrl + '/todos',
      headers: {
        token
      },
      data: {
        title,
        description,
        due_date
      }
    })
      .done(function (response) {
          errorEmpty()
        const Todos = response.Todos
        $('#table-todo').append(`
          <td>${Todos.title}</td>
          <td>${Todos.description}</td>
          <td>${Todos.due_date}</td>
        `)
        fetchTodo()
      })
      .fail(err =>{
          errorResponse(err)
      })
  }

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        method: 'post',
        url : baseUrl + '/user/google-login',
        headers : {
            google_token : id_token
        },
    })
        .done(data => {
            localStorage.setItem('token', data.Token)
            errorEmpty()
            authorize()
        })
        .fail(err => {
            errorResponse(err)
        })
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            let userID = response.authResponse.userID
            FB.api(`/${userID}`, {fields: 'email'}, function(response) {
                let email = response.email
                $.ajax({
                    method: 'post',
                    url : baseUrl + '/user/facebook-login',
                    headers : {
                        email
                    },
                })
                    .done(data => {
                        localStorage.setItem('token', data.Token)
                        errorEmpty()
                        authorize()

                    })
                    .fail(err => {
                        errorResponse(err)
                    })
              });
        }
    })
  }