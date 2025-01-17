package com.apiario.avoante.service;

import com.apiario.avoante.model.Cliente;
import com.apiario.avoante.model.Colheita;
import com.apiario.avoante.repository.ClienteRepository;
import com.apiario.avoante.repository.ColheitaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApiarioService {

    @Autowired
    private ColheitaRepository colheitaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // Colheitas
    public List<Colheita> listarColheitas() {
        return colheitaRepository.findAll();
    }

    public Colheita salvarColheita(Colheita colheita) {
        return colheitaRepository.save(colheita);
    }

    public Optional<Colheita> obterColheitaPorId(Long id) {
        return colheitaRepository.findById(id);
    }

    // Clientes
    public List<Cliente> listarClientesPorColheita(Long colheitaId) {
        return clienteRepository.findAll().stream()
                .filter(cliente -> cliente.getColheita().getId().equals(colheitaId))
                .toList();
    }

    public Cliente atualizarCliente(Long clienteId, Cliente attCliente) {
        // Carrega o cliente existente do banco de dados
        Cliente clienteExistente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        // Atualiza os campos relacionados ao cliente
        clienteExistente.setNome(attCliente.getNome());
        clienteExistente.setTelefone(attCliente.getTelefone());
        clienteExistente.setSituacao(attCliente.getSituacao());
        clienteExistente.setGarrafasMel(attCliente.getGarrafasMel());
        clienteExistente.setPotesFavo(attCliente.getPotesFavo());

        if (attCliente.getColheita() != null) {
            Colheita colheita = colheitaRepository.findById(attCliente.getColheita().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Colheita não encontrada"));
            clienteExistente.setColheita(colheita);
        }

        // Salva o cliente atualizado no banco de dados
        return clienteRepository.save(clienteExistente);
    }

    public Cliente salvarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public void deletarCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    public void deletarColheita(Long id) {
        colheitaRepository.deleteById(id);
    }

    public Optional<Colheita> atualizarColheita(Long id, Colheita colheitaAtualizada) {
        Optional<Colheita> colheitaExistente = colheitaRepository.findById(id);

        if (colheitaExistente.isPresent()) {
            Colheita colheita = colheitaExistente.get();
            colheita.setNome(colheitaAtualizada.getNome());
            colheita.setBaldesMel(colheitaAtualizada.getBaldesMel());
            colheita.setTotalGarrafasMel(colheitaAtualizada.getTotalGarrafasMel());
            colheita.setTotalPotesFavo(colheitaAtualizada.getTotalPotesFavo());

            // Salva a colheita atualizada no banco de dados
            colheitaRepository.save(colheita);
            return Optional.of(colheita);
        }
        return Optional.empty();
    }
}
