package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuarios")
@Getter @Setter
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    @JsonIgnore
    private String username;
    @Column(nullable = false)
    @JsonIgnore
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppRole role;
    @Column(nullable = false, unique = true, length = 9)
    private String run;
    private String nombre;
    private String apellidos;
    private String fechaNacimiento;
    private String region;
    private String comuna;
    @Column(length = 300)
    private String direccion;

    protected AppUser() {}

    public AppUser(String username, String password, AppRole role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getCorreo() { return username; }

    public String getTipoUsuario() {
        return switch (role) {
            case ADMIN -> "Administrador";
            case VENDEDOR -> "Vendedor";
            case CLIENTE -> "Cliente";
        };
    }
}
