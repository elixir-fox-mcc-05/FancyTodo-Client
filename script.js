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

    $(".edit-todo-form").submit(function(event) {

        let id = $("#edit-todo-id").attr('value')
        let title = $("#edit-todo-title").attr('value')
        let description = $("#edit-todo-description").attr('value')
        let due_date = $("#edit-todo-due-date").attr('value')

        event.preventDefault();

        $.ajax({
            method : "put",
            url : baseUrl + "/todos/" + id,
            headers : {
                token : localStorage.token
            },
            data : {
                title : $("#edit-todo-title").val(),
                description : $("#edit-todo-description").val(),
                due_date : $("#edit-todo-due-date").val(),
            }
        })
        .done(data => {
            $("#edit-todo-title").val("")
            $("#edit-todo-description").val("")
            $("#edit-todo-due-date").val("")
            auth()
            
        })
        .fail(err => {
            err.responseJSON.errors.forEach(element => {
                $("#edit-todo-status").text(element.message)
            });
            
        })
    })
});

/**
 * ===========================================
 * Auth, BUTTON : login, register, cancel, create, logout
 * ===========================================
 */

const auth = () => {

    if (localStorage.getItem("token")) {
        $("#landing-page").hide()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").show()
        $("#create-todo-form").hide()
        fetchToDos()
    } else {
        $("#landing-page").show()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").hide()
        $("#create-todo-form").hide()
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
 * Fetch, Update, Delete
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
            <div id="card-${element.id}" class="card-body">

                <h4 class="card-title">${element.title}</h4>
                <div class="alert alert-warning" role="alert">
                <strong>Due date : </strong>${element.due_date}
                </div>
                <h6 class="card-subtitle mb-2 text-muted">${element.status ? "COMPLETED !" : "not yet completed"}</h6>
                <p class="card-text">
                ${element.description}
                </p>
                <button id="edit-todo-${element.id}" type="button" class="btn btn-primary" onclick="updateToDo('${element.id}', '${element.title}', '${element.description}', '${element.due_date}')">Edit</button>
                <button type="button" class="btn btn-danger" onclick="deleteToDo(${element.id})">Delete</button><br><br>
                
            </div>
        `)
        });
        
    })
    .fail(err => {
        console.log(err.responseJSON.message);
    })
}

const updateToDo = (id, title, description, due_date) => {

    $(`#edit-todo-${id}`).hide()
    $(`#card-${id}`).append(`
    <form class="edit-todo-form">
        <input id="edit-todo-id" value="${id}" hidden>
        <h2>Edit "${title}"</h2>
        <label>Title :</label><br>
        <input id="edit-todo-title" class="form-control" type="text" placeholder="todo title" value="${title}" required autofocus><br>
        <label>Description :</label><br>
        <input id="edit-todo-description" class="form-control" type="text" placeholder="description here" value="${description}" required><br>
        <label>Due date :</label><br>
        <input id="edit-todo-due-date" class="form-control" type="date" placeholder="date" value="${due_date}" required><br>
        <input class="btn btn-primary" type="submit" value="Ok, done editing">
        <input id="edit-todo-cancel" class="btn btn-outline-warning" type="button" value="Cancel" onclick="cancel()"><br><br>
        <p id="edit-todo-status" class="alert alert-info" role="alert"></p>
    </form>
    `)

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