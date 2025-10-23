package org.a_in_hotel.be.converter.impl;

import jakarta.persistence.Converter;
import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.converter.EnumCodeConverter;

@Converter(autoApply = true)
public class PriceTypeConverterImpl implements EnumCodeConverter<PriceType> {

    @Override
    public Class<PriceType> getEnumClass() {
        return PriceType.class;
    }
}
