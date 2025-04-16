document.addEventListener('DOMContentLoaded', function () {
    refreshUserTable();
    initUserForms();
});

function initUserForms() {
    const addForm = document.getElementById('addUserForm');
    if (addForm) {
        addForm.removeEventListener('submit', addFormSubmitHandler);
        addForm.addEventListener('submit', addFormSubmitHandler);
    }

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            loadUserData(userId, 'edit');
            const editForm = document.getElementById('editUserForm');
            if (editForm) {
                editForm.removeEventListener('submit', editUserHandler);
                editForm.addEventListener('submit', editUserHandler);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            loadUserData(userId, 'delete');
            const deleteForm = document.getElementById('deleteUserForm');
            if (deleteForm) {
                deleteForm._handler = function (e) {
                    deleteUser(e, userId);
                };
                deleteForm.removeEventListener('submit', deleteForm._handler);
                deleteForm.addEventListener('submit', deleteForm._handler);
            }
        });
    });
}

function addFormSubmitHandler(e) {
    e.preventDefault();
    AddOrEditUser(this, 'POST', '/api/v1/users');
}

function editUserHandler(e) {
    e.preventDefault();
    AddOrEditUser(this, 'PUT', '/api/v1/users');
}

function AddOrEditUser(form, method, url) {
    const formData = new FormData(form);
    const userData = {};

    for (const [key, value] of formData.entries()) {
        if (key !== 'roles') {
            userData[key] = value;
        }
    }
    userData.roles = formData.getAll('roles');

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сервера');
        })
        .then(data => {
            refreshUserTable();
            $('#editModal').modal('hide');
        })
        .catch(error => showError(error));
}

function deleteUser(e, userId) {
    e.preventDefault();

    fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
        }
    })
        .then(response => {
            if (response.ok) {
                refreshUserTable();
                $('#deleteModal').modal('hide');
            } else {
                return response.text().then(errorText => {
                    throw new Error(errorText);
                });
            }
        })
        .catch(error => showError(error));
}

function loadUserData(userId, method) {
    fetch(`/api/v1/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById(method + 'Id').value = user.id;
            document.getElementById(method + 'Username').value = user.username;
            document.getElementById(method + 'FirstName').value = user.firstName;
            document.getElementById(method + 'LastName').value = user.lastName;
            document.getElementById(method + 'Email').value = user.email;
            document.getElementById(method + 'PhoneNumber').value = user.phoneNumber;
            if (method === 'edit') {
                document.getElementById(method + 'Password').value = '';
            }
            document.getElementById(method + 'RoleUser').checked = user.roles.includes("USER");
            document.getElementById(method + 'RoleAdmin').checked = user.roles.includes("ADMIN");
        })
        .catch(error => showError(error));
}

function refreshUserTable() {
    fetch('api/v1/users')
        .then(response => response.json())
        .then(users => {
            const tbody = document.querySelector('#usersTableList tbody');
            tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.roles}</td>
                <td>
                    <button class="btn btn-primary edit-btn" data-toggle="modal" data-target="#editModal" data-user-id="${user.id}">
                        Edit
                    </button>
                    <button class="btn btn-danger delete-btn" data-toggle="modal" data-target="#deleteModal" data-user-id="${user.id}">
                        Delete
                    </button>
                </td>
            <tr>
            `).join('');
            initUserForms();
        })
        .catch(error => showError(error));
}

function showError(error) {
    console.log(error);
}