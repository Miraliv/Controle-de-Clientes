// Inicialização de variáveis globais
    let colheitas = [];
    let clientes = [];
    let clientesFiltrados = [];

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

    function updateHarvestDropdown() {
        const harvestDropdownMenu = document.getElementById('harvestDropdownMenu');
        harvestDropdownMenu.innerHTML = '';

        colheitas.forEach((colheita, index) => {
            const dropdownItem = document.createElement('a');
            dropdownItem.className = 'dropdown-item';
            dropdownItem.href = '#';
            dropdownItem.textContent = colheita.nome;
            dropdownItem.onclick = () => {
                selectHarvest(colheita);
            };
            harvestDropdownMenu.appendChild(dropdownItem);
        });
    }

    function selectHarvest(colheita) {
        document.getElementById('harvestNameTitle').textContent = colheita.nome;
        document.getElementById('addCustomerButton').disabled = false;

        loadCustomers(colheita.id);

        const harvestData = document.getElementById('harvestData');
        harvestData.innerHTML = `
            <h5>Detalhes da Colheita</h5>
            <p>Garrafas de Mel: ${colheita.totalGarrafasMel}</p>
            <p>Potes de Favo: ${colheita.totalPotesFavo}</p>
        `;
    }

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

    function filterCustomers(situacao) {
        if (situacao === 'Todos') {
            clientesFiltrados = clientes;
        } else {
            clientesFiltrados = clientes.filter(cliente => cliente.situacao === situacao);
        }
        updateCustomerTable();
    }

    function updateCustomerTable() {
        const tablesContent = document.getElementById('tablesContent');
        tablesContent.innerHTML = '';

        if (clientesFiltrados.length === 0) {
            tablesContent.innerHTML = '<p>Nenhum cliente encontrado.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Situação</th>
                <th>Garrafas de Mel</th>
                <th>Potes de Favo</th>
                <th>Ações</th>
            </tr>
        `;

        const tbody = document.createElement('tbody');
        clientesFiltrados.forEach((cliente, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td class="${getSituacaoClass(cliente.situacao)}">${cliente.situacao}</td>
                <td>${cliente.garrafasMel}</td>
                <td>${cliente.potesFavo}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCustomer(${index})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${cliente.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tablesContent.appendChild(table);
    }

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

    function addHarvest(event) {
        event.preventDefault();

        const nome = document.getElementById('harvestName').value;
        const totalGarrafasMel = parseInt(document.getElementById('harvestHoneyJars').value);
        const totalPotesFavo = parseInt(document.getElementById('harvestHoneycombs').value);

        axios.post('/api/colheitas', { nome, totalGarrafasMel, totalPotesFavo })
            .then(response => {
                colheitas.push(response.data);
                updateHarvestDropdown();
                document.getElementById('addHarvestForm').reset();
                $('#addHarvestModal').modal('hide');
            })
            .catch(error => {
                console.error('Erro ao adicionar colheita:', error);
            });
    }

    function addCustomer(event) {
        event.preventDefault();

        const nome = document.getElementById('customerName').value;
        const telefone = document.getElementById('customerPhone').value;
        const situacao = document.getElementById('customerSituacao').value;
        const garrafasMel = parseInt(document.getElementById('customerHoneyJars').value);
        const potesFavo = parseInt(document.getElementById('customerHoneycombs').value);

        const selectedHarvest = colheitas.find(colheita => colheita.nome === document.getElementById('harvestNameTitle').textContent);

        if (!selectedHarvest) {
            alert('Selecione uma colheita para adicionar um cliente.');
            return;
        }

        axios.post('/api/clientes', { nome, telefone, situacao, garrafasMel, potesFavo, colheita: { id: selectedHarvest.id } })
            .then(response => {
                clientes.push(response.data);
                clientesFiltrados = clientes;
                updateCustomerTable();
                document.getElementById('addCustomerForm').reset();
                $('#addCustomerModal').modal('hide');
            })
            .catch(error => {
                console.error('Erro ao adicionar cliente:', error);
            });
    }

    function editCustomer(index) {
        const cliente = clientesFiltrados[index];
        document.getElementById('updateCustomerIndex').value = index;
        document.getElementById('updateCustomerName').value = cliente.nome;
        document.getElementById('updateCustomerPhone').value = cliente.telefone;
        document.getElementById('updateCustomerSituacao').value = cliente.situacao;
        document.getElementById('updateCustomerHoneyJars').value = cliente.garrafasMel;
        document.getElementById('updateCustomerHoneycombs').value = cliente.potesFavo;
        $('#updateCustomerModal').modal('show');
    }

    function updateCustomer(event) {
        event.preventDefault();

        const index = document.getElementById('updateCustomerIndex').value;
        const nome = document.getElementById('updateCustomerName').value;
        const telefone = document.getElementById('updateCustomerPhone').value;
        const situacao = document.getElementById('updateCustomerSituacao').value;
        const garrafasMel = parseInt(document.getElementById('updateCustomerHoneyJars').value);
        const potesFavo = parseInt(document.getElementById('updateCustomerHoneycombs').value);

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
    document.getElementById('addHarvestForm').addEventListener('submit', addHarvest);
    document.getElementById('addCustomerForm').addEventListener('submit', addCustomer);
    document.getElementById('updateCustomerForm').addEventListener('submit', updateCustomer);

    // Load initial data
    loadHarvests();