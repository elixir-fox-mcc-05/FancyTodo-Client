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
        $( '.nav-bar' ).show()
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
        $( '.nav-bar' ).hide()
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
        $('.all-task-list-box').empty()
        let totalTasks = result.tasks.length
        let completedTasks = 0
        let uncompletedTasks = 0
        for (let i = 0; i < result.tasks.length; i++) {
            let id = result.tasks[i].id
            let title = result.tasks[i].title
            let description = result.tasks[i].description
            let imgSource =""
            let completeButton =""
            let uncompleteButton = ""
            if(result.tasks[i].status == true){
                imgSource="./src/img/Recall-Logo-Task-Finished.png"
                completedTasks += 1
                uncompleteButton = `<button class="card-button-uncompleteTask" onclick="uncompleteTaskStatus(${id})"><i class="fas fa-spinner"></i></button>`
            } else {
                imgSource="./src/img/Recall-Logo-Task-Ongoing.png"
                uncompletedTasks +=1
                completeButton = `<button class="card-button-completeTask" onclick="completeTaskStatus(${id})"><i class="fas fa-check"></i></button>`    
            }
            
            let StringDate = new Date(result.tasks[i].due_date)
            let displayDate = StringDate.toISOString().substring(0, 10)
            // let due_date = displayDate 
            // console.log("Ready for append: ", title, description,status, due_date)
            
            $('.all-task-list-box').append(`
                <div class="new-task-card">
                    <div class="task-card-bar"></div>
                    <div class="task-card-content">
                        <div class="task-card-details">
                            <div class="task-card-status-image-container">
                              <img class="task-card-image" src=${imgSource}>
                            </div>
                            <div class="task-card-notes">
                                <h2>${title}</h2>
                                <p>${description}</p><br><br>
                                <p>Due by: ${displayDate}</p>
                            </div>
                        </div>
                        <div class="task-card-action-buttons">
                            <div class="task-card-action-buttons-completion">
                                ${uncompleteButton}
                                ${completeButton}
                            </div>
                            <button class="card-button-editTask" onclick="showEditPage(${id})"><i class="fas fa-edit"></i></button>
                            <button class="card-button-deleteTask" onclick="deleteTask(${id})"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            `)
            // $('.card-button-completeTask').toggle(result.tasks[i].status == false)
            // $('.card-button-uncompleteTask').toggle(result.tasks[i].status == true)
            // $('.task-card-action-buttons-completion').empty()           
            // if(result.tasks[i].status == true){
            //     $('.card-button-completeTask').hide()
            //     $('.card-button-uncompleteTask').show()
            //     // $('.task-card-action-buttons-completion').append(`
            //     // <button class="card-button-uncompleteTask" onclick="uncompleteTaskStatus(${id})"><i class="fas fa-spinner"></i></button>
            //     // `)
            // } else {
            //     $('.card-button-completeTask').show()
            //     $('.card-button-uncompleteTask').hide()
            //     // $('.task-card-action-buttons-completion').append(`
            //     // <button class="card-button-completeTask" onclick="completeTaskStatus(${id})"><i class="fas fa-check"></i></button>
            //     // `)
            // }
        }
        

        $('.summary-box-total-tasks-box').empty()
        $('.summary-box-completed-tasks-box').empty()
        $('.summary-box-uncompleted-tasks-box').empty()
        $('.summary-box-total-tasks-box').append(`
            <p><b>${totalTasks} listed tasks</b></p>
        `)
        $('.summary-box-completed-tasks-box').append(`
            <p><b>${completedTasks} completed</b></p>
        `)
        $('.summary-box-uncompleted-tasks-box').append(`
            <p><b>${uncompletedTasks} in progress</b></p>
        `)
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
        // console.log(result.selectedArticles)
        for (let i = 0; i < result.selectedArticles.length; i++) {
            let title = result.selectedArticles[i].title
            let description = result.selectedArticles[i].description
            let source = result.selectedArticles[i].source.name
            let author = result.selectedArticles[i].author
            let imageUrl = result.selectedArticles[i].urlToImage
            let url = result.selectedArticles[i].url
            let publishDate = (new Date(result.selectedArticles[i].publishedAt)).toDateString()
            $('.all-articles-list').append(`
                <a href="${url}" class="article-card" target="_blank">
                    <div class="article-card-bar"></div>
                    <div class="article-card-content">
                        <div class="article-card-image-container">
                            <img class="article-card-image" src="${imageUrl}">
                        </div>
                        <div class="article-card-details">
                            <h2>${title}</h2><br>
                            <p>${description}</p><br>
                            <div class="article-card-details-writer" >
                                <p>${author} <b>·</b> ${publishDate} <b>·</b> ${source}</p><br>
                            </div>
                        </div>
                    </div>
                </a>
            `)
        }
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
            $('#sign-in-email').val("")
            $('#sign-in-password').val("")
            checkStorage()
        })
        .fail(error => {
            console.log(error)
            let errorMessage = error.responseJSON.error
            $('.error-message-display').append(`
                <p id="sign-in-error-message">${errorMessage}</p>
            `)
            setTimeout(function(){
                $('.error-message-display').empty()
            }, 3000)
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
    // checkStorage()
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
            console.log(data)
            let successMessage = "You're registered. Please sign in!"
            $('.success-registered-display').append(`
                <p id="register-success-display">${successMessage}</p>
            `)
            setTimeout(function(){
                $('.success-registered-display').empty()
            }, 3000)
            $('#register-email').val("")
            $('#register-password').val("")
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
        // console.log(result)
        $('#newTask-title').val("")
        $('#newTask-description').val("")
        $('#newTask-due_date').val("")
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
        //   console.log(result.task.title)
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
    // console.log(newTaskTitle, newTaskDescription, newTaskDueDate, tempId)
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