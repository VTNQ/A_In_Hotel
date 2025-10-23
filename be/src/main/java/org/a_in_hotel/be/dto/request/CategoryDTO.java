package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.CategoryType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotNull
    private CategoryType type;
}
