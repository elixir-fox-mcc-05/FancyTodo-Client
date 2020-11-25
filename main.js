let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    auth()
    $('#form-login').on('submit', (event) => {
        event.preventDefault()
    })
})

function auth () {

    if (localStorage.access_token) {
        $("#login").hide()
        $("#list").show()
        $("#form-register").hide()
        $("#btn-regis").hide()
        $("#btn-logout").show()
        $("#add").hide()
        $("#btn-add").show()
        $("#g-signin2").hide()
        $("#form-weather").show()
        $("#API-weather-jumbo").show()
        $("#btn-login").hide()
        $("#btn-home").show()
        $("#btn-project").show()
        $("#btn-profile").show()
        $("#btn-myproject").show()
        $("#project-list").hide()
        $("#form-add-project").hide()
        $('#detail-form').hide()
        
        getStatus(event)
        myTodo()
    } else {
        $("#login").show()
        $("#add").hide()
        $("#list").hide()
        $("#btn-logout").hide()
        $("#form-register").hide()
        $("#btn-regis").show()
        $("#g-signin2").show()
        $("#form-weather").hide()
        $("#btn-add").hide()
        $("#API-weather-jumbo").hide()
        $("#btn-project").hide()    
        $("#btn-home").hide()
        $("#btn-profile").hide()
        $("#btn-myproject").hide()
        $("#btn-login").show()
        $("#project-list").hide()
        $("#form-add-project").hide()
        $('#detail-form').hide()
        $('.retire').hide()
    }
}

function login (event) {

    event.preventDefault();
        let email = $('#email').val()
        let password = $('#password').val()
        
        $.ajax({
            method: 'POST',
            url: baseUrl+'/user/login',
            data: {
                email,
                password
            }
        })
        .done(data => {
            localStorage.setItem('access_token', data.access_token)
            auth()
        })
        .fail(err => {
            console.log(err);
        })
}

function myTodo() {
    $('#detail-form').hide()
    $('#Hiterto').text('')
    $("#project-list").hide()
    $("#form-add-project").hide()
    $.ajax({
        method: 'GET',
        url: baseUrl+'/todo',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        $('#todo-list').empty();
        if(data.Todo[0] == undefined) {
            // console.log('object');
            $('#Hiterto').text('Please insert some Data')
            $("#list").hide()
            $("#project-list").hide()
        }
        for(let i in data.Todo) {
            let button = 'Check'
            if (data.Todo[i].status == true) {
                button = 'Uncheck'
            }
            $('#todo-list').append(`
            <tr >
                <td data-content="${data.Todo[i].status}">${data.Todo[i].title}</td>
                <td data-content="${data.Todo[i].status}">${data.Todo[i].description}</td>
                <td data-content="${data.Todo[i].status}">${data.Todo[i].status}</td>
                <td data-content="${data.Todo[i].status}">${data.Todo[i].due_date}</td>
                <td data-content="${data.Todo[i].status}"> <button class="edit-button" id="btn-check-${data.Todo[i].id}"> ${button} </button> <button class="edit-button" onclick="deleteTodo(event, ${data.Todo[i].id})"> Delete </button></td>
            </tr>
            `)
            $(`#btn-check-${data.Todo[i].id}`).on('click', (event) => {
                editTodo(event, data.Todo[i])
            })
        }
    })
    .fail(err => {
        console.log(err);
    })
}

function myProject(event) {
    $('#detail-form').hide()
    $("#form-add-project").hide()
    $('#Hiterto').text('')
    $("#project-list").show()
    $("#list").hide()
    $("#add").hide()

    event.preventDefault();
    $.ajax({
        method: 'GET',
        url: baseUrl+`/project`,
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        
        if(data.UserProject[0] == undefined) {
            // console.log('object');
            $('#Hiterto').text('Please insert some Data')
            $('#project-body').hide();
            $("#project-list").hide()
        }
        $('#project-body').empty();
        for(let i in data.UserProject) {
            // console.log(data.UserProject[i].Project.id);
            $('#project-body').append(`
            <tr>
                <td class= "">${data.UserProject[i].Project.name}</td>
                <td>
                    <button class="edit-button" id="myproject-${data.UserProject[i].Project.id}"> Detail </button> 
                </td>
            </tr>
            
            `)
            $(`#myproject-${data.UserProject[i].Project.id}`).on('click', (event) => {
                detail(event, data.UserProject[i])
            })

        }
    })
    .fail(err => {
        console.log(err);
    })
}

function showTodo (event) {
    event.preventDefault();
    $('#detail-form').hide()
    $("#form-add-project").hide()
    $("#list").hide()
    $("#add").show()
    $("#project-list").hide()
}

function createTodo (event) {
    $('#detail-form').hide()
    $("#form-add-project").hide()
    $('#Hiterto').text('')
    event.preventDefault();
    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#due_date').val()

    $.ajax({
        method: 'POST',
        url: baseUrl+'/todo',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title,
            description,
            due_date
        },
    })
    .done(data => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function editTodo (event, data) {
    event.preventDefault();
    let newStatus = true
    if (data.status == true) {
        newStatus = false
    }
    $.ajax({
        method: 'PUT',
        url: baseUrl+`/todo/${data.id}`,
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            status: newStatus
        },
    })
    .done(data => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function deleteTodo (event,id) {
    event.preventDefault();

    $.ajax({
        method: 'DELETE',
        url: baseUrl+`/todo/${id}`,
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            id : id
        },
    })
    .done(data => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function logout () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        auth()
    });
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: baseUrl+'/user/googleLogin',
        method: 'POST',
        headers: {
            google_token : id_token
        },
    })
    .done(data => {
        localStorage.setItem('access_token', data.access_token)
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function registerForm () {
    $('#detail-form').hide()
    $("#login").hide()
    $("#form-register").show()
}

function register () {
    let email = $('#email-reg').val()
    let password = $('#password-reg').val()

    $.ajax({
        method: 'POST',
        url: baseUrl+'/user/register',
        data: {
            email,
            password
        },
    })
    .done(data => {
        event.preventDefault();
        console.log(data);
        $("#login").show()
        $("#form-register").hide()
    })
    .fail(err => {
        console.log(err);
    })
}

function weather(event) {
    event.preventDefault();
    let location = $('#location').val()
    $.ajax({
        method: 'GET',
        url: baseUrl+`/todo/weather/${location}`,
        data: {
            query : location
        }
    })
    .done(data => {
        let day = 'HOT DAY chose place with lower temperature the magic will happend'
        if (data.weather.current.temperature <= 25) {
            day = 'COLD DAY option TODO for Stay at Home Added (RECOMENDED)'
            $('#description').append(`<option value="#StayAtHome">#StayAtHome</option>`)
            $('#body-id').css({'background-image'  : 'url(https://images.unsplash.com/photo-1558920778-a82b686f0521?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'});
        } else {
            $('#body-id').css({'background-image'  : 'url(https://cdn2.tstatic.net/bali/foto/bank/images/bliss_20160913_172941.jpg'});
        }
        $('#Api_day').text(day)
        $('#Api_location').text(data.weather.location.name)
        $('#Api_temp').text(data.weather.current.temperature,' Celcius')
    })
    .fail(err => {
        console.log(err);
    })
}

function relation (event, user, project) {
    event.preventDefault();
    // console.log(user, project);
    $.ajax({
        method: 'POST',
        url: baseUrl+`/project/invite`,
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            UserId: user,
            ProjectId: project
        },
    })
    .done(data => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function getStatus () {
    $.ajax({
        method: 'GET',
        url: baseUrl+'/todo/one',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        localStorage.setItem('id_user', data.result.id)
        $('#navbar-li').empty();
        let button = 'RETIRE'
        if (!data.result.status) button = 'AVALIABLE'
        $('#navbar-li').append(`
            <a class="nav-link" data-content="${data.result.status}" id="btn-status-${data.result.id}">${button}<span class="sr-only" class="retire"></span></a>
        `)
        $(`#btn-status-${data.result.id}`).on('click', (event) => {
            changeStatus(event,data.result)
        })
        
    })
    .fail(err => {
        console.log(err);
    })
}

function changeStatus (event, data) {
    console.log(data);
    event.preventDefault();
    let newStatus = true
    if (data.status == true) {
        newStatus = false
    }
    $.ajax({
        method: 'PUT',
        url: baseUrl+`/user/${data.id}`,
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            status: newStatus
        },
    })
    .done(data => {
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function formAddProject(event) {
    event.preventDefault();
    $('#detail-form').hide()
    $("#list").hide()
    $("#add").hide()
    $("#project-list").hide()
    $("#form-add-project").show()
}   

function addProject(event) {
    $('#Hiterto').text('')
    event.preventDefault();
    let project = $('#project-add-name').val()
    $.ajax({
        method: 'POST',
        url: baseUrl+'/project',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            name : project,
        },
    })
    .done(data => {
        $.ajax({
            method: 'POST',
            url: baseUrl+'/project/invite',
            data: {
                UserId : localStorage.id_user,
                ProjectId : data.Todo.id
            },
            headers: {
                access_token: localStorage.access_token
            }
        })
        auth()
    })
    .fail(err => {
        console.log(err);
    })
}

function detail (event, result) {
    event.preventDefault();
    $('#detail-form').hide()
    $("#form-add-project").hide()
    $("#project-list").hide()
    $('#detail-form').show()
    $.ajax({
        method: 'GET',
        url: baseUrl+`/user`,
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(data => {
        $('#tbl-detail-proj').empty();
        let arr = `<select id="cars">`
        
        for (let x in data.data) {
            
            $.ajax({
                method: 'GET',
                url: baseUrl+`/project/check/${data.data[x].id}/${result.Project.id}`,
                headers: {
                    access_token: localStorage.access_token
                },
            })
            .done(temp => {
                if(!temp.UserProject) {
                    arr += `\n<option value="${data.data[x].id}">${data.data[x].email}</option>`
                    arr += `</select>`
                    $('#detail-proj-name').text('PROJECT '+result.Project.name)
                    $('#tbl-detail-proj').append(`
                    <tr >
                        <td>${result.Project.name}</td>
                        <td>
                            <form>
                            ${arr}
                            <button class="edit-button" id="btn-invite-${data.data[x].id}"> INVITE </button>
                            </form>
                        </td>
                    </tr>
                    `)
                    $(`#btn-invite-${data.data[x].id}`).on('click', (event) => {
                        relation(event,data.data[x].id, result.Project.id)
                    })
                }
               
            })
        }
        
    })
}