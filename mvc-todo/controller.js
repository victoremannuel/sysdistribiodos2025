const TodoModel = require('./model');
const TodoView = require('./view');

class TodoController {
    constructor() {
        this.model = new TodoModel();
        this.view = new TodoView();
    }

    start() {
        this.loop();
    }

    loop() {
        this.view.showTodos(this.model.getTodos());
        this.view.showMenu();
        this.view.ask('Opção: ', (option) => {
            switch (option.trim()) {
                case '1':
                    this.view.ask('Digite a tarefa: ', (text) => {
                        this.model.addTodo(text);
                        this.loop();
                    });
                    break;
                case '2':
                    this.view.ask('ID da tarefa para remover: ', (id) => {
                        this.model.removeTodo(Number(id));
                        this.loop();
                    });
                    break;
                case '3':
                    this.view.ask('ID da tarefa para marcar/desmarcar: ', (id) => {
                        this.model.toggleTodo(Number(id));
                        this.loop();
                    });
                    break;
                case '4':
                    this.view.close();
                    console.log('Saindo...');
                    break;
                default:
                    console.log('Opção inválida!');
                    this.loop();
            }
        });
    }
}

module.exports = TodoController;
