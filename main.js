let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    auth()
    $('#signInForm').submit(event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/signin',
            data: {
                email: $('#emailSignIn').val(),
                password: $('#passwordSignIn').val()
            }
        })
        .done(data => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err)
        })
        .always(() => {
            $('#email').val('')
            $('#password').val('')
        })
    })
});


function auth() {
    if (localStorage.token) {
        $('#signUpPage').hide()
        $('#signInPage').hide()
        $('#mainPage').show()
        $('#buttonSignOut').show()
        fetchData()
    } else {
        $("#message").empty()
        $("#message").append(`It seems that you have signed out`)
        showSignIn()
    }
}

function fetchData() {
    $.ajax({
        method: 'get',
        url: baseUrl + '/todos',
        headers: {
            token: localStorage.token
        }
    })
    .done(data => {
        // olah data
        console.log(data);
        
    })
    .fail(err => {
        console.log(err);
        localStorage.clear()
        auth()
    })
}

function showSignUp() {
    $('#signUpPage').show()
    $('#signInPage').hide()
    $('#mainPage').hide()
    $('#buttonSignOut').hide()
}

function showSignIn() {
    $('#signUpPage').hide()
    $('#signInPage').show()
    $('#mainPage').hide()
    $('#buttonSignOut').hide()
}

function signOut() {
    localStorage.clear()
    auth()
}