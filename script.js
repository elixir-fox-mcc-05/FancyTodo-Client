let baseUrl = "http://localhost:3000"

$(document).ready(function () {
    auth()

    $("#register-form").submit(function(event){

        event.preventDefault();

        $.ajax({
            method : "post",
            url: baseUrl + "/register",
            data : {
                email : $("#register-email").val(),
                password : $("#register-password").val()
            }
        })
        .done(data => {
            $("#register-status").text("Success Register...");
            $("#register-to-login").show()
        })
        .fail(err => {
            $("#register-status").text(err.responseJSON.errors);
            $("#register-to-login").hide()
        })
        .always(_ => {
            $("#register-email").val("")
            $("#register-password").val("")
        })
    })

    $("#login-form").submit(function(event){

        event.preventDefault();

        $.ajax({
            method : "post",
            url: baseUrl + "/login",
            data : {
                email : $("#login-email").val(),
                password : $("#login-password").val()
            }
        })
        .done(data => {
            $("#login-status").text("");
            // console.log(data.token);
            localStorage.setItem("token", data.token);
            auth()
        })
        .fail(err => {
            $("#login-status").text(err.responseJSON.errors);
        })
        .always(_ => {
            $("#login-email").val("")
            $("#login-password").val("")
        })
    })

    $("#create-todo-form").submit(function(event) {

        event.preventDefault();

        $.ajax({
            method : "post",
            url : baseUrl + "/todos",
            headers : {
                token : localStorage.token
            },
            data : {
                title : $("#create-todo-title").val(),
                description : $("#create-todo-description").val(),
                due_date : $("#create-todo-due-date").val(),
            }
        })
        .done(data => {
            $("#create-todo-title").val("")
            $("#create-todo-description").val("")
            $("#create-todo-due-date").val("")
            auth()
            
        })
        .fail(err => {
            err.responseJSON.errors.forEach(element => {
                $("#create-todo-status").text(element.message)
            });
            
        })
    })    
});

/**
 * ===========================================
 * Auth, Button : login, register, cancel, create, update, logout
 * ===========================================
 */

const auth = () => {

    if (localStorage.getItem("token")) {
        $("#landing-page").hide()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").show()
        $("#create-todo-form").hide()
        $("#edit-todo-form").hide()
        fetchToDos()
    } else {
        $("#landing-page").show()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").hide()
        $("#create-todo-form").hide()
        $("#edit-todo-form").hide()
    }
}

const login = () => {

    $("#landing-page").hide()
    $("#register-page").hide()
    $("#login-page").show()
    $("#login-status").text("");
}

const register = () => {

    $("#landing-page").hide()
    $("#register-page").show()
    $("#login-page").hide()
    $("#register-status").text("");
    $("#register-to-login").hide()
}

const cancel = () => {

    auth()
}

const create = () => {

    $("#create-todo-form").show()
}

const logout = () => {

    localStorage.clear()
    auth()
}

/**
 * ===========================================
 * Fetch, Create, Delete
 * ===========================================
 */

const fetchToDos = () => {

    $.ajax({
        method : "get",
        url : baseUrl + "/todos/",
        headers : {
            token : localStorage.token
        }
    })
    .done(data => {
        // console.log(data);
        $(".card").text("")
        data.ToDos.forEach(element => {
            let date = new Date(element.due_date)
            $(".card").append(`
            <div class="card-body">

                <h4 class="card-title">${element.title}</h4>
                <div class="alert alert-warning" role="alert">
                <strong>Due date : </strong>${date.getDate()}-${date.getMonth()}-${date.getFullYear()}
                </div>
                <h6 class="card-subtitle mb-2 text-muted">${element.status ? "COMPLETED !" : "not yet completed"}</h6>
                <p class="card-text">
                ${element.description}
                </p>
                <button type="button" class="btn btn-primary" onclick="updateToDo(${element.id})">Edit</button>
                <button type="button" class="btn btn-danger" onclick="deleteToDo(${element.id})">Delete</button><br><br>
            </div>
        `)
        });
    })
    .fail(err => {
        console.log(err.responseJSON.message);
    })
}

const deleteToDo = (id) => {

    $.ajax({
        method : "delete",
        url : baseUrl + "/todos/" + id,
        headers : {
            token : localStorage.token
        }
    })
    .done(data => {
        fetchToDos()
    })
    .fail(err => {
        console.log(err)
    })
}