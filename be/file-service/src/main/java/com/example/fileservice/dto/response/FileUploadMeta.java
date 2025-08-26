package com.example.fileservice.dto.response;

import lombok.Data;

@Data
public class FileUploadMeta {
    private String url;
    private String altText;
    private Integer width;
    private Integer height;
    private String imageType;
    private Long sizeBytes;
}
