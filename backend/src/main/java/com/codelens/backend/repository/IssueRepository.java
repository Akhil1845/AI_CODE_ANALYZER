package com.codelens.backend.repository;

import com.codelens.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, String> {
    List<Issue> findByScanId(String scanId);
    List<Issue> findByType(String type);
}
