let baseUrl = "http://localhost:3000"

$(document).ready(function () {
    auth()

    $("#register-button").click(function() {
        $("#landing-page").hide()
        $("#register-page").show()
        $("#login-page").hide()
    })

    $("#register-cancel").click(function() {
        $("#landing-page").show()
        auth()
    })

    $("#login-button").click(function() {
        $("#landing-page").hide()
        $("#register-page").hide()
        $("#login-page").show()
    })

    $("#login-cancel").click(function() {
        $("#landing-page").show()
        auth()
    })

    $("#logout-button").click(function() {
        localStorage.clear()
        auth()
    })

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
            $("#register-status").text("Success register..");
        })
        .fail(err => {
            $("#register-status").text(err.responseJSON.errors);
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
            $("#login-status").text("Success login..");
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
});

const auth = () => {

    if (localStorage.getItem("token")) {
        $("#landing-page").hide()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").show()
    } else {
        $("#landing-page").show()
        $("#register-page").hide()
        $("#login-page").hide()
        $("#main-page").hide()
    }
}
