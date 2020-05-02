let baseUrl = 'http://localhost:3000';

$( document ).ready(function() {
    $('#anime').hide();
    auth();

    // Mengisi running-text corona
    $.ajax({
        method: 'get',
        url: baseUrl + '/corona'
    })
        .done(data => {
            let corona = data.corona;
            corona = corona[corona.length - 1];
            const date = new Date(corona.Date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const newDate = `${day}/${month}/${year}`;
            $('#running-text').text(`
            Per tanggal ${newDate} jumlah kasus corona di Indonesia sebanyak ${corona.Confirmed}, jumlah yang sembuh ${corona.Recovered}, dan jumlah yang mati ${corona.Deaths}. Please Stay Safe!
            `);
        })

    

    $('#register').on('click', function(event) {
        event.preventDefault();
        $('#edit-todo').empty();
        $('#form-login').hide();
        $('#form-register').show();
        $('#running-text').hide();
        $('#feedback-register').text(``);
        $('.add-btn').hide();
    });

    $('#login').on('click', function(event) {
        event.preventDefault();
        $('#edit-todo').empty();
        $('#form-login').show();
        $('#form-register').hide();
        $('#running-text').hide();
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
                $('#main-section').show();
                $('#add-button').show();
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
                let error;
                for (let i = 0; i < err.responseJSON.errors.length; i++) {
                    error = err.responseJSON.errors[i].message;
                    $('#feedback-register').append(`<p>${error}</p>`);
                }
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
        let description = null;
        if ($('#description').val() == '') {
            description = $('#anime').val();
        } else {
            description = $('#description').val();
        }
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
                $('#add-button').show();
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
        $('#register').hide();
        $('#google-signin').hide();
        $('#running-text').show();
        
    } else {
        $('#form-login').show();
        $('#form-register').hide();
        $('#logout').hide();
        $('#login').show();
        $('.add-btn').hide();
        $('#form-todo').hide();
        $('#google-signin').show();
        $('#running-text').hide();
    }
}

function logout(event) {
    event.preventDefault();
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('#main-section').hide();
        localStorage.clear();
        $('#register').show();
        auth();
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
            $('#main-section').empty();
            data = data.Todos;
            const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
            let counter = 0;
            data.forEach(todo => {
                let date = new Date(todo.due_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const newDate = `${day}/${month}/${year}`;
                const realDate = changeDate(date);
                $('#main-section').append(`
                    <div class="card text-white bg-${color[counter]} mb-3">
                        <div class="card-header d-flex flex-row justify-content-between">
                            <div>Deadline: ${newDate}</div>
                            <div>
                                <a href="javascript:;" onclick="updateTodo(${todo.id},'${todo.title}', '${todo.description}', '${realDate}')" class="edit-delete btn btn-${color[counter]}">Edit</a>
                                <a href="javascript:;" onclick="deleteTodo(${todo.id})" class="edit-delete btn btn-${color[counter]}">Delete</a>
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
    $('.add-btn').hide();
    $('#running-text').hide();
    $('#form-todo').show();
    $('#main-section').hide();
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
            fetchTodo();
            $('#form-login').hide();
            $('#form-register').hide();
            $('#feedback-register').text(``);
            $('.add-btn').hide();
            $('#form-todo').hide();
            $('#main-section').show();
            $('#add-button').show();
            $('#running-text').show();
        })
        .fail(err => {
            const error = err.responseJSON.errors[0].message;
            $('#feedback-todo').text(`${error}`);
        })
}

function updateTodo(id, title, description, due_date) {
    $('#running-text').hide();
    $('#add-button').hide();
    $('#edit-todo').append(`
        <h2 class="text-center mt-4">Update Todo</h2>
        <form action="http://localhost:3000/todos/${id}" method="PATCH">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" name="title" value="${title}" id="title-edit" placeholder="e.g: Running" class="form-control is-valid">
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <input type="text" name="description" value="${description}" id="description-edit" placeholder="e.g: running routine (5km)" class="form-control is-valid">
            </div>
            <div class="form-group">
                <label for="due_date">Due Date</label>
                <input type="date" name="due_date" value="${due_date}" id="due_date-edit" class="form-control is-valid">
                <div class="invalid-feedback" id="feedback-todo-edit"></div>
            </div>
            <button type="submit" onclick="submitEdit(event, ${id})" class="btn btn-success">Submit</button>
            <button type="" onclick="showMainContent(event)" class="btn btn-success">Cancel</button>
        </form>
    `)
    $('#edit-todo').show();
    $('#main-section').hide();
}

function submitEdit(event, id) {
    event.preventDefault();
    $.ajax({
        method: 'patch',
        url: baseUrl + `/todos/${id}`,
        headers: {
            token: localStorage.token
        },
        data: {
            title: $('#title-edit').val(),
            description: $('#description-edit').val(),
            due_date: $('#due_date-edit').val(),
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
            $('#add-button').show();
            $('#edit-todo').hide();
            $('#edit-todo').empty();
            $('#running-text').show();
        })
        .fail(err => {
            const error = err.responseJSON.errors[0].message.errors[0].message;
            $('#feedback-todo-edit').text(`${error}`);
        })
}

function changeDate(date) {
    let dt = date
    let month = dt.getMonth() + 1;
    if (month < 10) {
        month = '0' + String(month);
    }
    let day = dt.getDate();
    if (day < 10) {
        day = '0' + String(day);
    }
    const newDate = dt.getFullYear() + "-" + month + "-" + day;
    return newDate;
}

function showMainContent(event) {
    event.preventDefault();
    fetchTodo();
    $('#main-section').show();
    $('#add-button').show();
    $('#form-todo').hide();
    $('#edit-todo').empty();
    $('#edit-todo').hide();
    $('#running-text').show();
}

function onSignIn(googleUser) {
   const id_token = googleUser.getAuthResponse().id_token;
   $.ajax({
       method: 'post',
       url: baseUrl + '/users/google-login',
       headers: {
           google_token: id_token
       }
   })
        .done(data => {
            localStorage.setItem('token', data.token);
            $('#main-section').show();
            $('#add-button').show();
            auth();
        })
        .fail(err => {
            console.log(err)
        })
}

$('#title').on('keyup', function() {
    let title = $('#title').val();
    let n = title.search('anime')
    if (n !== -1) {
        $('#description').hide();
        $('#anime').show();
        $.ajax({
            method: 'get',
            url: baseUrl + '/anime'
        })
            .done(anime => {
                let list_anime = anime.movie;
                for (let i = 0; i < list_anime.length; i++) {
                    $('#anime').append(`
                    <option id="anime-val" value="${list_anime[i].title}">'${list_anime[i].title}'</option>
                `)
                }
            })
            .fail(err => {
                console.log(err);
            })
    }
})

