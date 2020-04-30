let baseUrl = 'http://localhost:3000';

$( document ).ready(function() {
    auth();
    $('#register').on('click', function(event) {
        event.preventDefault();
        $('#form-login').hide();
        $('#form-register').show();
        $('#feedback-register').text(``);
        $('.add-btn').hide();
    });

    $('#login').on('click', function(event) {
        event.preventDefault();
        $('#form-login').show();
        $('#form-register').hide();
        $('#feedback-login').text(``);
        $('.add-btn').hide();
    });

    $('#form-login').on('submit', function(event) {
        event.preventDefault();
        $('#feedback-login').text(``);
        const email = $('#email').val();
        const password = $('#password').val();
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/signin',
            data: {
                email,
                password
            }
        })
            .done(data => {
                const token = data.token;
                localStorage.setItem('token', token);
                auth();
            })
            .fail(err => {
                const error = err.responseJSON.errors[0].message;
                $('#feedback-login').text(`${error}`);
            })
            .always(_ => {
                $('#email').val('');
                $('#password').val('');
            })
    })

    $('#form-register').on('submit', function(event) {
        event.preventDefault();
        $('#feedback-register').text(``);
        const name = $('#name-register').val();
        const email = $('#email-register').val();
        const password = $('#password-register').val();
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/signup',
            data: {
                name,
                email,
                password
            }
        })
            .done(data => {
                $('#register-success').text('Register Success, please login');
                $('#form-register').hide();
            })
            .fail(err => {
                const error = err.responseJSON.errors[0].message;
                $('#feedback-register').text(`${error}`);
            })
            .always(_ => {
                $('#name-register').val('');
                $('#email-register').val('');
                $('#password-register').val('');
            })
    })

    $('#form-todo').on('submit', function(event) {
        event.preventDefault();
        $('#feedback-todo').text(``);
        const title = $('#title').val();
        const description = $('#description').val();
        const due_date = $('#due_date').val();
        $.ajax({
            method: 'post',
            url: baseUrl + '/todos',
            headers: {
                token: localStorage.token
            },
            data: {
                title,
                description,
                due_date
            }
        })
            .done(_ => {
                fetchTodo();
                $('#form-login').hide();
                $('#form-register').hide();
                $('#feedback-register').text(``);
                $('.add-btn').hide();
                $('#form-todo').hide();
                $('#main-section').show();
            })
            .fail(err => {
                const error = err.responseJSON.errors[0].message;
                $('#feedback-todo').text(`${error}`);
            })
            .always(_ => {
                $('#title').val('');
                $('#description').val('');
                $('#due_date').val('');
            })
    })
});

function auth() {
    if (localStorage.getItem('token')) {
        $('#form-login').hide();
        $('#form-register').hide();
        $('#logout').show();
        $('#login').hide();
        fetchTodo();
        $('.add-btn').show();
        $('#form-todo').hide();
    } else {
        $('#form-login').show();
        $('#form-register').hide();
        $('#logout').hide();
        $('#login').show();
        $('.add-btn').hide();
        $('#form-todo').hide();
    }
}

function logout() {
    localStorage.clear();
    auth();
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
            $('#main-section').empty();
            data = data.Todos;
            const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
            let counter = 0;
            data.forEach(todo => {
                let date = new Date(todo.due_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const newDate = `${year}-${month}-${day}`;
                $('#main-section').append(`
                    <div class="card text-white bg-${color[counter]} mb-3">
                        <div class="card-header d-flex flex-row justify-content-between">
                            <div>Deadline: ${newDate}</div>
                            <div>
                                <a href="" class="edit-delete btn btn-${color[counter]}">Edit</a>
                                <a href="" class="edit-delete btn btn-${color[counter]}">Delete</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${todo.title}</h4>
                            <p class="card-text">${todo.description}</p>
                        </div>
                    </div>
                `)
                if (counter == 6) {
                    counter = 0;
                } else {
                    counter++
                }
            });
        })
        .fail(err => {
            console.log(err)
        })
}

function showTodoForm() {
    $('#form-todo').show();
    $('#main-section').hide();
}

