const baseUrl = 'http://localhost:3000'

$( document ).ready(function(){
    authorize()
    $("#login-form").submit(function(event) {
        event.preventDefault()
        $.ajax({
            type: "post",
            url: baseUrl + '/user/login',
            data: {
                email : $('#email').val(),
                password : $('#password').val()
            },
        })
            .done(data => {
                localStorage.setItem('token', data.Token)
                authorize()
            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    })
    $("#register-form").submit(function(event) {
        event.preventDefault()
        $.ajax({
            type: "post",
            url: baseUrl + '/user/register',
            data: {
                email : $('#email-regis').val(),
                password : $('#password-regis').val()
            },
        })
            .done(data => {
                localStorage.setItem('Message', "succes create account")
            })
            .fail(err => {
                console.log(err.responseJSON.msg);
            })
    })
})
function authorize(){
    if(localStorage.getItem('token')){
        $('#login-page').hide()
        $('#main-page').show()
        $('#register-page').hide()
        $('#navbar-page').hide()
        $('#navbar-user').show()
        fetchTodo()
    } else {
        $('#login-page').hide()
        $('#navbar-user').hide()
        $('#navbar-page').show()
        $('#main-page').hide()
        $('#register-page').hide()
    }
}
function logout(){
    localStorage.clear()
    authorize()
}
function login(){
    $('#login-page').show()
    $('#main-page').hide();
    $('#register-page').hide()
}
function register(){
    $('#register-page').show()
    $('#login-page').hide();
    $('#main-page').hide();
}

function fetchTodo(){
    $.ajax({
        method : 'get',
        url : baseUrl + '/todos/',
        headers : {
            token : localStorage.token
        }
    })
    .done(data => {
        data.Todos.forEach(element => {
            $(".main-container").append(`
                <div class="todo">
                    <h1 style="text-align: center;"></h1>
                    <table border>
                        <thead>
                            <th>Todo Title</th>
                            <th>Todo Description</th>
                            <th>Todo Status</th>
                            <th>Todo Date</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${element.title}</td>
                                <td>${element.description}</td>
                                <td>${element.status ? "Complete" : "Uncomplete"}</td>
                                <td>${element.due_date}</td>
                                <td>${element.id}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `)
        })
        $(".main-container").append(`
                <div id="weather">
                    <p>Location = Depok</p>
                    <p>Date = ${data.Weather.dataseries[0].date}</p>
                    <p>Weather = ${data.Weather.dataseries[0].weather}</p>
                    <p>Max Wind = ${data.Weather.dataseries[0].wind10m_max} m/s</p>
                </div>
            `)
    })
    .fail(err => {
        console.log(err.responseJSON.msg)
    })
}