let baseUrl = 'http://localhost:3000'

$(document).ready(() => {
    authentication()    
})

function authentication() {
    if(localStorage.token) {
        $( "#errorSection" ).hide()
        $( "#notifSection" ).hide()
    
        $('#dashboardButton').show()
        $('#registerButton').hide()
        $('#loginButton').hide()
        $('#logoutButton').show()

        $('#home').hide()
        $('#dashboardPage').show()
        $('#publicHolidays').hide()
        $('#listTodo').show()
        $('#addTodo').hide()
        $('#editTodo').hide()
        fetchTodo()

    } else {
        $( "#errorSection" ).hide()
        $( "#notifSection" ).hide()
    
        $('#dashboardButton').hide()
        $('#registerButton').show()
        $('#loginButton').show()
        $('#logoutButton').hide()

        $('#home').show()
        $('#publicHolidays').hide()
        $('#titleJumbotron').show()
        $('#register').hide()
        $('#login').hide()

        $('#dashboardPage').hide()
    }
}

function showRegister() {
    $('#home').show()
    $('#titleJumbotron').hide()
    $('#publicHolidays').hide()
    $('#login').hide()
    $('#register').show()
    $('#register').on('submit', function (event) {
        event.preventDefault()
        const name = $('#newName').val()
        const email = $('#newEmail').val()
        const password = $('#newPassword').val()
        registerUser(name, email, password)
    })
}

function registerUser(name, email, password) {
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/register',
        data: {
            name,
            email,
            password
        }
    })
        .done(data => {
            showLogin()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
        .always(_ => {
            $('#newName').val('')
            $('#newEmail').val('')
            $('#newPassword').val('')
        })
}

function showLogin() {
    $('#home').show()
    $('#titleJumbotron').hide()
    $('#publicHolidays').hide()
    $('#register').hide()
    $('#login').show()
    $('#login').on('submit', function (event) {
        event.preventDefault()
        const email = $('#inputEmail').val()
        const password = $('#inputPassword').val()
        loginUser(email, password)
    })

}

function loginUser(email, password) {
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/login',
        data: {
            email,
            password
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            authentication()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
        .always(_ => {
            $('#inputEmail').val('')
            $('#inputPassword').val('')
        })

}

function logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        authentication()
    });

}

function fetchTodo() {
    $.ajax({
        method: 'get',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $( "#todoContainer" ).empty()
            data.Todos.forEach(el => {
                let status = el.status ? '<p class="text-success">Done<p>' : '<p class="text-danger">Not Done<p>'
                $( "#todoContainer" ).append(` 
                    <tr>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td class="text-center">${el.due_date}</td>
                        <td class="text-center">${status}</td>
                        <td class="text-center">
                            <a class="btn btn-warning btn-sm" href="#" role="button" onclick="changeStatus(${el.id})">Check/Uncheck</a>
                        </td>
                        <td class="text-center">
                            <a class="btn btn-info btn-sm" href="#" role="button" onclick="showEditTodo(${el.id})">Edit</a>
                        </td>
                        <td class="text-center">
                            <a class="btn btn-danger btn-sm" href="#" role="button" onclick="deleteTodo(${el.id})">Delete</a>
                        </td>
                    </tr>`
                )
            })
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
}

function showAddTodo() {
    $('#listTodo').hide()
    $('#publicHolidays').hide()
    $('#editTodo').hide()
    $('#addTodo').show()
    $('#addTodo').on('submit', function (event) {
        event.preventDefault()
        const title = $('#newTitle').val()
        const description = $('#newDescription').val()
        const due_date = $('#newDueDate').val()
        addTodo(title, description, due_date)
    })
}

function addTodo(title, description, due_date) {
    $.ajax({
        method: 'post',
        url: baseUrl + '/todos',
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            console.log(data)
            authentication()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
        .always(_ => {
            $('#newTitle').val('')
            $('#newDescription').val('')
            $('#newDueDate').val('')
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
        .done(data => {
            authentication()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
}

function showEditTodo(id) {
    $('#listTodo').hide()
    $('#addTodo').hide()
    $('#editTodo').show()
    $.ajax({
        method: 'get',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            console.log(data.Todo)
            let todo = data.Todo
            $( "#editTodoContainer" ).empty()
            $( "#editTodoContainer" ).append(` 
                <div class="form-group">
                    <label for="editedTitle">Title</label>
                    <input type="text" class="form-control" id="editedTitle" value="${todo.title}">
                </div>
                <div class="form-group">
                    <label for="editedDescription">Description</label>
                    <textarea class="form-control" id="editedDescription" rows="3">${todo.description}</textarea>
                </div>
                <div class="form-group text-center">
                    <label for="editedDueDate">Due Date</label>
                    <input type="date" class="form-control" id="editedDueDate" value="${todo.due_date}">
                </div>
                <button type="submit" class="btn btn-primary" onclick="editTodo(${todo.id})">Modify</button>`
            )
            $('#editTodo').on('submit', function (event) {
                event.preventDefault()
                
                const title = $('#editedTitle').val()
                const description = $('#editedDescription').val()
                const due_date = $('#editedDueDate').val()
                editTodo(todo.id, title, description, due_date)
            })
        
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
}

function editTodo(id, title, description, due_date) {
    $.ajax({
        method: 'put',
        url: baseUrl + `/todos/${id}`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            console.log(data)
            authentication()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
        .always(_ => {
            $('#editedTitle').val('')
            $('#editedDescription').val('')
            $('#editedDueDate').val('')
        })
}

function getPublicHolidays() {
    $('#home').hide()
    $('#dashboardPage').hide()
    $('#publicHolidays').show()
    $.ajax({
        method: 'get',
        url: baseUrl + '/public-holidays'
    })
        .done(data => {
            console.log(data.public_holidays)
            $("#publicHolidaysContainer").empty()
            data.public_holidays.forEach(el => {
                $( "#publicHolidaysContainer" ).append(` 
                    <tr>
                        <td>${el.date}</td>
                        <td>${el.name}</td>
                        <td>${el.localName}</td>
                    </tr>`
                )
            })
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
}

function showNotif(response) {
    $( "#errorSection" ).hide()
    $( "#notifSection" ).show()
    $( "#notifSection" ).empty()
    if(response.notif) {
        $( "#notifSection" ).append(`
            <h5>${response.notif}</h5>
        `)
    }
}

function showError(response) {
    $( "#notifSection" ).hide()
    $( "#errorSection" ).show()
    $( "#errorSection" ).empty()
    if(Array.isArray(response.err)) {
        for(let i = 0; i < response.err.length; i++) {
            $( "#errorSection" ).append(`
                <h5>${response.err[i]}</h5>
            `)
        }
    } else {
        $( "#errorSection" ).append(`
            <h5>${response.err}</h5>
        `)
    }
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${baseUrl}/users/google-login`,
        method: 'get',
        headers: {
            google_token: id_token
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            authentication()
        })
        .fail(err => {
            console.log(err);
        })
}

function changeStatus(id) {
    $.ajax({
        method: 'patch',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            console.log(data)
            authentication()
            showNotif(data)
        })
        .fail(err => {
            console.log(err)
            showError(err.responseJSON)
        })
}