// Initialize Firebase
var config = {
    apiKey: "API_KEY",
    authDomain: "<YOUR_FIREBASE_PROJECT>.firebaseapp.com",
    databaseURL: "https://<YOUR_FIREBASE_PROJECT>.firebaseio.com",
    projectId: "<YOUR_FIREBASE_PROJECT>",
    storageBucket: "<YOUR_FIREBASE_PROJECT>.appspot.com",
    messagingSenderId: "<OPTIONAL>"
};

var app = firebase.initializeApp(config);
var db = app.database();
var rootRef = db.ref();

var input = document.querySelector('#todo-input');
var todoList = document.querySelector('.todo-list');

function addTodo() {
    var todo = input.value;
    if(todo !== ''){
        // push to firebase
        var todoKey = rootRef.push().key; // get unique key
        rootRef.child(todoKey).set(todo);
        // empty the input
        input.value = '';
        input.focus();
    }
}

rootRef.on('child_added', function(data){
    renderTodo(data);
});
rootRef.on('child_removed', function(data){
    var itemToDelete = document.querySelector('.' + data.key);
    itemToDelete.remove();
});

rootRef.on('child_changed', function(data){
    var itemToDelete = document.querySelector('.' + data.key);
    var itemText = itemToDelete.firstElementChild;
    itemText.innerHTML = data.val();
});

function renderTodo(todo){
    var todoTemplate = '<li class="list-group-item todo-item ' + todo.key + '">' + 
                            '<span class="todo-item-text">' + todo.val() + '</span>' +
                            '<span class="controls">' + 
                                '<button class="btn btn-default todo-item-delete" onclick="editTodo(\''+ todo.key + '\',\'' + todo.val() + '\')">Edit</button>' +
                                '<button class="btn btn-default todo-item-delete" onclick="deleteTodo(\''+ todo.key +'\')">Delete</button>' +
                            '</span>' +
                        '</li>';

    todoList.insertAdjacentHTML('beforeend', todoTemplate);
        
}

function deleteTodo(key){
    rootRef.child(key).remove();
}
function editTodo(key, value) {
    var newValue = prompt('Edit todo', value);
    if(newValue !== '' && newValue !== null){
        var updates = {};
        updates[key] = newValue; 
        rootRef.update(updates);
    }

}