let urlmaster ='https://g-todo.herokuapp.com'
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

$(document).ready(function(event){   
    console.log("petama")
    
    // $('#form_add').event.preventDefault()
    if(localStorage.action){
        authentication(localStorage.action)        
    }else {
        authentication('.limiter')
    }

    $.ajax({
        method:"GET",
        url:urlmaster +'/apiquotes'
    })
   
    
    .then(quote=>{
        console.log(quote);
        
        $('#msg_quotes').html("'"+quote.quotes.quoteText+"'")
    })
    .catch(err=>{
        console.log(err);
        
    })
  
    event.preventDefault()
    
})


function createUser(event){
    
    let signup_email = $('#signup_email').val()
    let signup_pass = $('#signup_pass').val()
    let signup_pass2 = $('#signup_pass2').val()
    if(signup_pass==signup_pass2){
        $.ajax({
            method :'POST',
            url: urlmaster +'/user/register',        
            data:{
                email: signup_email,
                password: signup_pass
            }
        })
        .done(result=>{
            $('#email').val(signup_email)
            $('#pass').val(signup_pass)
            login(event)
            $('#email').val('')
            $('#pass').val('')
            $('#signup_email').val('')
            $('#signup_pass').val('')
            $('#signup_pass2').val('')
            localStorage.setItem('action','#todocontent')
            authentication(localStorage.action)   
            toastr["info"]("WELCOME TO TODO APPS", "SELAMAT")  
        })
        .fail(err=>{                                    
            let bacaError =err.responseJSON.errors.map(el=>el.message).join(",")            
            $('#msg_signup').html(bacaError)
            toastr["warning"](bacaError, "message")  
        })
    } else {
        console.log("salah");
        
        $('#msg_signup').html("Password not match")
    }
    event.preventDefault()
}

function login(event){
    
    event.preventDefault();
    let email = $('#email').val()
    let password =$('#pass').val()
    $.ajax({
        method:'POST',
        url:urlmaster +'/user/login',
        data:{
           email: email,
           password: password
        }
    })
    .done(data=>{
        //masukan token ke dalam localstorage client
        localStorage.setItem('token',data.Data.token)
        localStorage.setItem('email',data.Data.email)
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)

    })
    .fail(err=>{
        console.log(err)
        let bacaError =err.responseJSON.message          
        $('#msg_limiter').html(bacaError)
        toastr["warning"](bacaError, "message")  
    })


}
function authentication(active){    
    $('#registerForm').hide()
    $('#forgotform').hide()
    $('.createForm').hide()
    $('.editForm').hide()
    $('.addmember').hide()
    $('#todocontent').hide()
    $('.limiter').hide()  
    if(localStorage.token){           
         $(active).show()        
         if(localStorage.action == '#todocontent'){
            if(localStorage.view =='done'){
                viewtodo_done()
            }else {
                viewtodo()
            }            
        }
    } else{
        $('.limiter').show() 
    }
}

function viewtodo(){
     
    $('.row').empty()
    $.ajax({
        method:'GET',
        url:urlmaster+'/todos',
        headers:{
            token:localStorage.token,
            status:false
        }
    })
    .done(result=>{
        for( let i in result.todos){
            let {id,
            title,
            description,
            status,
            due_date,
            UserId,
            createdAt,
            updatedAt} = result.todos[i]
            
            let color = random_color();
            let color2 = random_color();

         $('.row').append (`
         <div class="col-md-4 card-container" style="background-color:${color}">
         <div class="card-flip">
           <!-- Card 1 Front -->
           <div class="card front"  style="background-color:${color2}">
             <span class="fa fa-4x fa-smile-o text-center"></span>
             <div class="card-block">
               <h4 class="card-title text-center">${title}</h4>
               <h6 class="card-subtitle mb-2 text-muted text-center">${id}</h6>
               <p class="card-text">${description}</p>
             </div>
           </div>
           <!-- End Card 1 Front -->
   
           <!-- Card 1 Back -->
           <div class="card back" style="background-color:${color2}">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    
                    <li class="nav-item">
                        <button onclick ="updateForm('${id}','${title}','${description}','${formatDateEdit(due_date)}')" class="nav-link" >Edit</button>
                    </li>
                    <li class="nav-item">
                    <button onclick ="del(${id})" class="nav-link" >Delete</button>
                    </li>
                    <li class="nav-item">
                    <button onclick ="addmember(${id})" class="nav-link" >Add Member</button>
                    </li>
                  </ul>
                </div>
                <div class="card-block">
                  
                  <p class="card-text">Due Date: ${formatDate(due_date)}</p>
                  <p class="card-text">Create Date:${formatDate(createdAt)}</p>
                  <p class="card-text">Updated Date:${formatDate(updatedAt)}</p>
                  <button onclick="updateStatus(${id})" class="btn btn-primary">Done</button>
                </div>
              </div>
           <!-- End Card 1 Back -->
         </div>
       </div>
         `)  
        }
    })
    .fail(err=>{
        console.log(err)        
    })    

    
}


function viewtodo_done(){
    
    $('.row').empty()
    $.ajax({
        method:'GET',
        url:urlmaster+'/todos',
        headers:{
            token:localStorage.token,
            status:true
        }
    })
    .done(result=>{
        for( let i in result.todos){
            let {id,
            title,
            description,
            status,
            due_date,
            UserId,
            createdAt,
            updatedAt} = result.todos[i]
        let color = random_color();
        let color2 = random_color();
            
         $('.row').append (`
         <div class="col-md-4 card-container" style="background-color:${color}">
         <div class="card-flip">
           <!-- Card 1 Front -->
           <div class="card front" style="background-color:${color2}">
             <span class="fa fa-4x fa-smile-o text-center"></span>
             <div class="card-block">
               <h4 class="card-title text-center">${title}</h4>
               <h6 class="card-subtitle mb-2 text-muted text-center">${id}</h6>
               <p class="card-text">${description}</p>
             </div>
           </div>
           <!-- End Card 1 Front -->
   
           <!-- Card 1 Back -->
           <div class="card back" style="background-color:${color2}">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">                   
                    
                    <li class="nav-item">
                    <button onclick ="del(${id})" class="nav-link" >Delete</button>
                    </li>
                  </ul>
                </div>
                <div class="card-block">                  
                  <p class="card-text">Due Date: ${formatDate(due_date)}</p>
                  <p class="card-text">Create Date:${formatDate(createdAt)}</p>
                  <p class="card-text">Updated Date:${formatDate(updatedAt)}</p>                  
                </div>
              </div>
           <!-- End Card 1 Back -->
         </div>
       </div>
         `)  
        }
    })
    .fail(err=>{
        console.log(err)        
    })    

    
}


function random_color() {
    var color;
    color = "#" + Math.random().toString(16).slice(2, 8).toUpperCase();
    return color;
  }

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month,year ].join('-');
}

function createTodo(event){
    event.preventDefault();
    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#duedate').val()
    let status = 'false'
    $.ajax({
        method :'POST',
        url: urlmaster +'/todos',
        headers:{
            token: localStorage.token
        },
        data:{
            title,
            description,
            due_date,
            status
        }
    })
    .done(result=>{
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)  
        toastr["success"]("anda telah berhasil menambahkan todo", "Add todo ")    
        $('#title').val('')
        $('#description').val('')
    })
    .fail(err=>{
        console.log(err);        
        let bacaError = err.responseJSON.errors.map(el=>el.message).join(",")     
        toastr["error"](bacaError, "messages ")

    })
   
}
function createTodoCancel(event){
    event.preventDefault();
    localStorage.setItem('action','#todocontent')
    authentication(localStorage.action)  
}



$('.addtodoform').click(function () {
    localStorage.setItem('action','.createForm')
    authentication(localStorage.action)
    document.getElementById("duedate").defaultValue = formatDateEdit(new Date())       
})
$('.view_done').click(function () {
    localStorage.setItem('action','#todocontent')
    localStorage.setItem('view','done')
    authentication(localStorage.action)  
    toastr["info"]("Todo list Done", "message")
    
})
$('.view_undone').click(function () {
    localStorage.setItem('action','#todocontent')
    localStorage.setItem('view','undone')
    authentication(localStorage.action)  
    toastr["info"]("Todo list still on progress", "message") 
})
$('.signout').click(function () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
   localStorage.clear()
   $('#email').val('') 
    $('#pass').val('')     
    authentication('.limiter')  
})
function updateStatus(id){
    $.ajax({
        method:"PUT",
        url:urlmaster + '/todos/' + id +'/status',
        headers:{
            token:localStorage.token
        },
        data:{
            status:"true"
        }
    })
    .done(result=>{
        toastr["success"]("Update Todo list success", "message")
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action) 
    })
    .fail(err=>{
        let bacaError = err.responseJSON.todos.errors.map(el=>el.message).join(",")   
        toastr["error"](bacaError, "message")
    })

}
function del(id){
    $.ajax({
        method:"DELETE",
        url:urlmaster + '/todos/' + id,
        headers:{
            token:localStorage.token
        }
    })
    .done(result=>{
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)  
    })
    .fail(err=>{

    })

}
function update(event){
    event.preventDefault()
    let id = $('#editid').val()
    let title =  $('#edittitle').val()
    let description = $('#editdescription').val()
    let due_date = $('#editdue_date').val()  
    
    

    $.ajax({
        method:"PUT",
        url:urlmaster + '/todos/' + id ,
        headers:{
            token:localStorage.token
        },
        data:{
            title : title,
            description: description,
            status: "false",
            due_date : due_date
        }
    })
    .done(result=>{
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)     
    })
    .fail(err=>{

    })
   
}


function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
  }      
function formatDateEdit(date) {
  let datenow = new Date(date);
  let startdate =datenow.getFullYear() + "-" + appendLeadingZeroes(datenow.getMonth() + 1) + "-" + appendLeadingZeroes(datenow.getDate()) 
  return startdate
  
  
}


function updateForm(id,title,description,due_date){
       console.log(id,title,description,due_date)     
       localStorage.setItem('action','.editForm')
        authentication(localStorage.action)            
        $('#editid').val(id)
        $('#edittitle').val(title)
        $('#editdescription').val(description)
        $('#editduedate').val(due_date);
        console.log(due_date);
       
}

function addmember(id){
    localStorage.setItem('action','.addmember')
    $('#idtodomember').val(id)
    
    authentication(localStorage.action)
    $('#optionmember').empty()
    $.ajax({
        method:'GET',
        url:urlmaster+'/todos/member',
        headers:{
            token:localStorage.token,
            status:true,
            id_todo:id
        }
    })
    .done(result=>{
        console.log(result);
        
        for( let i in result.data.result){
            let {id,
                email,
                Projects
            } = result.data.result[i]
            console.log(id);
         if(Projects.length == 0){
             $('#optionmember').append (`
                <option value=${id}>${email}</option>
             `) 
         }   
        }
    })
    .fail(err=>{
        console.log(err)        
    })    
}
function createmember(event){
    event.preventDefault();
    let UserId = $('#optionmember').val()
    let TodoId = $('#idtodomember').val()    
    $.ajax({
        method :'POST',
        url: urlmaster +'/todos/member',
        headers:{
            token: localStorage.token
        },
        data:{
            UserId:UserId,
            TodoId:TodoId
        }
    })
    .done(result=>{
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)  
        toastr["success"]("anda telah berhasil menambahkan member todo", "Add member todo ")    
    })
    .fail(err=>{

        let bacaError = err.responseJSON.todos.errors.map(el=>el.message).join(",")     
        toastr["error"](bacaError, "messages ")

    })
   
}

function show_signup_form(event){
    event.preventDefault()    
    $('#registerForm').show()
    $('.limiter').hide()
}
function login_view(event){
    event.preventDefault() 
    localStorage.setItem('action','.limiter')
    authentication(localStorage.action)    
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        method :'POST',
        url: urlmaster +'/user/gmail',
        data:{
            id_token
        }
    })
    .done(result=>{
        console.log(result);
        
        localStorage.setItem('token',result.Data.token)
        localStorage.setItem('email',result.Data.email)
        localStorage.setItem('action','#todocontent')
        authentication(localStorage.action)      
    })
    .fail(err=>{
       
    })
  }

  function forgotpassword(event){
      event.preventDefault()
      console.log($('#forgot_email').val());
      
    $.ajax({
        method:"GET",
        url:urlmaster + '/user/forgot/' + $('#forgot_email').val()       
    })
    .done(result=>{
        localStorage.setItem('action','.limiter')
        authentication(localStorage.action) 
    })
    .fail(err=>{

    })

}
function show_forgot_form(event){
    event.preventDefault()
    localStorage.setItem('action','#forgotform')
    authentication(localStorage.action) 
      
}
