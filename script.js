let baseUrl = 'http://localhost:3000';

let editId;
let deleteId;

$(document).ready(function() {
    authentication()
    $('#login-form').submit(event => {
        event.preventDefault()
        // console.log($('#email').val(), 'email')
        // console.log($('#password').val(), 'password')
        $.ajax({
            method: 'post',
            url: baseUrl + '/user/login',
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            }
        })
        .done(data => {
            // console.log(data)
            localStorage.setItem('token', data.token);
            authentication()
        })
        .fail(err => {
            console.log(err);
        })
    })
    $('#register-form').submit(event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/user/register',
            data: {
                username: $('#username').val(),
                email: $('#email').val(),
                password: $('#password').val()
            }
        })
        .done(data => {
            localStorage.setItem('Message')
        })
        .fail(err => {
            console.log(err)
        })
    })
})

function authentication() {
    if (localStorage.getItem('token')) {
        $('#login-page').hide()
        $('#home-page').show()
        $('#register-page').hide()
        $('#front-navbar').hide()
        $('#navbar-user').show()
        $('.create-todo').hide()
        $('.edit-todo').hide()
        homeUser()
    } 
    else {
        $('#login-page').hide()
        $('#navbar-user').hide()
        $('#front-navbar').show()
        $('#home-page').hide()
        $('#register-page').show()
        $('.edit-todo').hide()
        $('.create-todo').hide()
    }
}

function login() {
    $('#login-page').show()
    $('#home-page').hide();
    $('#register-page').hide()
    $('.create-todo').hide()
    $('.edit-todo').hide()
}

function register() {
    $('#register-page').show()
    $('#login-page').hide()
    $('#home-page').hide()
    $('.create-todo').hide()
    $('.edit-todo').hide()
}

function homeUser() {
    $('#home-page').show();
    $('.create-todo').hide()
    $('.edit-todo').hide()
    fetchTodo()
}

function create() {
    $('.create-todo').show()
    $('#home-page').hide()
    $('.edit-todo').hide()
}

function logout() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        authentication()
        $('#home-page').hide()
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: baseUrl + '/user/google-login',
        method: 'post',
        headers: {
            google_token: id_token
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            authentication()
        })
        .fail(err => {
            console.log(err)
        })
}

function fetchTodo() {
    $('.create-todo').hide()
    $('.edit-todo').show()
    $.ajax({
        method: 'get',
        url: baseUrl + `/todos`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('#todo-table').empty()
            data.data.map(elem => {
                // console.log(elem.title)
                $('#todo-table').append(` 
                    <tr>
                        <td>${elem.title}</td>
                        <td>${elem.description}</td>
                        <td>${elem.status ? "Completed" : "Uncompleted"}</td>
                        <td>${elem.due_date}</td>
                        <td><button type="button" class="btn btn-outline-info" id="edit-${elem.id}">EDIT</button> 
                        <button type="button" class="btn btn-outline-danger" id="delete-${elem.id}">DELETE</button></td>
                    </tr>
                `)
                $(`#edit-${elem.id}`).click(event => {
                    editId = elem.id 
                    $('#title-edit').val(elem.title)
                    $('#description-edit').val(elem.description)
                    $('#status-edit').val(elem.status)
                    $('#due_date-edit').val(elem.due_date)
                }), 
                $(`#delete-${elem.id}`).click(event => {
                    deleteId = elem.id
                    deleteTodo(event)
                })
            })
            // for (let key in data.weather) {
                $('#weather-table').append(` 
                    <tr>
                        <td>${data.weather.weather_state_name}</td>
                        <td>${data.weather.min_temp}</td>
                        <td>${data.weather.the_temp}</td>
                        <td>${data.weather.humidity}</td>
                    </tr>
                `)
            // }
        })
        .fail(err => {
            console.log(err)
        })
}

function createTodo(event) {
    event.preventDefault()
    let value = {
        title: $('#title-create').val(),
        description: $('#description-create').val(),
        due_date: $('#due_date-create').val()
    }
    $.ajax({
        method: 'post',
        url: baseUrl + '/todos',
        data: value,
        headers: {
            token: localStorage.token
        }
    })
        .done(() => {
            fetchTodo()
            $('#title-create').val('')
            $('#description-create').val('')
            $('#due_date-create').val('')
        })
        .fail(err => {
            console.log(err)
        })
}

function editTodo(event) {
    event.preventDefault()
    let value = {
        title: $('#title-edit').val(),
        description: $('#description-edit').val(),
        status: $('#status-edit').val(),
        due_date: $('#due_date-edit').val()
    }
    $.ajax({
        method: 'put',
        url: baseUrl + `/todos/${editId}`,
        data: value,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(() => {
            authentication()
            $('#title-edit').val('')
            $('#description-edit').val('')
            $('#status-edit').val('')
            $('#due_date-edit').val('')
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteTodo(event) {
    event.preventDefault()
    $.ajax({
        method : 'delete',
        url : baseUrl + `/todos/${deleteId}`,
        headers : {
            token : localStorage.token
        }
    })
        .done(() => {
            authentication()
        })
        .fail(err => [
            console.log(err)
        ])
}