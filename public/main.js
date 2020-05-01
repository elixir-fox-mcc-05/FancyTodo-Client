// let baseUrl = 'http://localhost:3000'
let baseUrl = 'https://achrams-fancy-todo.herokuapp.com'

$(document).ready(() => {
    auth()
})


function auth() {
    getIP()
    showSchedule()
    if (localStorage.access_token) {
        homepage()
    } else {
        loginPage()
        $('#nav').hide()
        $('.page').hide()
    }
}

function loginPage() {
    $('.registerpage').hide()
    $('.loginpage').show()
}

function registerPage() {
    $('.loginpage').hide()
    $('.registerpage').show()
}

function openNav() {
    $('#mySidenav').width(250)
}

function closeNav() {
    $('#mySidenav').width(0)

}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

function logout(event) {
    event.preventDefault()
    closeNav()
    localStorage.removeItem('access_token')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
    Toast.fire({
        icon: 'success',
        title: 'Logged Out'
    })
    auth()
}

function homepage() {
    $('.page').show()
    $('#nav').show()
    $('.loginpage').hide()
    $('.registerpage').hide()
    showTodo()
    closeNav()
}

function login(event) {
    event.preventDefault()
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    $.ajax({
            method: 'POST',
            url: baseUrl + '/login',
            data: {
                email,
                password
            }
        })
        .done(data => {
            localStorage.setItem('access_token', data.access_token)

            Toast.fire({
                icon: 'success',
                title: 'Logged in successfully'
            })
            auth()
        })
        .fail(err => {
            err.responseJSON.errors.forEach(data => {
                Swal.fire({
                    icon: 'error',
                    title: JSON.stringify(data.msg, null, 2)
                })
                auth()
            })
        })
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
            method: 'POST',
            url: baseUrl + '/googlesign',
            data: {
                id_token
            }
        })
        .done(data => {
            localStorage.setItem('access_token', data.access_token)
            Toast.fire({
                icon: 'success',
                title: 'Logged in successfully'
            })
            auth()
        })
        .fail(err => {
            console.log(err)
        })
}

function register(event) {
    event.preventDefault()
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    $.ajax({
            method: 'POST',
            url: baseUrl + '/register',
            data: {
                email,
                password
            }
        })
        .done(data => {
            console.log(data)
                // localStorage.setItem('userId', data.id)
            localStorage.setItem('access_token', data.access_token)

            Toast.fire({
                icon: 'success',
                title: 'Registered successfully'
            })
            auth()
        })
        .fail(err => {
            err.responseJSON.errors.forEach(data => {
                Swal.fire({
                    icon: 'error',
                    title: data.msg
                })
            })
        })
}

function showTodo() {
    $('.content-body').empty()
    $.ajax({
            method: 'GET',
            url: `${baseUrl}/todos`,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done(result => {
            $('.content-body').empty()
            for (i in result) {
                let monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                console.log(result[i].due_date);
                let date = new Date(result[i].due_date)
                let day = date.getUTCDate()
                let monthVal = date.getMonth() + 1
                let month = monthName[monthVal]
                let year = date.getFullYear()
                $('.content-body').append(`
                <div id="todo-card">
                <h2>${result[i].title}</h1>
                <h4>${result[i].description}</h3>
                <h4>status: ${result[i].status}</h3>
                <h4>Due : ${day} ${month} ${year}</h3>
                <div id="actionbtn">
                <a href="#" onclick="editTodo(${result[i].id})"><h3>Edit</h3></a> <a href="#" onclick="deleteTodo(${result[i].id})"><h3>Delete</h3></a>
                </div>
                </div>
                `)
            }
        })
        .fail(err => {
            err.responseJSON.errors.forEach(data => {
                Swal.fire({
                    icon: 'error',
                    title: data.msg
                })
            })
        })
}

function getIP() {
    $.ajax({
            method: 'GET',
            url: `https://api.ipify.org`
        })
        .done((result) => {
            localStorage.setItem('ip', result)
        })
        .fail((err) => {})
}

function showSchedule() {
    $.ajax({
            method: 'GET',
            url: `${baseUrl}/api`,
            headers: {
                access_token: localStorage.access_token,
                ip: localStorage.ip
            }
        })
        .done(result => {
            $('#ip-address').empty()
            $('.rightBar').empty()
            $('#ip-address').append(`<h4>IP : ${result.data.ip}</h4>`)
            console.log(result.data.ip);
            let data = result.data.data
            $('.rightBar').append(`
            <div id="schedulebox">
            <div class="titlebar">
                <h3 id="schedule-title">Today Ramadhan Schedule</h3>
            </div>
            <div>
                <h3>${data.state}, ${data.items[0].date_for}</h3>
                <table>
                <tr>
                <th>Pray</th>
                <th>Time</th>
                </tr>                
                <tr>
                <td>Fajr</td>
                <td>${data.items[0].fajr}</td>
                </tr>
                <tr>
                <td>Dhuhr</td>
                <td>${data.items[0].dhuhr}</td>
                </tr>
                <tr>
                <td>Asr</td>
                <td>${data.items[0].asr}</td>
                </tr>
                <tr>
                <td>Maghrib</td>
                <td>${data.items[0].maghrib}</td>
                </tr>
                <tr>
                <td>Isha</td>
                <td>${data.items[0].isha}</td>
                </tr>
                </table>
            </div>
            </div>
            `)
        })
        .fail(err => {})
}

function add() {
    closeNav()
    Swal.fire({
        title: 'Add Todo',
        html: '<label>title</label>' +
            '<input id="swal-input1-add" class="swal2-input" placeholder="title">' +
            '<label>description</label>' +
            '<input id="swal-input2-add" class="swal2-input" placeholder="description">' +
            '<label>due date</label>' +
            '<input id="swal-input3-add" class="swal2-input" type="date" placeholder="due date">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            let title = $('#swal-input1-add').val()
            let description = $('#swal-input2-add').val()
            let fulldate = new Date($('#swal-input3-add').val())
            let status = 'Undone'
            let due_date = fulldate
            let data = {
                title,
                description,
                status,
                due_date
            }
            $.ajax({
                    method: 'POST',
                    url: `${baseUrl}/todos/add`,
                    headers: {
                        access_token: localStorage.access_token
                    },
                    data
                })
                .done((result) => {
                    auth()
                    Swal.fire({
                        icon: 'success',
                        title: 'Success add new Todo'
                    })
                })
                .fail((err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed add new Todo'
                    })
                })
        }
    })
}

function deleteTodo(id) {
    Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                return $.ajax({
                    method: 'DELETE',
                    url: `${baseUrl}/todos/${id}`,
                    headers: {
                        access_token: localStorage.access_token
                    }
                })
            } else {

            }
        })
        .then((data) => {
            if (data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success Delete Todo'
                })
            }
            auth()
        })
        .catch(err => {
            Swal.fire(
                'Failed!',
                'Cannot delete Todo.',
                'error'
            )
        })
}

function editTodo(id) {
    $.ajax({
            method: 'GET',
            url: `${baseUrl}/todos/${id}`,
            headers: {
                access_token: localStorage.access_token
            }
        })
        .done((result) => {
            console.log(result);
            Swal.fire({
                title: 'Add Todo',
                html: `<label>title</label>
                    <input id="swal-input1-edit" class="swal2-input" value="${result.title}">
                    <label>description</label>
                    <input id="swal-input2-edit" class="swal2-input" value="${result.description}">
                    <label>Status</label>
                    <select id="swal-input3-edit" class="swal2-input">
                    <option selected value="Undone">Undone</option>
                    <option value="Done" >Done</option>
                    </select>
                    <label>due date</label>
                    <input id="swal-input4-edit" class="swal2-input" type="date" values="${result.due_date}">`,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => {
                    console.log('here preconfirm');
                    let title = $('#swal-input1-edit').val()
                    let description = $('#swal-input2-edit').val()
                    let status = $('#swal-input3-edit').val()
                    let due_date = $('#swal-input4-edit').val()
                    console.log(due_date);
                    let data = {
                        title,
                        description,
                        status,
                        due_date
                    }
                    console.log(data);
                    $.ajax({
                            method: 'PUT',
                            url: baseUrl + '/todos/' + id,
                            headers: {
                                access_token: localStorage.access_token
                            },
                            data
                        })
                        .done((result) => {
                            if (result) {
                                showTodo()
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success Update Todo'
                                })
                            }
                        })
                }
            })
        })
        .fail((err) => {})
}