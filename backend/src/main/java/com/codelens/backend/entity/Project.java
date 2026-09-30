package com.codelens.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "source_type", length = 50)
    private String sourceType;

    @Column(name = "repo_url", length = 500)
    private String repoUrl;

    @Column(name = "detected_stack", length = 100)
    private String detectedStack;

    @Column(name = "total_files")
    private Integer totalFiles;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
