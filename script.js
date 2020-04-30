const baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
        authentication()
        $('#form-login').submit(function(event) {
            event.preventDefault()
            $.ajax({
                method : 'post',
                url : `${baseUrl}/users/signIn`,
                data : {
                    email : $('#Email').val(),
                    password : $('#Password').val()
                }
            })
            .done(data => {
                localStorage.setItem('token', data.token)
                authentication()
            })
            .fail(err => {
                console.log(err.responseJSON.error)
            })
            .always(() => {
                $('#Email').val('')
                $('#Password').val('')
            })
        })
});

function authentication() {
    if(localStorage.getItem('token')){
        $('#loginPage').hide()
        $('#MainPage').show()
        $('#createPage').hide()
        fecthTodo()
    }else{
        $('#loginPage').show()
        $('#MainPage').hide()
    }
}
// GOOGLE
function onSignIn(googleUser) {
   const id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token)
    $.ajax({
        url : `${baseUrl}/users/googleLogin`,
        method : 'post',
        headers : {
            id_token : id_token
        }
    })
    .done(data => {
        localStorage.setItem('token', data.token)
        authentication()
    })
    .fail(err => {
        console.log(err)
    })
}

function logOut() {
    event.preventDefault()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      localStorage.removeItem('token')
      authentication()
    });
}

function fecthTodo() {
    $.ajax({
        method: 'GET',
        url : `${baseUrl}/todos/`,
        headers : {token : localStorage.token},
    })
    .done(result => {
        // console.log(data.data[0], 'ini dataaa')
        $('#Tbody').empty()
        result.data.forEach(e => {
            $('#Tbody').append(`
                <tr>
                    <td>${e.title}</td>
                    <td>${e.description}</td>
                    <td>${e.status}</td>
                    <td>${e.due_date}</td>
                    <td><button onclick=deleteTodo(${e.id})>Delete</button></td>
                </tr>
            `)
        })
    })
    .fail(err => {
        console.log(err)
    })
    .always()
}

function toAddTodo(){
    $('#MainPage').hide()
    $('#createPage').show()
}

function CreateTodo(event) {
    console.log(        $("#input[name='status']:checked")   )
    event.preventDefault()
    let todo = {
        title : $('#title').val(),
        description : $('#description').val(),
        status : $("input[name='status']:checked").val(),
        due_date : $('#due_date').val(),
    }
    $.ajax({
        method : 'post',
        url : `${baseUrl}/todos/`,
        headers : {
            token : localStorage.token
        },
        data : todo
    })
    .done(data => {
        fecthTodo()
        $('#MainPage').show()
        $('#createPage').hide()    

    })
    .fail(err => {
        console.log(err.responseJSON.error)
    })
    .always(() => {
        $('#title').val('')
        $('#description').val('')
        $("#input[name='status']:checked").prop("checked", false)
        $('#due_date').val('')
    })
    
}

function deleteTodo(id) {
    console.log(id)
    $.ajax({
        method : 'DELETE',
        url : `${baseUrl}/todos/${id}`,
        headers :{token : localStorage.token}
    })
    .done(data => {
        fecthTodo()
    })
    .fail(err => {
        console.log(err)
    })
}