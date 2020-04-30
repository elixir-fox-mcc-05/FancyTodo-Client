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
})

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
        console.log(err.responseJSON.errors[0].msg);
        $('#loginError').show();
        $('#loginError').text(err.responseJSON.errors[0].msg);
    })
}

// check storage/token
function checkStorage(){
    if(localStorage.token){ //to main page
        $('#loginPage').hide()
        $('#mainPage').show()
        readTodo()
    }
    else{ //to login page
        $('#loginPage').show()
        $('#mainPage').hide()
    }
}

 // logout
function logout(){
    localStorage.clear();
    $('#loginPage').show();
    $('#mainPage').hide();
}

 // get todo list
function readTodo() {
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
        $('#todoList').empty()
        for (let i = 0; i < todos.length; i++){
            $('#todoList').append(`
            <tr>
                <td>${todos[i].id}</td>
                <td>${todos[i].title}</td>
                <td>${todos[i].description}</td>
                <td>${todos[i].due_date}</td>
            </tr>
            `)
        }
    })
    .fail(function(err) {
        console.log(err.responseJSON.errors.msg);
    })
}


