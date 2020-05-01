const LOCALHOST = 'http://localhost:3000'

$(document).ready(() => { // digunakan agar render dari HTML selesai
    if (localStorage.token) {
        $('#landing_page_nav').hide()
        $('#form_register').hide()
        $('#form_login').hide()
        $('.jumbotron').hide()
        $('#edit_page').hide()
        $('#add_page').hide()

        $('#navigation').show()
        $('#dashboard').show()
        
        get_all_todos(localStorage.token)
    } else {
        $('#landing_page_nav').hide()
        $('#form_register').hide()
        $('#navigation').hide()
        $('#form_login').hide()
        $('#dashboard').hide()
        $('#edit_page').hide()
        $('#add_page').hide()
    } // [ok]

    $('#home').click((event) => {
        event.preventDefault()

        $('#landing_page_nav').hide()
        $('#form_register').hide()
        $('#form_login').hide()
        $('.jumbotron').hide()
        $('#edit_page').hide()
        $('#add_page').hide()

        $('#dashboard').show()
    }) // [ok]

    $('#register').click((event)=> {
        event.preventDefault()

        $('#form_login').hide()
        $('.jumbotron').hide()
        $('#message').hide()
        $('#success').hide()

        $('#landing_page_nav').show()
        $('#form_register').show()
    }) // [ok]

    $('#login').click((event)=> {
        event.preventDefault()

        $('#form_register').hide()
        $('.jumbotron').hide()
        $('#dashboard').hide()
        $('#add_page').hide()

        $('#landing_page_nav').show()
        $('#form_login').show()
    })

    $('#create_todo').click((event) => {
        $('#dashboard').hide()

        $('#add_page').show()
    }) // [ok]

    $('#landing_page_nav').click((event) => {
        event.preventDefault()

        $('#landing_page_nav').hide()
        $('#form_register').hide()
        $('#form_login').hide()
        $('#navigation').hide()
        $('#dashboard').hide()

        $('.jumbotron').show()
    }) // [ok]

    $('#submit_register').submit((event) => {
        event.preventDefault()

        const email = $('#email_register').val()
        const password = $('#password_register').val()

        $.ajax({
            method: 'POST',
            url: LOCALHOST + '/register',
            data: {
                email,
                password
            }
        })
        .done((res) => {
            $('#landing_page_nav').hide()
            $('#submit_register').hide()
            $('#form_egister').hide()
            $('#edit_page').hide()
            $('#message').hide()

            $('.jumbotron').show()

            $('#password_register').val('')
            $('#email_register').val('')
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').text(err.responseJSON.errors)
        })
    }) // [ok]

    $('#submit_login').submit((event) => {
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
        .done((res) => {
            $('#landing_page_nav').hide()
            $('#form_register').hide()
            $('#form_login').hide()
            $('#jumbotron').hide()

            $('#dashboard').show()
            $('#navigation').show()

            get_all_todos(res.token)

            $('#email_register').val('')
            $('#password_register').val('')

            localStorage.setItem('token', res.token)
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').text(err.responseJSON.errors)
        })
    }) // [ok]

    $('#edit_page').submit((event) => {
            event.preventDefault()

            const id = $('#update_id').val()
            const title = $('#update_title').val()
            const description = $('#update_description').val()
            const status = $("input[name='update_status']:checked").val();
            const due_date = $('#update_due_date').val()

            $.ajax({
                method: 'PUT',
                url: LOCALHOST + `/todos/${id}`,
                headers: {
                    token: localStorage.token
                },
                data: {
                    title,
                    description,
                    status,
                    due_date
                }
            })
            .done((res) => {
                $('#form_register').hide()
                $('#form_login').hide()
                $('#edit_page').hide()
                $('.jumbotron').hide()
                $('#dashboard').show()
                $('#add_page').hide()

                $('#navigation').show()

                $('#table_content').empty()

                get_all_todos(localStorage.token)
                })
            .fail((err) => {
                $('#message').append(err.errors)
            })
    }) // [ok]

    $('#add_page').submit((event) => {
        event.preventDefault()

        const title = $('#new_title').val()
        const description = $('#new_description').val()
        const status = $("input[name='new_status']:checked").val();
        const due_date = $('#new_due_date').val()

        $.ajax({
            method: 'POST',
            url: LOCALHOST + '/todos',
            headers: {
                token: localStorage.token
            },
            data: {
                title,
                description,
                status,
                due_date
            }
        })
        .done((res) => {
            $('#form_register').hide()
            $('#form_login').hide()
            $('#edit_page').hide()
            $('.jumbotron').hide()
            $('#add_page').hide()
            $('#message').hide()

            $('#navigation').show()
            $('#dashboard').show()

            $('#table_content').empty()

            get_all_todos(localStorage.token)
            
            $('#new_title').val('')
            $('#new_description').val('')
            $('.new_status').val('')
            $('#new_due_date').val('')
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').append(`${err.responseJSON.errors}`)
        })
    }) // [ok]
})

// FUNCTIONS BELOW

function get_all_todos(token) {
    $.ajax({
        method: 'GET',
        url: LOCALHOST + '/todos',
        headers: {
            token
        }
    })
    .done((res) => {
        let {data} = res
        data.map(el => {
            $('#table_content')
                .append(`<tr>
                <td class="table-light">${el.id}</td>
                <td class="table-light">${el.title}</td>
                <td class="table-light">${el.status}</td>
                <td class="table-light">${getDate(el.due_date)}</td>
                <td class="table-light"><a onclick="button_edit(${el.id})"><button type="button" class="btn btn-outline-warning">UPDATE</button></a> <a onclick="button_delete(${el.id})"><button type="button" class="btn btn-outline-danger">DELETE</button></a></td>
                </tr>`);
        })
    })
    .fail((err) => {
        $('#message').empty()
        $('#message').append(`<b>Warning!</b> ${err.errors}`)
    })
} // [ok]

function button_edit(id) {
    $.ajax({
        method: 'GET',
        url: LOCALHOST + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done((res) => {
        $('#dashboard').hide()
        $('#edit_page').show()
        $('#update_id').attr('value', `${res.data.id}`)
        $('#update_title').attr('value', `${res.data.title}`)
        $('#update_description').attr('value', `${res.data.description}`)

        if (res.data.status == true) { $("input[name='update_status'][value=true]").attr('checked', true); }
        else if (res.data.status == false) { $("input[name='update_status'][value=false]").attr('checked', true); }

        $('#update_due_date').attr('value', `${getDate(res.data.due_date)}`)
        $('#edit_page').show()
    })
    .fail((err) => {
        $('#message').empty()
        $('#message').append(`<b>Warning!</b> ${err.errors}`)
    })
} // [ok]

function button_delete(id) {
    $.ajax({
        method: 'DELETE',
        url: LOCALHOST + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done((res) => {
        $('#form_register').hide()
        $('#form_login').hide()
        $('#edit_page').hide()
        $('#edit_page').hide()
        $('.jumbotron').hide()
        $('#add_page').hide()
        $('#message').hide()
        $('#message').hide()

        $('#table_content').empty()

        get_all_todos(localStorage.token)
    })
    .fail((err) => {
        $('#message').empty()
        $('#message').append(`<b>Warning!</b> ${err.errors}`)
    })
} // [ok]

function getDate(date) {
    const year = new Date(date).getFullYear()
    let month = new Date(date).getMonth() + 1
    let day = new Date(date).getDate()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    return `${year}-${month}-${day}`
} // [ok]

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $('.jumbotron').hide()

    $('#navigation').show()
    $('#dashboard').show()

    $.ajax({
        method: 'POST',
        url: LOCALHOST + '/google-signin',
        headers: {
            google_token: id_token
        }
    })
    .done((res) => {
        localStorage.setItem('token', res.token)
    })
    .fail((err) => {
        $('#message').empty()
        $('#message').append(`<b>Warning!</b> ${err.errors}`)
    })
} // [ok]

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {
      localStorage.removeItem('token')

      $('#landing_page_nav').hide()
      $('#navigation').hide()
      $('#dashboard').hide()

      $('.jumbotron').show()
    });
} // [ok]