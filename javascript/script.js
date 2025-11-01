let todos = [];
let currentFilter = 'all';

function toggleFilterDropdown() {
    const dropdown = document.getElementById('filterDropdown');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', function(e) {
    const filterSection = document.querySelector('.filter-section');
    const dropdown = document.getElementById('filterDropdown');
    if (!filterSection.contains(e.target)) {
    dropdown.classList.remove('show');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => {
    errorDiv.classList.remove('show');
    }, 3000);
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    if (todoInput.value.trim() === '') {
        showError('Mohon isi task terlebih dahulu!');
        return;
    }
    if (dateInput.value === '') {
        showError('Mohon pilih tanggal terlebih dahulu!');
        return;
    }
    const todo = {
        id: Date.now(),
        text: todoInput.value.trim(),
        date: dateInput.value,
        completed: false
    };
    todos.push(todo);
    todoInput.value = '';
    dateInput.value = '';
    renderTodos();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function deleteAll() {
    if (todos.length === 0) {
        showError('Tidak ada task untuk dihapus!');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus semua task?')) {
        todos = [];
        renderTodos();
    }
}

function filterTodos(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const filterText = {
        'all': 'SEMUA',
        'pending': 'PENDING',
        'completed': 'SELESAI'
    };
    document.getElementById('currentFilter').textContent = filterText[filter];
    
    document.getElementById('filterDropdown').classList.remove('show');
    
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    let filteredTodos = todos;
    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No task found</div>
            </div>
        `;
        return;
    }
    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-text">${todo.text}</div>
            <div class="todo-date">${formatDate(todo.date)}</div>
            <span class="status-badge ${todo.completed ? 'completed' : 'pending'}">
                ${todo.completed ? 'Selesai' : 'Pending'}
            </span>
            <div class="todo-actions">
                <button class="action-btn complete-btn" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? '↶' : '✓'}
                </button>
                <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">×</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});
document.getElementById('dateInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

const today = new Date().toISOString().split('T')[0];
document.getElementById('dateInput').setAttribute('min', today);

renderTodos();
