package com.apiario.avoante.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Colheita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private int totalGarrafasMel;
    private int totalPotesFavo;

    @OneToMany(mappedBy = "colheita", cascade = CascadeType.ALL)
    private List<Cliente> clientes;
}