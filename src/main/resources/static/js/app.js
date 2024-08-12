$.ajax({
    url: '/api/colheitas',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
        nome: $('#harvestName').val(),
        totalGarrafasMel: $('#harvestHoneyJars').val(),
        totalPotesFavo: $('#harvestHoneycombs').val()
    }),
    success: function(response) {
        // Processar a resposta e atualizar o front-end
    }
});
