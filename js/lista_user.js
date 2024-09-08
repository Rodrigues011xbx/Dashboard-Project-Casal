let form_pesquisa_usuarios = document.querySelector('#form-pesquisa-usuarios');
let input_nome = document.querySelector('#input-pesquisa-nome');
let input_data = document.querySelector('#input-pesquisa-data');
let btn_limpar = document.querySelector('#btn-limpar-pesquisa');

let tabela_usuarios = document.querySelector('#tabela-usuarios');

document.addEventListener('DOMContentLoaded', () => {
    fetch('./utils/dados.json')
        .then(res => res.json())
        .then(data => {
            atualizar_tabela(data.users);
        })
        .catch(err =>{
            console.error('Erro ao carregar os dados JSON: ', err);
        });
});

btn_limpar.addEventListener('click', () => {
    // como os valores dos inputs estão vazios ele retornará a tabela completa:
    input_nome.value = "";
    input_data.value = "";
    pesquisar_na_tabela();
})

form_pesquisa_usuarios.addEventListener('submit', (e) => {
    e.preventDefault();
    pesquisar_na_tabela();
});

input_nome.addEventListener('input', (e) => {
    e.preventDefault();
    pesquisar_na_tabela();
});

function atualizar_tabela(lista_usuarios) {
    tabela_usuarios.innerHTML = "";

    lista_usuarios.forEach(user => {
        let tr = tabela_usuarios.insertRow();

        let registered = user.registered.split('-').reverse().join('/');

        tr.insertCell(0).innerText = user.name;
        tr.insertCell(1).innerText = user.email;
        tr.insertCell(2).innerText = registered;
    });
}

function pesquisar_na_tabela() {
    fetch('./utils/dados.json')
        .then(res => res.json())
        .then(data => {
            // .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
            // serve para transformar qualquer letra com acento em sua letra normal (á -> a)
            // assim é possível pesquisar por "marcio" e aparecer "márcio" por exemplo
            let nome = input_nome.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');

            let lista_pesquisada = data.users.filter(user => {
                let user_nome = user.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
                return user_nome.includes(nome);
            });

            if (input_data.value) {
                lista_pesquisada = lista_pesquisada.filter(user => user.registered === input_data.value);
            }

            atualizar_tabela(lista_pesquisada);
        })
        .catch(err => {
            console.error('Erro ao pesquisar o usuário: ', err);
        });
}