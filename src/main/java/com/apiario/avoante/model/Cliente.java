package com.apiario.avoante.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;
    private String situacao;
    private int garrafasMel;
    private int potesFavo;

    @ManyToOne
    @JoinColumn(name = "colheita_id")
    private Colheita colheita;
}
