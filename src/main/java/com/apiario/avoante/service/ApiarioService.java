package com.apiario.avoante.service;

import com.apiario.avoante.model.Cliente;
import com.apiario.avoante.model.Colheita;
import com.apiario.avoante.repository.ClienteRepository;
import com.apiario.avoante.repository.ColheitaRepository;
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

    public Cliente salvarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public void deletarCliente(Long id) {
        clienteRepository.deleteById(id);
    }
}
