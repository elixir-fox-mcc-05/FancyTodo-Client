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
            $("#create-todo-status").empty()
            err.responseJSON.errors.forEach(element => {
                // console.log(element.message);
                $("#create-todo-status").append("! - "+ element.message + "<br>")
            });
            
        })
    })

    $(".edit-todo-form").submit(function(event) {

        let id = $("#edit-todo-id").attr('value')
        let status = $(".custom-control-input:checked").val()

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
                status : status,
                due_date : $("#edit-todo-due-date").val(),
            }
        })
        .done(data => {
            auth()
            
        })
        .fail(err => {
            $("#edit-todo-status").empty()
            err.responseJSON.errors.forEach(element => {
                // console.log(element.message);
                $("#edit-todo-status").append("! - "+ element.message + "<br>")
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
        checkIp()
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
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {});
    auth()
}

/**
 * ===========================================
 * Fetch, Update, Delete, Random Quote, Check Ip
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
        $(".card").empty()
        data.ToDos.forEach(element => {
            let date = new Date(element.due_date)
            let dateNow = new Date()
            let dayRemaining = Math.round((date - dateNow)/86400000)
            
            $(".card").append(`
            <div id="card-${element.id}" class="card-body">

                <h4 class="card-title">${element.status ? "&#9745; - " : ""}${element.title}</h4>
                <div class="alert alert-info" role="alert">
                <strong>Due date : </strong>${element.due_date} ${dayRemaining >= 0 ? "- ( " + dayRemaining + " days remaining )" : "- ( EXPIRED )"}
                </div>
                <h6 class="card-subtitle mb-2 text-white ${element.status ? "badge badge-success" : "badge badge-danger"} " >${element.status ? "[ COMPLETED ! ]" : "[ Not yet completed ]"}</h6>
                <p class="card-text">
                ${element.description}
                </p>
                <button id="edit-todo-${element.id}" type="button" class="btn btn-primary" onclick="updateToDo('${element.id}', '${element.title}', '${element.description}', '${element.status}', '${element.due_date}')">Edit</button>
                <button type="button" class="btn btn-danger" onclick="deleteToDo(${element.id})">Delete</button><br><br>
                
            </div>
        `)
        });
        
    })
    .fail(err => {
        console.log(err.responseJSON.message);
    })
}

const updateToDo = (id, title, description, status, due_date) => {
    
    $(`#edit-todo-${id}`).hide()
    $(`#card-${id}`).append(`
    <form class="edit-todo-form">
        <input id="edit-todo-id" value="${id}" hidden>
        <h2>Edit "${title}"</h2>
        <label>Title :</label><br>
        <input id="edit-todo-title" class="form-control" type="text" placeholder="todo title" value="${title}" ><br>
        <label>Description :</label><br>
        <input id="edit-todo-description" class="form-control" type="text" placeholder="description here" value="${description}" ><br>
        <label>Status :</label><br>
        <div class="custom-control custom-radio">
            <input type="radio" id="edit-todo-status-1" name="status" class="custom-control-input" value="true" ${status == "true" ? "checked" : ""}>
            <label class="custom-control-label" for="edit-todo-status-1">Completed</label>
        </div>
        <div class="custom-control custom-radio">
            <input type="radio" id="edit-todo-status-2" name="status" class="custom-control-input" value="false" ${status == "false" ? "checked" : ""}>
            <label class="custom-control-label" for="edit-todo-status-2">Not Completed</label>
        </div>
        <label>Due date :</label><br>
        <input id="edit-todo-due-date" class="form-control" type="date" placeholder="date" value="${due_date}"><br>
        <p id="edit-todo-status" class="alert alert-warning" role="alert"></p>
        <input class="btn btn-primary" type="submit" value="Ok, done editing">
        <input id="edit-todo-cancel" class="btn btn-outline-warning" type="button" value="Cancel" onclick="cancel()"><br><br>
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

const randomizeQuote = () => {
    
    $.ajax({
        method : "get",
        url : baseUrl + "/randomquote",

    })
    .done(data => {
        $("#quote-author").empty()
        $("#quote-text").empty()
        $("#quote-author").append(` -( ${data.quote.quoteAuthor} ) :`)
        $("#quote-text").append(data.quote.quoteText)
    })
    .fail(err => {
        console.log(err);
    })
}

const checkIp = () => {

    $.ajax({
        method : "get",
        url : baseUrl + "/checkip"
    })
    .done(data => {
        $("#ip").text(data.ipAddress)
    })
    .fail(err => {
        console.log(err);
    })
}

/**
 * ===========================================
 * Google Sign In
 * ===========================================
 */

function onSignIn(googleUser) {

    const id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method : "post",
        url : baseUrl + "/google-login",
        headers : {
            google_token : id_token
        }
    })
    .done(data => {
        localStorage.setItem("token", data.token)
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}