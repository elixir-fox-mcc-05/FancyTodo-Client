$(document).ready(function(){
    // condition if already login (have token)
    checkStorage()

    // for login to get token, before main page
    $("#formLoginPage").on('submit', function(event) {
        event.preventDefault();
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        login(email, password);
    });

    // initial value for due_date in add Todo form
    $('#add_due_date').val(dateNow());
})

// check storage/token
function checkStorage(){
    if(localStorage.token){ //to main page
        $('#registerPage').hide()
        $('#loginPage').hide()
        $('#mainPage').show()
        readTodo()
    }
    else{ //to login page
        $('#registerPage').hide()
        $('#loginPage').show()
        $('#mainPage').hide()
    }
}

// login
function login(email, password){
    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/users/login',
        data: {
            email: email,
            password: password
        }
    })
    .done(function(response) {
        const token = response.token;
        localStorage.setItem('token', token);
        $('#loginPage').hide(); // hide loginpage
        $('#loginError').hide();
        $(`#mainPage`).show(); // show mainpage
        readTodo()
    })
    .fail(function(err) {
        console.log(err);
        $('#loginError').show();
        $('#loginPassword').val('');
        $('#loginError').text(err.responseJSON.errors[0].msg);
    })
    .always(_ => {
        $('#loginEmail').val('');
        $('#loginPassword').val('')
    })
}

/////////////register new user////////////
// show register form 
function showRegister() {
    $('#registerPage').show();
    $(`#registerError`).hide();
    $(`#loginPage`).hide();
}
// input register
function register(event){
    event.preventDefault()
    let input = {
        email: $(`#registerEmail`).val(),
        password: $(`#registerPassword`).val(),
    };
    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/users/register',
        data: input
    })
    .done(_ => {
        console.log(`masuk`)
        $('#loginError').hide();
        $('#loginPage').show();
        $('#registerPage').hide()
    })
    .fail(err => {
        console.log(err);
        $('#registerError').show();
        $('#registerError').text(err.responseJSON.errors[0].msg);
    })
    .always(_ => {
        $('#registerEmail').val('');
        $('#registerPassword').val('');
    })
}
// cancel register
function cancelRegister() {
    $('#registerPage').hide()
    $(`#loginPage`).show()
    $(`#loginError`).hide()
}
///////////////////////////

 // logout
function logout(){
    localStorage.clear();
    $('#loginPage').show();
    $('#mainPage').hide();
}

 // get todo list
function readTodo() {
    $(`#formAddTodo`).hide()
    const token = localStorage.getItem('token')
    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/todos',
        headers: {
            token: token
        }
    })
    .done(function(response) {
        const todos = response.todos;
        $('#todoList').empty();
        for (let i = 0; i < todos.length; i++){
            let check = null;
            if(todos[i].status == false){
                check = `[  ]`
            }
            else {
                check = `[X]`
            }
            $('#todoList').append(`
                <li>Title  &emsp;&emsp;&emsp;&nbsp;: ${todos[i].title}</li>
                <p>Description: ${todos[i].description}</p>
                <p>Due Date &ensp;&nbsp;: ${todos[i].due_date}</p>
                <p>Status  &emsp;&emsp;&nbsp;: ${check}</p>
                <button>Edit</button>
                <button onclick="deleteTodo(${todos[i].id})">Delete</button>
                <br><br>
            `)
        }
    })
    .fail(function(err) {
        console.log(err.responseJSON.errors.msg);
    })
}

////////add new todo //////////////
// show add new todo form 
function showAddTodo() {
    $('#addTodoError').hide();
    $(`#buttonAddTodo`).hide()
    $(`#formAddTodo`).show()
}
// input add new todo
function inputAddTodo(event){
    event.preventDefault();
    const token = localStorage.getItem('token');
    let input = {
        title: $(`#addTitle`).val(),
        description: $(`#addDescription`).val(),
        due_date: $(`#add_due_date`).val()
    };
    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/todos',
        headers: {token},
        data: input
    })
    .done(_ => {
        $('#addTodoError').hide();
        $(`#buttonAddTodo`).show();
        $(`#formAddTodo`).hide();
        checkStorage()
        $('#add_due_date').val(dateNow());
    })
    .fail(err => {
        console.log(err);
        $('#addTodoError').show();
        $('#addTodoError').text(err.responseJSON.errors[0].msg);
    })
    .always(_ => {
        $('#addTitle').val('');
        $('#addDescription').val('');
    })
}
// cancel add new todo form
function cancelAddTodo() {
    $(`#buttonAddTodo`).show();
    $(`#formAddTodo`).hide();
}
// initial value for add_due_date
function dateNow() {
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1);               
    let day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    let today = year + '-' + month + '-' + day;
    return today
}
/////////////////////////////

/////////////delete available todo////////////
function deleteTodo(idDelete){
    const token = localStorage.getItem('token');
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${idDelete}`,
        headers: {
            token: token
        }
    })
    .done(data => {
        console.log(data)
        readTodo()
    })
    .fail(err => {
        console.log(err)
    })
}
////////////////////////////////



/////////////edit available todo/////////////

///////////////




