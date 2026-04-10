package com.catcat.boot.service;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.ByteArrayInputStream;
import java.time.Duration;

/**
 * 阿里云 OSS 服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OssService {

    private final OSS ossClient;
    private final String ossBucketName;
    private final String ossUrlPrefix;

    private final WebClient webClient = WebClient.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
            .build();

    /**
     * 从 URL 下载文件并上传到 OSS
     *
     * @param ossPath   OSS 中的目标路径，如 "breed/abys.jpg"
     * @param sourceUrl 源文件 URL
     * @return OSS 完整访问 URL，失败返回 null
     */
    public String uploadFromUrl(String ossPath, String sourceUrl) {
        try {
            byte[] data = webClient.get()
                    .uri(sourceUrl)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (data == null || data.length == 0) {
                log.warn("下载图片为空: {}", sourceUrl);
                return null;
            }

            String contentType = guessContentType(ossPath);
            return uploadBytes(ossPath, data, contentType);
        } catch (Exception e) {
            log.error("从 URL 下载并上传 OSS 失败: ossPath={}, sourceUrl={}", ossPath, sourceUrl, e);
            return null;
        }
    }

    /**
     * 上传字节数组到 OSS
     *
     * @param ossPath     OSS 中的目标路径
     * @param data        文件字节数据
     * @param contentType MIME 类型
     * @return OSS 完整访问 URL
     */
    public String uploadBytes(String ossPath, byte[] data, String contentType) {
        try {
            ObjectMetadata meta = new ObjectMetadata();
            meta.setContentLength(data.length);
            meta.setContentType(contentType);

            ossClient.putObject(ossBucketName, ossPath, new ByteArrayInputStream(data), meta);
            String url = ossUrlPrefix + "/" + ossPath;
            log.debug("上传 OSS 成功: {}", url);
            return url;
        } catch (Exception e) {
            log.error("上传 OSS 失败: ossPath={}", ossPath, e);
            return null;
        }
    }

    /**
     * 根据 OSS 路径推断 Content-Type
     */
    private String guessContentType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        return "image/jpeg";
    }
}
