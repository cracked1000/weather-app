package com.example.weather_app_backend.service;

import com.example.weather_app_backend.model.CityList;
import com.example.weather_app_backend.model.WeatherResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${openweather.api.key}")
    private String apiKey;

    private List<String> cityNames = new ArrayList<>(); // preload city names

    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.openweathermap.org").build();
    }

    @PostConstruct
    public void loadCities() {
        try {
            InputStream is = new ClassPathResource("cities.json").getInputStream();
            CityList cityList = mapper.readValue(is, CityList.class);
            for (CityList.City city : cityList.getList()) {
                cityNames.add(city.getCityName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Fetch weather for a specific city
    public Mono<WeatherResponse> getWeather(String city) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/weather")
                        .queryParam("q", city)
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .bodyToMono(WeatherResponse.class)
                .onErrorResume(e -> Mono.empty());
    }

    // Fetch weather for all preloaded cities
    public Flux<WeatherResponse> getAllPreloadedWeather() {
        List<Mono<WeatherResponse>> requests = new ArrayList<>();
        for (String city : cityNames) {
            requests.add(getWeather(city));
        }
        return Flux.merge(requests);
    }
}
