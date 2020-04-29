$(document).ready(_=> {
    hideAll();

    $(`#login-submit`).click(_=> {
        $(`#login-error`).hide()
        let email = $(`#login-email`).val()
        let password = $(`#login-password`).val()
        login(email, password);
    })
})

function hideAll() {
    $(`#login-error`).hide();
    $(`#register-error`).hide();
    $(`#todo-error`).hide();
    $(`#todo-pending`).hide();
    $(`#todo-active`).hide();
    $(`#todo-complete`).hide();
    $(`#todo-add-container`).hide();
    $(`#new-task`).hide();
    $(`#logout-nav`).hide();
    $(`#todo-queue-container`).empty()
    $(`#todo-active-container`).empty()
    $(`#todo-complete-container`).empty()
};

function login(email, password) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/login',
        data: {
          email,
          password
        }
      })
        .done(function (response) {
          $(`#register-nav`).hide();
          $(`#login-nav`).hide();
          $(`#logout-nav`).show();
          $(`#login-container`).modal(`hide`);

          const token = response.token
          localStorage.setItem('token', token)
          clearForms();
          $(`#todo-pending`).show();
          $(`#todo-active`).show();
          $(`#todo-complete`).show();
          $(`#new-task`).show();
          loadTodos()
        })
        .fail(function (err) {
          $(`#login-error`).show()
          $(`#login-error`).empty()
          $(`#login-error`).append(err.responseJSON.Error.message)
        })
}

function register() {
    $(`#register-error`).hide()
    let nickname = $(`#register-nickname`).val()
    let email = $(`#register-email`).val()
    let password = $(`#register-password`).val()

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/register',
        data: {
          nickname,
          email,
          password
        }
      })
        .done(function (response) {
          $(`#register-container`).modal(`hide`);
          $(`#login-container`).modal(`show`);
          clearForm();
          $(`#login-email`).val(email)
        })
        .fail(function (err) {
          console.log(err)
          $(`#register-error`).show()
          $(`#register-error`).empty()
          $(`#register-error`).append(err.responseJSON.Error)
        })
}

function logout() {
    localStorage.clear()
    hideAll()
    $(`#register-nav`).show();
    $(`#login-nav`).show();
    $(`#logout-nav`).hide();
    clearForms();
  }

function clearForms() {
  $(`#register-nickname`).val(``)
  $(`#register-email`).val(``)
  $(`#register-password`).val(``)
  $(`#login-email`).val(``)
  $(`#login-password`).val(``)

}

function loadTodos() {
  const token = localStorage.getItem('token')
  $.ajax({
    method : `GET`,
    url : `http://localhost:3000/todos`,
    headers : {
      token
    }
  }).done( result => {
    seedHtml(result.Todo);
  })
  .fail(function (err) {
    console.log(err)
  })
}

function seedHtml(result){
  for (let i = 0; i < result.length; i++) {
    const { id, title, description, status, due_date} = result[i]
    let card = newCard( id,title, description, due_date )
    if( status == `queued`){
       $(`#todo-queue-container`).append(card)
    } else if(status == `active`){
      $(`#todo-active-container`).append(card)
    } else {
      $(`#todo-complete-container`).append(card)
    }
  }
}

function newCard(id, title, description, due) {
  let date = new Date(due)
  let fullDate = date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
  return `
<div class="card">
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${description} <br>Due :<br> ${fullDate}</p>
    <a href="#" class="btn btn-primary" id="todoid${id}">Go somewhere</a>
  </div>
</div>`
}