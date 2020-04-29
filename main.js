const LOCALHOST = 'http://localhost:3000'
$(document).ready(() => { // digunakan agar render dari HTML selesai
    // without ajax
    
    $('#home').click((event) => {
        event.preventDefault()
        $('#form_register').hide()
        $('#form_login').hide()
        $('.jumbotron').show()
    })

    $('#register').click((event)=> {
        event.preventDefault()
        $('.jumbotron').hide()
        $('#form_register').show()
        $('#form_login').hide()
    })

    $('#login').click((event)=> {
        event.preventDefault()
        $('#form_login').show()
        $('#form_register').hide()
    })

// register
    $('#submit_register').submit((event) => {
        event.preventDefault()
        const email = $('#email_register').val()
        const password = $('#password_register').val()
        // can we say ajax is function ? or routes ?
        $.ajax({
            method: 'POST',
            url: LOCALHOST + '/register',
            data: {
                email,
                password
            }
        })
        .done((res) => {
            $('#sucess').text(res.msg)
            $('#message').hide()
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').text(err.responseJSON.errors)
        })
    })

// login
    $('#submit_login').submit((event) => { // event is action from html
        event.preventDefault()
        const email = $('#email_login').val()
        const password = $('#password_login').val()

        $.ajax({
            method: 'POST',
            url: LOCALHOST + '/login',
            data: {
                email,
                password
            }
        })
        .done((res) => {  // arahkan ke dashboard
            $('#success').text('Your token ' + res.token)
            $('#message').hide()
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').text(err.responseJSON.errors)
        })
    })  
})
