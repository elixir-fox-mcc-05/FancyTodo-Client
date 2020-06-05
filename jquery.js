baseURl = 'http://localhost:4000';

function checkToken() {
    if(localStorage.token) {
        $('#landingPage').hide();
        $('#jumbotron').hide();
        $('#homePage').show();
        $('#logout').show();
        $('#btn-login').hide();
        $('#modal-body').css('display', 'none');
        $('#modal-covid').css('display', 'none');
        $('#modal-body-home').css('display', 'none');
        $('#modal-body-edit').css('display', 'none');
        $('#default-select').nextAll().remove();
        $('#addTask').slideUp();
        $('#editProject').slideUp();
        $('#addProject').slideUp();
        $('nav').removeClass('fixed-top');
        $('.bg-custom').css('background-color','rgba(80, 39, 28, 0.8)')
        showAllTask();
        showAllProject();
    } else {
        $('#homePage').hide();
        $('#landingPage').show();
        $('#btn-login').show();
        $('#logout').hide();
        $('#modal-body').css('display', 'none');
        $('#modal-body-home').css('display', 'none');
        $('#modal-body-edit').css('display', 'none');
        $('nav').addClass('fixed-top');
        $('.bg-custom').css('background-color','rgba(94, 94, 92, 0.5)')
    }
}

// Function
function register(name, email, password) {
    $.ajax({
        method: 'POST',
        url: `${baseURl}/users/register`,
        data: {
            name,
            email,
            password
        }
    })
        .done(res => {
            $('#nameRegister').val('');
            $('#usernameRegister').val('');
            $('#emailRegister').val('');
            $('#passwordRegister').val('');
            $.toast({
                heading: 'Success',
                text: 'Registration Success',
                showHideTransition: 'slide',
                icon: 'success'
            })
            showLogin();
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showLogin() {
    $('#register').hide();
    $('#login').show();
    $('.alert').hide();
}

function login(email, password) {
    $.ajax({
        method: 'POST',
        url: `${baseURl}/users/login`,
        data: {
            email,
            password
        }
    })
        .done(res => {
            console.log(res.accessToken);
            $('#emailLogin').val('');
            $('#passwordLogin').val('');
            localStorage.setItem('token', res.accessToken);
            $.toast({
                heading: 'Success',
                text: 'Login Success',
                showHideTransition: 'slide',
                icon: 'success'
            })
            checkToken();
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showAllTask() {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/todos`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#tasklist').empty();
            $('#user_name').text(res.Todos.name);
            res.Todos.Todos.forEach(todo => {
                if (!todo.ProjectId) {
                    appendTodo(todo, $('#tasklist'));
                }
            })
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function addNewTask(title, description, due_date) {
    const { token } = localStorage;
    $.ajax({
        method: 'POST',
        url: `${baseURl}/todos`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token
        }
    })
        .done(res=> {
            $('#newTaskTitle').val('');
            $('#newTaskDescription').val('');
            $('#newTaskDue_Date').val('');
            appendTodo(res.Todo, $('#tasklist'));
            showCountry();
            showPopUp('Global');
            $('#modal-covid').css('display', 'flex');
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showCountry() {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/public_apis/covid`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#country').append(`<option value="Global">Global</option>`);
            res.countries.forEach(country => {
                $('#country').append(`<option value="${country}">${country}</option>`);
            })
        })
        .fail(err => {
            console.log(err);
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showPopUp(country) {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/public_apis/covid/${country}`,
        headers: {
            token
        }
    })
        .done(res => {
            var ctx = $('#covid');
            var myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: ['New Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths', 'New Recovered', 'Total Recovered'],
                    datasets: [{
                        label: `${country} casualties`,
                        data: [res.country.NewConfirmed, res.country.TotalConfirmed, res.country.NewDeaths, res.country.TotalDeaths, res.country.NewRecovered, res.country.TotalRecovered],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Global Casualties Cause by COVID19'
                    }
                }
            });
            console.log(res);
        })
        .fail(err => {
            console.log(err);
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function appendTodo(todo, parent) {
    let newTodo = $(`<li class="list-group-item" style="overflow: hidden;">
                    <div class="title-btn-group">
                    <h5>${todo.title}</h5>
                    <div>
                    <input type="button" value="Show Detail" class="btn btn-outline-primary display-task btn-sm"></input>
                    <input type="button" value="Edit" class="btn btn-outline-warning edit-task btn-sm"></input>
                    <i class="fas fa-fw fa-times-circle"></i>
                    </div>
                    </div>
                    <div class="collapse-detail" style="display: none;">
                    <h6>Title: ${todo.title}</h6>
                    <h6>Description: ${todo.description}</h6>
                    <h6>Due Date: ${todo.due_date.slice(0,10)}</h6>
                    </div>
                    </li>`);
    newTodo.data('id', todo.id);
    newTodo.data('status', todo.status);
    if (todo.ProjectId) {
        newTodo.data('projectId', todo.ProjectId);
    }
    if (todo.status) {
        $(newTodo).addClass('complete')
    }
    $(parent).append(newTodo);
}

function deleteTask(id, projectId) {
    const { token } = localStorage;
    $.ajax({
        method: 'DELETE',
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#tasklist').empty();
            $('#projectlist').empty();
            $('#project-select').empty();
            if (projectId) {
                showAllProjectTodos(projectId);
            }
            $.toast({
                heading: 'Success',
                text: 'Success Delete Task',
                showHideTransition: 'slide',
                icon: 'success'
            })
            checkToken();
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function readTaskById(id) {
    const { token } = localStorage;
    $.ajax({
        method: 'GET',
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#modal-body-home').css('display', 'flex');
            $('#editTitle').val(res.Todo.title);
            $('#editDescription').val(res.Todo.description);
            $('#editDue_Date').val(res.Todo.due_date.slice(0,10));
            $('#editTask').data('id', res.Todo.id);
            $('#editTask').data('projectId', res.Todo.ProjectId);
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function updateTask(id, title, description, due_date) {
    const { token } = localStorage;
    $.ajax({
        method: "PUT",
        url: `${baseURl}/todos/${id}`,
        headers: {
            token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(res => {
            $('#editTitle').val('');
            $('#editDescription').val('');
            $('#editDue_Date').val('');
            $('#modal-body-home').css('display', 'none');
            $('#tasklist').empty();
            $.toast({
                heading: 'Success',
                text: 'Success Update Task',
                showHideTransition: 'slide',
                icon: 'success'
            })
            showAllTask();
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function checkedTodo(todo) {
    const { token } = localStorage;
    const id = todo.data('id');
    const status = todo.data('status');
    console.log(status);

    $.ajax({
        method: "PUT",
        url: `${baseURl}/todos/check/${id}`,
        headers: {
            token
        },
        data: {
            status: !status
        }
    })
        .done(res => {
            todo.data('status', res.Todo.status);
            todo.toggleClass('complete');
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showAllProject() {
    const { token } = localStorage;
    $.ajax({
        method: "GET",
        url: `${baseURl}/projects`,
        headers: {
            token
        }
    })
        .done(res => {
            res.projects.forEach(project => {
                let newProject = $(`<option value="${project.name}">${project.name}</option>`);
                newProject.data('id', project.id);
                $('#project-select').append(newProject);
            });
            
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function clearProjectTab() {
    $('.listproject').hide();
    $('.listmember').hide();
    $('.title-project').hide();
    $('#project-title').text('');
    $('#project-task').text('');
    $('#member-list').text('');
    $('#memberlist').children().remove();
    $("#project-select").children().remove();
    $('#project-select').append('<option value="" id="default-select" selected disabled>Choose Project</option>');
}

function createNewProject(name) {
    const { token } = localStorage;
    $.ajax({
        method: 'POST',
        url: `${baseURl}/projects`,
        data: {
            name
        },
        headers: {
            token
        }
    })
        .done(res=> {
            $('#newProjectName').val('');
            $('#default-select').nextAll().remove();
            $('#addProject').slideUp();
            $.toast({
                heading: 'Success',
                text: 'Success add New Project',
                showHideTransition: 'slide',
                icon: 'success'
            })
            showAllProject();
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showAllProjectTodos(id) {
    const { token } = localStorage;
    $.ajax({
        method: "GET",
        url: `${baseURl}/projects/${id}/todos`,
        headers: {
            token
        }
    })
        .done(res => {
            res.todos.forEach(todo => {
                appendTodo(todo, $('#projectlist'))
            })
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function addNewProjectTask(ProjectId, title, description, due_date) {
    const { token } = localStorage;
    $.ajax({
        method: 'POST',
        url: `${baseURl}/projects/${ProjectId}/todos`,
        data: {
            title,
            description,
            due_date
        },
        headers: {
            token
        }
    })
        .done(res=> {
            $('#newProjectTaskTitle').val('');
            $('#newProjectTaskDescription').val('');
            $('#newProjectTaskDue_Date').val('');
            appendTodo(res.todo, $('#projectlist'));
            showCountry();
            showPopUp('Global');
            $('#modal-covid').css('display', 'flex');
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function updateProjectTask(ProjectId, id, title, description, due_date) {
    const { token } = localStorage;
    console.log(ProjectId);
    $.ajax({
        method: "PUT",
        url: `${baseURl}/projects/${ProjectId}/todos/${id}`,
        headers: {
            token
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(res => {
            $('#editTitle').val('');
            $('#editDescription').val('');
            $('#editDue_Date').val('');
            $('#modal-body-home').css('display', 'none');
            $('#tasklist').empty();
            $('#projectlist').empty();
            $.toast({
                heading: 'Success',
                text: 'Success Update Project Task',
                showHideTransition: 'slide',
                icon: 'success'
            })
            showAllTask();
            showAllProjectTodos(ProjectId);
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function deleteProjectTask(id, ProjectId) {
    const { token } = localStorage;
    $.ajax({
        method: "DELETE",
        url: `${baseURl}/projects/${ProjectId}/todos/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            $('#tasklist').empty();
            $('#projectlist').empty();
            $('#default-select').nextAll().remove();
            $.toast({
                heading: 'Success',
                text: 'Success Delete Project Task',
                showHideTransition: 'slide',
                icon: 'success'
            })
            checkToken();
            showAllProjectTodos('ProjectId');
        })
        .fail(err =>{
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function showAllMembers(id) {
    const { token } = localStorage;
    $.ajax({
        method: "GET",
        url: `${baseURl}/projects/members/${id}`,
        headers: {
            token
        }
    })
        .done(res => {
            console.log(res.members);
            $('#memberlist').empty();
            res.members.forEach(member => {
                appendMember(member, id);
            })
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function addMember(id, email) {
    const { token } = localStorage;
    $.ajax({
        method: "POST",
        url: `${baseURl}/projects/members/${id}`,
        headers: {
            token
        },
        data: {
            email
        }
    })
        .done(res => {
            $('#newMemberEmail').val('');
            console.log(res);
            // appendMember(res.newMember.name, id);
            let newMember = $(`<li class="list-group-item" style="overflow: hidden;">
                               <h5>${res.name}</h5>
                               </li>`)
            newMember.data('id', res.newMember.UserId);
            $.toast({
                heading: 'Success',
                text: `Success add ${res.name} to your project`,
                showHideTransition: 'slide',
                icon: 'success'
            })
            $('#memberlist').append(newMember);
        })
        .fail(err =>{
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            })
        })
}

function appendMember(member, projectId) {
    let newMember = $(`<li class="list-group-item" style="overflow: hidden;">
                    <h5>${member.name}</h5>
                    </li>`)
    newMember.data('id', member.id);
    if (projectId) {
        $('#memberlist').data('projectId', projectId);
    }
    $('#memberlist').append(newMember);
}

function editProject(name, id) {
  const { token } = localStorage;
  $.ajax({
    method: "PUT",
    url: `${baseURl}/projects/${id}`,
    headers: {
        token
    },
    data: {
      name
    }
  })
    .done(() => {
        $.toast({
            heading: 'Success',
            text: 'Success Edit Project',
            showHideTransition: 'slide',
            icon: 'success'
        })
      clearProjectTab();
      showAllProject();
    })
    .fail(err => {
        $.toast({
            heading: 'Error',
            text: err.responseJSON.error,
            showHideTransition: 'slide',
            icon: 'error'
        })
    })
}

function deleteProject(id) {
  const { token } = localStorage;
  $.ajax({
    method: "DELETE",
    url: `${baseURl}/projects/${id}`,
    headers: {
        token
    }
  })
    .done(() => {
        $.toast({
            heading: 'Success',
            text: 'Success Delete Project',
            showHideTransition: 'slide',
            icon: 'success'
        })
        clearProjectTab();
        showAllProject();
    })
    .fail(err => {
        $.toast({
            heading: 'Error',
            text: err.responseJSON.error,
            showHideTransition: 'slide',
            icon: 'error'
        })
    })
}

// google signin
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    
    $.ajax({
        method: "POST",
        url: 'http://localhost:4000/users/google-login',
        headers: {
            google_token: id_token
        }
    })
        .done(res => {
            localStorage.setItem('token', res.accessToken);
            checkToken();
            $.toast({
                heading: 'Success',
                text: 'Login Success',
                showHideTransition: 'slide',
                icon: 'success'
            })
        })
        .fail(err => {
            $.toast({
                heading: 'Error',
                text: err.responseJSON.error,
                showHideTransition: 'slide',
                icon: 'error'
            }) 
        })
}

$(document).ready(function() {
    checkToken();
    $('.alert').hide();
    // event

    //show register modal
    $('#getStarted').click(function(event) {
        event.preventDefault();
        $('#modal-body').css('display', 'flex');
        $('#register').show();
        $('#login').hide();
    })

    //show login modal
    $('#btn-login').click(function(event) {
        event.preventDefault();
        $('#modal-body').css('display', 'flex');
        $('#register').hide();
        $('#login').show();
    })

    //hide register-login modal
    $('.cancel').click(function(event) {
        event.preventDefault();
        $('.alert').hide();
        $('#modal-body').css('display', 'none');
    })

    // Submit register
    $('#registerForm').on('submit', function(event){
        event.preventDefault();
        const name = $('#nameRegister').val();
        const email = $('#emailRegister').val();
        const password = $('#passwordRegister').val();
        register(name, email, password)
    })

    // Submit login
    $('#login').on('submit', function(event){
        event.preventDefault();
        const email = $('#emailLogin').val();
        const password = $('#passwordLogin').val();
        login(email, password)
    })

    //user already register
    $('#alreadyRegister').click(function(event){
        event.preventDefault();
        showLogin();
    })

    //Toggle Add Task Form
    $('#addFormToggle').click(function() {
        $('#addTask').slideToggle();
    })

    //Toggle Add Project Task Form
    $('#addFormToggleProject').click(function() {
        const projectId = $(this).next().find('.list-group-item').data('projectId');
        $('#addProjectTask').data('projectId', projectId);
        $('#addProjectTask').slideToggle();
    })

    //Add new task
    $('#addTaskForm').on('submit', function(event) {
        event.preventDefault();
        const title = $('#newTaskTitle').val();
        const description = $('#newTaskDescription').val();
        const due_date = $('#newTaskDue_Date').val();
        addNewTask(title, description, due_date)
    })

    //add new project task
    $('#addProjectTaskForm').on('submit', function(event) {
        event.preventDefault();
        const ProjectId = $(this).parent().prev().prev().find('option:selected').data('id');
        console.log(ProjectId);
        const title = $('#newProjectTaskTitle').val();
        const description = $('#newProjectTaskDescription').val();
        const due_date = $('#newProjectTaskDue_Date').val();
        addNewProjectTask(ProjectId, title, description, due_date);
    })

    //Delete
    $('#tasklist').on('click', 'i', function(event) {
        event.stopPropagation();
        const id = $(this).parent().parent().parent().data('id');
        const projectId = $(this).parent().parent().parent().data('projectId');
        deleteTask(id, projectId);
    })

    //Delete project task
    $('#projectlist').on('click', 'i', function(event) {
        event.stopPropagation();
        const id = $(this).parent().parent().parent().data('id');
        const ProjectId = $(this).parent().parent().parent().data('projectId');
        deleteProjectTask(id, ProjectId)
    })

    //Show edit form
    $('#tasklist').on('click', '.edit-task', function(event) {
        event.stopPropagation();
        const id = $(this).parent().parent().parent().data('id');
        readTaskById(id);
    })

    //Show edit form project task
    $('#projectlist').on('click', '.edit-task', function(event) {
        event.stopPropagation();
        const id = $(this).parent().parent().parent().data('id');
        readTaskById(id);
    })

    //Edit task
    $('#editTask').on('submit', function(event) {
        event.preventDefault();
        const id = $('#editTask').data('id');
        const ProjectId = $('#editTask').data('projectId')
        const title = $('#editTitle').val();
        const description = $('#editDescription').val();
        const due_date = $('#editDue_Date').val();
        if (ProjectId) {
            updateProjectTask(ProjectId, id, title, description, due_date)
        } else {
            updateTask(id, title, description, due_date);
        }
    })

    //hide edit form
    $('.cancel-edit').click(function(event) {
        event.preventDefault();
        $('#modal-body-home').css('display', 'none');
    })

    //Toggle completion
    $('#tasklist').on('click', '.list-group-item', function() {
        checkedTodo($(this));
    })

    //Toggle completion project
    $('#projectlist').on('click', '.list-group-item', function() {
        checkedTodo($(this));
    })

    //Toggle detail
    $('#tasklist').on('click', '.display-task', function(event){
        event.stopPropagation();
        $(this).parent().parent().parent().find('.collapse-detail').slideToggle(function(){
            if($(this).parent().find('.display-task').val() === "Show Detail") {
                $(this).parent().find('.display-task').val('Hide Detail');
            } else {
                $(this).parent().find('.display-task').val('Show Detail');
            }
        });
    })

    //Toggle detail project task
    $('#projectlist').on('click', '.display-task', function(event){
        event.stopPropagation();
        $(this).parent().parent().parent().find('.collapse-detail').slideToggle(function(){
            if($(this).parent().find('.display-task').val() === "Show Detail") {
                $(this).parent().find('.display-task').val('Hide Detail');
            } else {
                $(this).parent().find('.display-task').val('Show Detail');
            }
        });
    })

    //Show pop-up
    $('#country').change(function(event) {
        country = $(this).val();
        $('#covid').remove();
        $('#canvas').append(`<canvas id="covid" class="text-center" height="280"></canvas>`);
        showPopUp(country);
    })

    //Close pop-up
    $('#okay').click(function(event) {
        event.preventDefault();
        $('#modal-covid').css('display', 'none');
    })

    //Show Project
    $('#project-select').change(function() {
        let project = $(this).val();
        $('.listproject').show();
        $('.listmember').show();
        $('.title-project').show();
        $('#project-title').text(project);
        $('#project-task').text(project);
        $('#member-list').text(project);
        const projectId = $('option:selected').data('id');
        const name = $(this).find('option:selected').text();
        $('#editedProjectName').val(name);
        $('#projectlist').children().remove();
        showAllMembers(projectId)
        showAllProjectTodos(projectId);
    })

    //add new member
    $('#addMemberForm').on('submit', function(event) {
        event.preventDefault();
        const email = $('#newMemberEmail').val();
        const id = $(this).parent().prev().data('projectId');
        addMember(id, email);
    })

    //Show Add Project Form
    $('#add-project').click(function(event) {
        event.preventDefault();
        $('#addProject').slideToggle();
    })

    //Add new project
    $('#addProjectForm').on('submit', function(event) {
        event.preventDefault();
        const newProject = $('#newProjectName').val();
        createNewProject(newProject);
    })

    //Show Edit Project Form
    $('#edit-project').click(function(event) {
      event.preventDefault();
      const name = $(this).parent().next().find('option:selected').text();
      $(this).parent().next().next().next().find('#editedProjectName').val(name)
      $('#editProject').slideToggle();
    })

    //Edit Project
    $('#editProjectForm').on('submit', function(event) {
      event.preventDefault();
      const name = $('#editedProjectName').val();
      const id = $(this).parent().prev().prev().find('option:selected').data('id');
      $('#editProject').slideUp();
      $('#editedProjectName').val('');
      editProject(name, id);
    })

    //Delete Project
    $('#delete-project').click(function(event) {
      event.preventDefault();
      const id = $(this).parent().next().find('option:selected').data('id');
      deleteProject(id);
    })

    //Logout
    $('#logout').click(function(event) {
        event.preventDefault();
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            localStorage.removeItem('token');
            console.log('User signed out.');
            clearProjectTab();
            checkToken();
        });
    }) 
})


