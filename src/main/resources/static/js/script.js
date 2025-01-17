// Inicialização de variáveis globais
let colheitas = [];
let selectedHarvest = null;
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
    selectedHarvest = colheita;  // Armazena a colheita selecionada

    $('#harvestNameTitle').text(colheita.nome);
    $('#addCustomerButton').prop('disabled', false);

    loadCustomers(colheita.id);

    $('#harvestData').html(`
        <div class="card border border-warning">
            <div class="card-header bg-warning text-dark">
                <h5 class="mb-0">Detalhes da Colheita</h5>
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <strong>Baldes de mel:</strong> ${colheita.baldesMel}
                    </li>
                    <li class="list-group-item">
                        <strong>Garrafas de Mel:</strong> ${colheita.totalGarrafasMel}
                    </li>
                    <li class="list-group-item">
                        <strong>Potes de Favo:</strong> ${colheita.totalPotesFavo}
                    </li>
                </ul>
            </div>
        </div>
    `);

}
// Adiciona uma nova colheita através de uma solicitação POST
function addHarvest(event) {
    event.preventDefault();

    const nome = $('#harvestName').val();
    const baldesMel = parseInt($('#harvestHoneyBucket').val());
    const totalGarrafasMel = parseInt($('#harvestHoneyJars').val());
    const totalPotesFavo = parseInt($('#harvestHoneycombs').val());

    axios.post('/api/colheitas', { nome, baldesMel, totalGarrafasMel, totalPotesFavo })
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


//Para mascarar o input de telefone
$(document).ready(function(){
    $('#customerPhone').inputmask('(99) 99999-9999');
    $('#updateCustomerPhone').inputmask('(99) 99999-9999');
});


function editHarvest() {
    if (!selectedHarvest) {
        console.error("Nenhuma colheita foi selecionada para edição.");
        return;
    }

    // Verifique se o jQuery está encontrando os campos
    console.log($('#harvestName')); // Verifica se o elemento está sendo selecionado corretamente
    console.log($('#harvestHoneyBucket'));
    console.log($('#harvestHoneyJars'));
    console.log($('#harvestHoneycombs'));

    // Preenche os campos do modal com os dados da colheita selecionada
    $('#harvestName').val(selectedHarvest.nome || '');
    $('#harvestHoneyBucket').val(selectedHarvest.baldesMel !== undefined ? selectedHarvest.baldesMel : '');
    $('#harvestHoneyJars').val(selectedHarvest.totalGarrafasMel !== undefined ? selectedHarvest.totalGarrafasMel : '');
    $('#harvestHoneycombs').val(selectedHarvest.totalPotesFavo !== undefined ? selectedHarvest.totalPotesFavo : '');

    // Abre o modal após os dados estarem prontos
    $('#updateHarvestModal').modal('show');
}


$('#updateHarvestForm').on('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão de submissão do formulário

    updateHarvest(); // Chama a função que faz o envio via Axios
});

function updateHarvest() {
    const nome = $('#harvestName').val();
    const baldesMel = parseInt($('#harvestHoneyBucket').val());
    const totalGarrafasMel = parseInt($('#harvestHoneyJars').val());
    const totalPotesFavo = parseInt($('#harvestHoneycombs').val());

    if (!selectedHarvest) {
        console.error("Nenhuma colheita selecionada para atualização.");
        return;
    }

    selectedHarvest.nome = nome;
    selectedHarvest.baldesMel = baldesMel;
    selectedHarvest.totalGarrafasMel = totalGarrafasMel;
    selectedHarvest.totalPotesFavo = totalPotesFavo;

    axios.put(`/api/colheitas/${selectedHarvest.id}`, selectedHarvest)
        .then(response => {
            // Atualize os dados da colheita
            selectedHarvest = response.data;

            // Atualize os detalhes na tela
            $('#harvestNameTitle').text(selectedHarvest.nome);
            $('#updateHarvestModal').modal('hide');

            // Você pode atualizar a interface ou recarregar a lista de colheitas aqui
        })
        .catch(error => {
            console.error("Erro ao atualizar colheita:", error);
        });
}


function deleteSelectedHarvest() {
    if (selectedHarvest) {
        axios.delete(`/api/colheitas/${selectedHarvest.id}`)
            .then(response => {
                console.log('Colheita excluída com sucesso:', response);
                $('#confirmDeleteHarvestModal').modal('hide'); // Fecha o modal
                loadHarvests(); // Recarrega as colheitas após a exclusão
                redirectToHome()
            })
            .catch(error => {
                console.error('Erro ao excluir a colheita:', error);
            });
    }
}
$(document).ready(function() {
    $('#confirmDeleteHarvestModal .btn-danger').on('click', deleteSelectedHarvest);
});

function redirectToHome() {
    // Recarrega a página inteira
    location.reload();
}

// Event Listeners
$('#addHarvestForm').on('submit', addHarvest);

// Carrega os dados iniciais ao iniciar a aplicação
loadHarvests();
