let baseurl = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
    $('#form-login').submit( event => {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseurl + '/users/signin',
            data: {
                email: $('#exampleInputEmail1').val(),
                password: $('#exampleInputPassword1').val()
            }
        })
            .done(data => {
                localStorage.setItem('token', data.token)
                auth()
            })
            .fail(err => {
                console.log(err.responseJSON.error)
            })
            .always(() => {
                $('#exampleInputEmail1').val('')
                $('#exampleInputPassword1').val('')
            })
    })
})

function auth(){
    if(localStorage.getItem('token')){
        $('#login-page').hide()
        $('#home-page').show()
        fetchTodos()
    } else {
        $('#login-page').show()
        $('#home-page').hide()
    }
}

function logout(){
    localStorage.clear()
    auth()
}

function fetchTodos(){
    $.ajax({
        method: 'get',
        url: baseurl + '/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('#table-main-todos').empty()
            data.todos.forEach(todo => {                
                $('#table-main-todos').append(`
                    <tr>
                        <td>${todo.title}</td>
                        <td>${todo.description}</td>
                        <td>${todo.status}</td>
                        <td>${todo.due_date}</td>
                    </tr>
                `)
            });
        })
        .fail(err => {
            console.log(err.responseJSON.error, 'ini errornya')
        })
}

function addNewTodo(event){
    event.preventDefault()
    let payload = {
        title: $('#title').val(),
        description: $('#description').val(),
        due_date: $('#date').val()
    }
    $.ajax({
        method: 'post',
        url: baseurl + '/todos',
        headers: {
            token: localStorage.token
        },
        data: payload
    })
        .done(() => {
            fetchTodos()
        })
        .fail(err => {
            console.log(err.responsesJSON.error, 'ini errornya')
        })
        .always(() => {
            $('#title').val(''),
            $('#description').val(''),
            $('#date').val('')
        })
}