"use strict"

let baseUrl = 'http://localhost:3000'
let idTemporary = "";
$( document ).ready(function(){
    auth()
    $('#signin-form').submit(function(event) {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/signin',
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            }
        })
            .done(data => {
                localStorage.setItem('token', data.token)
                auth()
            })
            .fail(err => {
                console.log(err.responseJSON.message,'-error')
            })
            .always(_ => {
                $('#email').val('')
                $('#password').val('')
            })
    })
})

function auth(){
    if (localStorage.token){
        $('#signup-page').hide()
        $('#signin-page').hide()
        $('#main-page').show()
        $('#add-page').hide()
        $('#find-page').hide()
        $('#update-page').hide()
        fetchData()
    } else {
        $('#signup-page').hide()
        $('#signin-page').show()
        $('#main-page').hide()
        $('#add-page').hide()
        $('#find-page').hide()
        $('#update-page').hide()
    }
}

function showAddPage(){
    $('#add-page').show()
    $('#main-page').hide()
}

function showFindPage(){
    $('#find-page').show()
    $('#main-page').hide()
}

function showSignUpPage(){
    $('#signup-page').show()
    $('#signin-page').hide()
}

function backToMainPage(){
    event.preventDefault()
    $('#find-page').hide()
    $('#update-page').hide()
    $('#main-page').show()
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `${baseUrl}/users/google-signin`,
        method: 'POST',
        headers: {
            google_token: id_token
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token);
            auth();
        })
        .fail(err => {
            console.log(err);
        })
}

function signout(){
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        $('#signup-page').hide()
        $('#signin-page').show()
        $('#main-page').hide()
        $('#add-page').hide()
        $('#find-page').hide()
        $('#update-page').hide()
        auth()
    });
}

function fetchData(){
    $.ajax({
        method: 'get',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $( ".main-container" ).empty()
            data.todos.forEach(el => {
                $( ".main-container" ).append( 
                    `<div class="todo">
                        <div class="todo-id">
                            <h4>Id: ${el.id}</h4>
                        </div>
                        <div class="todo-title">
                            <h4>Title: ${el.title}</h4>
                        </div>
                        <div class="todo-description">
                            <h4>Description: ${el.description}</h4>
                        </div>
                        <div class="todo-status">
                            <h4>Status: ${el.status}</h4>
                        </div>
                        <div class="todo-due_date">
                            <h4>Due Date: ${el.due_date.slice(0,10)}</h4>
                        </div>
                        <button onclick="deleteTodo(${el.id})">Delete</button>
                        <button onclick="updateTodoForm(${el.id})">Update</button>
                    </div>`
                 )
            })
        })
        .fail(err => {
            console.log(err,'error')
        })
}

function signup(event) {
    event.preventDefault()
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/signup',
        data: {
            email: $('#email').val(),
            password: $('#password').val()
        }
    })
    .done(_ => {
        $('#signup-page').hide()
        $('#signin-page').show()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
    .always(_ => {
        $('#email').val('')
        $('#password').val('')
    })
}

function addTodo(event) {
    event.preventDefault()
    let data = {
        title: $('#title').val(),
        description: $('#description').val(),
        status: $('#status').val(),
        due_date: $('#due_date').val()
    }
    $.ajax({
        method: 'post',
        url: baseUrl + '/todos',
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        $('#add-page').hide()
        $('#main-page').show()
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
    .always(_ => {
        $('#title').val('')
        $('#description').val('')
        $('#status').val('')
        $('#due_date').val('')
    })
}

function findTodo(event) {
    event.preventDefault()
    let data = {
        id: $('#id').val()
    }
    $.ajax({
        method: 'get',
        url: baseUrl + '/todos/:id',
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(result => {
        $( ".find-result" ).empty()
        result.todo.forEach(el => {
            $( ".find-result" ).append( 
                `<div class="todo">
                    <div class="todo-title">
                        <input type="text" class="input" value="${el.title}"><br>
                    </div>
                    <div class="todo-description">
                        <input type="text" class="input" value="${el.description}"><br>
                    </div>
                    <div class="todo-status">
                        <input type="text" class="input" value="${el.status}"><br>
                    </div>
                    <div class="todo-due_date">
                        <input type="date" class="input" value="${el.due_date.slice(0,10)}"><br>
                    </div>
                </div>`
            )
        })
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}

function deleteTodo(id) {
    $.ajax({
        method: 'delete',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}

function updateTodoForm(id) {
    event.preventDefault()
    idTemporary = id;
    $("#main-page").hide();
    $("#update-page").show();
    $.ajax({
        method: 'get',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(data => {
        $("#update-page").empty();
        $( "#update-page" ).append(
            `<div class="todo">
                <form onsubmit="updateTodo(event)">
                    <div class="div">
                        <h5>Title</h5>
                        <input type="text" class="input" id="title-edit" value="${data.todo.title}">
                    </div>
                    <div class="div">
                        <h5>Description</h5>
                        <input type="text" class="input" id="description-edit" value="${data.todo.description}">
                    </div>
                    <div class="div">
                        <h5>Status</h5>
                        <input type="text" class="input" id="status-edit" value="${data.todo.status}">
                    </div>
                    <div class="div">
                        <h5>Due Date</h5>
                        <input type="date" class="input" id="due_date-edit" value="${data.todo.due_date.slice(0,10)}">
                    </div>
                <input type="submit" class="btn" value="submit">
                <input onclick="backToMainPage()" type="button" value="Cancel" class="cancelButton"/>
                </form>
            </div>`
        )
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}
function updateTodo(event){
    event.preventDefault()
    let data = {
        title: $('#title-edit').val(),
        description: $('#description-edit').val(),
        status: $('#status-edit').val(),
        due_date: $('#due_date-edit').val()
    }
    console.log(data)
    $.ajax({
        method: 'put',
        url: baseUrl + `/todos/${idTemporary}`,
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        $('#update-page').hide()
        $('#main-page').show()
        auth()
    })
    .fail(err => {
        console.log(err,'-error')
    })
}

const randomRESEP = () => {
    $.ajax({
        method : "get",
        url: baseUrl + `/foodrecipe`,
    })
    .done(data => {
        let randomResep = Math.floor(Math.random() * 9);
        console.log(data)
        let resep = data.recipes.results[randomResep]
        $("#resep").empty()
        $("#resep").append(`
            <table border>
                <tr>
                    <th>JUDUL</th>
                    <th>INGREDIENTS</th>
                </tr>
                <tr>
                    <td>${resep.title}</td>
                    <td>${resep.ingredients}</td>
                </tr>
            </table>
        `)
    })
    .fail(err => {
        console.log(err);
    })
}