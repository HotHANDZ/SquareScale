package com.squarescale.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves a welcome page at {@code /} so visiting {@code http://localhost:8080/} is not a 404.
 * The main UI remains under {@code frontend/} (open as static files or via Live Server).
 */
@Controller
public class RootController {

    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }
}
