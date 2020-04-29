let baseUrl = 'http://localhost:3000';

$(document).ready(function() {
  checkStorage();
});

function checkStorage() {
  if(localStorage.token) {
    $('#registerLogin').hide();
    $('.notlogged-in').hide();
    $('.logged-in').show();
    $('#dashboardPage').show();
    fetchTodo();
  } else {
    $('#registerLogin').show();
    $('#dashboardPage').hide();
    $('.notlogged-in').show();
    $('.logged-in').hide();
  }
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
      console.log(response);
      const token = response.token;
      $('#email').val('');
      $('#password').val('');
      localStorage.setItem('token', token);
      // hide landing
      $('#registerLogin').hide();
      $('#errorLogin').hide();
      //manage nav
      $('.notlogged-in').hide();
      $('.logged-in').show();
      // show dashboard
      $('#dashboardPage').show();
      fetchTodo();
    })
    .fail(err => {
      console.log(err.responseJSON);
      $('#errorLogin').show();
      $('#errorLogin').text(err.responseJSON.error.msg);
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
            <td>${todo.due_date}</td>
            <td><a class="btn btn-primary" href="${baseUrl}/todos/${todo.id}"><i class="fa fa-edit"></i> Edit</a></td>
            <td><a class="btn btn-danger" href="${baseUrl}/todos/${todo.id}"><i class="fa fa-trash"></i> Delete</a></td>
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

function addTodo(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = $('#title').val();
  const description = $('#description').val();
  const status = $('#status').val();
  const due_date = $('#due_date').val();
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
      due_date
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
            <td>${todo.due_date}</td>
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

function logout(e){
  e.preventDefault();
  localStorage.clear();
  $('#registerLogin').show();
  $('#dashboardPage').hide();
  $('.notlogged-in').show();
  $('.logged-in').hide();
}