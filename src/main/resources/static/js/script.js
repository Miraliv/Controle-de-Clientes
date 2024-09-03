// Inicialização de variáveis globais
let colheitas = [];
let clientes = [];
let clientesFiltrados = [];

// Carrega todas as colheitas ao iniciar a aplicação
function loadHarvests() {
    axios.get('/api/colheitas')
        .then(response => {
            colheitas = Array.isArray(response.data) ? response.data : [];
            updateHarvestDropdown();
        })
        .catch(error => {
            console.error('Erro ao carregar colheitas:', error);
        });
}

// Atualiza o dropdown das colheitas com os dados carregados
function updateHarvestDropdown() {
    const harvestDropdownMenu = $('#harvestDropdownMenu');
    harvestDropdownMenu.empty(); // Limpa o dropdown antes de adicionar novos itens

    colheitas.forEach((colheita, index) => {
        const dropdownItem = $('<a>')
            .addClass('dropdown-item')
            .attr('href', '#')
            .text(colheita.nome)
            .on('click', () => {
                selectHarvest(colheita);
            });
        harvestDropdownMenu.append(dropdownItem);
    });
}

// Exibe os detalhes da colheita selecionada e carrega os clientes associados
function selectHarvest(colheita) {
    $('#harvestNameTitle').text(colheita.nome);
    $('#addCustomerButton').prop('disabled', false);

    loadCustomers(colheita.id);

    $('#harvestData').html(`
        <h5>Detalhes da Colheita</h5>
        <p>Garrafas de Mel: ${colheita.totalGarrafasMel}</p>
        <p>Potes de Favo: ${colheita.totalPotesFavo}</p>
    `);
}

// Carrega os clientes associados à colheita selecionada
function loadCustomers(harvestId) {
    axios.get(`/api/colheitas/${harvestId}/clientes`)
        .then(response => {
            clientes = Array.isArray(response.data) ? response.data : [];
            clientesFiltrados = clientes; // Inicialmente, todos os clientes são exibidos
            updateCustomerTable();
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
        });
}

// Filtra a lista de clientes de acordo com a situação selecionada
function filterCustomers(situacao) {
    if (situacao === 'Todos') {
        clientesFiltrados = clientes;
    } else {
        clientesFiltrados = clientes.filter(cliente => cliente.situacao === situacao);
    }
    updateCustomerTable();
}

// Atualiza a tabela de clientes exibindo os clientes filtrados
function updateCustomerTable() {
    const tablesContent = $('#tablesContent');
    tablesContent.empty(); // Limpa a tabela antes de adicionar novos itens

    if (clientesFiltrados.length === 0) {
        tablesContent.html('<p>Nenhum cliente encontrado.</p>');
        return;
    }

    const table = $('<table>').addClass('table table-striped');
    const thead = $('<thead>').html(`
        <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Situação</th>
            <th>Garrafas de Mel</th>
            <th>Potes de Favo</th>
            <th>Ações</th>
        </tr>
    `);

    const tbody = $('<tbody>');
    clientesFiltrados.forEach((cliente, index) => {
        const tr = $('<tr>').html(`
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td class="${getSituacaoClass(cliente.situacao)}">${cliente.situacao}</td>
            <td>${cliente.garrafasMel}</td>
            <td>${cliente.potesFavo}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCustomer(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteConfirmation(${cliente.id})">Excluir</button>
            </td>
        `);
        tbody.append(tr);
    });

    table.append(thead);
    table.append(tbody);
    tablesContent.append(table);
}

// Retorna a classe CSS apropriada para a situação do cliente
function getSituacaoClass(situacao) {
    switch (situacao) {
        case 'Quer comprar':
            return 'situacao-warning';
        case 'Já pagou':
            return 'situacao-success';
        case 'Falta pagar':
            return 'situacao-danger';
        default:
            return '';
    }
}

// Adiciona uma nova colheita através de uma solicitação POST
function addHarvest(event) {
    event.preventDefault();

    const nome = $('#harvestName').val();
    const totalGarrafasMel = parseInt($('#harvestHoneyJars').val());
    const totalPotesFavo = parseInt($('#harvestHoneycombs').val());

    axios.post('/api/colheitas', { nome, totalGarrafasMel, totalPotesFavo })
        .then(response => {
            colheitas.push(response.data);
            updateHarvestDropdown();
            $('#addHarvestForm').trigger('reset');
            $('#addHarvestModal').modal('hide');
        })
        .catch(error => {
            console.error('Erro ao adicionar colheita:', error);
        });
}

// Adiciona um novo cliente associado à colheita selecionada
function addCustomer(event) {
    event.preventDefault();

    const nome = $('#customerName').val();
    const telefone = $('#customerPhone').val();
    const situacao = $('#customerSituacao').val();
    let garrafasMel = parseInt($('#customerHoneyJars').val());
    let potesFavo = parseInt($('#customerHoneycombs').val());

    // Verifica se o telefone está completamente preenchido
        if (telefone.replace(/[_\s()-]/g, '').length !== 11) {
            alert('Por favor, preencha o telefone corretamente.');
            return;
        }

        // Definir valores vazios como 0
            if (isNaN(garrafasMel)) garrafasMel = 0;
            if (isNaN(potesFavo)) potesFavo = 0;

            // Verificar se ambos os valores são 0
            if (garrafasMel === 0 && potesFavo === 0) {
                alert('Você deve comprar pelo menos uma garrafa de mel ou um pote de favo.');
                return;
            }

    const selectedHarvest = colheitas.find(colheita => colheita.nome === $('#harvestNameTitle').text());

    axios.post('/api/clientes', { nome, telefone, situacao, garrafasMel, potesFavo, colheita: { id: selectedHarvest.id } })
        .then(response => {
            clientes.push(response.data);
            clientesFiltrados = clientes;
            updateCustomerTable();
            $('#addCustomerForm').trigger('reset');
            $('#addCustomerModal').modal('hide');
        })
        .catch(error => {
            console.error('Erro ao adicionar cliente:', error);
        });
}
//Para mascarar o input de telefone
$(document).ready(function(){
    $('#customerPhone').inputmask('(99) 99999-9999');
    $('#updateCustomerPhone').inputmask('(99) 99999-9999');
});

// Prepara o formulário de atualização de cliente com os dados existentes
function editCustomer(index) {
    const cliente = clientesFiltrados[index];
    $('#updateCustomerIndex').val(index);
    $('#updateCustomerName').val(cliente.nome);
    $('#updateCustomerPhone').val(cliente.telefone);
    $('#updateCustomerSituacao').val(cliente.situacao);
    $('#updateCustomerHoneyJars').val(cliente.garrafasMel);
    $('#updateCustomerHoneycombs').val(cliente.potesFavo);
    $('#updateCustomerModal').modal('show');
}

// Atualiza os dados do cliente através de uma solicitação PUT
function updateCustomer(event) {
    event.preventDefault();

    const index = $('#updateCustomerIndex').val();
    const nome = $('#updateCustomerName').val();
    const telefone = $('#updateCustomerPhone').val();
    const situacao = $('#updateCustomerSituacao').val();
    const garrafasMel = parseInt($('#updateCustomerHoneyJars').val());
    const potesFavo = parseInt($('#updateCustomerHoneycombs').val());

    // Verifica se o telefone está completamente preenchido
            if (telefone.replace(/[_\s()-]/g, '').length !== 11) {
                alert('Por favor, preencha o telefone corretamente.');
                return;
            }

    const cliente = clientesFiltrados[index];
    cliente.nome = nome;
    cliente.telefone = telefone;
    cliente.situacao = situacao;
    cliente.garrafasMel = garrafasMel;
    cliente.potesFavo = potesFavo;

    axios.put(`/api/clientes/${cliente.id}`, cliente)
        .then(response => {
            clientesFiltrados[index] = response.data;
            updateCustomerTable();
            $('#updateCustomerModal').modal('hide');
        })
        .catch(error => {
            console.error('Erro ao atualizar cliente:', error);
        });
}
//Mostra o modal de delete
function showDeleteConfirmation(clienteId) {
    $('#confirmDeleteModal').modal('show');

    // Adiciona um evento de clique ao botão de confirmação do modal
    $('#confirmDeleteButton').off('click').on('click', function () {
        deleteCustomer(clienteId);
        $('#confirmDeleteModal').modal('hide');
    });
}


// Exclui um cliente através de uma solicitação DELETE
function deleteCustomer(id) {
    axios.delete(`/api/clientes/${id}`)
        .then(() => {
            clientes = clientes.filter(cliente => cliente.id !== id);
            clientesFiltrados = clientesFiltrados.filter(cliente => cliente.id !== id);
            updateCustomerTable();
        })
        .catch(error => {
            console.error('Erro ao excluir cliente:', error);
        });
}

// Event Listeners
$('#addHarvestForm').on('submit', addHarvest);
$('#addCustomerForm').on('submit', addCustomer);
$('#updateCustomerForm').on('submit', updateCustomer);

// Carrega os dados iniciais ao iniciar a aplicação
loadHarvests();
