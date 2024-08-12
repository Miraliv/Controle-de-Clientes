package com.apiario.avoante.controller;

import com.apiario.avoante.model.Cliente;
import com.apiario.avoante.model.Colheita;
import com.apiario.avoante.service.ApiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiarioController {

    @Autowired
    private ApiarioService apiarioService;

    // Colheitas
    @GetMapping("/colheitas")
    public List<Colheita> listarColheitas() {
        return apiarioService.listarColheitas();
    }

    @PostMapping("/colheitas")
    public Colheita salvarColheita(@RequestBody Colheita colheita) {
        return apiarioService.salvarColheita(colheita);
    }

    @GetMapping("/colheitas/{id}")
    public ResponseEntity<Colheita> getColheitaById(@PathVariable Long id) {
        Optional<Colheita> colheitaOptional = apiarioService.obterColheitaPorId(id);
        return colheitaOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Clientes
    @GetMapping("/colheitas/{id}/clientes")
    public List<Cliente> listarClientesPorColheita(@PathVariable Long id) {
        return apiarioService.listarClientesPorColheita(id);
    }

    @PostMapping("/clientes")
    public Cliente salvarCliente(@RequestBody Cliente cliente) {
        return apiarioService.salvarCliente(cliente);
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteDetails) {
        Cliente clienteAtualizado = apiarioService.atualizarCliente(id, clienteDetails);
        return ResponseEntity.ok(clienteAtualizado);
    }

    @DeleteMapping("/clientes/{id}")
    public void deletarCliente(@PathVariable Long id) {
        apiarioService.deletarCliente(id);
    }
}
