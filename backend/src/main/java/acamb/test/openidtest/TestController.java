package acamb.test.openidtest;

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.context.annotation.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/test")
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello(JwtAuthenticationToken authentication){

        return ResponseEntity.ok("hello " + authentication.getTokenAttributes().get("username"));
    }

    @GetMapping("/operator")
    @Secured("operator")
    public ResponseEntity<String> operator(JwtAuthenticationToken authentication){

        return ResponseEntity.ok("operator " + authentication.getTokenAttributes().get("username"));
    }

    @GetMapping("/admin")
    @Secured("admin")
    public ResponseEntity<String> admin(JwtAuthenticationToken authentication){

        return ResponseEntity.ok("admin " + authentication.getTokenAttributes().get("username"));
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(JwtAuthenticationToken authentication){
        List<String> roles = (List<String>) authentication.getToken()
                .getClaimAsMap("realm_access")
                .get("roles");
        String username = (String) authentication.getTokenAttributes().get("username");
        return ResponseEntity.ok(new User(username,roles));
    }
}
