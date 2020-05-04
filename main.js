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
        $('#formUpdatePage').hide()
        $('#loginPage').hide()
        $('#mainPage').show()
        readTodo()
    }
    else{ //to login page
        $('#registerPage').hide()
        $('#formUpdatePage').hide()
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
    $('#registerEmail').val('');
    $('#registerPassword').val('');
    $(`#registerConfirmPassword`).val('')
}
// input register
function register(event){
    event.preventDefault()
    let input = {
        email: $(`#registerEmail`).val(),
        password: $(`#registerPassword`).val(),
    };
    if ($(`#registerPassword`).val() !== $(`#registerConfirmPassword`).val()){
        $('#registerError').show();
        $('#registerError').text(`Invalid password match`);
    }
    else {
        $.ajax({
            method: "POST",
            url: 'http://localhost:3000/users/register',
            data: input
        })
        .done(_ => {
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
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear();
        $('#loginPage').show();
        $('#mainPage').hide();
    });

}

 // get todo list
function readTodo() {
    $(`#formAddTodo`).hide()
    $(`#formUpdatePage`).hide()
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
                check = `Unfinished`
            }
            else {
                check = `Finished`
            }
            $('#todoList').append(`
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${todos[i].title}</h5>
                        <p class="card-text">Description:</p>
                        <p class="card-text">${todos[i].description}</p>
                        <p class="card-text">Due Date: ${todos[i].due_date}</p>
                        <p class="card-text"><small class="text-muted">Status: ${check}</small></p>
                        <button class="card-text" onclick="showUpdateTodo(${todos[i].id})">Update</button>
                        <button class="card-text" onclick="deleteTodo(${todos[i].id})">Delete</button>
                        </div>
                    </div>
                </div>
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
        console.log(err.responseJSON.errors);
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
        readTodo()
    })
    .fail(err => {
        console.log(err)
    })
}
////////////////////////////////

/////////////update available todo/////////////
// show update form
function showUpdateTodo(idUpdate) {
    $('#formUpdatePage').val('')
    $('#updateError').hide()
    $('#mainPage').hide()
    $('#formUpdatePage').show()
    const token = localStorage.getItem('token');
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${idUpdate}`,
        headers: {token}
    })
    .done(data => {
        $(`#updateTitle`).val(data.todo.title);
        $(`#updateDescription`).val(data.todo.description);
        $(`#update_due_date`).val(data.todo.due_date);
        $(`#updateId`).val(data.todo.id);
        if(data.todo.status === false){
            $(`[value='false']`).prop('checked', true);
        }
        else {
            $(`[value='true']`).prop('checked', true)
        }
    })
    .fail(err => {
        console.log(err);
    })
}
// input update todo
function inputUpdateTodo(event){
    event.preventDefault();
    const token = localStorage.getItem('token');
    let idInput = $(`#updateId`).val();
    let input = {
        title: $(`#updateTitle`).val(),
        description: $(`#updateDescription`).val(),
        due_date: $(`#update_due_date`).val(),
        status: $(`[name='status']:checked`).val()
    };
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${idInput}`,
        headers: {token},
        data: input
    })
    .done(data => {
        $('#mainPage').show()
        $('#formUpdatePage').hide()
        readTodo()
    })
    .fail(err => {
        console.log(err.responseJSON);
        $('#updateError').show();
        $('#updateError').text(err.responseJSON.errors[0].msg);
    })

}
// back to home
function backMainPage() {
    $('#mainPage').show()
    $('#formUpdatePage').hide()
}
///////////////

// google sign-in
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/google-login',
        headers: {
            google_token: id_token
        }
    })
    .done(data => {
        localStorage.setItem('token', data.token);
        $('#loginPage').hide(); // hide loginpage
        $('#loginError').hide();
        $(`#mainPage`).show(); // show mainpage
        readTodo()
    })
    .fail(err => {
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
  



