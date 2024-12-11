package com.mail.back.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

// Annotate with @NoRepositoryBean to prevent Spring from instantiating it
@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {
    // Add any custom methods if necessary
}
