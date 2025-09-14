const readline = require('readline');

class TodoView {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    showTodos(todos) {
        console.clear();
        console.log('--- Lista de Tarefas ---');
        if (todos.length === 0) {
            console.log('Nenhuma tarefa encontrada.');
        } else {
            todos.forEach(todo => {
                console.log(`${todo.id} - [${todo.completed ? 'X' : ' '}] ${todo.text}`);
            });
        }
        console.log('\n');
    }

    showMenu() {
        console.log('Escolha uma opção:');
        console.log('1. Adicionar tarefa');
        console.log('2. Remover tarefa');
        console.log('3. Marcar/desmarcar tarefa como concluída');
        console.log('4. Sair');
    }

    ask(question, callback) {
        this.rl.question(question, callback);
    }

    close() {
        this.rl.close();
    }
}

module.exports = TodoView;
