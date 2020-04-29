const baseUrl = 'http://localhost:3000'

$( document ).ready(function(){
    landingPage()
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
            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    })
    $("#register-form").submit(function(event) {
        event.preventDefault()
        $.ajax({
            type: "post",
            url: baseUrl + '/user/register',
            data: {
                email : $('#email-regis').val(),
                password : $('#password-regis').val()
            },
        })
            .done(data => {
                localStorage.setItem("Message", "Succes Create Account")
            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    })
})
function landingPage(){
    if(localStorage.getItem('token')){
        $('#login-page').hide()
        $('#main-page').show()
        $('#register-page').hide()
        $('#navbar-page').hide()
        $('#navbar-user').show()
        $('.create-todo').hide()
        $('.edit-todo').hide()
        fetchTodo()
    } else {
        $('#login-page').hide()
        $('#navbar-user').hide()
        $('#navbar-page').show()
        $('#main-page').hide()
        $('#register-page').show()
        $('.edit-todo').hide()
        $('.create-todo').hide()
    }
}

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
        $('#login-page').hide()
        $('#navbar-user').hide()
        $('#navbar-page').show()
        $('#main-page').hide()
        $('#register-page').show()
        $('.edit-todo').hide()
        $('.create-todo').hide()
    }
}
function logout(){
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
        localStorage.clear()
        $('#login-page').hide()
        $('#navbar-user').hide()
        $('#navbar-page').show()
        $('#main-page').hide()
        $('#register-page').show()
        $('.edit-todo').hide()
        $('.create-todo').hide()
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
            $('#main-page').show();
        })
        .fail(err=>{
            console.log(err.responseJSON.msg)
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
                <br>
                <div id="weather">
                    <p>Location = Depok</p>
                    <p>Date = ${data.Weather.dataseries[0].date}</p>
                    <p>Weather = ${data.Weather.dataseries[0].weather}</p>
                    <p>Max Wind = ${data.Weather.dataseries[0].wind10m_max} m/s</p>
                </div>
            `)
        })
        .fail(err => {
            console.log(err.responseJSON.msg)
        })
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
        })
        .fail(err => [
            console.log(err.responseJSON.msg)
        ])
}

function createTodo(event) {
    event.preventDefault()
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
        const Todos = response.Todos
        $('#table-todo').append(`
          <td>${Todos.title}</td>
          <td>${element.description}</td>
          <td>${element.due_date}</td>
        `)
      })
      .fail(function (err) {
        console.log(err.responseJSON.msg)
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
            authorize()
        })
        .fail(err => {
            console.log(err)
        })
}