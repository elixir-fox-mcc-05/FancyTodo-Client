let baseUrl = 'http://localhost:3000'

$(document).ready(() => {
    authentication()    
})

function authentication() {
    if(localStorage.token) {
        $('#navbar').show()
        $('#dashboard').show()
        $('#registerButton').hide()
        $('#loginButton').hide()
        $('#logoutButton').show()

        $('#home').hide()
        $('#footer').show()
        $('#register').hide()
        $('#login').hide()
        $('#dashboardPage').show()
        fetchTodo()
    } else {
        $('#navbar').show()
        $('#dashboard').hide()
        $('#registerButton').show()
        $('#loginButton').show()
        $('#logoutButton').hide()

        $('#home').show()
        $('#footer').show()
        $('#register').hide()
        $('#login').hide()
        $('#dashboardPage').hide()
    }
}

function showRegister() {
    $('#navbar').show()
    $('#home').hide()
    $('#footer').show()
    $('#register').show()
    $('#login').hide()
    $('#dashboard').hide()
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
            authentication()
        })
        .fail(err => {
            console.log(err.responseJSON)
        })
}

function showLogin() {
    $('#navbar').show()
    $('#home').hide()
    $('#footer').show()
    $('#register').hide()
    $('#login').show()
    $('#dashboard').hide()
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
            fetchTodo()
        })
        .fail(err => {
            console.log(err.responseJSON)
        })

}

function logout() {
    localStorage.clear()
    authentication()
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
                let status = el.status ? 'Selesai' : 'Belum Selesai'
                $( "#todoContainer" ).append(` 
                    <tr>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.due_date}</td>
                        <td>${status}</td>
                    </tr>`
                )
            })
        })
        .fail(err => {
            console.log(err,'errrrorr')
        })
}