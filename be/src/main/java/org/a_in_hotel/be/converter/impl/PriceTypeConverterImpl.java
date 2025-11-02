package org.a_in_hotel.be.converter.impl;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.a_in_hotel.be.Enum.PriceType;

@Converter(autoApply = true)
public class PriceTypeConverterImpl implements AttributeConverter<PriceType,Integer> {

    @Override
    public Integer convertToDatabaseColumn(PriceType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCode(); // ví dụ: CategoryType.SERVICE -> 2
    }

    /**
     * Đọc từ DB: Integer -> Enum
     */
    @Override
    public PriceType convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return PriceType.fromCode(dbData); // ví dụ: 2 -> CategoryType.SERVICE
    }
}
