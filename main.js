const LOCALHOST = 'http://localhost:3000'
$(document).ready(() => { // digunakan agar render dari HTML selesai
    if (localStorage.token) {
        $('#edit_page').hide()
        $('#form_register').hide()
        $('#form_login').hide()
        $('#dashboard').show()
        get_all_todos(localStorage.token)
    } else {
        // $('#form_login').show()
        $('#form_register').hide()
        $('#form_login').hide()
        $('#dashboard').hide()
    }

    $('#home').click((event) => {
        event.preventDefault()
        $('#form_register').hide()
        $('#form_login').hide()
        $('#dashboard').hide()
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
        $('#dashboard').hide()
    })

    $('#create_todo').click((event) => {
        $('#dashboard').hide()
        $('#add_page').append(`
        <div class="form-group w-25">
            <h4>Add Page</h4>
            <p><b>Title :</b></p>
            <input type="text" id="new_title">
            <p><b>Description :</b></p>
            <input type="text" id="new_description">
            <p><b>Status :</b></p>
            <input type="text" id="new_status">
            <p><b>Due Date :</b></p>
            <input type="date" id="new_due_date">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        `)
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
        .done((res) => {  // arahkan ke dashboard s
            // masukkan token ke get all
            $('#jumbotron').hide()
            $('#form_register').hide()
            $('#form_login').hide()
            $('#dashboard').show()
            get_all_todos(res.token)
            localStorage.setItem('token', res.token)
        })
        .fail((err) => {
            $('#success').hide()
            $('#message').text(err.responseJSON.errors)
        })
    })  

    $('#edit_page').submit((event) => {
        event.preventDefault()
        const id = $('#update_id').val()
        const title = $('#update_title').val()
        const description = $('#update_description').val()
        const status = $('#update_status').val()
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
            $('#success').append(`data success updated`)

        })
        .fail((err) => {
            console.log(err)
            $('#message').append(err.errors)
        })
    })

    $('#add_page').submit((event) => {
        event.preventDefault()
        const title = $('#new_title').val()
        const description = $('#new_description').val()
        const status = $('#new_status').val()
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
            $('#success').append(`successfully added with title :<b>${title}</b>`)
        })
        .fail((err) => {
            $('#message').append(`${err.responseJSON.errors}`)
        })
    })
})


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
            $('#table_content').append(`
            <tr>
            <td class="table-light">${el.id}</td>
            <td class="table-light">${el.title}</td>
            <td class="table-light">${el.status}</td>
            <td class="table-light">${el.due_date}</td>
            <td class="table-light"><a onclick="button_edit(${el.id})"><button type="button" class="btn btn-warning">EDIT</button></a> <a onclick="button_delete(${el.id})"><button type="button" class="btn btn-danger">DELETE</button></a></td>
            </tr>
        `);
        })
    })
    .fail((err) => {
        console.log(err)
    })
}

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
        $('#edit_page').append(`
        <div class="form-group w-25">
            <input type="hidden" id="update_id" value="${res.data.id}">
            <p><b>Title :</b></p>
            <input type="text" id="update_title" value="${res.data.title}">
            <p><b>Description :</b></p>
            <input type="text" id="update_description" value="${res.data.description}">
            <p><b>Status :</b></p>
            <input type="text" id="update_status" value="${res.data.status}">
            <p><b>Due Date :</b></p>
            <input type="date" id="update_due_date" value="${getDate(res.data.due_date)}">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        `)
    })
    .fail((err) => {
        console.log(err)
    })
}

function button_delete(id) {
    $.ajax({
        method: 'DELETE',
        url: LOCALHOST + `/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done((res) => {
        $('#success').append(`success deleted with tidilist id ${id}`)
    })
    .fail((err) => {
        $('#message').append(err.errors)
    })
}

function getDate(date) {
    const year = new Date(date).getFullYear()
    let month = new Date(date).getMonth()
    let day = new Date(date).getDate()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    
    return `${year}-${month}-${day}`
}

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;

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
        console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    localStorage.removeItem('token')
    auth2.signOut().then(function () {
      localStorage.removeItem('')
    });
  }