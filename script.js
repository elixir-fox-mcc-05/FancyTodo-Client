const url = 'http://localhost:3000'

$(document).ready(function () {
    auth()
    $("#login-form").submit(function (event) {
        event.preventDefault()
        // console.log(`masuk`);
        $.ajax({
            method: 'post',
            url: `${url}/users/login`,
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
                console.log(err.responseJSON.errors[0].message);
            })
            .always(_ => {
                $('#email').val('')
                $('#password').val('')
            })
    })
});

function auth() {
    if (localStorage.getItem('token')) {
        $('.login-page').hide()
        $('.homepage').show()
        $('.add-form-page').hide()
        getTodoList()
    } else {
        $('.login-page').show()
        $('.homepage').hide()
        $('.add-form-page').hide()

    }
}

function logout() {
    localStorage.clear();
    auth();
}

function getTodoList() {
    $.ajax({
        method: 'get',
        url: `${url}/todos`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            console.log('dataaaaaaaaaa', data.todos);
            data.todos.forEach(todo => {
                let date = new Date(todo.due_date)
                let day = date.getUTCDate()
                let month = date.getUTCMonth() + 1
                let year = date.getUTCFullYear()
                $('.main-content').append(`
                <div class="todo-list">
                <h1>${todo.title}</h1>
                <h4> ${todo.description}</h3>
                <h4>Status: ${todo.status}</h3>
                <h4>Due : ${day}/${month}/${year}</h3>
                <div id="actionbtn">
                <button id="button" onclick="editTodo(${todo.id})"><h4>Edit</h4></button> <button id="button" onclick="deleteTodo(${todo.id})"><h4>Delete</h4></button>
                </div>
                </div>
        `)
            });

        })
        .fail(err => {
            console.log(err.responseJSON.errors[0].message);
        })
}

function addFormPage() {
    $('.add-form-page').show()
    $('.homepage').hide()
}