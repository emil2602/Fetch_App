import './main.scss';

let postData = null;

async function getUsers() {
    const usersUrl = 'https://jsonplaceholder.typicode.com/users';

    await fetch(usersUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    if (el.id > data.length - 3) {
                        drawCards(el);
                        () => getUsersPosts(el);
                    }
                });
            });
};

function drawCards(el) {
    const ul = document.querySelector('ul');
    let li = document.createElement('li'),
        title = document.createElement('h2'),
        email = document.createElement('a'),
        phone = document.createElement('a'),
        companyName = document.createElement('span');

    email.setAttribute('href', `mailto:${el.email}`);
    email.innerHTML = `Mail: ${el.email}`;
    
    phone.setAttribute('href', `tel+:${el.phone}`);
    phone.innerHTML = `Phone: ${el.phone}`;

    companyName.innerHTML = `Company name: ${el.company.name}`; 

    title.innerHTML = el.name;
    
    ul.insertAdjacentElement('beforeend', li);
    li.insertAdjacentElement('afterbegin', title);
    li.addEventListener('click', (e) => {
        e.preventDefault();
        getUsersPosts(el);
    });
    title.insertAdjacentElement('afterend', email);
    email.insertAdjacentElement('afterend', phone);
    phone.insertAdjacentElement('afterend', companyName);
};

async function getUsersPosts(el) {
    let modal = document.createElement('div'),
        modalList = document.createElement('ul'),
        closeButton = document.createElement('button'),
        container = document.querySelector('.container'),
        body = document.querySelector('body');
    const usersPost = 'https://jsonplaceholder.typicode.com/posts';

    body.classList.add('overlay');
    modal.classList.add('modal');

    closeButton.innerHTML = '&#10060';
    closeButton.addEventListener('click', () => {
        body.classList.remove('overlay');
        modal.remove();
    });

    modal.insertAdjacentElement('afterbegin', modalList);
    modal.insertAdjacentElement('afterbegin', closeButton);
    container.insertAdjacentElement('beforeend', modal);

    await fetch(usersPost + `?userId=${el.id}`)
            .then(response => response.json())
            .then(data => {
                postData = data;
                data.map(data => {
                    let {title, body} = data;
                    drawPosts(title, body, modalList, data);
                })
            });

    createPost(modal);
};

function drawPosts(header, body, container, data) {
    let li = document.createElement('li'),
        title = document.createElement('h3'),
        postDeleteButton = document.createElement('button'),
        description = document.createElement('p');

    title.innerHTML = header;
    description.innerHTML = body;
    li.dataset.post = data.id || data;

    postDeleteButton.innerHTML = '&#10006';
    postDeleteButton.addEventListener('click', () => {
        deleteUserPost(data);
    });
    
    container.insertAdjacentElement('beforeend', li);
    li.insertAdjacentElement('afterbegin', title);
    li.insertAdjacentElement('beforeend', postDeleteButton);
    title.insertAdjacentElement('afterend', description);
};

async function deleteUserPost(post) {
    let arrOfLi = document.querySelectorAll('.modal li'),
        ul = document.querySelector('.modal ul'),
        modal = document.querySelector('.modal'),
        body = document.querySelector('body');
    const usersPost = 'https://jsonplaceholder.typicode.com/posts';

    await fetch(usersPost + `/${post.id || post}`, {
        method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                arrOfLi.forEach(li => {
                    if (Number(li.dataset.post) === post.id || Number(li.dataset.post) === post) {
                        li.parentNode.removeChild(li);
                    }

                    if (ul.innerHTML === '') {
                        modal.remove();
                        body.classList.remove('overlay')
                    }
                })
            }
        }).catch(err => alert(err));
};

function createPost(modal) {
    let form = document.createElement('form'),
        inputTitle = document.createElement('input'),
        labelTitle = document.createElement('label'),
        inputDescription = document.createElement('textarea'),
        labelDescription = document.createElement('label'),
        inputSubmit = document.createElement('input'),
        title, 
        description;

    inputTitle.setAttribute('type', 'text');
    inputTitle.id = 'title';
    labelTitle.setAttribute('for', 'title');
    labelTitle.innerHTML = 'Title:';

    inputDescription.setAttribute('rows', 5);
    inputDescription.setAttribute('cols', 30);
    inputDescription.id = 'description';
    labelDescription.setAttribute('for', 'description');
    labelDescription.innerHTML = 'Description:';

    inputSubmit.setAttribute('type', 'submit');

    modal.insertAdjacentElement('beforeEnd' , form);
    form.insertAdjacentElement('afterbegin', inputTitle);
    inputTitle.insertAdjacentElement('beforebegin', labelTitle);
    inputTitle.insertAdjacentElement('afterend', inputDescription);
    inputDescription.insertAdjacentElement('beforebegin', labelDescription);
    inputDescription.insertAdjacentElement('afterend', inputSubmit);
    modal.addEventListener('submit', e => {
        e.preventDefault();
        title = inputTitle.value;
        description = inputDescription.value;

        if (inputTitle.value === '' && inputDescription.value === '') {
            alert('Fill the field, please');
        }else {
            createNewPost(title, description);
        };

        inputTitle.value = '';
        inputDescription.value = '';
    })
};

async function createNewPost(title, body) {
    let modalList = document.querySelector('.modal ul');
    let arrOfLi = document.querySelectorAll('.modal ul li');
    let [{userId}] = postData;

    await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: body,
                userId: userId,
                id: arrOfLi.length + 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
    })
    .then(() => { 
        drawPosts(title, body, modalList, arrOfLi.length + 1);
    });
};

getUsers();