let basedUrl = 'http://localhost:3000'

if (localStorage.token) {
    $('#dashboard-page').show()
    $('#landing-page').hide()
} else {
    $('#dashboard-page').hide()
    $('#landing-page').show()
}

$(document).ready(function () {
    $('.login-page').hide();

    $('#login-page').on("click", (event) => {
        event.preventDefault()
        $('.login-page').show();
        $('.login-form').show()
        $('.register-form').hide();
    });

    $('#register').on("click", (event) => {
        event.preventDefault()
        $('.login-page').show();
        $('.login-form').hide();
        $('.register-form').show()
    });

    $('.register-form').on("submit", (event) => {
        event.preventDefault()
        let email = $('.email').val('');
        let password = $('.password').val('');

        $.ajax({
                method: "POST",
                url: basedUrl + "/user/register",
                data: {
                    email,
                    password
                }
            })
            .done((data) => {
                localStorage.setItem('token', data.token)
                $('#dashboard-page').show();
                $('#landing-page').hide();
                // console.log(data);
                $('.errorRegister').empty()
            })
            .fail((err) => {
                $('.errorRegister').empty()
                console.log(err.responseJSON[0].message)
                $('.errorRegister').text(err.responseJSON[0].message) //!Notif error masih undefined
            })
            .always(_ => {
                email = $('.email').val('')
                password = $('.password').val('')
            })

    })

    $('.login-form').on("submit", (event) => {
        event.preventDefault()
        let email = $('.emailLogin').val()
        let password = $('.passwordLogin').val();
        $.ajax({
                method: "POST",
                url: basedUrl + "/user/login",
                data: {
                    email,
                    password
                }
            })
            .done((data) => {
                localStorage.setItem("token", data.token)
                $('#dashboard-page').show()
                $('#landing-page').hide()
                fetchData()
                $('.err').empty();
            })
            .fail((err) => {
                $('.errorLogin').append(`${err.responseJSON.message}`) //!Notif error masih undefine
            })
            .always(_ => {
                email = $('.emailLogin').val('')
                password = $('.passwordLogin').val('');
            })
    });

    $("#create").on("submit", (event) => {
        event.preventDefault()
        const title = $('#title').val()
        const description = $("#description").val()
        const status = $("#status").val()
        const due_date = $("#due_date").val()
        const token = localStorage.getItem("token")
        $.ajax({
                method: "POST",
                url: basedUrl + "/todo",
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
            .done((data) => {
                $('.error').empty();
                fetchData()
                console.log(data);
            })
            .fail((err) => {
                $('.errorLogin').append(err.responseJSON.message);
            })
    });

    $('#logout').on("click", (event) => {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            Swal.fire(
                'You Are Signed Out',
                'success'
            )
        });
        localStorage.clear()
        $('#listdata').empty()
        $('#dashboard-page').hide()
        $('#landing-page').show()
    })

});

function fetchData() {
    $.ajax({
        method: "GET",
        url: basedUrl + "/todo",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done((response) => {
        $('#listdata').empty()
        response.data.forEach(element => {
            $('#listdata').append(`
            <tr>
                <th>${element.title}</th>
                <th>${element.description}</th>
                <th>${element.status === true ? "Done" : "Undone"}</th>
                <th>${new Date(element.due_date).toDateString()}</th>
                <th> <button onclick="findOne(${element.id})" value=${element.id} class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
                Edit</button> <button class="btn btn-danger" onclick="destroy(${element.id})" value=${element.id}>Delete</button> <button onclick="complete(${element.id})" class="btn btn-success ${element.status === true ? "disabled" : ""} " value=${element.id}>Complete</button>
            </tr>
            `);
        });
    }).fail((err) => {
        console.log(err);
    })
}

function findOne(id) {
    const token = localStorage.getItem("token")
    $.ajax({
        method: "GET",
        url: basedUrl + `/todo/${id}`,
        headers: {
            token
        }
    }).done((data) => {
        let element = data.data
        $('#modalEdit').append(` <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body">
                    <form class="form-group">
                        <label for="todo">Todo Name</label><br>
                        <input class="form-control input-sm value" id="title_update" type="text" placeholder="Whats You Gonna Do" value="${element.title}"/><br>
                        <label for="description">Description</label><br>
                        <input class="form-control input-sm value" id="description_update" type="text" placeholder="Description" value="${element.description}"/><br>
                        <label for="due_date">Due Date</label><br>
                        <input class="form-control input-sm value" id="due_date_update" value="${element.due_date}" type="date"/>
                    </form>
                </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="update(${element.id})" >Save changes</button>
            </div>
        </div>
        </div>
        </div>
`);
    }).fail((err) => {
        console.log(err);
    })
}

function update(id) {
    const title = $('title_update').val()
    const description = $('description_update').val()
    const due_date = $('due_date_update').val()
    const token = localStorage.getItem("token")
    $.ajax({
            method: "PUT",
            url: basedUrl + `/todo/${id}`,
            headers: {
                token
            },
            data: {
                title,
                description,
                due_date
            }
        })
        .done((data) => {
            $('#modalEdit').hide()
            $('.value').val('')
            fetchData()
        })
        .fail((err) => {
            console.log(err);
        })
}

function destroy(id) {
    const token = localStorage.getItem("token")
    $.ajax({
        method: "delete",
        url: basedUrl + `/todo/${id}`,
        headers: {
            token
        }
    }).done((data) => {
        fetchData()
    }).fail((err) => {
        console.log(err);
    })
}

function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token
    $.ajax({
        method: "POST",
        url: basedUrl + `/user/google`,
        headers: {
            token
        }
    }).done((data) => {
        localStorage.setItem("token", data.token)
        $('#dashboard-page').show()
        fetchData()
        $('#landing-page').hide()
    }).fail((err) => {
        console.log(err);
    })
}