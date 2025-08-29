package com.example.weather_app_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CityList {

    @JsonProperty("List")
    private List<City> list;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class City {
        @JsonProperty("CityCode")
        private String cityCode;

        @JsonProperty("CityName")
        private String cityName;

        @JsonProperty("Temp")
        private String temp;

        @JsonProperty("Status")
        private String status;
    }
}
