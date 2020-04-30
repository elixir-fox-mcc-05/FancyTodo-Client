let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    auth()
    $('#signInForm').submit(event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/signin',
            data: {
                email: $('#emailSignIn').val(),
                password: $('#passwordSignIn').val()
            }
        })
        .done(data => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err)
        })
        .always(() => {
            $('#email').val('')
            $('#password').val('')
        })
    })
});


function auth() {
    if (localStorage.token) {
        $('#signUpPage').hide()
        $('#signInPage').hide()
        $('#mainPage').show()
        $('#createPage').hide()
        $('#editPage').hide()
        $('#buttonSignOut').show()
        fetchData()
    } else {
        $("#message").empty()
        $("#message").append(`It seems that you have signed out`)
        showSignIn()
    }
}

function fetchData() {
    $.ajax({
        method: 'get',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.token
        }
    })
    .done(data => {
        console.log(data);
        $('#mainTable').empty()
        $('#mainTable').append(
            `<tr>
                <th>Task</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>`
        )        
        data.Todos.forEach(element => {
            $('#mainTable').append(
                `<tr>
                        <td>${element.title}</td>
                        <td>${element.description}</td>
                        <td>${element.due_date}</td>
                        <td> <button class="btn btn-sm" id="buttonEdit" onclick="editTodo(${element.id})">Edit</button> | 
                        <button class="btn btn-sm" id="buttonDelete" onclick="deleteTodo(${element.id})">Delete</button> </td>
                </tr>`
            )
        })
    })
    .fail(err => {
        console.log(err);
        localStorage.clear()
        auth()
    })
}

function showCreatePage() {
    $('#signUpPage').hide()
    $('#signInPage').hide()
    $('#mainPage').hide()
    $('#createPage').show()
    $('#editPage').hide()
    $('#buttonSignOut').hide()
}

function createTodo(event) {
    event.preventDefault()
    let data = {
        title: $('#title').val(),
        description: $('#description').val(),
        due_date: $('#due_date').val()
    }

    $.ajax({
        method: 'post',
        url: baseUrl + '/todos',
        data, // will be sent as req.body
        headers: {
            token: localStorage.token
        }
    })
    .done(() => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
    .always(() => {
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
    })
}

function showEditPage() {
    $('#signUpPage').hide()
    $('#signInPage').hide()
    $('#mainPage').hide()
    $('#createPage').hide()
    $('#editPage').show()
    $('#buttonSignOut').hide()
}

function editTodo(num) {
    let data = {
        title: $('#title').val(),
        description: $('#description').val(),
        due_date: $('#due_date').val()
    }

    .always(() => {
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
    })
}

function deleteTodo(num) {
    event.preventDefault()
    $.ajax({
        method: 'delete',
        url: baseUrl + '/todos/' + num,
        headers: { //careful of typos
            token: localStorage.token
        }
    })
    .done(() => {
        auth()
    })
    .fail(err => {
        console.log(err)
    })
    
}

function showSignUp() {
    $('#signUpPage').show()
    $('#signInPage').hide()
    $('#mainPage').hide()
    $('#createPage').hide()
    $('#editPage').hide()
    $('#buttonSignOut').hide()
}

function showSignIn() {
    $('#signUpPage').hide()
    $('#signInPage').show()
    $('#mainPage').hide()
    $('#createPage').hide()
    $('#editPage').hide()
    $('#buttonSignOut').hide()
}

function signOut() {
    localStorage.clear()
    auth()
}