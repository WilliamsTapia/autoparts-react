package com.example.demo.service;

import com.example.demo.model.AppRole;
import com.example.demo.model.AppUser;
import com.example.demo.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminUserInitializer(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.password:}") String password) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean hasUsername = !username.isBlank();
        boolean hasPassword = !password.isBlank();
        if (!hasUsername && !hasPassword) {
            return;
        }
        if (!hasUsername || !hasPassword) {
            throw new IllegalStateException("ADMIN_USERNAME y ADMIN_PASSWORD deben configurarse juntos");
        }
        if (password.length() < 8) {
            throw new IllegalStateException("ADMIN_PASSWORD debe tener al menos 8 caracteres");
        }

        String normalizedUsername = username.trim().toLowerCase(java.util.Locale.ROOT);
        var existingUser = appUserRepository.findByUsernameIgnoreCase(normalizedUsername);
        if (existingUser.isPresent()) {
            if (existingUser.get().getRole() != AppRole.ADMIN) {
                throw new IllegalStateException("La cuenta configurada para administrador ya existe con otro rol");
            }
            return;
        }

        AppUser admin = new AppUser(
                normalizedUsername,
                passwordEncoder.encode(password),
                AppRole.ADMIN);
        admin.setRun("197654325");
        admin.setNombre("Admin");
        admin.setApellidos("Sistema");
        admin.setDireccion("");
        admin.setFechaNacimiento("");
        admin.setRegion("");
        admin.setComuna("");
        appUserRepository.save(admin);
    }
}
