package org.a_in_hotel.be.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class BlogDTO {
    private String title;
    private String content;
    private Long categoryId;
    private List<String> tags;      // tên tag
    private LocalDateTime publishAt;
}
