/*  Resources to learn firebase.
 *  Official Documentation:
 *  Database : https://firebase.google.com/docs/database/web/start
 *  Authentication : https://firebase.google.com/docs/auth/web/start  
 *  
 *  Video Tutorials: 
 *  Database (includes some advanced js)
 *       Part 1: https://www.youtube.com/watch?v=noB98K6A0TY
 *       Part 2: https://www.youtube.com/watch?v=dBscwaqNPuk
 *  Authentication: (includes some advanced js)
 *       Full Part: https://www.youtube.com/watch?v=-OKrloDzGpU
 * 
 */ 


// Initialize Firebase, add the configs from your firebase project
var config = {
    apiKey: "API_KEY",
    authDomain: "<YOUR_FIREBASE_PROJECT>.firebaseapp.com",
    databaseURL: "https://<YOUR_FIREBASE_PROJECT>.firebaseio.com",
    projectId: "<YOUR_FIREBASE_PROJECT>",
    storageBucket: "<YOUR_FIREBASE_PROJECT>.appspot.com",
    messagingSenderId: "<OPTIONAL>"
};

var app = firebase.initializeApp(config); // get the firebase reference for our app
var db = app.database(); 
var rootRef = db.ref();

var input = document.querySelector('#todo-input'); // learn it from https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
var todoList = document.querySelector('.todo-list');

function addTodo() {
    var todo = input.value;
    if(todo !== ''){
        var todoKey = rootRef.push().key; // get unique key
        rootRef.child(todoKey).set(todo);
        input.value = ''; // empty the input
        input.focus(); // put the cursor again in the input
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
    var itemToChange = document.querySelector('.' + data.key);
    var itemText = itemToChange.firstElementChild; // the firstElementChild will be the span element that contains todo text 
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

    todoList.insertAdjacentHTML('beforeend', todoTemplate); // learn it from https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        
}

function deleteTodo(key){
    rootRef.child(key).remove();
}
function editTodo(key, value) {
    var newValue = prompt('Edit todo', value);
    
    if(newValue !== '' && newValue !== null){ // check if the value is not empty
        var updates = {};
        updates[key] = newValue; 
        rootRef.update(updates);
    }

}
