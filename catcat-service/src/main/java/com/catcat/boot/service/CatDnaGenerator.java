package com.catcat.boot.service;

import com.catcat.boot.dto.CatDNA;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * 虚拟猫 DNA 生成服务
 */
@Service
public class CatDnaGenerator {

    private static final String[] COLORS = {"白色", "黑色", "橘色", "灰色", "奶油色", "玳瑁色"};
    private static final String[] PATTERNS = {"纯色", "双色", "三花", "虎斑", "条纹", "斑点"};
    private static final String[] EYE_COLORS = {"蓝色", "绿色", "黄色", "铜色", "琥珀色", "异瞳"};
    private static final String[] FUR_LENGTHS = {"短毛", "长毛", "中长毛", "无毛"};
    private static final String[] TAILS = {"正常", "长尾", "短尾"};

    private final Random random = new Random();

    /**
     * 生成随机 DNA
     */
    public CatDNA generate() {
        CatDNA dna = new CatDNA();
        dna.setColor(randomChoice(COLORS));
        dna.setPattern(randomChoice(PATTERNS));
        dna.setEyeColor(randomChoice(EYE_COLORS));
        dna.setFurLength(randomChoice(FUR_LENGTHS));
        dna.setTail(randomChoice(TAILS));
        return dna;
    }

    /**
     * 根据品种特征生成 DNA（品种可能影响某些特征的权重）
     */
    public CatDNA generateByBreed(String breedId) {
        CatDNA dna = generate();

        // 根据品种做一些微调（这里是简化的策略）
        // 某些品种有特定特征
        if (breedId != null) {
            // 波斯猫通常是长毛
            if (breedId.contains("persian") || breedId.contains("Persian")) {
                dna.setFurLength("长毛");
            }
            // 斯芬克斯是无毛猫
            if (breedId.contains("sphynx") || breedId.contains("Sphynx")) {
                dna.setFurLength("无毛");
            }
            // 日本短尾猫通常是短尾
            if (breedId.contains("Japanese") && breedId.contains("Bobtail")) {
                dna.setTail("短尾");
            }
        }

        return dna;
    }

    private String randomChoice(String[] options) {
        return options[random.nextInt(options.length)];
    }
}
