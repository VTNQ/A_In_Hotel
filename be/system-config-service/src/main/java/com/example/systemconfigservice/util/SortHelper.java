package com.example.systemconfigservice.util;

import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.stream.Collectors;

public class SortHelper {
    public static Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.unsorted();
        }

        return Arrays.stream(sort.split(";"))
                .map(order -> {
                    String[] parts = order.split(",");
                    String property = parts[0].trim();
                    Sort.Direction direction =
                            (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                                    ? Sort.Direction.DESC
                                    : Sort.Direction.ASC;
                    return new Sort.Order(direction, property);
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));
    }
}
