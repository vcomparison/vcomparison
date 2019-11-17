package com.junction.vcomparison;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author avbelyaev
 */
@Configuration
@Controller
public class SpaControllerConfiguration extends WebMvcConfigurerAdapter {

    @GetMapping(value = {
            "/plans/**",
            "/comparison/**",
            "/views/**",
    }, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView returnSpaBundle() {
        return new ModelAndView("index");
    }
}
