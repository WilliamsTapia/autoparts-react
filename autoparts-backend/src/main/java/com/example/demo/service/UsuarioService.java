package com.example.demo.service;


import com.example.demo.dto.UsuarioRequest;
import com.example.demo.model.*;
import com.example.demo.repository.AppUserRepository;
import com.example.demo.repository.BoletaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

@Service
public class UsuarioService {
    private final AppUserRepository usuarios;
    private final PasswordEncoder encoder;
    private final BoletaRepository boletas;

    public UsuarioService(AppUserRepository usuarios, PasswordEncoder encoder, BoletaRepository boletas) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.boletas = boletas;
    }

    public List<AppUser> listar() { return usuarios.findAll(); }

    public AppUser obtener(String run) {
        return usuarios.findByRun(run).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public AppUser porCorreo(String correo) {
        return usuarios.findByUsernameIgnoreCase(correo).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public AppUser crear(UsuarioRequest datos, boolean registro) {
        if (datos.run() == null || !runValido(datos.run())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "RUN inválido");
        }
        var usuario = new AppUser(correo(datos), codificar(datos.contrasena()),
                registro ? AppRole.CLIENTE : rol(datos.tipoUsuario()));
        usuario.setRun(datos.run().toUpperCase(Locale.ROOT));
        return guardar(usuario, datos);
    }

    public AppUser actualizar(String run, UsuarioRequest datos, String actor) {
        var usuario = obtener(run);
        var role = datos.tipoUsuario() == null ? usuario.getRole() : rol(datos.tipoUsuario());
        var correo = correo(datos);
        if (usuario.getUsername().equals(actor) &&
                (role != AppRole.ADMIN || !correo.equals(actor))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conserva el correo y el rol de tu cuenta activa");
        }
        usuario.setUsername(correo);
        usuario.setRole(role);
        if (datos.contrasena() != null && !datos.contrasena().isBlank()) {
            usuario.setPassword(codificar(datos.contrasena()));
        }
        return guardar(usuario, datos);
    }

    public void eliminar(String run, String actor) {
        var usuario = obtener(run);
        if (usuario.getUsername().equals(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes eliminar tu cuenta activa");
        }
        if (boletas.existsByCompradorId(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario tiene compras registradas y no se puede eliminar");
        }
        usuarios.delete(usuario);
    }

    private AppUser guardar(AppUser usuario, UsuarioRequest datos) {
        if (datos.nombre() == null || datos.nombre().isBlank() || datos.nombre().length() > 50
                || datos.apellidos() == null || datos.apellidos().isBlank() || datos.apellidos().length() > 100
                || datos.direccion() == null || datos.direccion().length() > 300) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa el nombre, los apellidos y la dirección");
        }
        usuario.setNombre(datos.nombre().trim());
        usuario.setApellidos(datos.apellidos().trim());
        usuario.setFechaNacimiento(datos.fechaNacimiento());
        usuario.setRegion(datos.region());
        usuario.setComuna(datos.comuna());
        usuario.setDireccion(datos.direccion().trim());
        try {
            return usuarios.saveAndFlush(usuario);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El RUN o correo ya está registrado");
        }
    }

    private boolean runValido(String valor) {
        if (!valor.matches("[0-9]{6,8}[0-9Kk]")) return false;
        int suma = 0;
        int factor = 2;
        for (int i = valor.length() - 2; i >= 0; i--) {
            suma += (valor.charAt(i) - '0') * factor;
            factor = factor == 7 ? 2 : factor + 1;
        }
        int resto = 11 - suma % 11;
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
        return Character.toUpperCase(valor.charAt(valor.length() - 1)) == esperado;
    }

    private String correo(UsuarioRequest datos) {
        if (datos.correo() == null || datos.correo().length() > 254
                || !datos.correo().trim().matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correo inválido");
        }
        return datos.correo().trim().toLowerCase(Locale.ROOT);
    }

    private String codificar(String password) {
        if (password == null || password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña requiere 8 caracteres como mínimo y 72 bytes como máximo");
        }
        return encoder.encode(password);
    }

    private AppRole rol(String tipo) {
        if ("Administrador".equals(tipo)) return AppRole.ADMIN;
        if ("Vendedor".equals(tipo)) return AppRole.VENDEDOR;
        if ("Cliente".equals(tipo)) return AppRole.CLIENTE;
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido");
    }
}

