package org.a_in_hotel.be.converter.impl;

import jakarta.persistence.Converter;
import org.a_in_hotel.be.Enum.CategoryType;
import org.a_in_hotel.be.converter.EnumCodeConverter;

@Converter(autoApply = true)
public class CategoryTypeConverterImpl extends EnumCodeConverter<CategoryType> {
    public CategoryTypeConverterImpl() {
        super(CategoryType.class);
    }
}
