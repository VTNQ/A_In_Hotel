package org.a_in_hotel.be.dto.response;

import lombok.*;
import org.a_in_hotel.be.Enum.BlogStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
