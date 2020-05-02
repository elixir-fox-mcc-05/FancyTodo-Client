let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    auth(`It seems that you have signed out`)
    signIn()
    signUp()
});


function auth(message) {
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
        $("#message").append(message)
        showSignIn()
    }
}

function signIn() {
    $('#signInForm').submit(event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/signin',
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
}

function signUp() {
    $('#signUpForm').submit(event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/signup',
            data: {
                email: $('#emailSignUp').val(),
                password: $('#passwordSignUp').val()
            }
        })
        .done(_=> {
            auth(`Sign up succesful. Please sign in again.`)
        })
        .fail(err => {
            console.log(err);
            $("#message").append()
        })
        .always(() => {
            $('#email').val('')
            $('#password').val('')
        })
    })
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
                        <td>${element.due_date.slice(0, 10)}</td>
                        <td> <button class="btn btn-sm" id="buttonEdit" onclick="showEditPage(${element.id}, '${element.title}', '${element.description}', '${element.due_date}')">Edit</button> | 
                        <button class="btn btn-sm" id="buttonDelete" onclick="deleteTodo(${element.id})" data-toggle="popover" data-trigger="hover" title="Are you sure?" data-content="You want to delete this tasks? It cannot be undone.">Delete</button> </td>
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
        title: $('#titleCreate').val(),
        description: $('#descriptionCreate').val(),
        due_date: $('#due_dateCreate').val()
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
    .fail(error => {
        console.log(error, 'at creating');
    })
    .always(() => {
        $('#titleCreate').val('')
        $('#descriptionCreate').val('')
        $('#due_dateCreate').val('')
    })
}

function showEditPage(id, title, description, due_date) {
    $('#signUpPage').hide()
    $('#signInPage').hide()
    $('#mainPage').hide()
    $('#createPage').hide()
    $('#buttonSignOut').hide()
    $('#editPage').show()

    due_date = new Date(due_date)
    $('#insertEditForm').empty()
    $('#insertEditForm').append(
        `
        <form id="editForm" onsubmit="editTodo(event, ${id})"> <!-- set in main.js -->
            <label for="title">Title: </label>
            <input type="text" name="title" id="titleEdit" class="form-control" value="${title}"><br>
            <label for="description">Description: </label>
            <!-- remove empty space before </textarea> -->
            <textarea  cols="40" rows="10" name="description" id="descriptionEdit" class="form-control">${description}</textarea><br> 
            <label for="due_date">Due Date: </label><br>
            <p>Previous due date: ${due_date.getMonth()}/${due_date.getDate()}/${due_date.getFullYear()}</p><br>
            <small>Note: Due date must be later than today</small>
            <input type="date" name="due_date" id="due_dateEdit" class="form-control text-center due_date"><br>
            <!-- input date does not support placeholder -->
            <input type="submit" class="btn btn-primary" value="Save">
            <input type="button" class="btn btn-secondary" value="Cancel"
            onclick="window.location='';return false;">
        </form>
        `
    )
}

function editTodo(event, id) {
    event.preventDefault()
    let data = {
        title: $('#titleEdit').val(),
        description: $('#descriptionEdit').val(),
        due_date: $('#due_dateEdit').val()
    }

    $.ajax({
        method: 'put',
        url: baseUrl + '/todos/' + id,
        data,
        headers : {
            token: localStorage.token
        }
    })
    .done(_=> {
        auth()
    })
    .fail(err => {
        console.log(err)
    })
    .always(_=> {
        $('#titleEdit').val('')
        $('#descriptionEdit').val('')
        $('#due_dateEdit').val('')
    })
}

function deleteTodo(id) {
    event.preventDefault()
    $.ajax({
        method: 'delete',
        url: baseUrl + '/todos/' + id,
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

// function confirmDelete(id) {
//   let message = confirm("Are you sure you want to delete?");
//     // no alert(), confirm(), prompt() for now
//   if (message) {
//     deleteTodo(id)
//     return true;
//   } else return false;
// }

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