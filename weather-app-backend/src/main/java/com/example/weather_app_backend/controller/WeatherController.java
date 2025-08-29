package com.example.weather_app_backend.controller;

import com.example.weather_app_backend.model.WeatherResponse;
import com.example.weather_app_backend.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // Endpoint to get all preloaded cities' weather
    @GetMapping("/weather/preloaded")
    public Flux<WeatherResponse> getPreloadedWeather() {
        return weatherService.getAllPreloadedWeather();
    }

    // Endpoint to search a city by name
    @GetMapping("/weather")
    public Mono<WeatherResponse> getWeather(@RequestParam String city) {
        return weatherService.getWeather(city);
    }
}
