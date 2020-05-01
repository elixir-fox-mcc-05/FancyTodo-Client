let baseurl = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
    $('#signin-form').submit( event => {
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

// function register(event){
//     event.preventDefault()
//     $.ajax({
//         method: 'post',
//         url: baseurl + '/users/signup',
//         data: {
//             email: $('#email-register').val(),
//             password: $('#password-register').val()
//         }
//     })
//         .done(data => {
//             localStorage.setItem('token', data.token)
//             auth()
//         })
//         .fail(err => {
//             console.log(err.responseJSON.error)
//         })
//         .always(() => {
//             $('#exampleInputEmail1').val('')
//             $('#exampleInputPassword1').val('')
//         })    
// }


function auth(){
    if(localStorage.getItem('token')){
        $('#edit-page').hide()
        $('#signin-page').hide()
        $('#home-page').show()
        fetchTodos()
    } else {
        $('#edit-page').hide()
        $('#signin-page').show()
        $('#home-page').hide()
    }
}

function logout(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        auth()
    });
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
                        <td class="todoId">${todo.id}</td>
                        <td>${todo.title}</td>
                        <td>${todo.description}</td>
                        <td>${todo.status}</td>
                        <td>${todo.due_date}</td>
                    </tr>
                `)
            });
        })
        .fail(err => {
            console.log(err.responseJSON.error)
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

function formEdit(event){
    event.preventDefault()
    let id
    $('#signin-page').hide()
    $('#home-page').hide()
    $('#edit-page').show()
    $("#home-table").on("click", "tr", function (row, $el, field) {
        id = $(this).find(".todoId").html();
        $.ajax({
            method: 'get',
            url: `${baseurl}/todos/${id}`,
            headers: {
                token: localStorage.token
            }
        })
        .done(data => {   
            $('#table-todo-by-Id').empty()
            $('#table-recom-by-Id').empty()
            $('#form-edit-todo').empty()
            $('#table-todo-by-Id').append(`
                <tr>
                    <td class="todo-edit-id">${data.Todo.id}</td>
                    <td>${data.Todo.title}</td>
                    <td>${data.Todo.description}</td>
                    <td>${data.Todo.status}</td>
                    <td>${data.Todo.due_date}</td>
                    <td><button type="submit" class="btn btn-primary" onclick="deleteTodo(event)">delete</button></td>
                </tr>
            `)
            
            $('#form-edit-todo').append(`
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title-edit" value="${data.Todo.title}">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control" id="description-edit" value="${data.Todo.description}">
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <div class="custom-control custom-radio">
                        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" value="true">
                        <label class="custom-control-label" for="customRadio1">true</label>
                    </div>
                    <div class="custom-control custom-radio">
                        <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" value="false">
                        <label class="custom-control-label" for="customRadio2">false</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="date">Due Date</label>
                    <input type="date" class="form-control" id="date-edit">
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
            `)  
            let activity = ['makan', 'dinner', 'nongkrong', 'hangout']
            for (let i = 0; i < activity.length; i++) {
                if(data.Todo.title.toLowerCase() == activity[i]){
                    for (let j = 0; j < data.recommendations.length; j++) {
                        $('#table-recom-by-Id').append(`
                            <tr>
                                <td>${data.recommendations[j].title}</td>
                                <td>${data.recommendations[j].description}</td>
                                <td><a href="${data.recommendations[j].url}">${data.recommendations[i].url}</a></td>
                            </tr>
                        `)
                    }
                } 
            }
        })
        .fail(err => console.log(err))
    });
}

function editTodo(event){
    event.preventDefault()
    let updatePayload = {
        title: $('#title-edit').val(),
        description: $('#description-edit').val(),
        status: $("input[name='customRadio']:checked").val(),
        due_date: $('#date-edit').val()
    }
    $('#table-todo-by-Id tr').each(function() {
        let id = $(this).find(".todo-edit-id").html();
        $.ajax({
            method: 'put',
            url: `${baseurl}/todos/${id}`,
            headers: {
                token: localStorage.token
            },
            data: updatePayload
        })
            .done(data => {
                fetchTodos()
                $('#edit-page').hide()
                $('#signin-page').hide()
                $('#home-page').show()
                
            })
            .fail(err => {
                console.log(err.responsesJSON.error)
            })

            .always(() => {
                $('#title-edit').val('')
                $('#description-edit').val('')
            })
    });
}

function deleteTodo(event){
    event.preventDefault()
    $('#table-todo-by-Id tr').each(function(){
        let id = $(this).find(".todo-edit-id").html()
        $.ajax({
            method: 'delete',
            url: `${baseurl}/todos/${id}`,
            headers: {
                token: localStorage.token
            }
        })
            .done(() => {
                fetchTodos()
                $('#edit-page').hide()
                $('#signin-page').hide()
                $('#home-page').show()
            })  
            .fail(err => {
                console.log(err.responseJSON.error)
            })    
    })
}       

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;     
    $.ajax({
        method: 'post',
        url: `${baseurl}/users/google-signin`,
        headers: {
            google_token: id_token
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .catch(err => {
            console.log(err.responseJSON.error)
        })
}