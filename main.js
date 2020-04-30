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
        $('#loginPassword').val('')
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
    $('#loginEmail').val('');
    $('#loginPassword').val('')
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
                <li>Titel: ${todos[i].title}</li>
                <p>Description: ${todos[i].description}</p>
                <p>Due Date: ${todos[i].due_date}</p>
                <p>Check: ${check}</p>
                <button>Edit</button>
                <button>Delete</button>
                <br><br>
            `)
        }
    })
    .fail(function(err) {
        console.log(err.responseJSON.errors.msg);
    })
}

// post new tot

// edit available todo

// delete available todo
