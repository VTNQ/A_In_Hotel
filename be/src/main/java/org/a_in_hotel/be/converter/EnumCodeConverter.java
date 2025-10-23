package org.a_in_hotel.be.converter;

import jakarta.persistence.AttributeConverter;

public class EnumCodeConverter <E extends Enum<E>> implements AttributeConverter<E, Integer> {
    private final Class<E> enumClass;

    public EnumCodeConverter(Class<E> enumClass) {
        this.enumClass = enumClass;
    }

    @Override
    public Integer convertToDatabaseColumn(E attribute) {
        if (attribute == null) return null;
        try {
            return (Integer) attribute.getClass().getMethod("getCode").invoke(attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Enum " + enumClass.getSimpleName() + " must have getCode() method", e);
        }
    }

    @Override
    public E convertToEntityAttribute(Integer dbData) {
        if (dbData == null) return null;
        try {
            return (E) enumClass.getMethod("fromCode", int.class).invoke(null, dbData);
        } catch (Exception e) {
            throw new IllegalStateException("Enum " + enumClass.getSimpleName() + " must have fromCode(int) method", e);
        }
    }
}
