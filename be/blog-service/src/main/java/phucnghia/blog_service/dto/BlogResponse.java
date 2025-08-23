package phucnghia.blog_service.dto;

import lombok.*;
import phucnghia.blog_service.Enum.BlogStatus;

import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private String categoryName;
    private Set<String> tags;
    private List<String> mediaUrls;
    private BlogStatus status;
    private LocalDateTime publishAt;
}
