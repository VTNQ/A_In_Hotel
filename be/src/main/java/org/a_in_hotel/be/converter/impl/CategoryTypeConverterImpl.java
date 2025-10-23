package org.a_in_hotel.be.converter.impl;

import jakarta.persistence.Converter;
import org.a_in_hotel.be.Enum.CategoryType;
import org.a_in_hotel.be.converter.EnumCodeConverter;

@Converter(autoApply = true)
public class CategoryTypeConverterImpl implements EnumCodeConverter<CategoryType> {
    @Override
    public Class<CategoryType> getEnumClass() {
        return CategoryType.class;
    }
}
