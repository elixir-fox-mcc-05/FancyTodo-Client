$('#signup').hide()
$('#signupDone').hide()
$('#dashboard').hide()
$('#editTask').hide()
$('#respon').hide()
$('#taskRes').hide()
$('#taskResErr').hide()
$('#settings').hide()
$('#errorMsg').hide()
$('#taskResDel').hide()

// $('#newTask').hide()

let baseUrl = 'http://localhost:3000'

$(document).ready(()=>{
    checkToken()

    // login fuction

    $('#formLogin').submit((event)=>{
        $('#respon').empty()
        event.preventDefault()
        let email = $('#emailLogin').val()
        let password = $('#passwordLogin').val()
        signin(email,password)
    })

    //  signup function

    $('#formSignup').submit((event)=>{
        $('#respon').empty()
        event.preventDefault()
        let email = $('#emailSignup').val()
        let password = $('#passwordSignup').val()
        let confirm_password = $('#confirm_password').val()

        signup(email , password , confirm_password )        
    })

    $('#signupBtn').click((event)=>{
        event.preventDefault()
        $('#respon').empty()
        $('#signup').show()
        $('#login').hide()
        $('#emailSignup').val('')
        $('#passwordSignup').val('')
        $('#confirm_password').val('')
    })

    $('#signinBtn').click((event)=>{
        event.preventDefault()
        $('#respon').empty()
        $('#signup').hide()
        $('#login').show()
        $('#emailLogin').val('')
        $('#passwordLogin').val('')
    })

    $('#logout').click(()=>{
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            localStorage.clear()
        });

    })

    $('#newTask').submit((event)=>{
        event.preventDefault()
        let title = $('#title').val()
        let description = $('#description').val()
        let due_date = $('#due_date').val()

        addTask(title,description,due_date)
    })

})

function signin (email , password) {
    $.ajax({
        method : 'POST',
        url : baseUrl+'/users/signin',
        data : {
            email,
            password
        }
    })
    .done(function(data){
        let token = data.token
        localStorage.setItem('token',token)
        $('#dashboard').show()
        getTodo()
        $('#landingPage').hide()
        $('#emailLogin').val('')
        $('#passwordLogin').val('')
    })
    .fail(function(err){
        // return popup()
        $('#respon').show()
        $('#respon').append(`${err.responseJSON.error}`)
    })
}

function signup (email , password , confirm_password ) {
    $.ajax({
        method : 'POST',
        url : baseUrl+'/users/signup',
        data : {
            email,
            password,
            confirm_password
        }
    })
    .done(function(data){
        $('#errorMsg').empty()
        $('#signup').hide()
        $('#signupDone').show()
        $('#emailSignup').val('')
        $('#passwordSignup').val('')
        $('#confirm_password').val('')
    })
    .fail(function(err){
        $('#errorMsg').empty()
        $('#errorMsg').show()
        $('#errorMsg').append(`${err.responseJSON.error}`)
    })
}

function getTodo () {
    $('#tableBody').empty()
    $.ajax({
        method : 'GET',
        url : baseUrl+'/todos',
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(data =>{
        data.data.forEach(element => {
            id = element.id
            title = element.title
            description = element.description
            due_date = element.due_date

            $('#tableBody').append(
                `
                <div class="row">
                    <div class="col-3">
                        ${title}
                    </div>
                    <div class="col-4">
                        ${description}
                    </div>
                    <div class="col-3">
                        ${due_date}
                    </div>
                    <div class="col-2">
                        <button id="editTaskBtn" onclick="editTaskBtn('${id}','${title}','${description}','${due_date}')" class="btn btn-warning btn-sm" >edit</button>
                        <button id="deleteBtn" onclick="deleteTask(event,${id})" class="btn btn-danger btn-sm" style="right: 0;">delete</button>   
                    </div>
                </div> <hr>
                `
                )
        });
        console.log(data.data)
    })
    .fail(err =>{
        $('#todoList').append(`${err}`)
    })
}

function checkToken () {
    if(localStorage.token) {
        $('#landingPage').hide()
        $('#dashboard').show()
        getTodo()
    }
}

function addTask (title,description,due_date) {
    $('#taskRes').empty()
    $('#taskResErr').empty()
    $.ajax({
        method : 'POST',
        url : baseUrl+'/todos',
        headers : {
            token : localStorage.getItem('token')
        },
        data : {
            title,
            description,
            due_date
        }
    })
    .done(data=>{
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
        $('#taskRes').show()
        $('#taskRes').append(`${data.msg}`)
        $('#taskResErr').hide()
        getTodo()
    })
    .fail(err=>{
        $('#taskResDel').hide()
        $('#taskResErr').append(`${err.responseJSON.error}`)
        $('#taskResErr').show()
        $('#taskRes').hide()
    })
}

function editTask () {
    event.preventDefault()
    let id = $('#idEdit').val()
    let title = $('#titleEdit').val()
    let description = $('#descriptionEdit').val()
    let due_date = $('#due_dateEdit').val()
    
    $.ajax({
        method : 'PATCH',
        url : baseUrl+`/todos/${id}`,
        headers : {
            token : localStorage.getItem('token')
        },
        data : {
            title,
            description,
            due_date
        }
    })
    .done(data=>{
        $('#todoList').show()
        $('#newTask').show()
        $('#editTask').hide()
        $('#editRes').empty()
        $('#editTask').empty()
        $('#taskRes').empty()
        
        getTodo()
    })
    .fail(err=>{
        $('#editRes').empty()
        $('#editRes').append(`${err.responseJSON.error}`)
        $('#editRes').show()
    })
}

function editTaskBtn(id,title,description,due_date) {
    $('#todoList').hide()
    $('#newTask').hide()
    $('#editTask').empty()
    $('#editTask').show()
    $('#editRes').empty()
    
    $('#editTask').append(
        `
        <h4>Edit Task</h4> <hr>
        <div id="editRes" class="alert alert-danger" role="alert"></div>
        <div>
            <form  id="formEdit" class="input-group">
                <input type="text" id="idEdit" value="${id}" hidden >
                <input type="text" id="titleEdit" value="${title}" aria-label="title" class="form-control">
                <input type="text" id="descriptionEdit" value="${description}" aria-label="description" class="form-control">
                <input type="date" id="due_dateEdit" value="${due_date}" aria-label="due_date" class="form-control" >
                <div class="input-group-append">
                    <button type="submit" onclick="editTask()" class="btn btn-success" >SUBMIT</button> <button id="cancelBtn" class="btn btn-danger" onclick="cancelEdit()" >CANCEL</button>
                </div>
                
            </form>
        </div>`
    )
    $('#editRes').hide()
}

function deleteTask(event,id) {
    $('#taskResDel').empty()
    event.preventDefault()
    $.ajax({
        method : 'DELETE',
        url : baseUrl+`/todos/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(result=>{
        $('#taskRes').hide()
        $('#taskResErr').hide()
        $('#taskResDel').empty()
        $('#taskResDel').append(`${result.msg}`)
        $('#taskResDel').show()
        getTodo()
    })
    .fail(err=>{
        $('#taskResErr').append(`${err.responseJSON.error}`)
        console.log(err)
    })
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method : 'POST',
        url : baseUrl+'/users/googleSignin',
        data : {
            google_token : id_token
        }
    })
    .done(data=>{
        localStorage.setItem('token',data.token)
        $('#dashboard').show()
        getTodo()
        $('#landingPage').hide()
        $('#emailLogin').val('')
        $('#passwordLogin').val('')
    })
    .fail(err=>{
        $('#respon').empty()
        $('#respon').append(`${err.responseJSON.error}`)
    })
  }

function cancelEdit () {
    event.preventDefault()
    
    $('#todoList').show()
    $('#newTask').show()
    $('#editTask').hide()
    $('#taskResErr').hide()
    $('#taskRes').hide()
    $('#taskResDel').hide()

}



