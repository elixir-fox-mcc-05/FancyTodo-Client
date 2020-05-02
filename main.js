let baseUrl = 'http://localhost:3000'

$( document ).ready(function() {
    auth()
})

function logout(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        swal('You have signed out.');
    });
    localStorage.clear()
    auth()
}

function register(event){
    event.preventDefault()
    let email =$('#emailRegister').val()
    let password =$('#passwordRegister').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/register',
        data: { 
            email,
            password
        }
    })
        .done(data => {
            $('#emailRegister').val('')
            $('#passwordRegister').val('')
            swal("Successfully create new account", {
                icon: "success"
            })
            localStorage.setItem('token', data.access_token)
            auth()
            
        }) 
        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })

}

function login(event){
    event.preventDefault()
    let email =$('#emailLogin').val() 
    let password =$('#passwordLogin').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/login',
        data: { 
            email,
            password
        }
    })
        .done(data => {
            $('#emailLogin').val('')
            $('#passwordLogin').val('')
            localStorage.setItem('token', data.access_token)
            auth()
            swal("Success login", {
                icon: "success"
            })
            
        }) 
        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;    
    $.ajax({
        method: 'POST',
        url: baseUrl + '/users/googleSign',
        data: {
            'id_token' : id_token,
        }
    })
        .done(data => {
            localStorage.setItem('token', data.token)
            console.log('Success Login');
            auth()
        })
        .fail(err => {
            swal("Upss", err.responseJSON, "error");
        })
}

function logoutBtn(){
    swal({
        title: "Are you sure?",
        text: "Want to logout now?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willLogout) => {
        if (willLogout) {
            logout()
        } else {
          swal("Yass stay here");
        }
      });
}

function auth(){
    if(localStorage.token){  
        $('.registerPage').hide()
        $('.loginPage').hide()
        $('.landingPage').hide() 
        $('.homePage').show()
        readTodos()

    }
    else{
        $('.registerPage').hide()
        $('.loginPage').hide()
        $('.homePage').hide()
        $('.landingPage').show()
        readWeather()
    }
}

function readTodos(){
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.token
        }
    })

        .done(data => {
            $('.todoList').empty()
            for(let i=0; i < data.result.length; i++){
                let id = data.result[i].id
                let title = data.result[i].title
                let description = data.result[i].description
                let status = data.result[i].status
                    if(status == false){
                        status = 'Undone'
                    }
                    else {
                        status = "Done"
                    }
                let due_date = new Date(data.result[i].due_date)
                    let year = due_date.getFullYear()
                    let month = due_date.getMonth() + 1
                    let day = due_date.getDate()
                    if(month < 10){
                        month = `0${month}`
                    }
                    if(day < 10){
                        day = `0${day}`
                    }
                    let formatDate = `${day}-${month}-${year}`
                let updatedAt = new Date(data.result[i].updatedAt)
                let lastUpdate = updatedAt.toDateString()

                if(status == "Undone"){
                    $('.todoList').append(`
                        <div class="container col-md-8">
                            <div class="card border-dark text-center">
                                <div class="card-body">
                                    <p class="card-title mainTitle">${title}</p>
                                    <p class="card-title mainDescription">${description}</p>
                                    <div class="row date-status">
                                        <div class="col">
                                            <p class="card-text">Due date: <br>${formatDate}</p>
                                        </div>
                                        <div class="col">
                                            <p class="card-text">Status: <br>${status}</p>
                                        </div>
                                    </div>
                                    <button onClick="doneBtn(${id})" class="btn btn-primary" >Done</button> <button onClick="updateBtn(${id})" class="btn btn-success" data-toggle="modal" data-target="#editModal">Edit</button> <button onClick="deleteBtn(${id})" class="btn btn-danger">Delete</button>
                                </div>
                                <div class="card-footer text-muted">
                                    Last update : ${lastUpdate}
                                </div>
                            </div>
                        </div>
                    `)
                }
                else {
                    $('.todoList').append(`
                        <div class="container col-md-8">
                            <div class="card border-dark text-center">
                                <div class="card-body">
                                    <p class="card-title mainTitle">${title}</p>
                                    <p class="card-title mainDescription">${description}</p>
                                    <div class="row">
                                        <div class="col-sm">
                                            <p class="card-text">Due date: <br>${formatDate}</p>
                                        </div>
                                        <div class="col-sm">
                                            <p class="card-text">Status: <br>${status}</p>
                                        </div>
                                    </div>
                                    <button onClick="updateBtn(${id})" class="btn btn-success" data-toggle="modal" data-target="#editModal">Edit</button> <button onClick="deleteBtn(${id})" class="btn btn-danger">Delete</button>                                
                                </div>
                                <div class="card-footer text-muted">
                                    Last update : ${lastUpdate}
                                </div>
                            </div>
                        </div>
                    `)
                }
                
            }
        })

        .fail(err => {
            swal("Caution", err, "error");
        })
    
}

function createTodo(event){
    event.preventDefault()
    let title =$('#title').val()
    let description = $('#description').val()
    let due_date = $('#due_date').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/todos',
        headers: {
            access_token: localStorage.token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(data => {
            swal(data.msg, {
                icon: "success"
            })
            $('#title').val('')
            $('#description').val('')
            $('#due_date').val('')
            readTodos()
        })

        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })
    
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: baseUrl + '/todos/' + id,
        headers: {
            access_token: localStorage.token
        }
    })
        .done(res => {
            swal(res.msg, {
                icon: "success"
            })
            readTodos()
        })

        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })
}

function deleteBtn(id){
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            deleteTodo(id)
        } else {
          swal("Your todo list is safe!");
        }
      });
}

function doneBtn(id) {
    swal({
        title: "Are you sure?",
        text: "Want to change this list's status?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((todoDone) => {
        if (todoDone) {
            makeItDone(id)
        }
      })
      .catch((err) => {
        swal("Upss", err, "error");
      })

}

function makeItDone(id){
    $.ajax({
        method: 'PATCH',
        url: baseUrl + '/todos/' +id,
        headers: {
            access_token: localStorage.token
        }
    })
        .done(res => {
            swal(res.msg, {
                icon: "success"
            })
            readTodos()
        })

        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })
}

function updateBtn(id){
    $.ajax({
        method: 'GET',
        url: baseUrl + '/todos/' +id,
        headers : {
            access_token: localStorage.token
        }
    })

        .done(data => {
            let due_date = new Date(data.result.due_date)
                let year = due_date.getFullYear()
                let month = due_date.getMonth() + 1
                let day = due_date.getDate()
                if(month < 10){
                    month = `0${month}`
                }
                if(day < 10){
                    day = `0${day}`
                }
            let formatDate = `${year}-${month}-${day}`
            $('#editId').val(data.result.id)
            $('#editTitle').val(data.result.title)
            $('#editDescription').val(data.result.description)
            $('#editDue_date').val(formatDate)
            
        })
        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })
}

function updateTodo(event){
    event.preventDefault
    let id = $('#editId').val()
    let title = $('#editTitle').val()
    let description =$('#editDescription').val()
    let due_date = $('#editDue_date').val()

    $.ajax({
        method: 'PUT',
        url: baseUrl+'/todos/'+id,
        headers: {
            access_token: localStorage.token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(data => {
            swal(data.msg, {
                icon: "success"
            })
            readTodos()
        })
        .fail(err => {
            swal("Upss", err.responseJSON.errors[0].message, "error");
        })

}

function readWeather(){
    $('#weather').empty()
    $.ajax({
        method: 'GET',
        url: baseUrl+'/api',
        headers: {}
    })
        .done(data => {            
            let mainWeather = data.cityWeather.weather
            let formatDate = new Date (data.shalatSchedule.date_for) 
            let date = formatDate.toDateString()

            let mainTemp = data.cityWeather.temp
            let temp = `${(mainTemp.temp-273.15).toFixed(2)} &#8451`
            let feels_like = `${(mainTemp.feels_like-273.15).toFixed(2)}  &#8451`
            let tempMin = `${(mainTemp.temp_min-273.15).toFixed(2)}  &#8451`
            let tempMax = `${(mainTemp.temp_max-273.15).toFixed(2)}  &#8451`
            let pressure = `${mainTemp.pressure} hPa`
            let humidity = `${mainTemp.humidity}%`

            $('#weather').append(`
                <div class="weatherTable">
                    <h3>Hello ${data.cityName.city}, ${data.cityName.country}</h3>
                    <h4>${date}</h4>
                    <div class="container row">
                        <div class="col-sm-4">
                            <img src="${data.weatherIcon}" alt="weather">
                            <h5>${mainWeather.description}</h5>
                        </div>
                        <div class="col-sm-8">
                            <table class="weather">
                            <tr>
                                <th>Temp</th>
                                <td>:</td>
                                <td>${temp}</td>
                            </tr>
                            <tr>
                                <th>Feels Like</th>
                                <td>:</td>
                                <td>${feels_like}</td>
                            </tr>
                            <tr>
                                <th>Temp Min</th>
                                <td>:</td>
                                <td>${tempMin}</td>
                            </tr>
                            <tr>
                                <th>Temp Max</th>
                                <td>:</td>
                                <td>${tempMax}</td>
                            </tr>
                            <tr>
                                <th>Pressure</th>
                                <td>:</td>
                                <td>${pressure}</td>
                            </tr>
                            <tr>
                                <th>Humidity</th>
                                <td>:</td>
                                <td>${humidity}</td>
                            </tr>
                            <table>
                        </div>
                    </div>
                </div>    
            `)
            
        })
        .fail(err => {
            swal("Caution", err, "error");
        })
}

function landingBtn(){
    $('.registerPage').hide()
    $('.loginPage').hide()
    $('.landingPage').show()
}

function loginBtn(){
    $('.registerPage').hide()
    $('.loginPage').show()
    $('.landingPage').hide()
}

function registerBtn(){
    $('.registerPage').show()
    $('.loginPage').hide()
    $('.landingPage').hide()
}