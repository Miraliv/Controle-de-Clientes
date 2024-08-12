package com.apiario.avoante.repository;

import com.apiario.avoante.model.Colheita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColheitaRepository extends JpaRepository<Colheita, Long> {
}
