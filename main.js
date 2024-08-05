

document.addEventListener('DOMContentLoaded', function () {
    // Login Page
    if (window.location.pathname.includes('index.html')) {
        const loginForm = document.getElementById('loginForm');
        const uname = document.getElementById('uname');
        const password = document.getElementById('password');
        const unameError = document.getElementById('unameError');
        const passwordError = document.getElementById('passwordError');
        const loginError = document.getElementById('loginError');

        function validateLogin(el, value) {
            if (el && el.value === value) {
                el.nextElementSibling.classList.add('hidden');
                return true;
            } else {
                if (el) el.nextElementSibling.classList.remove('hidden');
                if (el) el.nextElementSibling.textContent = `Invalid ${el.id}`;
                return false;
            }
        }

        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const validUname = validateLogin(uname, 'admin');
                const validPassword = validateLogin(password, '12345');

                if (validUname && validPassword) {
                    localStorage.setItem('user', JSON.stringify({ uname: 'admin' }));
                    window.location = 'todo.html';
                } else {
                    loginError.classList.remove('hidden');
                }
            });
        }
    }

    // Todo Page
    if (window.location.pathname.includes('todo.html')) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
            window.location = 'index.html';
        }

        const welcomeText = document.getElementById('welcomeText');
        if (welcomeText) {
            welcomeText.innerHTML = `Hello ${currentUser.uname}! <br> Welcome to your 'ToDo' List`;
        }

        const logout = document.getElementById('logout');
        if (logout) {
            logout.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location = 'index.html';
            });
        }

        const getList = async () => {
            try {
                const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
                const lists = res.data;
                let listContent = '';
                lists.forEach((el, index) => {
                    listContent += `<li class="list-group-item ${el.completed ? 'disabledList' : ''} ${index % 2 ? 'list-group-item-info' : 'list-group-item-success'}"> 
                        <input type="checkbox" class="checkbox" ${el.completed ? ' checked' : ''}/> 
                        <label for=""> ${el.title}</label></li>`;
                });
                const todoList = document.getElementById('todoList');
                if (todoList) {
                    todoList.innerHTML = listContent;
                }
            } catch (e) {
                console.log('failed to fetch lists data', e);
            }
        };

        const getListButton = document.getElementById('getList');
        if (getListButton) {
            getListButton.addEventListener('click', function (e) {
                e.preventDefault();
                getList();
            });
        }

        let checkedCount = 0;

        const alertPromise = () => {
            return new Promise((resolve, reject) => {
                if (checkedCount === 5) {
                    resolve(checkedCount);
                } else {
                    reject('count not equal to 5');
                }
            });
        };

        const promiseCall = () => {
            alertPromise().then((data) => {
                alert(`Kudos, We have completed ${data} activities today.... Congrats!`);
            }).catch((err) => {
                console.log('promise rejected');
            });
        };

        getList();

        const todoList = document.getElementById('todoList');
        if (todoList) {
            todoList.addEventListener('change', function (e) {
                if (e.target.classList.contains('checkbox')) {
                    if (e.target.checked) {
                        checkedCount++;
                        e.target.parentElement.classList.add('active');
                    } else {
                        checkedCount--;
                        e.target.parentElement.classList.remove('active');
                    }
                    promiseCall();
                }
            });
        }
    }
});

