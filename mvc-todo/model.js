const fs = require('fs');
const path = require('path');

class TodoModel {
    constructor(filename = 'todos.json') {
        this.filePath = path.join(__dirname, filename);
        this.todos = this.loadTodos();
        this.nextId = this.getNextId();
    }

    loadTodos() {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    saveTodos() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.todos, null, 2));
    }

    getNextId() {
        // Encontra o menor id disponível começando do 1
        const usedIds = new Set(this.todos.map(t => t.id));
        let id = 1;
        while (usedIds.has(id)) {
            id++;
        }
        return id;
    }

    addTodo(text) {
        const id = this.getNextId();
        const todo = { id, text, completed: false };
        this.todos.push(todo);
        this.saveTodos();
        return todo;
    }

    removeTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
    }

    getTodos() {
        return this.todos;
    }
}

module.exports = TodoModel;
