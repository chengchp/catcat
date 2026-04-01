package com.catcat.boot.adapter;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.TypeReference;
import com.catcat.boot.bo.CatBreedDTO;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;

/**
 * The Cat API 适配器
 */
@Slf4j
@Component
public class CatApiAdapter {

    @Value("${cat-api.base-url}")
    private String baseUrl;

    @Value("${cat-api.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public CatApiAdapter() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    /**
     * 获取所有品种
     */
    public List<CatBreedDTO> getBreeds() {
        try {
            String uri = baseUrl + "/breeds";
            String response = webClient.get()
                    .uri(uri)
                    .header("x-api-key", apiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            List<CatBreedDTO> breeds = JSON.parseObject(response, new TypeReference<List<CatBreedDTO>>() {});
            return breeds != null ? breeds : Collections.emptyList();
        } catch (Exception e) {
            log.error("调用 The Cat API 获取品种失败", e);
            return Collections.emptyList();
        }
    }

    /**
     * 根据品种ID获取详情
     */
    public CatBreedDTO getBreedById(String breedId) {
        try {
            String uri = baseUrl + "/breeds/" + breedId;
            String response = webClient.get()
                    .uri(uri)
                    .header("x-api-key", apiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return JSON.parseObject(response, CatBreedDTO.class);
        } catch (Exception e) {
            log.error("调用 The Cat API 获取品种详情失败, breedId={}", breedId, e);
            return null;
        }
    }

    /**
     * 获取品种图片
     */
    public String getBreedImage(String imageId) {
        try {
            String uri = baseUrl + "/images/" + imageId;
            String response = webClient.get()
                    .uri(uri)
                    .header("x-api-key", apiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            CatImageDTO image = JSON.parseObject(response, CatImageDTO.class);
            return image != null ? image.getUrl() : null;
        } catch (Exception e) {
            log.error("调用 The Cat API 获取品种图片失败, imageId={}", imageId, e);
            return null;
        }
    }

    @Data
    public static class CatImageDTO {
        private String id;
        private String url;
        private Integer width;
        private Integer height;
    }
}
