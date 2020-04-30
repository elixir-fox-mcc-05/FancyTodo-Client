const baseUrl = 'http://localhost:3000'
let tempId = ""
// jQuery Document Ready Event first

// FUNCTION SET 1 | FUNCTION AUTOMATIC (GET ALL TASKS, AUTH, ETC)

$( document ).ready(function() {
    checkStorage()
    $( '.logout' ).click(function() {
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
        checkStorage()
    })
});

function checkStorage() {
    if (localStorage.access_token) {
        $( '.sign-in-page' ).hide()
        $( '.main-dashboard-page' ).show()
        $( '.register-page' ).hide()
        $( '.addNewTask-page' ).hide()
        $( '.editOneTask-page' ).hide()
        $( '.productivity-article-page' ).hide()
        getAllTasks()
        getAllArticles()
    } else {
        $('.sign-in-page').show()
        $('.main-dashboard-page').hide()
        $('.register-page').hide()
        $( '.addNewTask-page' ).hide()
        $( '.editOneTask-page' ).hide()
        $( '.productivity-article-page' ).hide()
    }
}

function getAllTasks(){

    $.ajax({
        method: 'GET',
        url: baseUrl + "/tasks",
        headers: {
            access_token:localStorage.access_token
        }
    })
    .done(result => {
        $('.all-task-list').empty() 
        for (let i = 0; i < result.tasks.length; i++) {
            let id = result.tasks[i].id
            let title = result.tasks[i].title
            let description = result.tasks[i].description
            if(result.tasks[i].status == true){
                status = "Completed!"
            } else {
                status = "In-progress"
            }
            let StringDate = new Date(result.tasks[i].due_date)
            let displayDate = StringDate.toISOString().substring(0, 10)
            let due_date = displayDate 
            // console.log("Ready for append: ", title, description,status, due_date)
            $('.all-task-list').append(`
            <div class="task-card">
                <div class="task-card-header">
                <h2>${title}</h2>
                <div class="task-card-header-details">
                    <p>Status: ${status}</p>  |  
                    <p>Due date: ${due_date}</p>
                </div>
                </div>
                <div class="task-card-details">
                    <p>${description}</p>
                </div>
                <div class="task-card-actions">
                    <button class="button-card-actions" onclick="completeTaskStatus(${id})">Complete</button>
                    <button class="button-card-actions" onclick="uncompleteTaskStatus(${id})">Uncomplete</button>
                    <button class="button-card-actions" onclick="showEditPage(${id})">Edit</button>
                    <button class="button-card-actions" onclick="deleteTask(${id})">Delete</button>
                </div>
            </div>
            `)
        }
        // $('.all-task-list').empty() //Untuk kosongkan ulang semua task sebelumnya, hindari penumpukan
    })
    .catch(error => {
        console.log(error)
    })
}

function getAllArticles(){
    $.ajax({
        method:'GET',
        url: baseUrl + '/productivityNews'
    })
      .done(result => {
          //jangan lupa setelah ajax, empty artikelnya supaya gak numpuk
        $('.all-articles-list').empty()
        console.log(result.selectedArticles)
        for (let i = 0; i < result.selectedArticles.length; i++) {
            let title = result.selectedArticles[i].title
            let description = result.selectedArticles[i].description
            let source = result.selectedArticles[i].source.name
            let author = result.selectedArticles[i].author
            let imageUrl = result.selectedArticles[i].urlToImage
            let publishDate = result.selectedArticles[i].publishedAt
            $('.all-articles-list').append(`
                <div class="article-card">
                  <div class="article-card-image">
                    <img src="${imageUrl}">
                  </div>
                  <h3>${title}</h3><br>
                  <p>${description}</p><br>
                  <p>${source}</p><br>
                  <p>${author}</p><br>
                  <p>${publishDate}</p><br>
                </div>
            `)
        }

        // append terjadi di dalam loop
        // $('.all-articles-list').append(``)
      })
      .fail(error => {
          console.log(error)
      })
    

}


// FUNCTION SET 2 | USER FUNCTION( LOGIN, REGISTER )

function signIn( event ){
    event.preventDefault();
    let email = $('#sign-in-email').val() //ambil value dari #email
    let password = $('#sign-in-password').val() //ambil value dari #password
    // console.log(email, password, "email dan password di sini")
    $.ajax ({
        method: 'POST',
        url: baseUrl + "/login",
        data: {
            email,
            password
        }
    }) 
        .done(data => {
            // console.log(data)
            localStorage.setItem("access_token", data.access_token) // set token at data.access_token
            checkStorage()
        })
        .fail(error => {
            console.log(error, "process gagal")
        })
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token; //id token ini nanti akan kita kirimkan ke server
    $.ajax({
        method: 'POST',
        url: baseUrl + '/googleSign',
        data: {
            id_token
        }
    })
    .done(data =>{
        localStorage.setItem("access_token", data.access_token)
        checkStorage()
    })
    .fail(error => {
        console.log(error, "error di main.js onSignIn")
    })

}

function showRegisterPage (){
    $('.register-page').show()
    $('.sign-in-page').hide()
    $('.main-dashboard-page').hide()
    $( '.addNewTask-page' ).hide()
    $( '.editOneTask-page' ).hide()
    $( '.productivity-article-page' ).hide()
}

function showProductivityTipsPage() {
    $( '.productivity-article-page' ).show()
    $('.sign-in-page').hide()
    $('.main-dashboard-page').hide()
    $('.register-page').hide()
    $( '.addNewTask-page' ).hide()
    $( '.editOneTask-page' ).hide()
}

function showLogInPage(){
    checkStorage()
}

function register( event ){
    event.preventDefault()
    let registerEmail = $('#register-email').val() //ambil value dari #email
    let registerPassword = $('#register-password').val() //ambil value dari #password
    $.ajax ({
        method: 'POST',
        url: baseUrl + "/register",
        data: {
            email: registerEmail,
            password: registerPassword
        }
    }) 
        .done(data => {
            checkStorage()
        })
        .fail(error => {
            console.log("process gagal", error)
        })
}


// FUNCTION SET 3 | FUNCTION CRUD TASKS

function showAddTaskPage(){
    $('.sign-in-page').hide()
    $('.main-dashboard-page').hide()
    $('.register-page').hide()
    $( '.addNewTask-page' ).show()
    $( '.editOneTask-page' ).hide()
}

function addNewTask( event ){
    event.preventDefault();
    let newTaskTitle = $('#newTask-title').val()
    let newTaskDescription = $('#newTask-description').val()
    let newTaskDueDate = $('#newTask-due_date').val()
    // console.log(newTaskTitle, newTaskDescription, newTaskDueDate)
    $.ajax({
        method: 'POST',
        url: baseUrl + "/tasks",
        headers:{
            access_token: localStorage.access_token
        },
        data:{
            title: newTaskTitle,
            description: newTaskDescription,
            due_date: newTaskDueDate
        }
    })
    .done( result =>{
        console.log(result)
        checkStorage()
    })
    .fail( error => {
        console.log(error)
    })
}

function showEditPage( id ){
    $('.sign-in-page').hide()
    $('.main-dashboard-page').hide()
    $('.register-page').hide()
    $( '.addNewTask-page' ).hide()
    $( '.editOneTask-page' ).show()
    idTemp = id
    $.ajax({
        method: 'GET',
        url: baseUrl + '/tasks/' + id,
        headers: {
            access_token:localStorage.access_token
        }
    })
      .done(result =>{
          console.log(result.task.title)
          let currentTitle = result.task.title
          let currentDescription = result.task.description
          let StringDate = new Date(result.task.due_date)
          let displayCurrentDate = StringDate.toISOString().substring(0, 10)

          $( '#editTask-title' ).val(currentTitle)
          $( '#editTask-description' ).val(currentDescription)
          $( '#editTask-due_date' ).val(displayCurrentDate)

      })
      .fail(error =>{
          console.log(error)
      })

}

function editOneTask( event ){
    event.preventDefault()
    let newTaskTitle = $( '#editTask-title' ).val()
    let newTaskDescription = $( '#editTask-description' ).val()
    let newTaskDueDate = $( '#editTask-due_date' ).val()
    console.log(newTaskTitle, newTaskDescription, newTaskDueDate, tempId)
    $.ajax({
        method:'PUT',
        url: baseUrl + `/tasks/` + idTemp,
        headers: {
            access_token: localStorage.access_token
        },
        data:{
            title:newTaskTitle,
            description:newTaskDescription,
            due_date: newTaskDueDate
        } 
    })
        .done(result =>{
            checkStorage()
        })
        .catch(error => {
            console.log(error)
        })

}

function deleteTask(id){
    $.ajax({
        method: 'DELETE',
        url: baseUrl + '/tasks/' + id,
        headers:{
            access_token: localStorage.access_token
        }
    })
      .done(result =>{
          checkStorage()
      })
      .fail(error =>{
          console.log(error)
      })
}

function completeTaskStatus( id ) {
    $.ajax({
        method: 'PATCH',
        url: baseUrl + '/tasks/' + id + '/complete',
        headers:{
            access_token:localStorage.access_token
        }
    })
    .done(result => {
        checkStorage()
    })
    .fail(error =>{
        console.log(error)
    })
}

function uncompleteTaskStatus( id ) {
    $.ajax({
        method: 'PATCH',
        url: baseUrl + '/tasks/' + id + '/uncomplete',
        headers:{
            access_token:localStorage.access_token
        }
    })
    .done(result => {
        checkStorage()
    })
    .fail(error =>{
        console.log(error)
    })
}