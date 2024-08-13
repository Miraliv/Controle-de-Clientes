package com.apiario.avoante.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference
    private Colheita colheita;
}
