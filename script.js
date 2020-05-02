"use strict"

let baseUrl = 'http://localhost:3000'
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
        $('#signin-page').hide()
        $('#main-page').show()
        $('#add-page').hide()
        $('#find-page').hide()
        fetchData()
    } else {
        $('#signin-page').show()
        $('#main-page').hide()
        $('#add-page').hide()
        $('#find-page').hide()
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
    $('#find-page').hide()
    $('#main-page').show()
    auth()
}

function signout(){
    localStorage.clear()
    auth()
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
                            <h4>${el.id}</h4>
                        </div>
                        <div class="todo-title">
                            <h4>${el.title}</h4>
                        </div>
                        <div class="todo-description">
                            <h4>${el.description}</h4>
                        </div>
                        <div class="todo-status">
                            <h4>${el.status}</h4>
                        </div>
                        <div class="todo-due_date">
                            <h4>${el.due_date}</h4>
                        </div>
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
                        <input type="date" class="input" value="${el.due_date.toJSON().slice(0,10)}"><br>
                    </div>
                </div>`
            )
        })
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}

function deleteTodo(event) {
    event.preventDefault()
    let data = {
        id: $('#id').val()
    }
    $.ajax({
        method: 'delete',
        url: baseUrl + '/todos/:id',
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        $('#find-page').hide()
        $('#main-page').show()
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}

function updateTodo(event) {
    event.preventDefault()
    let data = {
        id: $('#id').val()
    }
    $.ajax({
        method: 'put',
        url: baseUrl + '/todos/:id',
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        $('#find-page').hide()
        $('#main-page').show()
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-error')
    })
}