$('#signup').hide()
$('#signupDone').hide()
$('#dashboard').hide()
$('#editTask').hide()
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
        localStorage.clear()

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
        $('#login').hide()
        $('#emailLogin').val('')
        $('#passwordLogin').val('')
    })
    .fail(function(err){
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
        $('#signup').hide()
        $('#signupDone').show()
        $('#emailSignup').val('')
        $('#passwordSignup').val('')
        $('#confirm_password').val('')
    })
    .fail(function(err){
        $('#respon').append(`${err.responseJSON.error}`)
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
                `<tr>
                <td>${id}</td>
                <td>${title}</td>
                <td>${description}</td>
                <td>${due_date}</td>
                <td><button id="editTaskBtn" onclick="editTaskBtn('${id}','${title}','${description}','${due_date}')"> EDIT </button> </td>
                <td><button id="deleteBtn" onclick="deleteTask(event,${id})">DELETE</button></td>
                </tr>`
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
        $('#taskRes').append(`${data.msg}`)
        getTodo()
    })
    .fail(err=>{
        $('#taskRes').append(`${err.responseJSON.error}`)
        console.log(err)
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
        $('#editRes').append(`${err.responseJSON.error}`)
        console.log(err)
    })
}

function editTaskBtn(id,title,description,due_date) {
    $('#todoList').hide()
    $('#newTask').hide()
    $('#editTask').show()
    $('#editRes').empty()
    
    $('#editTask').append(
        `<div>
            <form  id="formEdit" >
                <input type="text" id="idEdit" value="${id}" hidden >
                <label for="title">title</label> <br>
                <input type="text" id="titleEdit" value="${title}"> <br>
                <label for="description">description</label> <br>
                <input type="text" id="descriptionEdit" value="${description}"> <br>
                <label for="due_date" >due date</label> <br>
                <input type="date" id="due_dateEdit" value="${due_date}"> <br> <br>
                <button type="submit" onclick="editTask()">SUBMIT</button> <button id="cancelBtn">CANCEL</button> <br> <br>
            </form>
        </div>`
    )
}

function deleteTask(event,id) {
    $('#taskRes').empty()
    event.preventDefault()
    $.ajax({
        method : 'DELETE',
        url : baseUrl+`/todos/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(result=>{
        $('#taskRes').append(`${result.msg}`)
        getTodo()
    })
    .fail(err=>{
        $('#taskRes').append(`${err.responseJSON.error}`)
        console.log(err)
    })
}