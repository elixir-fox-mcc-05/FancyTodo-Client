let baseUrl = 'http://localhost:3000';

$(document).ready(function() {
  checkStorage();
});

function checkStorage() {
  if(localStorage.token) {
    $('#registerPage').hide();
    $('#loginPage').hide();
    $('.notlogged-in').hide();
    $('.logged-in').show();
    $('#dashboardPage').show();
    fetchTodo();
  } else {
    $('#loginPage').show();
    $('#registerPage').hide();
    $('#dashboardPage').hide();
    $('.notlogged-in').show();
    $('.logged-in').hide();
  }
}

function showLogin(e) {
  e.preventDefault();
  $('#loginPage').show();
  $('#registerPage').hide();
}

function showRegister(e) {
  e.preventDefault();
  $('#loginPage').hide();
  $('#registerPage').show();
}

function showProjects(e) {
  e.preventDefault();
  $('#dashboardPage').hide();
  fetchProjects();
  $('#projectPage').show();
  $("#detailProjectPage").hide();
  $("#projectid").val('');
}

function showDashboard(e) {
  e.preventDefault();
  $('#projectPage').hide();
  $('#dashboardPage').show();
  $("#detailProjectPage").hide();
  $("#projectid").val('');
}

function register(e) {
  e.preventDefault();
  const email = $('#emailRegister').val();
  const password = $('#passwordRegister').val();
  const confirmPassword = $('#confirmpassword').val();
  if(password !== confirmPassword) {
    alert("Your password and confirmation password do not match.");
    $('#confirmpassword').focus();
  } else {
    $.ajax({
      method: 'POST',
      url: `${baseUrl}/register`,
      data: {
        email,
        password
      }
    })
      .done(response => {
        // console.log(response);
        $('#errorRegister').hide();
        $('#formRegister').append(`
          <p style="color: green;">Register Success, Please Login</p>
        `);
      })
      .fail(err => {
        // console.log(err.responseJSON);
        $('#errorRegister').show();
        if(Array.isArray(err.responseJSON.errors)) {
          $('#errorRegister').text(err.responseJSON.errors[0].msg);
        } else {
          $('#errorRegister').text(err.responseJSON.error);
        }
      })
  }

}

function togglePassword(e) {
  e.preventDefault();
  if($('#passwordRegister').attr('type') == 'text'){
    $('#passwordRegister').attr('type', 'password');
    $('#togglePassword i').addClass('fa-eye-slash');
    $('#togglePassword i').removeClass('fa-eye');
  } else if($('#passwordRegister').attr('type') == 'password') {
    $('#passwordRegister').attr('type', 'text');
    $('#togglePassword i').addClass('fa-eye');
    $('#togglePassword i').removeClass('fa-eye-slash');
  }
}

function togglePasswordLogin(e) {
  e.preventDefault();
  if($('#password').attr('type') == 'text'){
    $('#password').attr('type', 'password');
    $('#togglePasswordLogin i').addClass('fa-eye-slash');
    $('#togglePasswordLogin i').removeClass('fa-eye');
  } else if($('#password').attr('type') == 'password') {
    $('#password').attr('type', 'text');
    $('#togglePasswordLogin i').addClass('fa-eye');
    $('#togglePasswordLogin i').removeClass('fa-eye-slash');
  }
}
 
function login(e) {
  e.preventDefault();
  let email = $('#email').val();
  let password = $('#password').val();
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/login`,
    data: {
      email,
      password
    }
  })
    .done(response => {
      // console.log(response);
      const token = response.token;
      $('#email').val('');
      $('#password').val('');
      localStorage.setItem('token', token);
      // hide landing
      $('#loginPage').hide();
      $('#errorLogin').hide();
      //manage nav
      $('.notlogged-in').hide();
      $('.logged-in').show();
      // show dashboard
      $('#dashboardPage').show();
      fetchTodo();
    })
    .fail(err => {
      // console.log(err.responseJSON);
      $('#errorLogin').show();
      $('#errorLogin').text(err.responseJSON.error.msg);
    })
}

function fetchProjects() {
  const token = localStorage.getItem('token');
  $.ajax({
    method: "GET",
    url: `${baseUrl}/projects`,
    headers: {
      token
    }
  })
    .done(response => {
      console.log(response);
      const projects = response.Projects;
      $("#projectList tbody").empty();
      let counter = 1;
      if(projects.length) {
        projects.forEach(project => {
          $("#projectList tbody").append(`
            <tr>
              <th scope="row">${counter}</th>
              <td>${project.name}</td>
              <td>${project.description}</td>
              <td>${project.status ? "Done" : "Pending"}</td>
              <td>${formatDate(project.due_date)}</td>
              <td><a class="btn btn-info" onclick="viewProject(${project.id})"><i class="fa fa-file"></i> View</a></td>
              <td><a class="btn btn-primary" onclick="editProjectForm(${project.id})"><i class="fa fa-edit"></i> Edit</a></td>
              <td><a class="btn btn-danger" onclick="confirmDelete(${project.id})"><i class="fa fa-trash"></i> Delete</a></td>
            </tr>
          `);
          counter++;
        })
      } else {
        $("#projectList tbody").append(`
          <tr>
            <td colspan="8" style="text-align:center;">You haven't created any Project</td>
          </tr>
        `);
      }
    })
    .fail(err => {
      console.log(err);
    })
}

function fetchTodo() {
  const token = localStorage.getItem('token');
  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos`,
    headers: {
      token
    }
  })
    .done(response => {
      const todos = response.Todos;
      $('#location').append(response.weather.title);
      $('#currentWeather').append(` ${response.weather.consolidated_weather[0].weather_state_name} <img src="https://www.metaweather.com/static/img/weather/${response.weather.consolidated_weather[0].weather_state_abbr}.svg" width="25" height="25">`);
      $("#todoList tbody").empty();
      let counter = 1;
      if(todos.length){
        todos.forEach(todo => {
          $("#todoList tbody").append(`
          <tr>
            <th scope="row">${counter}</th>
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.status}</td>
            <td>${formatDate(todo.due_date)}</td>
            <td><a class="btn btn-primary" onclick="editForm(${todo.id})"><i class="fa fa-edit"></i> Edit</a></td>
            <td><a class="btn btn-danger" onclick="confirmDelete(${todo.id})"><i class="fa fa-trash"></i> Delete</a></td>
          </tr>
          `);
          counter++;
        });
      } else {
        $("#todoList tbody").append(`
          <tr>
            <td colspan="7" style="text-align:center;">You haven't created any Todo</td>
          </tr>
        `);
      }
    })
    .fail(err => {
      console.log(err);
    });
}

function viewProject(id) {
  const token = localStorage.getItem('token');
  $('#projectPage').hide();
  $("#detailProjectPage").show();
  $("#projectid").val(id);
  $("#projectid_addmember").val(id);
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/projects/${id}`,
    headers: {
      token
    }
  })
    .done(response => {
      const Project = response.Project;
      const users = response.Users;
      let counter = 1;
      $("#project-title").empty();
      $("#project-title").append(Project.name);
      $("#memberList tbody").empty();
      $('#user-list').empty();
      users.forEach(user => {
        $('#user-list').append(`
          <option value="${user.id}">${user.email}</option>
        `);
      });
      Project.Users.forEach(user => {
        $("#memberList tbody").append(`
          <tr>
            <td>${counter}</td>
            <td>${user.email}</td>
          </tr>
        `);
        counter++;
      });
    })
    .fail(err => {
      console.log(err);
    });

  $.ajax({
    method: "GET",
    url: `${baseUrl}/projects/${id}/todos`,
    headers: {
      token
    }
  })
    .done(response => {
      let counter = 1;
      const todos = response.ProjectTodos;
      $("#todoProjectList tbody").empty();
      if(todos.length){
        todos.forEach(todo => {
          $("#todoProjectList tbody").append(`
          <tr>
            <th scope="row">${counter}</th>
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.status}</td>
            <td>${formatDate(todo.due_date)}</td>
            <td><a class="btn btn-primary" onclick="editForm(${todo.id})"><i class="fa fa-edit"></i> Edit</a></td>
            <td><a class="btn btn-danger" onclick="confirmDelete(${todo.id})"><i class="fa fa-trash"></i> Delete</a></td>
          </tr>
          `);
          counter++;
        });
      } else {
        $("#todoProjectList tbody").append(`
          <tr>
            <td colspan="7" style="text-align:center;">You haven't created any Todo</td>
          </tr>
        `);
      }
    })
    .fail(err => {
      console.log(err);
    })
}

function addProject(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const name = $('#project_name').val();
  const description = $('#project_description').val();
  const status = $('#project_status').val();
  const due_date = $('#project_due_date').val();
  $.ajax({
    method: "POST",
    url: `${baseUrl}/projects`,
    headers: {
      token
    },
    data: {
      name,
      description,
      status,
      due_date
    }
  })
    .done(response => {
      $('#addProjectModal').modal('hide');
      $('#project_name').val('');
      $('#project_description').val('');
      $('#project_status').val('');
      $('#project_due_date').val('');
      $('#errorAddProject').hide();
      const project = response.Project;
      let counter = $("#projectList tbody tr").length + 1;
      $("#projectList tbody").append(`
          <tr>
            <th scope="row">${counter}</th>
            <td>${project.name}</td>
            <td>${project.description}</td>
            <td>${project.status ? "Done" : "Pending"}</td>
            <td>${formatDate(project.due_date)}</td>
            <td><a class="btn btn-info" onclick="viewProject(${project.id})"><i class="fa fa-file"></i> View</a></td>
            <td><a class="btn btn-primary" onclick="editProjectForm(${project.id})"><i class="fa fa-edit"></i> Edit</a></td>
            <td><a class="btn btn-danger" onclick="confirmDelete(${project.id})"><i class="fa fa-trash"></i> Delete</a></td>
          </tr>
          `);
    })
    .fail(err => {
      $('#errorAdd').show();
      if(Array.isArray(err.responseJSON.errors)) {
        err.responseJSON.errors.forEach(el => {
          $('#errorAdd').append(`
            ${el.msg}<br>
          `);
        });
      } else {
        $('#errorAdd').text(err.responseJSON.error);
      }
    });
}

function addTodo(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = $('#title').val();
  const description = $('#description').val();
  const status = $('#status').val();
  const due_date = $('#due_date').val();
  const projectid = $('#projectid').val();
  console.log(title);
  $.ajax({
    method: "POST",
    url: `${baseUrl}/todos`,
    headers: {
      token
    },
    data: {
      title,
      description,
      status,
      due_date,
      projectid
    }
  })
    .done(response => {
      $('#addTodoModal').modal('hide');
      $('#title').val('');
      $('#description').val('');
      $('#status').val('');
      $('#due_date').val('');
      $('#errorAdd').hide();
      const todo = response.Todo;
      let counter = $("#todoList tbody tr").length + 1;
      $("#todoList tbody").append(`
          <tr>
            <th scope="row">${counter}</th>
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.status}</td>
            <td>${formatDate(todo.due_date)}</td>
            <td><a class="btn btn-primary" onclick="editForm(${todo.id})"><i class="fa fa-edit"></i> Edit</a></td>
            <td><a class="btn btn-danger" onclick="confirmDelete(${todo.id})"><i class="fa fa-trash"></i> Delete</a></td>
          </tr>
          `);
      console.log(response);
    })
    .fail(err => {
      $('#errorAdd').show();
      if(Array.isArray(err.responseJSON.errors)) {
        err.responseJSON.errors.forEach(el => {
          $('#errorAdd').append(`
            ${el.msg}<br>
          `);
        });
      } else {
        $('#errorAdd').text(err.responseJSON.error);
      }
    });
}

function editForm(todoid) {
  const token = localStorage.getItem('token');
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos/${todoid}`,
    headers: {
      token
    }
  })
    .done(response => {
      const Todo = response.Todo;
      $('#editTodoModal').modal('show');
      $('#todoId').val(Todo.id);
      $('#projectid_edittodo').val(Todo.ProjectId);
      $('#titleEdit').val(Todo.title);
      $('#descriptionEdit').val(Todo.description);
      $('#statusEdit').val(Todo.status);
      $('#due_dateEdit').val(formatDate(Todo.due_date));
    })
    .fail(err => {
      console.log(err);
    });
}

function editProjectForm(value) {
  const token = localStorage.getItem('token');
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/projects/${value}`,
    headers: {
      token
    }
  })
    .done(response => {
      const Project = response.Project;
      $('#editProjectModal').modal('show');
      $('#projectId').val(Project.id);
      $('#project_name_edit').val(Project.name);
      $('#project_description_edit').val(Project.description);
      $('#project_status_edit').val(Project.status);
      $('#project_due_date_edit').val(formatDate(Project.due_date));
    })
    .fail(err => {
      console.log(err);
    });
}

function update(e){
  e.preventDefault();
  const token = localStorage.getItem('token');
  const id = $('#todoId').val();
  const projectid = $('#projectid_edittodo').val();
  const title = $('#titleEdit').val();
  const description = $('#descriptionEdit').val();
  const status = $('#statusEdit').val();
  const due_date = $('#due_dateEdit').val();
  let reqUrl = '';

  if(projectid) {
    reqUrl = `${baseUrl}/projects/${projectid}/todos/${id}`;
  } else {
    reqUrl = `${baseUrl}/todos/${id}`;
  }

  $.ajax({
    method: 'PUT',
    url: reqUrl,
    headers: {
      token
    },
    data: {
      title,
      description,
      status,
      due_date
    }
  })
    .done(response => {
      $('#editTodoModal').modal('hide');
      $('#titleEdit').val('');
      $('#descriptionEdit').val('');
      $('#statusEdit').val('');
      $('#due_dateEdit').val('');
      $('#errorEdit').hide();
      location.reload();
    })
    .fail(err => {
      console.log(err.responseJSON);
      $('#errorAdd').text(err.responseJSON.msg);
    });
}

function updateProject(e){
  e.preventDefault();
  const token = localStorage.getItem('token');
  const id = $('#projectId').val();
  const name = $('#project_name_edit').val();
  const description = $('#project_description_edit').val();
  const status = $('#project_status_edit').val();
  const due_date = $('#project_due_date_edit').val();

  $.ajax({
    method: 'PUT',
    url: `${baseUrl}/projects/${id}`,
    headers: {
      token
    },
    data: {
      name,
      description,
      status,
      due_date
    }
  })
    .done(response => {
      $('#editProjectModal').modal('hide');
      $('#project_name_edit').val('');
      $('#project_description_edit').val('');
      $('#project_status_edit').val('');
      $('#project_due_date_edit').val('');
      $('#errorEditProject').hide();
      location.reload();
    })
    .fail(err => {
      $('#errorAdd').text(err.responseJSON.msg);
    });
}
 
function addMember(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');

  let projectid = $("#projectid_addmember").val();
  let userid = $("#user-list").val();
  $.ajax({
    method: "POST",
    url: `${baseUrl}/projects/${projectid}`,
    headers: {
      token
    },
    data: {
      userid
    }
  })
    .done(response => {
      $("#addMemberModal").modal('hide');
    })
    .fail(err => {
      console.log(err);
    })
}

function confirmDelete(value) {
  const token = localStorage.getItem('token');
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos/${value}`,
    headers: {
      token
    }
  })
    .done(response => {
      console.log(response);
      const Todo = response.Todo;
      $('#deleteTodoModal').modal('show');
      $('#idDelete').val(Todo.id);
      $('#projectid_delete').val(Todo.ProjectId);
      $('#deleteMessage').empty();
      $('#deleteMessage').append(`Delete data Todo "${Todo.title}" ?`);
    })
    .fail(err => {
      console.log(err);
    });
}

function deleteTodo(event) {
  const token = localStorage.getItem('token');
  const id = $('#idDelete').val();
  const projectid = $('#projectid_delete').val();

  if(projectid) {
    reqUrl = `${baseUrl}/projects/${projectid}/todos/${id}`;
  } else {
    reqUrl = `${baseUrl}/todos/${id}`;
  }

  $.ajax({
    method: 'DELETE',
    url: reqUrl,
    headers: {
      token
    }
  })
    .done(response => {
      const Todo = response.Todo;
      $('#deleteTodoModal').modal('show');
      $('#todoId').val(Todo.id);
      $('#deleteMessage').append(`"${Todo.title}" ?`);
    })
    .fail(err => {
      console.log(err);
    });
}

function formatDate(date) {
  date = new Date(date);
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset*60000));
  return date.toISOString().split('T')[0];
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/google-login`,
    headers: {
      google_token: id_token
    }
  })
    .done(response => {
      localStorage.setItem('token', response.token);
      $('#loginPage').hide();
      $('#errorLogin').hide();
      //manage nav
      $('.notlogged-in').hide();
      $('.logged-in').show();
      // show dashboard
      $('#dashboardPage').show();
      fetchTodo();
    })
    .fail(err => {
      console.log(err);
    });

}

function logout(e){
  e.preventDefault();
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.clear();
    $('#loginPage').show();
    $('#registerPage').hide();
    $('#dashboardPage').hide();
    $('.notlogged-in').show();
    $('.logged-in').hide();
    $("#detailProjectPage").hide();
    $('#projectPage').hide();
  });
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      let accessToken = response.authResponse.accessToken;
      let userId = response.authResponse.userID;
      console.log(response);
      $.ajax({
        method: 'POST',
        url: `${baseUrl}/facebook-login`,
        headers: {
          accessToken,
          userId
        }
      })
        .done(response => {
          localStorage.setItem('token', response.token);
          $('#loginPage').hide();
          $('#errorLogin').hide();
          //manage nav
          $('.notlogged-in').hide();
          $('.logged-in').show();
          // show dashboard
          $('#dashboardPage').show();
          fetchTodo();
        })
        .fail(err => {
          console.log(err);
        });
    } 
  } );
}
