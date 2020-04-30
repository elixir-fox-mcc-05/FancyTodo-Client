baseURl = 'http://localhost:4000';

function checkToken() {
    if(localStorage.token) {
        $('#landingPage').hide();
        $('#jumbotron').hide();
        $('#homePage').show();
        $('#logout').show();
        $('#btn-login').hide();
        $('#modal-body').css('display', 'none');
        $('#modal-body-home').css('display', 'none');
        $('#addTask').slideUp();
        showAllTask();
    } else {
        $('#homePage').hide();
        $('#landingPage').show();
        $('#btn-login').show();
        $('#logout').hide();
        $('#modal-body').css('display', 'none');
        $('#modal-body-home').css('display', 'none');
    }
}

// Function
function register(name, email, password) {
    $.ajax({
        method: 'POST',
        url: `${baseURl}/users/register`,
        data: {
            name,
            email,
            password
        }
    })
        .done(res => {
            $('#nameRegister').val('');
            $('#usernameRegister').val('');
            $('#emailRegister').val('');
            $('#passwordRegister').val('');
            $('.alert').hide();
            showLogin();
        })
        .fail(err => {
            $('.alert').show();
            $('#register-error').text(err.responseJSON.error[0]);
        })
}

function showLogin() {
    $('#register').hide();
    $('#login').show();
}

function login(email, password) {
    $.ajax({
        method: 'POST',
        url: `${baseURl}/users/login`,
        data: {
            email,
            password
        }
    })
        .done(res => {
            console.log(res.accessToken);
            $('#emailLogin').val('');
            $('#passwordLogin').val('');
            localStorage.setItem('token', res.accessToken);
            $('.alert').hide();
            checkToken();
        })
        .fail(err => {
            console.log(err);
            $('.alert').show();
            $('#login-error').text(err.responseJSON.error[0]);
        })
}

function showAllTask() {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/todos`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#tasklist').empty();
            $('#user_name').text(res.Todos.name)
            res.Todos.Todos.forEach(todo => {
                appendTodo(todo);
            })
        })
        .fail(err => {
            console.log(err);
        })
}

function addNewTask(title, description, due_date) {
    const { token } = localStorage;
    $.ajax({
        method: 'POST',
        url: `${baseURl}/todos`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token
        }
    })
        .done(res=> {
            console.log(res);
            $('#newTaskTitle').val('');
            $('#newTaskDescription').val('');
            $('#newTaskDue_Date').val('');
            appendTodo(res.Todo)
            $('.alert').hide();
        })
        .fail(err => {
            $('.alert').show();
            $('#add-error').text(err.responseJSON.error[0]);
        })
}

function appendTodo(todo) {
    let newTodo = $(`<li class="list-group-item">${todo.title}
                    <i class="fas fa-fw fa-times-circle">
                    </i><input type="button" value="Edit" class="btn btn-outline-warning edit-task btn-sm">
                    </input><input type="button" value="Show Detail" class="btn btn-outline-primary display-task btn-sm"></input>
                    </li>`);
    newTodo.data('id', todo.id);
    newTodo.data('status', todo.status);
    if (todo.status) {
        $(newTodo).addClass('complete')
    }
    $('#tasklist').append(newTodo);
}

function deleteTask(id) {
    const { token } = localStorage;
    $.ajax({
        method: 'DELETE',
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#tasklist').empty();
            checkToken();
        })
        .fail(err => {
            console.log(err);
        })
}

function readTaskById(id) {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#modal-body-home').css('display', 'flex');
            $('#editTitle').val(res.Todo.title);
            $('#editDescription').val(res.Todo.description);
            $('#editDue_Date').val(res.Todo.due_date.slice(0,10));
            $('#editTask').data('id', res.Todo.id)
        })
        .fail(err => {
            console.log(err);
        })
}

function updateTask(id, title, description, due_date) {
    const { token } = localStorage;
    $.ajax({
        method: "PUT",
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(res => {
            $('#editTitle').val('');
            $('#editDescription').val('');
            $('#editDue_Date').val('');
            $('#modal-body-home').css('display', 'none');
            $('#tasklist').empty();
            showAllTask();
        })
        .fail(err => {
            console.log(err);
        })
}

function checkedTodo(todo) {
    const { token } = localStorage;
    const id = todo.data('id');
    const status = todo.data('status');
    console.log(status);

    $.ajax({
        method: "PUT",
        url: `${baseURl}/todos/check/${id}`,
        headers: {
            token
        },
        data: {
            status: !status
        }
    })
        .done(res => {
            console.log(res.Todo.status);
            todo.data('status', res.Todo.status);
            todo.toggleClass('complete');
        })
        .fail(err => {
            console.log(err);
        })
}

// google signin
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    
    $.ajax({
        method: "POST",
        url: 'http://localhost:4000/users/google-login',
        headers: {
            google_token: id_token
        }
    })
        .done(res => {
            localStorage.setItem('token', res.accessToken);
            checkToken();
        })
        .fail(err => {
            console.log(err);
        })
}

$(document).ready(function() {
    checkToken();
    $('.alert').hide();
    // event

    //show register modal
    $('#getStarted').click(function(event) {
        event.preventDefault();
        $('#modal-body').css('display', 'flex');
        $('#register').show();
        $('#login').hide();
    })

    //show login modal
    $('#btn-login').click(function(event) {
        event.preventDefault();
        $('#modal-body').css('display', 'flex');
        $('#register').hide();
        $('#login').show();
    })

    //hide register-login modal
    $('.cancel').click(function(event) {
        event.preventDefault();
        $('#modal-body').css('display', 'none');
    })

    // Submit register
    $('#registerForm').on('submit', function(event){
        event.preventDefault();
        const name = $('#nameRegister').val();
        const email = $('#emailRegister').val();
        const password = $('#passwordRegister').val();
        register(name, email, password)
    })

    // Submit login
    $('#login').on('submit', function(event){
        event.preventDefault();
        const email = $('#emailLogin').val();
        const password = $('#passwordLogin').val();
        login(email, password)
    })

    //user already register
    $('#alreadyRegister').click(function(event){
        event.preventDefault();
        showLogin();
    })

    //Toggle Add Task Form
    $('#addFormToggle').click(function() {
        $('#addTask').slideToggle();
    })

    //Add new task
    $('#addTaskForm').on('submit', function(event) {
        event.preventDefault();
        const title = $('#newTaskTitle').val();
        const description = $('#newTaskDescription').val();
        const due_date = $('#newTaskDue_Date').val();
        console.log(due_date);
        addNewTask(title, description, due_date)
    })

    //Delete
    $('#tasklist').on('click', 'i', function(event) {
        event.stopPropagation();
        const id = $(this).parent().data('id');
        deleteTask(id);
    })

    //Show edit form
    $('#tasklist').on('click', '.edit-task', function(event) {
        event.stopPropagation();
        const id = $(this).parent().data('id');
        readTaskById(id);
    })

    //Edit task
    $('#editTask').on('submit', function(event) {
        event.preventDefault();
        const id = $('#editTask').data('id');
        const title = $('#editTitle').val();
        const description = $('#editDescription').val();
        const due_date = $('#editDue_Date').val();
        updateTask(id, title, description, due_date);
    })

    //hide edit form
    $('.cancel-edit').click(function(event) {
        event.preventDefault();
        $('#modal-body-home').css('display', 'none');
    })

    //Toggle completion
    $('#tasklist').on('click', '.list-group-item', function() {
        checkedTodo($(this));
    })

    //Logout
    $('#logout').click(function(event) {
        event.preventDefault();
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            localStorage.removeItem('token');
            console.log('User signed out.');
            checkToken();
        });
    })
    
})



