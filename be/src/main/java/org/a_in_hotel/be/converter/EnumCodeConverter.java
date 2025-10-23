package org.a_in_hotel.be.converter;

import jakarta.persistence.AttributeConverter;

public interface EnumCodeConverter<E extends Enum<E>> extends AttributeConverter<E, Integer> {

    @Override
    default Integer convertToDatabaseColumn(E attribute) {
        if (attribute == null) return null;
        try {
            return (Integer) attribute.getClass().getMethod("getCode").invoke(attribute);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Enum " + attribute.getClass().getSimpleName() + " must have getCode() method", e);
        }
    }

    @Override
    default E convertToEntityAttribute(Integer dbData) {
        if (dbData == null) return null;
        try {
            // lớp con phải override getEnumClass()
            return (E) getEnumClass().getMethod("fromCode", int.class).invoke(null, dbData);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Enum " + getEnumClass().getSimpleName() + " must have fromCode(int) method", e);
        }
    }

    /**
     * Lớp triển khai cần trả về class của enum
     */
    Class<E> getEnumClass();
}