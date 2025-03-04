package com.apiario.avoante.controller;

import com.apiario.avoante.model.Cliente;
import com.apiario.avoante.model.Colheita;
import com.apiario.avoante.service.ApiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiarioController {

    // Injeta o serviço que gerencia as operações relacionadas a colheitas e clientes
    @Autowired
    private ApiarioService apiarioService;

    // -----------------------
    // Métodos relacionados a Colheitas
    // -----------------------

    /**
     * Retorna uma lista de todas as colheitas disponíveis.
     * Mapeia para o endpoint GET /api/colheitas.
     *
     * @return Lista de objetos Colheita.
     */
    @GetMapping("/colheitas")
    public List<Colheita> listarColheitas() {
        return apiarioService.listarColheitas();
    }

    /**
     * Salva uma nova colheita no banco de dados.
     * Mapeia para o endpoint POST /api/colheitas.
     *
     * @param colheita Objeto Colheita recebido no corpo da requisição.
     * @return A Colheita salva.
     */
    @PostMapping("/colheitas")
    public Colheita salvarColheita(@RequestBody Colheita colheita) {
        return apiarioService.salvarColheita(colheita);
    }

    /**
     * Busca uma colheita pelo seu ID.
     * Mapeia para o endpoint GET /api/colheitas/{id}.
     *
     * @param id Identificador da colheita a ser buscada.
     * @return ResponseEntity contendo a Colheita encontrada ou um status 404 se não for encontrada.
     */
    @GetMapping("/colheitas/{id}")
    public ResponseEntity<Colheita> getColheitaById(@PathVariable Long id) {
        Optional<Colheita> colheitaOptional = apiarioService.obterColheitaPorId(id);
        return colheitaOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -----------------------
    // Métodos relacionados a Clientes
    // -----------------------

    /**
     * Retorna uma lista de clientes associados a uma colheita específica.
     * Mapeia para o endpoint GET /api/colheitas/{id}/clientes.
     *
     * @param id Identificador da colheita cujos clientes serão listados.
     * @return Lista de objetos Cliente.
     */
    @GetMapping("/colheitas/{id}/clientes")
    public List<Cliente> listarClientesPorColheita(@PathVariable Long id) {
        return apiarioService.listarClientesPorColheita(id);
    }

    /**
     * Salva um novo cliente no banco de dados.
     * Mapeia para o endpoint POST /api/clientes.
     *
     * @param cliente Objeto Cliente recebido no corpo da requisição.
     * @return O Cliente salvo.
     */
    @PostMapping("/clientes")
    public Cliente salvarCliente(@RequestBody Cliente cliente) {
        return apiarioService.salvarCliente(cliente);
    }

    /**
     * Atualiza os dados de um cliente existente.
     * Mapeia para o endpoint PUT /api/clientes/{id}.
     *
     * @param id Identificador do cliente a ser atualizado.
     * @param clienteDetails Objeto Cliente com os novos dados.
     * @return ResponseEntity contendo o Cliente atualizado.
     */
    @PutMapping("/clientes/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteDetails) {
        Cliente clienteAtualizado = apiarioService.atualizarCliente(id, clienteDetails);
        return ResponseEntity.ok(clienteAtualizado);
    }

    /**
     * Exclui um cliente do banco de dados.
     * Mapeia para o endpoint DELETE /api/clientes/{id}.
     *
     * @param id Identificador do cliente a ser excluído.
     */
    @DeleteMapping("/clientes/{id}")
    public void deletarCliente(@PathVariable Long id) {
        apiarioService.deletarCliente(id);
    }

    @DeleteMapping("/colheitas/{id}")
    public ResponseEntity<Void> deletarColheita(@PathVariable Long id) {
        try {
            apiarioService.deletarColheita(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/api/colheitas/{id}")
    public ResponseEntity<Colheita> atualizarColheita(@PathVariable Long id, @RequestBody Colheita colheita) {
        Optional<Colheita> colheitaAtualizada = apiarioService.atualizarColheita(id, colheita);

        if (colheitaAtualizada.isPresent()) {
            return ResponseEntity.ok(colheitaAtualizada.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
