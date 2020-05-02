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
                // console.log(data.id, 'ini data')
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
        $('#MainPage').show()
        $('#loginPage').hide()
        $('#createPage').hide()
        $('#regisPage').hide()
        $('#updatePage').hide()
        fecthTodo()
    }else{
        $('#loginPage').show()
        $('#MainPage').hide()
        $('#createPage').hide()
        $('#regisPage').hide()
        $('#updatePage').hide()

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
                    <td><button onclick=updatePage(${e.id})>Update</button></td>
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

function Registrasi() {
    $('#loginPage').hide()
    $('#regisPage').show()
}

function Registration(event) {
    event.preventDefault()
    let Registrasi = {
        email : $('#emailRegis').val(),
        password : $('#passwordRegis').val(),
    }
    console.log(Registrasi, 'ini regist')
    $.ajax({
        method : 'post',
        url : `${baseUrl}/users/signUp`,
        data : Registrasi
    })
    .done(data => {
        $('#loginPage').show()
        $('#regisPage').hide()    

    })
    .fail(err => {
        console.log(err)
    })
    .always(() => {
        $('#emailRegis').val(''),
        $('#passwordRegis').val('')
    })

}

function CreateTodo(event) {
    // console.log(        $("#input[name='status']:checked")   )
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
    // console.log(id)
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

function updatePage(id) {
    $('#MainPage').hide()
    $('#updatePage').show()
    console.log(localStorage)
    $.ajax({
        method : "get",
        url : baseUrl + `/todos/${id}`,
        headers: {
            token : localStorage.token
        },
    })
        .done(data => {
            // console.log(data, 'ini data')
            let Todos = data.data
            $('#formUpdate').append(`
            <label>ID</label>
            <input type="text" id="id-edit" value="${Todos.id}" /><br>
            <label>Title</label><br>
            <input type="text" id="title-edit" value="${Todos.title}" /><br>
            <label>Description</label><br>
            <input type="text" id="description-edit" value="${Todos.description}" /><br>
            <label>status</label><br>
            <p>Complete<input type="radio" name="status" autocomplete="off" value="true" ${Todos.status ? "checked" : ''}> Uncomplete<input type="radio" autocomplete="off" name="status" value="false" ${!Todos.status ? "checked" : ''}>
            </p>
            <label>Due Date</label><br>
            <input type="date" id="due_date-edit" value="${Todos.due_date}"><br>
            <button type="submit">Update Todo</button>
            `)
        })
        .fail(err => {
            console.log(err.responseJSON.Message)
        })

}

function updateTodo(){
    let id = $('#id-edit').val()
    let todo = {
        title : $('#title-edit').val(),
        description : $('#description-edit').val(),
        status : $("input[name='status']:checked").val(),
        due_date : $('#due_date-edit').val(),
    }
    $.ajax({
        method : 'put',
        url : `${baseUrl}/todos/${id}`,
        headers : {
            token : localStorage.token
        },
        data : todo
    })
    .done(data => {
        fecthTodo()
        $('#MainPage').show()
        $('#updatePage').hide()    

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

// searchMovie
function searchMovie(){
    $('#movie-list').html('')
    $.ajax({
        url : 'http://omdbapi.com',
        type : 'get',
        dataType : 'json',
        data : {
            'apikey' : '606c2e47',
            's' : $('#search-input').val()
        },
        success : function(result) {
            if(result.Response == 'True'){
                let movies = result.Search;
                $.each(movies, function(i, data) {
                    
                    $('#movie-list').append(`
                    <div class="col-md-3">
                        <div class="card">
                            <img src="`+ data.Poster +`" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">`+ data.Title +`</h5>
                                <p class="card-text">Type :`+ data.Type +`\nYear :`+ data.Year +`</p>
                                <a href="${data.imdbID}" class="card-link">See Detail </a>
                            </div>
                        </div>
                    </div>
                    `)
                })
                $('#search-input').val('')

            }else{
                $('#movie-list').html('<h1 class="text-center">'+ result.Error +'</h1>')
            }
        }
    });


}

$('#search-button').on('click', function() {
    searchMovie()
});

$('#search-input').on('keyup', function(e) {
    if(e.keyCode === 13){
        searchMovie()
    }
});