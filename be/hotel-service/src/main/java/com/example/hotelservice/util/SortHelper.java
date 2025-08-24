package com.example.hotelservice.util;

import com.example.hotelservice.dto.response.HotelResponse;
import org.springframework.data.domain.Sort;

import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SortHelper {
    public static Comparator<HotelResponse> parseSort(String sort,
                                                      Map<String, Comparator<HotelResponse>> fields) {

        if (sort == null || sort.isBlank() || fields == null || fields.isEmpty()) return null;

        Comparator<HotelResponse> result = null;

        for (String raw : sort.split(";")) {
            if (raw == null) continue;
            String token = raw.trim();
            if (token.isEmpty()) continue;

            String prop;
            boolean desc = false;

            int comma = token.indexOf(',');
            if (comma >= 0) {
                // Dạng "prop,asc|desc"
                prop = token.substring(0, comma).trim();
                String dir = token.substring(comma + 1).trim();
                desc = "desc".equalsIgnoreCase(dir) || "-".equals(dir);
            } else {
                // Dạng rút gọn: +prop / -prop / prop
                if (token.startsWith("-")) { desc = true;  prop = token.substring(1).trim(); }
                else if (token.startsWith("+")) {           prop = token.substring(1).trim(); }
                else {                                      prop = token; }
            }

            if (prop.isEmpty()) continue;

            Comparator<HotelResponse> cmp = fields.get(prop);
            if (cmp == null) continue;            // field không whitelist -> bỏ qua
            if (desc) cmp = cmp.reversed();       // áp hướng sắp xếp

            result = (result == null) ? cmp : result.thenComparing(cmp);
        }

        return result; // có thể là null nếu không có cột hợp lệ nào
    }
    // Hàm parse biểu thức RSQL-like thành Predicate<HotelResponse>
    public static java.util.function.Predicate<HotelResponse> parseDtoRsql(
            String expr,
            Map<String, Comparator<HotelResponse>> fields // dùng để validate field hợp lệ
    ) {
        if (expr == null || expr.isBlank()) return dto -> true;

        String[] orGroups = splitTop(expr, ','); // OR
        List<java.util.function.Predicate<HotelResponse>> orPreds = new ArrayList<>();

        for (String group : orGroups) {
            String[] andTerms = splitTop(group, ';'); // AND
            List<java.util.function.Predicate<HotelResponse>> andPreds = new ArrayList<>();
            for (String term : andTerms) {
                term = term.trim();
                if (!term.isEmpty()) {
                    andPreds.add(parseSingleTerm(term, fields));
                }
            }
            // combine AND
            java.util.function.Predicate<HotelResponse> andPred = dto -> true;
            for (var p : andPreds) andPred = andPred.and(p);
            orPreds.add(andPred);
        }

        // combine OR
        java.util.function.Predicate<HotelResponse> result = dto -> false;
        for (var p : orPreds) result = result.or(p);
        return result;
    }

    // Tách theo kí tự sep, bỏ khoảng trắng quanh sep
    public static String[] splitTop(String s, char sep) {
        String regex = "\\s*" + Pattern.quote(String.valueOf(sep)) + "\\s*";
        return Arrays.stream(s.split(regex))
                .filter(t -> !t.isBlank())
                .toArray(String[]::new);
    }

    // term: field==value | field!=value  (hỗ trợ wildcard '*')
    public static java.util.function.Predicate<HotelResponse> parseSingleTerm(
            String term,
            Map<String, Comparator<HotelResponse>> fields
    ) {
        // Bổ sung 'like' vào regex
        Pattern p = Pattern.compile("^\\s*([a-zA-Z0-9_]+)\\s*(==|!=|like)\\s*(.+?)\\s*$", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(term);
        if (!m.matches()) return dto -> true; // term không hợp lệ

        String field = m.group(1);
        String op    = m.group(2).toLowerCase(Locale.ROOT); // ép về thường để so
        String raw   = unquote(m.group(3).trim());

        // Không có comparator tương ứng -> coi như field không được hỗ trợ
        if (!fields.containsKey(field)) return dto -> true;

        boolean hasWildcard = raw.contains("*");
        String needle = raw.replace("*", "").toLowerCase(Locale.ROOT);

        return dto -> {
            Object v = getFieldValue(dto, field);
            String val = v == null ? "" : v.toString();
            boolean match;

            switch (op) {
                case "==":
                    match = hasWildcard
                            ? val.toLowerCase(Locale.ROOT).contains(needle)
                            : val.equalsIgnoreCase(raw);
                    break;
                case "!=":
                    match = hasWildcard
                            ? !val.toLowerCase(Locale.ROOT).contains(needle)
                            : !val.equalsIgnoreCase(raw);
                    break;
                case "like":
                    // like coi như contains, chấp nhận wildcard '*'
                    match = hasWildcard
                            ? val.toLowerCase(Locale.ROOT).contains(needle)
                            : val.toLowerCase(Locale.ROOT).contains(raw.toLowerCase(Locale.ROOT));
                    break;
                default:
                    match = true; // fallback
            }
            return match;
        };
    }

    private static String unquote(String s) {
        if ((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))) {
            return s.substring(1, s.length() - 1);
        }
        return s;
    }
    private static Object getFieldValue(HotelResponse dto, String field) {
        switch (field) {
            case "id":
                return dto.getId();
            case "code":
                return dto.getCode();
            case "name":
                return dto.getName();
            case "address":
                return dto.getAddress();
            case "fullName":
                return dto.getFullName();
            case "createdAt":
                return dto.getCreatedAt(); // Long
            case "status":
                return dto.getStatus() != null ? dto.getStatus().name() : null;
            default:
                return null;
        }
    }
}
