package com.example.authservice.util;

import com.example.authservice.dto.request.AccountDTO;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class SortHelper {
    private SortHelper() {}


    public static Comparator<AccountDTO> parseSort(String sort) {
        if (sort == null || sort.isBlank()) return null;

        // Map thuộc tính -> keyExtractor (Comparable)
        Map<String, Function<AccountDTO, Comparable<?>>> keys = new HashMap<>();
        keys.put("id",     AccountDTO::getId);
        keys.put("email", AccountDTO::getEmail);
        keys.put("fullName",AccountDTO::getFullName);
        keys.put("birthday",AccountDTO::getBirthday);
        Comparator<AccountDTO> result = null;

        for (String part : sort.split(";")) {
            String[] t = part.split(",");
            String prop = t.length > 0 ? t[0].trim() : "";
            String dir  = t.length > 1 ? t[1].trim() : "asc";

            Function<AccountDTO, Comparable<?>> key = keys.get(prop);
            if (key == null) continue; // field không hỗ trợ -> bỏ qua

            Comparator<AccountDTO> cmp =
                    Comparator.comparing(key, Comparator.nullsLast((a, b) -> {
                        if (a == b) return 0;
                        if (a == null) return 1;
                        if (b == null) return -1;
                        return ((Comparable) a).compareTo(b);
                    }));

            if ("desc".equalsIgnoreCase(dir)) {
                cmp = cmp.reversed();
            }

            result = (result == null) ? cmp : result.thenComparing(cmp);
        }
        return result;
    }
}
